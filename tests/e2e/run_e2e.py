"""
Unified Opaque-Box E2E Test Runner for english-mastery-web (v105.0).

Usage:
  python tests/e2e/run_e2e.py --list
  python tests/e2e/run_e2e.py --tier 1
  python tests/e2e/run_e2e.py --tier all --json-report <path>
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import unittest
from typing import Any, Dict, List, Tuple

E2E_DIR = os.path.dirname(os.path.abspath(__file__))
if E2E_DIR not in sys.path:
    sys.path.insert(0, E2E_DIR)

from e2e_isolation import REPO_ROOT, SOURCE_DB_PATH, snapshot_db_integrity

MJS_FILE = os.path.join(E2E_DIR, "test_tiers_1_to_3_frontend.mjs")
BACKEND_PY_MOD = "test_backend_tiers_1_to_3"
BROWSER_PY_MOD = "test_browser_cdp_tiers_3_4"

ID_FROM_PY_METHOD_RX = re.compile(r"^test_(T[1-4](?:_F\d{2}_\d{2}|_\d{2}))")
ID_FROM_MJS_RX = re.compile(r"""^test\(\s*['"](T[1-4](?:-F\d{2}-\d{2}|-\d{2}))\b""", re.MULTILINE)


def _normalize_py_id(method_name: str) -> str | None:
    m = ID_FROM_PY_METHOD_RX.match(method_name)
    if not m:
        return None
    return m.group(1).replace("_", "-")


def _tier_of_id(test_id: str) -> int:
    return int(test_id[1])


def discover_mjs_tests() -> List[Dict[str, Any]]:
    with open(MJS_FILE, "r", encoding="utf-8") as f:
        src = f.read()
    items = []
    for m in ID_FROM_MJS_RX.finditer(src):
        tid = m.group(1)
        items.append({"id": tid, "tier": _tier_of_id(tid), "layer": "node-vm", "target": os.path.basename(MJS_FILE)})
    return items


def _iter_suite_cases(suite: unittest.TestSuite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from _iter_suite_cases(item)
        else:
            yield item


def discover_py_tests(module_name: str, layer: str) -> List[Tuple[str, int, unittest.TestCase]]:
    loader = unittest.defaultTestLoader
    mod = __import__(module_name)
    suite = loader.loadTestsFromModule(mod)
    out = []
    for case in _iter_suite_cases(suite):
        tid = _normalize_py_id(case._testMethodName)
        if tid:
            out.append((tid, _tier_of_id(tid), case))
    return out


def discover_all_tests() -> List[Dict[str, Any]]:
    all_items: List[Dict[str, Any]] = []
    all_items.extend(discover_mjs_tests())
    for tid, tier, case in discover_py_tests(BACKEND_PY_MOD, "python-backend"):
        all_items.append({"id": tid, "tier": tier, "layer": "python-backend", "target": case.id()})
    for tid, tier, case in discover_py_tests(BROWSER_PY_MOD, "edge-cdp"):
        all_items.append({"id": tid, "tier": tier, "layer": "edge-cdp", "target": case.id()})
    return all_items


def parse_tap_results(tap_stdout: str) -> List[Dict[str, Any]]:
    results = []
    # Node --test-reporter=tap emits top-level lines: "ok 1 - T1-F01-01: ..." or "not ok 1 - T1-F01-01: ..."
    rx = re.compile(r"^(ok|not ok)\s+\d+\s+-\s+(T[1-4](?:-F\d{2}-\d{2}|-\d{2}))\b(.*)$")
    for raw_line in tap_stdout.splitlines():
        line = raw_line.rstrip()
        m = rx.match(line)
        if m:
            status = "passed" if m.group(1) == "ok" else "failed"
            tid = m.group(2)
            results.append({"id": tid, "tier": _tier_of_id(tid), "layer": "node-vm", "status": status, "detail": m.group(3).strip()})
    return results


def run_node_tier(tiers: List[int]) -> Tuple[int, List[Dict[str, Any]], str]:
    node_tiers = [t for t in tiers if t in (1, 2, 3)]
    if not node_tiers:
        return 0, [], ""
    tier_chars = "".join(str(t) for t in node_tiers)
    pattern = f"^T[{tier_chars}]-"
    cmd = ["node", "--test", "--test-reporter=tap", f"--test-name-pattern={pattern}", MJS_FILE]
    proc = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    parsed = parse_tap_results(proc.stdout)
    return proc.returncode, parsed, proc.stdout + ("\n" + proc.stderr if proc.stderr else "")


class RecordingTestResult(unittest.TextTestResult):
    def __init__(self, stream, descriptions, verbosity, layer: str):
        super().__init__(stream, descriptions, verbosity)
        self.layer = layer
        self.records: List[Dict[str, Any]] = []

    def _extract_id_and_tier(self, test) -> Tuple[str, int]:
        mname = getattr(test, "_testMethodName", None)
        if mname:
            tid = _normalize_py_id(mname)
            if tid:
                return tid, _tier_of_id(tid)
            return mname, 0
        desc = getattr(test, "description", None) or str(test)
        return desc, 0

    def addSuccess(self, test):
        super().addSuccess(test)
        tid, tier = self._extract_id_and_tier(test)
        self.records.append({"id": tid, "tier": tier, "layer": self.layer, "status": "passed", "detail": ""})

    def addFailure(self, test, err):
        super().addFailure(test, err)
        tid, tier = self._extract_id_and_tier(test)
        self.records.append(
            {"id": tid, "tier": tier, "layer": self.layer, "status": "failed", "detail": self._exc_info_to_string(err, test)}
        )

    def addError(self, test, err):
        super().addError(test, err)
        tid, tier = self._extract_id_and_tier(test)
        self.records.append(
            {"id": tid, "tier": tier, "layer": self.layer, "status": "error", "detail": self._exc_info_to_string(err, test)}
        )

    def addSkip(self, test, reason):
        super().addSkip(test, reason)
        tid, tier = self._extract_id_and_tier(test)
        self.records.append({"id": tid, "tier": tier, "layer": self.layer, "status": "skipped", "detail": reason})


def run_python_module_tiers(module_name: str, layer: str, tiers: List[int]) -> Tuple[bool, List[Dict[str, Any]]]:
    items = discover_py_tests(module_name, layer)
    selected = [case for (_tid, tier, case) in items if tier in tiers]
    if not selected:
        return True, []

    suite = unittest.TestSuite(selected)
    runner = unittest.TextTestRunner(
        stream=sys.stdout,
        verbosity=2,
        resultclass=lambda stream, descriptions, verbosity: RecordingTestResult(stream, descriptions, verbosity, layer),
    )
    res: RecordingTestResult = runner.run(suite)  # type: ignore[assignment]
    return res.wasSuccessful(), res.records


def main() -> int:
    parser = argparse.ArgumentParser(description="english-mastery-web v105.0 Opaque-Box E2E Runner")
    parser.add_argument("--tier", choices=["1", "2", "3", "4", "all"], default="all", help="Tier to execute")
    parser.add_argument("--list", action="store_true", help="List all registered test IDs & tier counts without running")
    parser.add_argument("--json-report", type=str, default="", help="Write structured JSON test report to path")
    args = parser.parse_args()

    if args.list:
        all_items = discover_all_tests()
        by_tier: Dict[int, List[Dict[str, Any]]] = {1: [], 2: [], 3: [], 4: []}
        seen_ids = set()
        dupes = []
        for it in all_items:
            if it["id"] in seen_ids:
                dupes.append(it["id"])
            seen_ids.add(it["id"])
            by_tier[it["tier"]].append(it)
        print(f"Discovered {len(all_items)} total E2E test IDs (unique={len(seen_ids)}, dupes={dupes}):")
        for t in (1, 2, 3, 4):
            print(f"  Tier {t}: {len(by_tier[t])} tests")
            for it in sorted(by_tier[t], key=lambda x: x["id"]):
                print(f"    {it['id']:12s} [{it['layer']:14s}] {it['target']}")
        if dupes:
            print(f"ERROR: Duplicate test IDs detected: {dupes}", file=sys.stderr)
            return 2
        if len(all_items) != 161:
            print(f"WARNING: Expected 161 test IDs, found {len(all_items)}", file=sys.stderr)
            return 2
        return 0

    tiers = [1, 2, 3, 4] if args.tier == "all" else [int(args.tier)]
    snap_before = snapshot_db_integrity(SOURCE_DB_PATH)
    started_at = time.time()

    all_records: List[Dict[str, Any]] = []
    node_rc, node_records, node_raw = run_node_tier(tiers)
    if node_raw:
        print("=== Node VM / Static Suite ===")
        print(node_raw)
    all_records.extend(node_records)

    print("\n=== Python Backend Suite ===")
    py_backend_ok, py_backend_records = run_python_module_tiers(BACKEND_PY_MOD, "python-backend", tiers)
    all_records.extend(py_backend_records)

    print("\n=== Headless Edge CDP Suite ===")
    py_browser_ok, py_browser_records = run_python_module_tiers(BROWSER_PY_MOD, "edge-cdp", tiers)
    all_records.extend(py_browser_records)

    snap_after = snapshot_db_integrity(SOURCE_DB_PATH)
    db_unchanged = (
        snap_before["sha256"] == snap_after["sha256"]
        and snap_before["mtime"] == snap_after["mtime"]
        and snap_before["size"] == snap_after["size"]
    )

    elapsed = round(time.time() - started_at, 2)
    print("\n" + "=" * 64)
    print(f"E2E SUMMARY (tiers={args.tier}, elapsed={elapsed}s)")
    print("=" * 64)
    for t in tiers:
        t_recs = [r for r in all_records if r["tier"] == t]
        passed = sum(1 for r in t_recs if r["status"] == "passed")
        failed = sum(1 for r in t_recs if r["status"] in ("failed", "error"))
        print(f"  Tier {t}: total={len(t_recs):3d} | passed={passed:3d} | failed/error={failed:3d}")

    total_passed = sum(1 for r in all_records if r["status"] == "passed")
    total_failed = sum(1 for r in all_records if r["status"] in ("failed", "error"))
    print("-" * 64)
    print(f"  TOTAL:  total={len(all_records):3d} | passed={total_passed:3d} | failed/error={total_failed:3d}")
    print(
        f"  DB Integrity ({SOURCE_DB_PATH}): "
        f"sha256_match={snap_before['sha256'] == snap_after['sha256']} "
        f"mtime_match={snap_before['mtime'] == snap_after['mtime']}"
    )

    if args.json_report:
        report = {
            "tiers": tiers,
            "elapsed_seconds": elapsed,
            "db_before": snap_before,
            "db_after": snap_after,
            "db_unchanged": db_unchanged,
            "summary": {
                "total": len(all_records),
                "passed": total_passed,
                "failed": total_failed,
            },
            "results": all_records,
        }
        os.makedirs(os.path.dirname(os.path.abspath(args.json_report)), exist_ok=True)
        with open(args.json_report, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"  JSON report written: {args.json_report}")

    if not db_unchanged:
        print("CRITICAL INTEGRITY FAILURE: backend/app.db was modified during E2E execution!", file=sys.stderr)
        return 2

    all_ok = (node_rc == 0) and py_backend_ok and py_browser_ok and (total_failed == 0)
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
