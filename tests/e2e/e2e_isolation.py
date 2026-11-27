"""
Isolated E2E test infrastructure for english-mastery-web (v105.0).

Guarantees:
1. backend/app.db is NEVER opened or written to directly. Every backend TestClient
   and live uvicorn server copies backend/app.db (+ -wal/-shm if present) into a
   fresh tempfile.TemporaryDirectory() and patches database.DB_PATH,
   database.DATABASE_URL, database.engine, and database.SessionLocal BEFORE
   importing main.
2. Outbound login alert emails/HTTPS relays are suppressed during tests.
3. Headless Microsoft Edge is launched with an isolated --user-data-dir and
   --remote-debugging-port on localhost, driven via synchronous CDP websockets,
   and torn down strictly by PID tree (taskkill /F /T /PID) without affecting
   any existing user browser sessions.
"""

from __future__ import annotations

import hashlib
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Callable, Dict, List, Optional, Tuple

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from websockets.sync.client import connect as ws_connect

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
SOURCE_DB_PATH = os.path.join(BACKEND_DIR, "app.db")
SYNC_SCRIPT_PATH = (
    r"C:\Users\ngvu2\.gemini\antigravity\brain\4811c77a-d5bb-4f11-a1f9-cf205e3dd634"
    r"\scratch\sync_to_desktops.py"
)

HOST_ADMIN_EMAIL = "tonguyenvu@265.com"
HOST_ADMIN_PASSWORD = os.getenv("HOST_ADMIN_PASSWORD", "VuAdmin@265")


def resolve_edge_executable() -> str:
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    which_path = shutil.which("msedge") or shutil.which("msedge.exe")
    if which_path and os.path.isfile(which_path):
        return which_path
    raise FileNotFoundError(
        "Microsoft Edge executable not found at standard paths or PATH."
    )


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        s.listen(1)
        return int(s.getsockname()[1])


def file_sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(65536)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def snapshot_db_integrity(db_path: str = SOURCE_DB_PATH) -> Dict[str, Any]:
    if not os.path.isfile(db_path):
        raise FileNotFoundError(f"Source database missing: {db_path}")
    return {
        "path": db_path,
        "sha256": file_sha256(db_path),
        "mtime": os.path.getmtime(db_path),
        "size": os.path.getsize(db_path),
    }


def copy_db_to_temp(temp_dir: str, src_db: str = SOURCE_DB_PATH) -> str:
    if not os.path.isfile(src_db):
        raise FileNotFoundError(f"Source database missing: {src_db}")
    dest_db = os.path.join(temp_dir, "app.db")
    shutil.copy2(src_db, dest_db)
    for suffix in ("-wal", "-shm"):
        sidecar = src_db + suffix
        if os.path.isfile(sidecar):
            shutil.copy2(sidecar, dest_db + suffix)
    return dest_db


def _safe_rmtree(path: str, retries: int = 15, delay: float = 0.2) -> None:
    for _ in range(retries):
        if not os.path.exists(path):
            return
        try:
            shutil.rmtree(path, ignore_errors=False)
            return
        except OSError:
            time.sleep(delay)
    shutil.rmtree(path, ignore_errors=True)


def _attach_sqlite_pragmas(engine_obj: Any) -> None:
    @event.listens_for(engine_obj, "connect")
    def _set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA synchronous=NORMAL;")
        cursor.close()


def _patch_backend_modules_for_db(tmp_db_path: str):
    if BACKEND_DIR not in sys.path:
        sys.path.insert(0, BACKEND_DIR)

    import database

    try:
        database.engine.dispose()
    except Exception:
        pass

    database.DB_PATH = tmp_db_path
    database.DATABASE_URL = f"sqlite:///{tmp_db_path}"
    new_engine = create_engine(
        database.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
    _attach_sqlite_pragmas(new_engine)
    database.engine = new_engine
    database.SessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=new_engine
    )

    import login_alert_service

    login_alert_service.send_via_https_relay = lambda *a, **kw: (True, "suppressed")
    login_alert_service.send_gmail_smtp = lambda *a, **kw: (True, "suppressed")

    import referral_service

    if hasattr(referral_service, "reset_rate_limiter"):
        referral_service.reset_rate_limiter()

    if "main" in sys.modules:
        import main as main_mod

        try:
            main_mod.engine.dispose()
        except Exception:
            pass
        main_mod.engine = database.engine
        main_mod.SessionLocal = database.SessionLocal
        main_mod.Base.metadata.create_all(bind=database.engine)
        main_mod.bootstrap_host_admin()
    else:
        import main as main_mod

    return database, main_mod


