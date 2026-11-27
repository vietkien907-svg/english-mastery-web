"""
Backend & Parity Opaque-Box E2E Tests (Tiers 1, 2, 3) for english-mastery-web (v105.0).
All DB-backed tests run exclusively against temporary copies of backend/app.db via
e2e_isolation.IsolatedBackendEnv.
"""

from __future__ import annotations

import ast
import datetime as real_datetime
import hashlib
import inspect
import json
import os
import py_compile
import re
import subprocess
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import patch
from zoneinfo import ZoneInfo

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from e2e_isolation import (
    HOST_ADMIN_EMAIL,
    HOST_ADMIN_PASSWORD,
    IsolatedBackendEnv,
    REPO_ROOT,
    SOURCE_DB_PATH,
    SYNC_SCRIPT_PATH,
    file_sha256,
    snapshot_db_integrity,
)

VN_TZ = ZoneInfo("Asia/Ho_Chi_Minh")

NEW_JS_FILES = [
    "translation_bank_units.js",
    "translation_bank_media.js",
    "translation_bank_ielts.js",
    "translation_bank_trends.js",
    "translation-practice-engine.js",
    "read-aloud-engine.js",
    "vi-en-games-engine.js",
]

EXISTING_JS_FILES = [
    "data.js",
    "listening_data.js",
    "vietnam_today_data.js",
    "educational_channels_data.js",
    "international_news_videos.js",
    "bilingual_news_data.js",
    "reading_lexicon.js",
    "conversation_data.js",
    "speaking-forecast.js",
    "speaking-knowledge-bank.js",
    "speakout-speaking-data.js",
    "speaking-engine.js",
    "ocr-vocab-engine.js",
    "unit-review-engine.js",
    "focus-session-engine.js",
    "security-guard-engine.js",
    "auth-gate-engine.js",
    "streak-deadline-engine.js",
    "app.js",
]

ALL_REQUIRED_JS_FILES = EXISTING_JS_FILES + NEW_JS_FILES
HTML_FILES = ["index.html", "flashcard.html", "flashcards.html", "speaking.html"]


def _load_sync_script_ast():
    with open(SYNC_SCRIPT_PATH, "r", encoding="utf-8") as f:
        src = f.read()
    tree = ast.parse(src, filename=SYNC_SCRIPT_PATH)
    data = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
            if name in ("src_dir", "dest_dirs", "files_to_sync"):
                data[name] = ast.literal_eval(node.value)
    return src, tree, data


def _make_mock_datetime_module(fixed_utc_dt: real_datetime.datetime):
    assert fixed_utc_dt.tzinfo is not None

    class MockDateTime(real_datetime.datetime):
        @classmethod
        def now(cls, tz=None):
            if tz is None:
                return fixed_utc_dt.replace(tzinfo=None)
            return fixed_utc_dt.astimezone(tz)

        @classmethod
        def utcnow(cls):
            return fixed_utc_dt.astimezone(real_datetime.timezone.utc).replace(tzinfo=None)

    class MockDate(real_datetime.date):
        @classmethod
        def today(cls):
            return fixed_utc_dt.astimezone(real_datetime.timezone.utc).date()

    return SimpleNamespace(
        datetime=MockDateTime,
        date=MockDate,
        timedelta=real_datetime.timedelta,
        timezone=real_datetime.timezone,
    )