class IsolatedBackendEnv:
    """
    In-process isolated FastAPI + SQLite environment for TestClient unit/API tests.
    Never touches backend/app.db.
    """

    def __init__(self, src_db: str = SOURCE_DB_PATH):
        self.src_db = src_db
        self._tmp_dir: Optional[str] = None
        self.db_path: str = ""
        self.database = None
        self.main = None
        self._client = None

    def __enter__(self) -> "IsolatedBackendEnv":
        self._tmp_dir = tempfile.mkdtemp(prefix="emh_e2e_db_")
        self.db_path = copy_db_to_temp(self._tmp_dir, self.src_db)
        self.database, self.main = _patch_backend_modules_for_db(self.db_path)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._client is not None:
            try:
                self._client.__exit__(None, None, None)
            except Exception:
                pass
            self._client = None
        if self.database is not None:
            try:
                self.database.engine.dispose()
            except Exception:
                pass
        if self._tmp_dir:
            _safe_rmtree(self._tmp_dir)
            self._tmp_dir = None

    def get_client(self):
        from fastapi.testclient import TestClient

        if self._client is None:
            self._client = TestClient(self.main.app)
            self._client.__enter__()
        return self._client

    def login_host(self, client=None) -> Tuple[str, Dict[str, Any]]:
        c = client or self.get_client()
        resp = c.post(
            "/api/auth/login",
            json={"email": HOST_ADMIN_EMAIL, "password": HOST_ADMIN_PASSWORD},
        )
        if resp.status_code != 200:
            raise RuntimeError(
                f"Host login failed: {resp.status_code} {resp.text}"
            )
        data = resp.json()
        return data["token"], data["user"]

    def get_host_referral_code(self, host_token: str, client=None) -> str:
        c = client or self.get_client()
        resp = c.get(
            "/api/auth/referral-code",
            headers={"Authorization": f"Bearer {host_token}"},
        )
        if resp.status_code != 200 or not resp.json().get("referral_code"):
            raise RuntimeError(
                f"Failed to obtain referral code: {resp.status_code} {resp.text}"
            )
        return resp.json()["referral_code"]

    def register_isolated_user(
        self,
        email: Optional[str] = None,
        password: str = "TestUser@123",
        full_name: str = "E2E Tester",
        target_exam: str = "IELTS",
        client=None,
    ) -> Dict[str, Any]:
        c = client or self.get_client()
        host_token, _ = self.login_host(c)
        ref_code = self.get_host_referral_code(host_token, c)
        user_email = email or f"e2e_{int(time.time() * 1000)}_{os.getpid()}@e2etest.local"
        resp = c.post(
            "/api/auth/register",
            json={
                "email": user_email,
                "password": password,
                "full_name": full_name,
                "target_exam": target_exam,
                "daily_new_target": 20,
                "referral_code": ref_code,
            },
        )
        if resp.status_code != 200:
            raise RuntimeError(
                f"Register isolated user failed: {resp.status_code} {resp.text}"
            )
        data = resp.json()
        return {
            "token": data["token"],
            "user": data["user"],
            "email": user_email,
            "password": password,
        }


class IsolatedUvicornServer:
    """
    Live FastAPI uvicorn subprocess backed by a temporary copy of backend/app.db.
    """

    def __init__(self, src_db: str = SOURCE_DB_PATH, startup_timeout: float = 25.0):
        self.src_db = src_db
        self.startup_timeout = startup_timeout
        self._tmp_dir: Optional[str] = None
        self.db_path: str = ""
        self.port: int = 0
        self.base_url: str = ""
        self._proc: Optional[subprocess.Popen] = None
        self._log_file = None
        self.log_path: str = ""

    def __enter__(self) -> "IsolatedUvicornServer":
        self._tmp_dir = tempfile.mkdtemp(prefix="emh_e2e_srv_")
        self.db_path = copy_db_to_temp(self._tmp_dir, self.src_db)
        self.port = find_free_port()
        self.base_url = f"http://127.0.0.1:{self.port}"
        self.log_path = os.path.join(self._tmp_dir, "uvicorn.log")

        boot_script = os.path.join(self._tmp_dir, "boot_isolated_server.py")
        script_body = f'''import os, sys
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = {BACKEND_DIR!r}
TMP_DB_PATH = {self.db_path!r}

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import database
try:
    database.engine.dispose()
except Exception:
    pass

database.DB_PATH = TMP_DB_PATH
database.DATABASE_URL = f"sqlite:///{{TMP_DB_PATH}}"
new_engine = create_engine(
    database.DATABASE_URL,
    connect_args={{"check_same_thread": False}},
    echo=False,
)

@event.listens_for(new_engine, "connect")
def _set_sqlite_pragma(dbapi_connection, _connection_record):
    c = dbapi_connection.cursor()
    c.execute("PRAGMA foreign_keys=ON;")
    c.execute("PRAGMA journal_mode=WAL;")
    c.execute("PRAGMA synchronous=NORMAL;")
    c.close()

database.engine = new_engine
database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=new_engine)

import login_alert_service
login_alert_service.send_via_https_relay = lambda *a, **kw: (True, "suppressed")
login_alert_service.send_gmail_smtp = lambda *a, **kw: (True, "suppressed")

import main
import uvicorn
uvicorn.run(main.app, host="127.0.0.1", port={self.port}, log_level="warning")
'''
        with open(boot_script, "w", encoding="utf-8") as f:
            f.write(script_body)

        self._log_file = open(self.log_path, "w", encoding="utf-8")
        creation_flags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        self._proc = subprocess.Popen(
            [sys.executable, boot_script],
            cwd=BACKEND_DIR,
            stdout=self._log_file,
            stderr=subprocess.STDOUT,
            creationflags=creation_flags,
        )

        deadline = time.time() + self.startup_timeout
        last_err: Optional[Exception] = None
        while time.time() < deadline:
            if self._proc.poll() is not None:
                log_tail = ""
                try:
                    with open(self.log_path, "r", encoding="utf-8", errors="replace") as lf:
                        log_tail = lf.read()[-2000:]
                except Exception:
                    pass
                raise RuntimeError(
                    f"Isolated uvicorn exited early (code {self._proc.returncode}):\n{log_tail}"
                )
            try:
                req = urllib.request.Request(f"{self.base_url}/api/health", method="GET")
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    if resp.status == 200:
                        return self
            except Exception as e:
                last_err = e
                time.sleep(0.15)

        self.__exit__(None, None, None)
        raise TimeoutError(
            f"Isolated uvicorn did not become healthy within {self.startup_timeout}s: {last_err}"
        )

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._proc is not None:
            try:
                if sys.platform == "win32":
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(self._proc.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        timeout=5,
                    )
                else:
                    self._proc.terminate()
                self._proc.wait(timeout=5)
            except Exception:
                try:
                    self._proc.kill()
                except Exception:
                    pass
            self._proc = None

        if self._log_file is not None:
            try:
                self._log_file.close()
            except Exception:
                pass
            self._log_file = None

        if self._tmp_dir:
            _safe_rmtree(self._tmp_dir)
            self._tmp_dir = None

    def api_json(
        self,
        method: str,
        path: str,
        body: Optional[Dict[str, Any]] = None,
        token: Optional[str] = None,
    ) -> Tuple[int, Any]:
        url = f"{self.base_url}{path}"
        data = json.dumps(body).encode("utf-8") if body is not None else None
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
        try:
            with urllib.request.urlopen(req, timeout=10.0) as resp:
                raw = resp.read().decode("utf-8", errors="replace")
                return resp.status, json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", errors="replace")
            try:
                parsed = json.loads(raw) if raw else {}
            except Exception:
                parsed = {"raw": raw}
            return e.code, parsed

    def login_host(self) -> Tuple[str, Dict[str, Any]]:
        status, data = self.api_json(
            "POST",
            "/api/auth/login",
            {"email": HOST_ADMIN_EMAIL, "password": HOST_ADMIN_PASSWORD},
        )
        if status != 200:
            raise RuntimeError(f"Live server host login failed: {status} {data}")
        return data["token"], data["user"]

    def register_isolated_user(
        self,
        email: Optional[str] = None,
        password: str = "TestUser@123",
        full_name: str = "E2E Live Tester",
        target_exam: str = "IELTS",
    ) -> Dict[str, Any]:
        host_token, _ = self.login_host()
        st_ref, ref_data = self.api_json("GET", "/api/auth/referral-code", token=host_token)
        if st_ref != 200 or not ref_data.get("referral_code"):
            raise RuntimeError(f"Failed referral-code fetch: {st_ref} {ref_data}")
        user_email = email or f"e2e_live_{int(time.time() * 1000)}_{os.getpid()}@e2etest.local"
        st_reg, reg_data = self.api_json(
            "POST",
            "/api/auth/register",
            {
                "email": user_email,
                "password": password,
                "full_name": full_name,
                "target_exam": target_exam,
                "daily_new_target": 20,
                "referral_code": ref_data["referral_code"],
            },
        )
        if st_reg != 200:
            raise RuntimeError(f"Live register failed: {st_reg} {reg_data}")
        return {
            "token": reg_data["token"],
            "user": reg_data["user"],
            "email": user_email,
            "password": password,
        }