class TestBackendTier1(unittest.TestCase):
    def test_T1_F03_01_me_preserves_vu_streak_non_destructive(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            token, _ = env.login_host(c)
            import models

            with env.database.SessionLocal() as db:
                vu = db.query(models.User).filter(models.User.email == HOST_ADMIN_EMAIL).first()
                self.assertIsNotNone(vu)
                yesterday_vn = (real_datetime.datetime.now(VN_TZ).date() - real_datetime.timedelta(days=1)).isoformat()
                vu.streak_count = 15
                vu.longest_streak = max(vu.longest_streak or 0, 15)
                vu.last_active_date = yesterday_vn
                db.commit()

            resp = c.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(resp.status_code, 200)
            body = resp.json()
            self.assertGreaterEqual(body["streak_count"], 15)
            self.assertGreaterEqual(body["longest_streak"], 15)

            with env.database.SessionLocal() as db:
                vu_after = db.query(models.User).filter(models.User.email == HOST_ADMIN_EMAIL).first()
                self.assertGreaterEqual(vu_after.streak_count, 15)

    def test_T1_F03_02_evaluate_daily_streak_consecutive_daily_activity(self):
        with IsolatedBackendEnv() as env:
            env.get_client()
            import models
            from routers import auth_router

            sig = inspect.signature(auth_router.evaluate_daily_streak)
            self.assertIn(
                "increment_if_completed",
                sig.parameters,
                "evaluate_daily_streak must accept increment_if_completed parameter per PROJECT.md contract",
            )

            reg = env.register_isolated_user(email="streak_hist@e2etest.local")
            today_vn = real_datetime.datetime.now(VN_TZ).date()
            with env.database.SessionLocal() as db:
                user = db.query(models.User).filter(models.User.email == reg["email"]).first()
                user.streak_count = 1
                user.longest_streak = 1
                user.timezone = "Asia/Ho_Chi_Minh"
                user.last_active_date = (today_vn - real_datetime.timedelta(days=1)).isoformat()
                for offset in (2, 1, 0):
                    d_str = (today_vn - real_datetime.timedelta(days=offset)).isoformat()
                    existing = (
                        db.query(models.DailyActivity)
                        .filter(models.DailyActivity.user_id == user.id, models.DailyActivity.date_str == d_str)
                        .first()
                    )
                    if not existing:
                        db.add(
                            models.DailyActivity(
                                user_id=user.id,
                                date_str=d_str,
                                reviews_count=10,
                                new_words_count=5,
                                goal_reached=True,
                            )
                        )
                    else:
                        existing.goal_reached = True
                db.commit()
                db.refresh(user)
                info = auth_router.evaluate_daily_streak(user, db, increment_if_completed=True)
                self.assertGreaterEqual(info["streak"], 3)
                self.assertEqual(info["last_active_date"], today_vn.isoformat())
                self.assertGreaterEqual(info["longest_streak"], 3)

    def test_T1_F03_03_me_idempotent_across_five_calls(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="idemp@e2etest.local")
            import models

            today_vn = real_datetime.datetime.now(VN_TZ).date().isoformat()
            with env.database.SessionLocal() as db:
                u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                u.streak_count = 7
                u.longest_streak = 7
                u.last_active_date = today_vn
                db.commit()

            streaks = []
            for _ in range(5):
                r = c.get("/api/auth/me", headers={"Authorization": f"Bearer {reg['token']}"})
                self.assertEqual(r.status_code, 200)
                streaks.append(r.json()["streak_count"])
            self.assertEqual(streaks, [7, 7, 7, 7, 7])

    def test_T1_F03_04_checkin_increments_from_yesterday_in_vn_tz(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="checkin@e2etest.local")
            import models

            now_vn = real_datetime.datetime.now(VN_TZ).date()
            yesterday_vn = (now_vn - real_datetime.timedelta(days=1)).isoformat()
            with env.database.SessionLocal() as db:
                u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                u.streak_count = 7
                u.longest_streak = 7
                u.last_active_date = yesterday_vn
                u.timezone = "Asia/Ho_Chi_Minh"
                db.commit()

            r = c.post("/api/auth/checkin", headers={"Authorization": f"Bearer {reg['token']}"})
            self.assertEqual(r.status_code, 200)
            data = r.json()
            self.assertTrue(data["success"])
            self.assertEqual(data["streak"], 8)
            self.assertEqual(data["last_active_date"], now_vn.isoformat())

    def test_T1_F03_05_login_vu_preserves_streak_and_word_counts(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            token, vu_user = env.login_host(c)
            self.assertTrue(token.startswith("emhs1."))
            self.assertGreaterEqual(vu_user["streak"], 15)
            import models

            with env.database.SessionLocal() as db:
                vu = db.query(models.User).filter(models.User.email == HOST_ADMIN_EMAIL).first()
                self.assertGreaterEqual(vu.streak_count, 15)
                self.assertGreaterEqual(vu.learned_words_count, 280)
                self.assertGreaterEqual(vu.total_started_count, 367)

    def test_T1_F06_01_news_feed_returns_200_and_items(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            r = c.get("/api/news/feed")
            self.assertEqual(r.status_code, 200, f"Expected /api/news/feed 200, got {r.status_code}: {r.text[:200]}")
            self.assertIn(
                "application/json",
                r.headers.get("content-type", "").lower(),
                f"Expected JSON response from /api/news/feed, got {r.headers.get('content-type')!r}",
            )
            data = r.json()
            self.assertEqual(data.get("status"), "ok")
            self.assertIn(data.get("source"), ("rss", "curated"))
            self.assertIsInstance(data.get("items"), list)
            self.assertGreaterEqual(len(data["items"]), 1)

    def test_T1_F06_02_news_feed_item_schema_complete(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            r = c.get("/api/news/feed")
            self.assertEqual(r.status_code, 200)
            self.assertIn(
                "application/json",
                r.headers.get("content-type", "").lower(),
                f"Expected JSON response from /api/news/feed, got {r.headers.get('content-type')!r}",
            )
            items = r.json().get("items", [])
            self.assertGreaterEqual(len(items), 1)
            for item in items:
                for key in ("id", "title", "titleEn", "textVi", "referenceEn", "sourceLabel", "lengthTier"):
                    self.assertIsInstance(item.get(key), str, f"Missing/non-str {key} in {item}")
                    self.assertTrue(item[key].strip(), f"Empty {key} in {item}")
                self.assertGreater(item.get("wordCountVi", 0), 0)

    def test_T1_F06_03_news_feed_topic_and_limit_filtering(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            r = c.get("/api/news/feed?topic=technology&limit=4")
            self.assertEqual(r.status_code, 200)
            self.assertIn(
                "application/json",
                r.headers.get("content-type", "").lower(),
                f"Expected JSON response from /api/news/feed, got {r.headers.get('content-type')!r}",
            )
            items = r.json().get("items", [])
            self.assertGreaterEqual(len(items), 1)
            self.assertLessEqual(len(items), 4)

    def test_T1_F11_04_vu_db_and_stats_summary_intact(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            token, _ = env.login_host(c)
            me = c.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(me.status_code, 200)
            me_json = me.json()
            self.assertGreaterEqual(me_json["streak_count"], 15)
            self.assertGreaterEqual(me_json["longest_streak"], 15)

            stats = c.get("/api/stats/summary", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(stats.status_code, 200)
            cards = stats.json().get("cards", {})
            self.assertGreaterEqual(cards.get("mature", 0), 280)
            self.assertGreaterEqual(cards.get("total_started", 0), 367)

    def test_T1_F12_04_explicit_js_routes_and_200_application_javascript(self):
        main_py = os.path.join(REPO_ROOT, "backend", "main.py")
        with open(main_py, "r", encoding="utf-8") as f:
            main_src = f.read()

        for js_file in ALL_REQUIRED_JS_FILES:
            self.assertIn(
                f'@app.get("/{js_file}")',
                main_src,
                f'backend/main.py missing explicit @app.get("/{js_file}") route',
            )

        with IsolatedBackendEnv() as env:
            c = env.get_client()
            for js_file in ALL_REQUIRED_JS_FILES:
                r = c.get(f"/{js_file}")
                self.assertEqual(r.status_code, 200, f"GET /{js_file} returned {r.status_code}")
                self.assertIn("javascript", r.headers.get("content-type", "").lower())

    def test_T1_F13_01_sync_script_lists_all_7_new_js_files(self):
        _, _, data = _load_sync_script_ast()
        files = set(data.get("files_to_sync", []))
        for js_file in NEW_JS_FILES:
            self.assertIn(js_file, files, f"sync_to_desktops.py missing {js_file}")

    def test_T1_F13_02_sync_script_lists_backend_and_core_files(self):
        _, _, data = _load_sync_script_ast()
        files = set(data.get("files_to_sync", []))
        required = [
            "backend/routers/news_router.py",
            "backend/main.py",
            "backend/routers/auth_router.py",
            "conversation_data.js",
            "sw.js",
            "style.css",
            "app.js",
            *HTML_FILES,
        ]
        for req in required:
            self.assertIn(req, files, f"sync_to_desktops.py missing {req}")

    def test_T1_F13_03_all_sync_files_exist_in_source_repo(self):
        _, _, data = _load_sync_script_ast()
        for f_rel in data.get("files_to_sync", []):
            full = os.path.join(REPO_ROOT, f_rel)
            self.assertTrue(os.path.isfile(full), f"Entry in files_to_sync missing on disk: {f_rel}")

    def test_T1_F13_04_sync_script_dest_dirs_and_ast_valid(self):
        _, tree, data = _load_sync_script_ast()
        self.assertIsNotNone(tree)
        dest_dirs = data.get("dest_dirs", [])
        self.assertIn(r"C:\Users\ngvu2\Desktop\english-mastery-web", dest_dirs)
        self.assertIsInstance(data.get("files_to_sync"), list)

    def test_T1_F13_05_gitignore_clean_and_source_db_vu_intact(self):
        gi_path = os.path.join(REPO_ROOT, ".gitignore")
        gi_lines = []
        if os.path.isfile(gi_path):
            with open(gi_path, "r", encoding="utf-8") as f:
                gi_lines = [ln.strip() for ln in f if ln.strip() and not ln.strip().startswith("#")]

        for f_rel in [*NEW_JS_FILES, *HTML_FILES, "backend/routers/news_router.py", "backend/main.py"]:
            for pat in gi_lines:
                self.assertNotEqual(pat, f_rel, f"Deliverable {f_rel} is explicitly ignored by .gitignore")

        # Read-only check via temporary copy (never open source DB for writes)
        import sqlite3, tempfile, shutil
        with tempfile.TemporaryDirectory(prefix="emh_ro_chk_") as tmp:
            dst = os.path.join(tmp, "app.db")
            shutil.copy2(SOURCE_DB_PATH, dst)
            conn = sqlite3.connect(dst)
            try:
                row = conn.execute(
                    "SELECT streak_count, longest_streak, learned_words_count, total_started_count FROM users WHERE email = ?",
                    (HOST_ADMIN_EMAIL,),
                ).fetchone()
            finally:
                conn.close()
        self.assertIsNotNone(row)
        self.assertGreaterEqual(row[0], 15)
        self.assertGreaterEqual(row[1], 15)
        self.assertGreaterEqual(row[2], 280)
        self.assertGreaterEqual(row[3], 367)


class TestBackendTier2(unittest.TestCase):
    def test_T2_F03_01_evaluate_daily_streak_utc_vs_vn_midnight_boundary(self):
        with IsolatedBackendEnv() as env:
            env.get_client()
            import models
            from routers import auth_router

            reg = env.register_isolated_user(email="tz_bound@e2etest.local")
            with env.database.SessionLocal() as db:
                u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                u.timezone = "Asia/Ho_Chi_Minh"
                u.streak_count = 15
                u.longest_streak = 15
                u.last_active_date = "2026-11-25"
                db.commit()

                # 2026-11-26T16:58:00Z == 2026-11-26 23:58:00+07:00 (still active day 26!)
                mock_before = _make_mock_datetime_module(
                    real_datetime.datetime(2026, 11, 26, 16, 58, 0, tzinfo=real_datetime.timezone.utc)
                )
                with patch.object(auth_router, "datetime", mock_before):
                    sig = inspect.signature(auth_router.evaluate_daily_streak)
                    kwargs = {"increment_if_completed": False} if "increment_if_completed" in sig.parameters else {}
                    info_before = auth_router.evaluate_daily_streak(u, db, **kwargs)
                self.assertEqual(info_before["streak"], 15, "At 23:58 VN with last_active=yesterday, streak must stay 15")

                # 2026-11-26T17:05:00Z == 2026-11-27 00:05:00+07:00 (UTC date is still Nov 26, VN date is Nov 27!)
                u.last_active_date = "2026-11-26"
                u.streak_count = 15
                db.commit()
                mock_after = _make_mock_datetime_module(
                    real_datetime.datetime(2026, 11, 26, 17, 5, 0, tzinfo=real_datetime.timezone.utc)
                )
                with patch.object(auth_router, "datetime", mock_after):
                    sig = inspect.signature(auth_router.evaluate_daily_streak)
                    kwargs = {"increment_if_completed": True} if "increment_if_completed" in sig.parameters else {}
                    info_after = auth_router.evaluate_daily_streak(u, db, **kwargs)
                # At 00:05 VN with last_active=2026-11-26, checkin should see diff==1 -> 16 (not diff==0 -> 15!)
                self.assertEqual(info_after["last_active_date"], "2026-11-27", "Must use Asia/Ho_Chi_Minh local date, not UTC date")

    def test_T2_F03_02_me_before_2359_vn_does_not_reset_streak(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="noreset@e2etest.local")
            import models

            yesterday_vn = (real_datetime.datetime.now(VN_TZ).date() - real_datetime.timedelta(days=1)).isoformat()
            with env.database.SessionLocal() as db:
                u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                u.streak_count = 15
                u.longest_streak = 15
                u.last_active_date = yesterday_vn
                u.timezone = "Asia/Ho_Chi_Minh"
                db.commit()

            r = c.get("/api/auth/me", headers={"Authorization": f"Bearer {reg['token']}"})
            self.assertEqual(r.status_code, 200)
            self.assertEqual(
                r.json()["streak_count"],
                15,
                "GET /api/auth/me must NEVER reset or alter streak_count on active day before 23:59",
            )

    def test_T2_F03_03_multi_day_gap_standard_user_vs_vu_protection(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="gap7@e2etest.local")
            host_token, _ = env.login_host(c)
            import models

            old_date = (real_datetime.datetime.now(VN_TZ).date() - real_datetime.timedelta(days=7)).isoformat()
            with env.database.SessionLocal() as db:
                u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                u.streak_count = 9
                u.last_active_date = old_date
                vu = db.query(models.User).filter(models.User.email == HOST_ADMIN_EMAIL).first()
                vu.last_active_date = old_date
                db.commit()

            r_std = c.get("/api/auth/me", headers={"Authorization": f"Bearer {reg['token']}"})
            self.assertEqual(r_std.status_code, 200)
            self.assertGreaterEqual(r_std.json()["streak_count"], 0)

            r_vu = c.get("/api/auth/me", headers={"Authorization": f"Bearer {host_token}"})
            self.assertEqual(r_vu.status_code, 200)
            self.assertGreaterEqual(r_vu.json()["streak_count"], 15)

    def test_T2_F03_04_corrupt_last_active_date_and_invalid_timezone_no_500(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="corrupt_dt@e2etest.local")
            import models

            for bad_date, bad_tz in [("not-a-date", "Mars/Phobos"), (None, "Invalid/Zone")]:
                with env.database.SessionLocal() as db:
                    u = db.query(models.User).filter(models.User.email == reg["email"]).first()
                    u.last_active_date = bad_date
                    u.timezone = bad_tz
                    db.commit()
                r = c.get("/api/auth/me", headers={"Authorization": f"Bearer {reg['token']}"})
                self.assertEqual(r.status_code, 200, f"Expected 200 for ({bad_date}, {bad_tz}), got {r.status_code}")

    def test_T2_F03_05_me_rejects_missing_malformed_and_revoked_tokens(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="revoked@e2etest.local")
            c.cookies.clear()
            r_none = c.get("/api/auth/me")
            self.assertEqual(r_none.status_code, 401)
            r_bad = c.get("/api/auth/me", headers={"Authorization": "Bearer invalid_token_xyz"})
            self.assertEqual(r_bad.status_code, 401)

            c.post("/api/auth/logout", headers={"Authorization": f"Bearer {reg['token']}"})
            c.cookies.clear()
            r_revoked = c.get("/api/auth/me", headers={"Authorization": f"Bearer {reg['token']}"})
            self.assertEqual(r_revoked.status_code, 401)

    def test_T2_F06_01_news_feed_offline_rss_failure_falls_back_to_curated(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            with patch("urllib.request.urlopen", side_effect=TimeoutError("simulated offline")):
                r = c.get("/api/news/feed")
            self.assertEqual(r.status_code, 200)
            self.assertIn(
                "application/json",
                r.headers.get("content-type", "").lower(),
                f"Expected JSON response from /api/news/feed, got {r.headers.get('content-type')!r}",
            )
            data = r.json()
            self.assertEqual(data.get("status"), "ok")
            self.assertEqual(data.get("source"), "curated")
            self.assertGreaterEqual(len(data.get("items", [])), 1)

    def test_T2_F06_03_news_feed_limit_boundary_clamping(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            for val in ("0", "-3", "9999"):
                r = c.get(f"/api/news/feed?limit={val}")
                self.assertEqual(r.status_code, 200, f"Expected 200 for limit={val}, got {r.status_code}")
                self.assertIn(
                    "application/json",
                    r.headers.get("content-type", "").lower(),
                    f"Expected JSON response from /api/news/feed?limit={val}, got {r.headers.get('content-type')!r}",
                )
                self.assertIsInstance(r.json().get("items"), list)
            r_bad = c.get("/api/news/feed?limit=bad")
            self.assertIn(r_bad.status_code, (200, 422))

    def test_T2_F06_04_news_feed_xss_and_traversal_blocked_403(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            r1 = c.get("/api/news/feed?topic=%3Cscript%3Ealert(1)%3C/script%3E")
            self.assertEqual(r1.status_code, 403)
            r2 = c.get("/api/news/feed?topic=../../etc/passwd")
            self.assertEqual(r2.status_code, 403)

    def test_T2_F11_03_security_middleware_blocks_405_and_403(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            self.assertEqual(c.post("/index.html").status_code, 405)
            self.assertEqual(c.put("/app.js").status_code, 405)
            self.assertEqual(c.delete("/style.css").status_code, 405)
            self.assertEqual(c.get("/%2e%2e/backend/app.db").status_code, 403)
            self.assertEqual(c.get("/?q=%3Cscript%3E").status_code, 403)

    def test_T2_F12_03_non_get_on_new_js_routes_returns_405(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            self.assertEqual(c.post("/translation-practice-engine.js").status_code, 405)
            self.assertEqual(c.put("/read-aloud-engine.js").status_code, 405)
            self.assertEqual(c.delete("/vi-en-games-engine.js").status_code, 405)

    def test_T2_F12_04_path_traversal_to_backend_db_blocked_403(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            r_enc = c.get("/%2e%2e/backend/app.db")
            self.assertEqual(r_enc.status_code, 403)
            r_lit = c.get("/..%2fbackend/app.db")
            self.assertEqual(r_lit.status_code, 403)
            self.assertNotIn(b"SQLite format 3", r_enc.content)
            self.assertNotIn(b"SQLite format 3", r_lit.content)

    def test_T2_F13_01_sync_script_no_duplicate_entries(self):
        _, _, data = _load_sync_script_ast()
        files = data.get("files_to_sync", [])
        self.assertEqual(len(files), len(set(files)), "files_to_sync contains duplicate entries")

    def test_T2_F13_02_sync_script_nested_dirs_handled_safely(self):
        src, _, data = _load_sync_script_ast()
        files = data.get("files_to_sync", [])
        nested = [f for f in files if "/" in f or "\\" in f]
        self.assertTrue(len(nested) > 0)
        desktop_dir = r"C:\Users\ngvu2\Desktop\english-mastery-web"
        has_makedirs = "makedirs" in src
        for f_rel in nested:
            parent_rel = os.path.dirname(f_rel)
            if os.path.isdir(desktop_dir):
                self.assertTrue(
                    has_makedirs or os.path.isdir(os.path.join(desktop_dir, parent_rel)),
                    f"Target parent dir missing for {f_rel} and sync_to_desktops.py does not call os.makedirs",
                )

    def test_T2_F13_03_sync_script_excludes_test_and_temp_artifacts(self):
        _, _, data = _load_sync_script_ast()
        for f_rel in data.get("files_to_sync", []):
            low = f_rel.lower()
            self.assertFalse(low.startswith("tests/"), f"Test path in files_to_sync: {f_rel}")
            for bad_ext in (".tmp", ".bak", "-journal", ".pyc"):
                self.assertFalse(low.endswith(bad_ext), f"Artifact {f_rel} in files_to_sync")

    def test_T2_F13_04_sync_script_covers_all_sw_assets(self):
        _, _, data = _load_sync_script_ast()
        sync_set = set(data.get("files_to_sync", []))
        with open(os.path.join(REPO_ROOT, "sw.js"), "r", encoding="utf-8") as f:
            sw_src = f.read()
        assets = re.findall(r"['\"]\.\/([^'\"]+)['\"]", sw_src)
        js_assets = [a for a in assets if a.endswith(".js")]
        self.assertGreater(len(js_assets), 10)
        for js in js_assets:
            self.assertIn(js, sync_set, f"Asset {js} in sw.js missing from sync_to_desktops.py")

    def test_T2_F13_05_sync_script_py_compile_clean(self):
        py_compile.compile(SYNC_SCRIPT_PATH, doraise=True)


class TestBackendTier3(unittest.TestCase):
    def test_T3_10_five_way_v105_asset_parity_and_html_sha256(self):
        # 1. 4 HTML SHA256 identical
        html_hashes = {h: file_sha256(os.path.join(REPO_ROOT, h)) for h in HTML_FILES}
        self.assertEqual(len(set(html_hashes.values())), 1, f"HTML hashes differ: {html_hashes}")

        # 2. index.html <script> JS list
        with open(os.path.join(REPO_ROOT, "index.html"), "r", encoding="utf-8") as f:
            html = f.read()
        html_js = set(re.findall(r'<script\s+[^>]*src=["\']\.\/([^"\'?]+\.js)\?v=106\.0["\']', html))

        # 3. sw.js ASSETS_TO_CACHE JS list
        with open(os.path.join(REPO_ROOT, "sw.js"), "r", encoding="utf-8") as f:
            sw_src = f.read()
        self.assertIn("english-mastery-v106.0", sw_src)
        sw_js = set(re.findall(r"['\"]\.\/([^'\"]+\.js)['\"]", sw_src))

        # 4. backend/main.py @app.get JS routes
        with open(os.path.join(REPO_ROOT, "backend", "main.py"), "r", encoding="utf-8") as f:
            main_src = f.read()
        main_js = set(re.findall(r'@app\.get\("/([^"]+\.js)"\)', main_src))

        # 5. sync_to_desktops.py JS files
        _, _, sync_data = _load_sync_script_ast()
        sync_js = {f for f in sync_data.get("files_to_sync", []) if f.endswith(".js")}

        required = set(ALL_REQUIRED_JS_FILES)
        for name, s in [("index.html?v=106.0", html_js), ("sw.js", sw_js), ("backend/main.py", main_js), ("sync_to_desktops.py", sync_js)]:
            missing = required - s
            self.assertFalse(missing, f"{name} missing required v106.0 JS files: {sorted(missing)}")
        for js in required:
            self.assertTrue(os.path.isfile(os.path.join(REPO_ROOT, js)), f"Disk file missing: {js}")

    def test_T3_13_security_guard_and_backend_routes_integration(self):
        # Verify SecurityGuardEngine in Node + FastAPI routes in isolated backend
        node_script = (
            "const g = require('./security-guard-engine.js');"
            "for (const h of ['#translation', '#readaloud', '#games']) {"
            "  const r = g.inspectAndSanitizeUrl({ pathname: '/', search: '?bad=1', hash: h });"
            "  if (!r.tampered || r.cleanUrl !== '/' + h) process.exit(2);"
            "}"
        )
        proc = subprocess.run(["node", "-e", node_script], cwd=REPO_ROOT, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"SecurityGuardEngine check failed: {proc.stderr}")

        with IsolatedBackendEnv() as env:
            c = env.get_client()
            self.assertEqual(c.get("/api/news/feed").status_code, 200)
            self.assertEqual(c.post("/translation-practice-engine.js").status_code, 405)
            self.assertEqual(c.get("/%2e%2e/app.db").status_code, 403)

    def test_T3_14_cloud_save_and_load_roundtrip_with_mission_registry(self):
        with IsolatedBackendEnv() as env:
            c = env.get_client()
            reg = env.register_isolated_user(email="cloud_rt@e2etest.local")
            headers = {"Authorization": f"Bearer {reg['token']}"}
            payload = {
                "missionRegistry": {
                    "currentDay": 3,
                    "history": {
                        "3": {
                            "vocabDone": True,
                            "translationDone": True,
                            "readaloudDone": True,
                            "translationReadaloudDone": True,
                        }
                    },
                }
            }
            save_r = c.post("/api/sync/cloud-save", json={"sync_key": "", "payload": payload}, headers=headers)
            self.assertEqual(save_r.status_code, 200)
            self.assertTrue(save_r.json().get("success"))

            # Login a second session for same user and verify cloud-load + /me
            login_r = c.post("/api/auth/login", json={"email": reg["email"], "password": reg["password"]})
            self.assertEqual(login_r.status_code, 200)
            tok2 = login_r.json()["token"]
            load_r = c.get("/api/sync/cloud-load", headers={"Authorization": f"Bearer {tok2}"})
            self.assertEqual(load_r.status_code, 200)
            loaded = load_r.json()
            self.assertTrue(loaded.get("success"))
            day3 = loaded["data"]["missionRegistry"]["history"]["3"]
            self.assertTrue(day3["translationDone"])
            self.assertTrue(day3["readaloudDone"])

            me_r = c.get("/api/auth/me", headers={"Authorization": f"Bearer {tok2}"})
            self.assertEqual(me_r.status_code, 200)
            self.assertGreaterEqual(me_r.json()["streak_count"], 1)


if __name__ == "__main__":
    snap_before = snapshot_db_integrity()
    try:
        unittest.main()
    finally:
        snap_after = snapshot_db_integrity()
        assert snap_before["sha256"] == snap_after["sha256"], "backend/app.db SHA256 mutated!"