class HeadlessEdgeCDP:
    """
    Minimal synchronous CDP driver for Headless Microsoft Edge using websockets.sync.client.
    Captures Runtime.exceptionThrown and Runtime.consoleAPICalled events.
    """

    def __init__(
        self,
        initial_url: str = "about:blank",
        width: int = 1280,
        height: int = 800,
        startup_timeout: float = 15.0,
    ):
        self.initial_url = initial_url
        self.width = width
        self.height = height
        self.startup_timeout = startup_timeout
        self.edge_exe = resolve_edge_executable()
        self._user_data_dir: Optional[str] = None
        self.cdp_port: int = 0
        self._proc: Optional[subprocess.Popen] = None
        self._ws = None
        self._cmd_id = 0

        self.exceptions: List[Dict[str, Any]] = []
        self.console_errors: List[Dict[str, Any]] = []
        self.console_warnings: List[Dict[str, Any]] = []
        self.console_logs: List[Dict[str, Any]] = []
        self.navigations: List[str] = []

    def __enter__(self) -> "HeadlessEdgeCDP":
        self._user_data_dir = tempfile.mkdtemp(prefix="emh_e2e_edge_")
        self.cdp_port = find_free_port()
        creation_flags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        self._proc = subprocess.Popen(
            [
                self.edge_exe,
                "--headless=new",
                f"--remote-debugging-port={self.cdp_port}",
                f"--user-data-dir={self._user_data_dir}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-gpu",
                "--disable-background-networking",
                f"--window-size={self.width},{self.height}",
                self.initial_url,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=creation_flags,
        )

        ws_url = None
        deadline = time.time() + self.startup_timeout
        while time.time() < deadline:
            if self._proc.poll() is not None:
                raise RuntimeError(
                    f"Headless Edge exited unexpectedly (code {self._proc.returncode})"
                )
            try:
                with urllib.request.urlopen(
                    f"http://127.0.0.1:{self.cdp_port}/json/list", timeout=1.0
                ) as resp:
                    targets = json.loads(resp.read().decode("utf-8"))
                    for t in targets:
                        if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                            ws_url = t["webSocketDebuggerUrl"]
                            break
                    if ws_url:
                        break
            except Exception:
                time.sleep(0.15)

        if not ws_url:
            self.__exit__(None, None, None)
            raise TimeoutError("Timed out waiting for Edge CDP page target.")

        self._ws = ws_connect(ws_url, max_size=16 * 1024 * 1024)
        self.send_cdp("Runtime.enable")
        self.send_cdp("Page.enable")
        self.send_cdp("DOM.enable")
        self.send_cdp("Network.enable")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._ws is not None:
            try:
                self._ws.close()
            except Exception:
                pass
            self._ws = None

        if self._proc is not None:
            try:
                if sys.platform == "win32":
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(self._proc.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        timeout=5,
                    )
                else:
                    self._proc.terminate()
                self._proc.wait(timeout=5)
            except Exception:
                try:
                    self._proc.kill()
                except Exception:
                    pass
            self._proc = None

        if self._user_data_dir:
            _safe_rmtree(self._user_data_dir)
            self._user_data_dir = None

    def _handle_event(self, msg: Dict[str, Any]) -> None:
        method = msg.get("method")
        params = msg.get("params") or {}
        if method == "Runtime.exceptionThrown":
            details = params.get("exceptionDetails") or {}
            text = details.get("text") or ""
            exc_obj = details.get("exception") or {}
            desc = exc_obj.get("description") or exc_obj.get("value") or text
            self.exceptions.append(
                {
                    "text": text,
                    "description": str(desc),
                    "url": details.get("url", ""),
                    "lineNumber": details.get("lineNumber"),
                }
            )
        elif method == "Runtime.consoleAPICalled":
            ctype = params.get("type", "log")
            args = params.get("args") or []
            rendered = " ".join(
                str(a.get("value") if "value" in a else a.get("description", ""))
                for a in args
            )
            entry = {"type": ctype, "text": rendered}
            self.console_logs.append(entry)
            if ctype == "error":
                self.console_errors.append(entry)
            elif ctype == "warning":
                self.console_warnings.append(entry)
        elif method == "Page.frameNavigated":
            frame = params.get("frame") or {}
            if not frame.get("parentId"):
                self.navigations.append(frame.get("url", ""))

    def send_cdp(
        self, method: str, params: Optional[Dict[str, Any]] = None, timeout: float = 15.0
    ) -> Dict[str, Any]:
        self._cmd_id += 1
        cid = self._cmd_id
        payload = {"id": cid, "method": method, "params": params or {}}
        self._ws.send(json.dumps(payload))

        deadline = time.time() + timeout
        while True:
            rem = max(0.05, deadline - time.time())
            raw = self._ws.recv(timeout=rem)
            msg = json.loads(raw)
            if "id" in msg and msg["id"] == cid:
                if "error" in msg:
                    raise RuntimeError(f"CDP error for {method}: {msg['error']}")
                return msg.get("result", {})
            self._handle_event(msg)

    def drain_events(self, timeout: float = 0.08) -> None:
        while True:
            try:
                raw = self._ws.recv(timeout=timeout)
                msg = json.loads(raw)
                if "method" in msg:
                    self._handle_event(msg)
            except TimeoutError:
                break
            except Exception:
                break

    def clear_errors(self) -> None:
        self.drain_events(0.05)
        self.exceptions.clear()
        self.console_errors.clear()
        self.console_warnings.clear()

    def assert_no_js_errors(
        self, allow_console_error_substrings: Optional[List[str]] = None
    ) -> None:
        self.drain_events(0.1)
        allowed = allow_console_error_substrings or []
        unexpected_console_errors = [
            e
            for e in self.console_errors
            if not any(pat in e["text"] for pat in allowed)
        ]
        if self.exceptions or unexpected_console_errors:
            raise AssertionError(
                f"Browser JS/console errors detected! "
                f"exceptions={self.exceptions}, console_errors={unexpected_console_errors}"
            )

    def eval_js(self, expression: str, await_promise: bool = True) -> Any:
        res = self.send_cdp(
            "Runtime.evaluate",
            {
                "expression": expression,
                "returnByValue": True,
                "awaitPromise": await_promise,
            },
        )
        if "exceptionDetails" in res:
            details = res["exceptionDetails"]
            exc = details.get("exception") or {}
            raise RuntimeError(
                f"JS eval exception: {exc.get('description') or details.get('text')}"
            )
        return (res.get("result") or {}).get("value")

    def add_init_script(self, script_source: str) -> str:
        res = self.send_cdp(
            "Page.addScriptToEvaluateOnNewDocument", {"source": script_source}
        )
        return res.get("identifier", "")

    def remove_init_script(self, identifier: str) -> None:
        if identifier:
            self.send_cdp(
                "Page.removeScriptToEvaluateOnNewDocument", {"identifier": identifier}
            )

    def wait_for(
        self, js_predicate: str, timeout: float = 10.0, poll: float = 0.1
    ) -> Any:
        deadline = time.time() + timeout
        last_val = None
        while time.time() < deadline:
            try:
                last_val = self.eval_js(js_predicate, await_promise=False)
                if last_val:
                    return last_val
            except Exception:
                pass
            time.sleep(poll)
        raise TimeoutError(
            f"Timed out after {timeout}s waiting for predicate: {js_predicate} (last={last_val!r})"
        )

    def wait_for_app_ready(self, timeout: float = 40.0) -> None:
        try:
            self.wait_for(
                "!window.__emhReloadMarker && document.readyState === 'complete' && typeof window.switchTab === 'function'",
                timeout=timeout,
            )
        except TimeoutError as exc:
            diag = None
            try:
                diag = self.eval_js(
                    "({ marker: window.__emhReloadMarker, readyState: document.readyState, switchTab: typeof window.switchTab, scripts: document.scripts.length, href: window.location.href })",
                    await_promise=False,
                )
            except Exception as de:
                diag = f"diag_err={de}"
            raise TimeoutError(f"{exc} | diag={diag}") from exc
        time.sleep(0.15)
        self.drain_events(0.05)

    def navigate(self, url: str, timeout: float = 40.0) -> None:
        cur_base = ""
        try:
            cur_base = str(self.eval_js("window.location.href.split('#')[0]", await_promise=False) or "")
        except Exception:
            cur_base = ""
        target_base = url.split("#", 1)[0]
        if cur_base and cur_base == target_base and "#" in url:
            frag = "#" + url.split("#", 1)[1]
            self.eval_js(f"window.location.hash = {json.dumps(frag)}; true;", await_promise=False)
            self.reload(ignore_cache=False, timeout=timeout)
            return
        try:
            self.eval_js("window.__emhReloadMarker = 1; true;", await_promise=False)
        except Exception:
            pass
        self.send_cdp("Page.navigate", {"url": url})
        self.wait_for_app_ready(timeout=timeout)

    def reload(self, ignore_cache: bool = True, timeout: float = 40.0) -> None:
        try:
            self.eval_js("window.__emhReloadMarker = 1; true;", await_promise=False)
        except Exception:
            pass
        self.send_cdp("Page.reload", {"ignoreCache": ignore_cache})
        self.wait_for_app_ready(timeout=timeout)

    def set_viewport(self, width: int, height: int, mobile: bool = False) -> None:
        self.send_cdp(
            "Emulation.setDeviceMetricsOverride",
            {
                "width": width,
                "height": height,
                "deviceScaleFactor": 1,
                "mobile": mobile,
            },
        )

    def clear_storage_and_cookies(self) -> None:
        try:
            self.send_cdp("Network.clearBrowserCookies")
        except Exception:
            pass
        try:
            self.eval_js("localStorage.clear(); sessionStorage.clear(); true;", await_promise=False)
        except Exception:
            pass

    def seed_auth(self, token: str, user: Dict[str, Any], extra_ls: Optional[Dict[str, str]] = None) -> None:
        payload = {
            "EMH_AUTH_TOKEN_V2": token,
            "EMH_AUTH_TOKEN": token,
            "EMH_ACTIVE_ACCOUNT_EMAIL": str(user.get("email", "")),
            "EMH_ACTIVE_ACCOUNT_NAME": str(user.get("full_name", "")),
        }
        if extra_ls:
            payload.update(extra_ls)
        js = (
            "(() => { const d = "
            + json.dumps(payload)
            + "; for (const [k, v] of Object.entries(d)) localStorage.setItem(k, String(v)); return true; })()"
        )
        self.eval_js(js, await_promise=False)

    def click(self, selector: str) -> None:
        ok = self.eval_js(
            f"""(() => {{
                const el = document.querySelector({json.dumps(selector)});
                if (!el) return false;
                el.scrollIntoView({{ block: 'center', inline: 'center' }});
                el.click();
                return true;
            }})()""",
            await_promise=False,
        )
        if not ok:
            raise AssertionError(f"Element not found for click: {selector}")

    def set_value(self, selector: str, value: str) -> None:
        ok = self.eval_js(
            f"""(() => {{
                const el = document.querySelector({json.dumps(selector)});
                if (!el) return false;
                el.value = {json.dumps(value)};
                el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                return true;
            }})()""",
            await_promise=False,
        )
        if not ok:
            raise AssertionError(f"Element not found for set_value: {selector}")

    def upload_file(self, selector: str, file_path: str) -> None:
        doc = self.send_cdp("DOM.getDocument", {"depth": -1})
        root_id = doc["root"]["nodeId"]
        q = self.send_cdp(
            "DOM.querySelector", {"nodeId": root_id, "selector": selector}
        )
        node_id = q.get("nodeId", 0)
        if not node_id:
            raise AssertionError(f"File input not found for upload_file: {selector}")
        self.send_cdp(
            "DOM.setFileInputFiles",
            {"files": [os.path.abspath(file_path)], "nodeId": node_id},
        )
        self.eval_js(
            f"""(() => {{
                const el = document.querySelector({json.dumps(selector)});
                if (el) el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                return true;
            }})()""",
            await_promise=False,
        )
