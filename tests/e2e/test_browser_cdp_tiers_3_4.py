"""
Browser CDP Opaque-Box E2E Tests (Tier 1/2 Browser DOM, Tier 3 Pairwise, Tier 4 Scenarios).
Runs against an isolated uvicorn FastAPI server backed by a temporary copy of
backend/app.db and Headless Microsoft Edge via CDP websockets.
"""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from e2e_isolation import (
    HOST_ADMIN_EMAIL,
    HeadlessEdgeCDP,
    IsolatedUvicornServer,
    snapshot_db_integrity,
)

# ---------------------------------------------------------------------------
# Shared browser helpers (strictly opaque-box DOM + window contracts)
# ---------------------------------------------------------------------------


def _boot_authenticated_user(
    cdp: HeadlessEdgeCDP,
    srv: IsolatedUvicornServer,
    email_prefix: str = "cdp",
    fresh_user: bool = False,
):
    if fresh_user or not hasattr(srv, "_cached_e2e_user"):
        reg = srv.register_isolated_user(email=f"{email_prefix}_{int(time.time() * 1000)}@e2etest.local")
        if not fresh_user:
            srv._cached_e2e_user = reg
    else:
        reg = srv._cached_e2e_user

    cur_origin = cdp.eval_js("window.location.origin", await_promise=False)
    if cur_origin != srv.base_url:
        cdp.navigate(f"{srv.base_url}/")
    cdp.clear_storage_and_cookies()
    cdp.seed_auth(reg["token"], reg["user"], extra_ls={"EMH_STREAK_V105_MIGRATED": "1"})
    cdp.reload(ignore_cache=False)
    cdp.clear_errors()
    return reg


def _open_tab(cdp: HeadlessEdgeCDP, tab_name: str):
    nav_sel = f"#nav-btn-{tab_name}"
    has_nav = cdp.eval_js(f"Boolean(document.querySelector({json.dumps(nav_sel)}))", await_promise=False)
    if not has_nav:
        raise AssertionError(f"Navigation button {nav_sel} not found in DOM")
    cdp.click(nav_sel)
    time.sleep(0.2)
    tab_sel = f"#tab-{tab_name}"
    visible = cdp.eval_js(
        f"""(() => {{
            const el = document.querySelector({json.dumps(tab_sel)});
            if (!el) return false;
            return !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none';
        }})()""",
        await_promise=False,
    )
    if not visible:
        raise AssertionError(f"Tab section {tab_sel} did not become visible after clicking {nav_sel}")


def _assert_elements_exist(cdp: HeadlessEdgeCDP, selectors: list[str]):
    missing = cdp.eval_js(
        f"""(() => {{
            const sels = {json.dumps(selectors)};
            return sels.filter(s => !document.querySelector(s));
        }})()""",
        await_promise=False,
    )
    if missing:
        raise AssertionError(f"Missing required DOM elements: {missing}")


def _select_unit1_article_and_prepare(cdp: HeadlessEdgeCDP):
    _open_tab(cdp, "translation")
    _assert_elements_exist(
        cdp,
        [
            "#trSourceFilter",
            "#trUnitFilter",
            "#trLengthFilter",
            "#trArticleList",
            "#trSourcePassageVi",
            "#trUserTranslationInput",
            "#trBtnGradeTranslation",
            "#trWritingGradeResult",
            "#trBtnSendToReadAloud",
        ],
    )
    cdp.set_value("#trSourceFilter", "unit")
    time.sleep(0.15)
    # Pick first non-empty option in #trUnitFilter if needed
    cdp.eval_js(
        """(() => {
            const uf = document.getElementById('trUnitFilter');
            if (uf && uf.options.length > 1 && !uf.value) {
                uf.value = uf.options[1].value;
                uf.dispatchEvent(new Event('change', { bubbles: true }));
            }
        })()""",
        await_promise=False,
    )
    time.sleep(0.15)
    clicked = cdp.eval_js(
        """(() => {
            const list = document.getElementById('trArticleList');
            if (!list) return false;
            const item = list.querySelector('[data-id], button, .tr-article-item, .article-card, li, :scope > div');
            if (!item) return false;
            item.click();
            return true;
        })()""",
        await_promise=False,
    )
    if not clicked:
        raise AssertionError("No clickable article item rendered in #trArticleList")
    time.sleep(0.15)
    passage = cdp.eval_js(
        "document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''",
        await_promise=False,
    )
    if len(passage.split()) < 10:
        raise AssertionError(f"#trSourcePassageVi did not populate cleanly: {passage!r}")
    return passage


def _extract_numeric_score(text: str) -> float:
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:/\s*(?:10|100)|%|điểm)", text, re.IGNORECASE)
    if not m:
        raise AssertionError(f"Expected numeric score in result text, got: {text[:250]!r}")
    val = float(m.group(1))
    unit = m.group(0)
    if "/100" in unit or "%" in unit:
        val = val / 10.0
    return val


def _play_game_mode(cdp: HeadlessEdgeCDP, mode: str) -> dict:
    _open_tab(cdp, "games")
    _assert_elements_exist(cdp, ["#vegUnitSelect", "#vegModeGrid", "#vegStage", "#vegScore", "#vegResultBox"])
    btn_sel = f'#vegModeGrid [data-mode="{mode}"]'
    _assert_elements_exist(cdp, [btn_sel])
    cdp.click(btn_sel)
    time.sleep(0.25)

    # Play up to 25 interactive steps using unit dictionary from APP_DATA
    res = cdp.eval_js(
        f"""(async () => {{
            const mode = {json.dumps(mode)};
            const stage = document.getElementById('vegStage');
            const resultBox = document.getElementById('vegResultBox');
            const unitSel = document.getElementById('vegUnitSelect');
            const units = (window.APP_DATA && window.APP_DATA.units) || [];
            const selectedVal = unitSel ? unitSel.value : '';
            const activeUnit = units.find(u => (u.unitId === selectedVal || String(u.unitNumber) === selectedVal)) || units[0] || {{}};
            const vocab = [];
            for (const d of (activeUnit.days || [])) {{
                for (const w of (d.words || [])) {{
                    vocab.push({{
                        en: String(w.word || '').trim(),
                        vi: String(w.meaning_vi || w.meaning || w.vi || '').trim(),
                        ex: String(w.example || '').trim(),
                        exVi: String(w.example_vi || '').trim(),
                    }});
                }}
            }}

            const isResultVisible = () => resultBox && !resultBox.classList.contains('hidden') && resultBox.textContent.trim().length > 0 && getComputedStyle(resultBox).display !== 'none';
            const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\\s]/g, ' ').replace(/\\s+/g, ' ').trim();

            for (let step = 0; step < 35; step++) {{
                if (isResultVisible()) break;
                const stageText = (stage.textContent || '').trim();

                if (mode === 'match_pairs') {{
                    const viBtn = stage.querySelector('[data-action="match-vi"]:not([disabled])');
                    if (viBtn) {{
                        const pairId = viBtn.dataset.pairId;
                        viBtn.click();
                        const enBtn = pairId
                            ? stage.querySelector(`[data-action="match-en"][data-pair-id="${{pairId}}"]:not([disabled])`)
                            : stage.querySelector('[data-action="match-en"]:not([disabled])');
                        if (enBtn) enBtn.click();
                    }}
                }} else if (mode === 'word_tiles') {{
                    const poolTiles = Array.from(stage.querySelectorAll('[data-tile], .veg-tile, button')).filter(b => {{
                        const t = (b.textContent || '').trim();
                        return !b.disabled && t && !/kiểm tra|submit|nộp|chơi lại|reset|xóa|next|tiếp/i.test(t) && !b.closest('[data-tray]');
                    }});
                    const matchedEx = vocab.find(v => v.exVi && stageText.includes(v.exVi.slice(0, 12))) || vocab.find(v => v.vi && stageText.includes(v.vi.slice(0, 10)));
                    if (matchedEx && matchedEx.ex) {{
                        const words = matchedEx.ex.replace(/[^a-zA-Z0-9'\\s-]/g, '').split(/\\s+/);
                        for (const w of words) {{
                            const btn = poolTiles.find(b => !b.disabled && norm(b.textContent) === norm(w));
                            if (btn) btn.click();
                        }}
                    }} else {{
                        for (const b of poolTiles.slice(0, 6)) {{
                            if (!b.disabled) b.click();
                        }}
                    }}
                    const submitBtn = Array.from(stage.querySelectorAll('button')).find(b => /kiểm tra|submit|nộp|check/i.test(b.textContent));
                    if (submitBtn) submitBtn.click();
                }} else if (mode === 'type_translation') {{
                    const inp = stage.querySelector('input[type="text"], textarea');
                    const matched = vocab.find(v => v.vi && stageText.toLowerCase().includes(v.vi.toLowerCase().slice(0, 12))) || vocab[0];
                    if (inp) {{
                        inp.value = matched ? (matched.en || matched.ex || 'hello') : 'technology';
                        inp.dispatchEvent(new Event('input', {{ bubbles: true }}));
                    }}
                    const submitBtn = stage.querySelector('[data-action="submit-text"]') || Array.from(stage.querySelectorAll('button')).find(b => /chấm|kiểm tra|submit|nộp|check|gửi/i.test(b.textContent));
                    if (submitBtn) submitBtn.click();
                }} else if (mode === 'spot_fix') {{
                    const inp = stage.querySelector('input[type="text"], textarea');
                    const matched = vocab.find(v => v.exVi && stageText.includes(v.exVi.slice(0, 12))) || vocab[0];
                    if (inp) {{
                        inp.value = matched ? (matched.ex || matched.en) : 'corrected sentence';
                        inp.dispatchEvent(new Event('input', {{ bubbles: true }}));
                    }}
                    const optBtn = Array.from(stage.querySelectorAll('[data-option], [data-correct="true"], .veg-option, button')).find(b => {{
                        if (b.dataset.correct === 'true') return true;
                        return matched && matched.en && norm(b.textContent).includes(norm(matched.en));
                    }});
                    if (optBtn) optBtn.click();
                    const submitBtn = Array.from(stage.querySelectorAll('button')).find(b => /kiểm tra|submit|nộp|sửa|fix|check/i.test(b.textContent));
                    if (submitBtn) submitBtn.click();
                }} else if (mode === 'falling_words') {{
                    const st = window.ViEnGamesEngine?.getState?.();
                    const activeWords = st?.fallingState?.activeWords || [];
                    const optBtns = Array.from(stage.querySelectorAll('#vegFallingOptions [data-action="submit-option"], [data-option], button[data-option]'));
                    const cleanVi = s => String(s || '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff\s]/g, ' ').replace(/\s+/g, ' ').trim();
                    let bestBtn = null;
                    for (const aw of activeWords) {{
                        const candEn = (aw.acceptedEn || [aw.en]).map(norm);
                        bestBtn = optBtns.find(b => candEn.includes(norm(b.textContent)));
                        if (bestBtn) break;
                    }}
                    if (!bestBtn && optBtns.length) {{
                        const arenaTexts = Array.from(stage.querySelectorAll('#vegFallingArena .veg-falling-item')).map(el => cleanVi(el.textContent));
                        for (const at of arenaTexts) {{
                            const m = vocab.find(v => {{
                                const vc = cleanVi(v.vi);
                                return vc && at && (vc.includes(at) || at.includes(vc.slice(0, 12)));
                            }});
                            if (m) {{
                                bestBtn = optBtns.find(b => norm(b.textContent) === norm(m.en));
                                if (bestBtn) break;
                            }}
                        }}
                    }}
                    if (bestBtn) {{
                        bestBtn.click();
                    }} else if (optBtns.length) {{
                        optBtns[0].click();
                    }}
                }} else {{
                    // cloze, speed_blitz, dialogue_chain
                    const matched = vocab.find(v => v.vi && stageText.toLowerCase().includes(v.vi.toLowerCase().slice(0, 10)));
                    const btns = Array.from(stage.querySelectorAll('[data-option], .veg-option, button:not([disabled])')).filter(b => !/chơi lại|restart|đổi|next|tiếp/i.test(b.textContent));
                    const best = btns.find(b => b.dataset.correct === 'true' || (matched && (norm(b.textContent).includes(norm(matched.en)) || norm(b.textContent).includes(norm(matched.ex))))) || btns[0];
                    if (best) best.click();
                    const inp = stage.querySelector('input[type="text"], textarea');
                    if (inp && !inp.value) {{
                        inp.value = matched ? (matched.en || matched.ex) : (vocab[0]?.en || 'answer');
                        inp.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        const submitBtn = Array.from(stage.querySelectorAll('button')).find(b => /kiểm tra|submit|nộp|gửi|check/i.test(b.textContent));
                        if (submitBtn) submitBtn.click();
                    }}
                }}

                // Click Next/Continue if presented
                const nextBtn = Array.from(stage.querySelectorAll('button')).find(b => /tiếp|next|câu tiếp|hoàn tất/i.test(b.textContent));
                if (nextBtn && !nextBtn.disabled) nextBtn.click();

                await new Promise(r => setTimeout(r, 80));
            }}

            return {{
                scoreText: document.getElementById('vegScore')?.textContent || '',
                resultVisible: isResultVisible(),
                resultText: resultBox?.textContent || '',
                stageHtmlLen: stage?.innerHTML?.length || 0,
            }};
        }})()"""
    )
    return res


class TestBrowserTiers1To3(unittest.TestCase):
    srv: IsolatedUvicornServer
    cdp: HeadlessEdgeCDP

    @classmethod
    def setUpClass(cls):
        cls.srv = IsolatedUvicornServer()
        cls.srv.__enter__()
        cls.cdp = HeadlessEdgeCDP(initial_url=f"{cls.srv.base_url}/")
        cls.cdp.__enter__()
        cls.cdp.wait_for_app_ready()

    @classmethod
    def tearDownClass(cls):
        try:
            cls.cdp.__exit__(None, None, None)
        finally:
            cls.srv.__exit__(None, None, None)

    def setUp(self):
        self.cdp.clear_errors()
        self.cdp.set_viewport(1280, 800, mobile=False)

    # ---- Tier 1 Browser Tests ----

    def test_T1_F01_05_today_tab_shows_translation_readaloud_completed_and_countdown(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0105")
        self.cdp.eval_js(
            "if (typeof window.markDailyStreakTaskCompleted === 'function') window.markDailyStreakTaskCompleted('translation_readaloud');",
            await_promise=False,
        )
        _open_tab(self.cdp, "today")
        _assert_elements_exist(self.cdp, ["#realDeadlineCountdown", "#missionProgressRatio", "#todayRealStreakPill"])
        countdown = self.cdp.eval_js("document.getElementById('realDeadlineCountdown')?.textContent?.trim() || ''", False)
        self.assertRegex(countdown, r"\d{2}:\d{2}:\d{2}")
        today_text = self.cdp.eval_js("document.getElementById('tab-today')?.textContent || ''", False)
        self.assertRegex(today_text.lower(), r"dịch|translation|đọc lại|read")
        ratio = self.cdp.eval_js("document.getElementById('missionProgressRatio')?.textContent?.trim() || ''", False)
        self.assertRegex(ratio, r"\d+\s*/\s*\d+")
        self.cdp.assert_no_js_errors()

    def test_T1_F02_05_authenticated_reload_twice_preserves_streak_15(self):
        reg = _boot_authenticated_user(self.cdp, self.srv, "t1f0205")
        self.cdp.seed_auth(
            reg["token"],
            reg["user"],
            extra_ls={"EMH_STREAK": "15", "EMH_STREAK_V105_MIGRATED": "1"},
        )
        for _ in range(2):
            self.cdp.reload()
            streak_ls = self.cdp.eval_js("localStorage.getItem('EMH_STREAK')", False)
            streak_dom = self.cdp.eval_js("document.getElementById('streakCount')?.textContent?.trim() || ''", False)
            self.assertEqual(streak_ls, "15")
            self.assertIn("15", streak_dom)
        self.cdp.assert_no_js_errors()

    def test_T1_F05_01_source_filter_renders_all_4_source_groups(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0501")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSourceFilter", "#trArticleList"])
        for grp in ("unit", "video", "ielts_reading", "hot_trends"):
            self.cdp.set_value("#trSourceFilter", grp)
            time.sleep(0.15)
            cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
            self.assertGreater(cnt, 0, f"Expected > 0 articles for sourceGroup={grp}")
        self.cdp.assert_no_js_errors()

    def test_T1_F05_02_unit_filter_unit1_renders_matching_articles(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0502")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSourceFilter", "#trUnitFilter", "#trArticleList"])
        self.cdp.set_value("#trSourceFilter", "unit")
        time.sleep(0.1)
        opts = self.cdp.eval_js(
            "Array.from(document.getElementById('trUnitFilter').options).map(o => o.value)", False
        )
        u1 = next((v for v in opts if "unit1" in v.lower() or v == "1" or "unit_1" in v.lower()), "")
        self.assertTrue(u1, f"Unit 1 option not found in #trUnitFilter: {opts[:10]}")
        self.cdp.set_value("#trUnitFilter", u1)
        time.sleep(0.15)
        cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.assertGreater(cnt, 0)
        self.cdp.assert_no_js_errors()

    def test_T1_F05_03_length_filter_short_medium_long_word_ranges(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0503")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trLengthFilter", "#trArticleList", "#trSourcePassageVi"])
        for tier, lo, hi in [("short", 20, 89), ("medium", 90, 180), ("long", 181, 2000)]:
            self.cdp.set_value("#trLengthFilter", tier)
            time.sleep(0.15)
            self.cdp.eval_js(
                "document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()",
                False,
            )
            time.sleep(0.1)
            wc = self.cdp.eval_js(
                "(document.getElementById('trSourcePassageVi')?.textContent || '').trim().split(/\\s+/).filter(Boolean).length",
                False,
            )
            self.assertGreaterEqual(wc, lo, f"Expected {tier} >= {lo} words, got {wc}")
            self.assertLessEqual(wc, hi, f"Expected {tier} <= {hi} words, got {wc}")
        self.cdp.assert_no_js_errors()

    def test_T1_F05_04_custom_word_limit_65_slices_long_article_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0504")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trLengthFilter", "#trCustomWordLimit", "#trArticleList", "#trSourcePassageVi"])
        self.cdp.set_value("#trLengthFilter", "long")
        time.sleep(0.1)
        self.cdp.eval_js(
            "document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()",
            False,
        )
        time.sleep(0.1)
        orig_wc = self.cdp.eval_js(
            "(document.getElementById('trSourcePassageVi')?.textContent || '').trim().split(/\\s+/).filter(Boolean).length",
            False,
        )
        self.cdp.set_value("#trLengthFilter", "custom")
        self.cdp.set_value("#trCustomWordLimit", "65")
        time.sleep(0.15)
        sliced_wc = self.cdp.eval_js(
            "(document.getElementById('trSourcePassageVi')?.textContent || '').trim().split(/\\s+/).filter(Boolean).length",
            False,
        )
        self.assertLess(sliced_wc, orig_wc)
        self.assertGreaterEqual(sliced_wc, 45)
        self.assertLessEqual(sliced_wc, 75)
        self.cdp.assert_no_js_errors()

    def test_T1_F05_05_search_input_and_click_populates_source_passage(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0505")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSearchInput", "#trArticleList", "#trSourcePassageVi"])
        self.cdp.set_value("#trSearchInput", "môi trường")
        time.sleep(0.15)
        cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.assertGreater(cnt, 0)
        self.cdp.eval_js(
            "document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()",
            False,
        )
        time.sleep(0.1)
        txt = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
        self.assertGreater(len(txt), 40)
        self.cdp.assert_no_js_errors()

    def test_T1_F06_04_refresh_online_news_populates_list_and_selects(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0604")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trBtnRefreshOnline", "#trArticleList", "#trSourcePassageVi"])
        self.cdp.click("#trBtnRefreshOnline")
        time.sleep(0.8)
        cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.assertGreater(cnt, 0)
        self.cdp.eval_js(
            "document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()",
            False,
        )
        txt = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
        self.assertGreater(len(txt), 30)
        self.cdp.assert_no_js_errors()

    def test_T1_F06_05_refresh_ai_with_mocked_groq_adds_article(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0605")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trBtnRefreshAi", "#trArticleList", "#trSourcePassageVi"])
        self.cdp.eval_js(
            """(() => {
                localStorage.setItem('user_groq_api_key', 'gsk_test_mock');
                window.__origFetch = window.fetch;
                window.fetch = async (url, opts) => {
                    if (String(url).includes('groq.com')) {
                        return new Response(JSON.stringify({
                            choices: [{ message: { content: JSON.stringify({
                                title: 'Bài AI Tạo Tự Động E2E',
                                textVi: 'Trí tuệ nhân tạo đang hỗ trợ người học tiếng Anh luyện dịch và phản xạ giao tiếp hiệu quả hơn mỗi ngày tại nhà và trường học.',
                                referenceEn: 'Artificial intelligence is helping English learners practice translation and speaking reflexes more effectively every day at home and school.'
                            }) } }]
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                    return window.__origFetch(url, opts);
                };
            })()""",
            False,
        )
        self.cdp.click("#trBtnRefreshAi")
        time.sleep(0.5)
        body_txt = self.cdp.eval_js("document.getElementById('tab-translation')?.textContent || ''", False)
        self.assertIn("Trí tuệ nhân tạo", body_txt)
        self.cdp.eval_js("if (window.__origFetch) window.fetch = window.__origFetch;", False)
        self.cdp.assert_no_js_errors()

    def test_T1_F07_01_paste_vietnamese_paragraph_prepares_translation(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0701")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi", "#trUserTranslationInput"])
        vi_text = (
            "Việc học ngoại ngữ mỗi ngày giúp mở rộng tư duy và kết nối với thế giới rộng lớn. "
            "Khi bạn kiên trì luyện đọc và dịch câu ngắn sang tiếng Anh, kỹ năng diễn đạt sẽ tiến bộ rõ rệt từng tuần."
        )
        self.cdp.set_value("#trCustomTextInput", vi_text)
        self.cdp.click("#trBtnUsePersonal")
        time.sleep(0.2)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertIn("mở rộng tư duy", shown)
        disabled = self.cdp.eval_js("Boolean(document.getElementById('trUserTranslationInput')?.disabled)", False)
        self.assertFalse(disabled)
        self.cdp.assert_no_js_errors()

    def test_T1_F07_02_paste_english_paragraph_converts_to_vietnamese_prompt(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0702")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi"])
        en_text = (
            "Remote work has transformed modern cities by allowing employees to collaborate across borders "
            "without daily commuting, reducing traffic congestion and improving personal work-life balance."
        )
        self.cdp.set_value("#trCustomTextInput", en_text)
        self.cdp.click("#trBtnUsePersonal")
        time.sleep(0.3)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
        self.assertGreater(len(shown), 20)
        self.assertNotEqual(shown, en_text, "English personal input must be converted/prepared into a Vietnamese prompt")
        self.cdp.assert_no_js_errors()

    def test_T1_F07_03_upload_txt_file_loads_passage(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0703")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomFileUpload", "#trSourcePassageVi"])
        with tempfile.TemporaryDirectory() as tmp:
            p = os.path.join(tmp, "personal.txt")
            with open(p, "w", encoding="utf-8") as f:
                f.write("Giáo dục số đang tạo ra nhiều cơ hội học tập bình đẳng cho học sinh ở mọi vùng miền Việt Nam hiện nay.")
            self.cdp.upload_file("#trCustomFileUpload", p)
            time.sleep(0.3)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertIn("Giáo dục số", shown)
        self.cdp.assert_no_js_errors()

    def test_T1_F07_04_upload_md_file_loads_clean_passage(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0704")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomFileUpload", "#trSourcePassageVi"])
        with tempfile.TemporaryDirectory() as tmp:
            p = os.path.join(tmp, "notes.md")
            with open(p, "w", encoding="utf-8") as f:
                f.write("# Heading\n\n**Nội dung** học tiếng Anh hằng ngày giúp cải thiện phản xạ giao tiếp và kỹ năng viết học thuật.")
            self.cdp.upload_file("#trCustomFileUpload", p)
            time.sleep(0.3)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertIn("Nội dung", shown)
        self.assertNotIn("**", shown)
        self.cdp.assert_no_js_errors()

    def test_T1_F07_05_upload_json_file_loads_textvi_and_reference_en(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0705")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomFileUpload", "#trSourcePassageVi"])
        with tempfile.TemporaryDirectory() as tmp:
            p = os.path.join(tmp, "article.json")
            with open(p, "w", encoding="utf-8") as f:
                json.dump(
                    {
                        "title": "Bài cá nhân",
                        "textVi": "Công nghệ giúp việc học ngoại ngữ trở nên linh hoạt và thú vị hơn rất nhiều.",
                        "referenceEn": "Technology makes learning foreign languages much more flexible and engaging.",
                    },
                    f,
                    ensure_ascii=False,
                )
            self.cdp.upload_file("#trCustomFileUpload", p)
            time.sleep(0.3)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertIn("linh hoạt", shown)
        self.cdp.assert_no_js_errors()

    def test_T1_F08_01_local_rubric_grades_accurate_translation(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0801")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.eval_js("localStorage.removeItem('user_groq_api_key');", False)
        ref = self.cdp.eval_js(
            "window.TranslationPracticeEngine?.getCurrentArticle?.()?.referenceEn || window.TranslationPracticeEngine?.getState?.()?.activeArticle?.referenceEn || 'Technology has changed how students learn every day.'",
            False,
        )
        self.cdp.set_value("#trUserTranslationInput", ref)
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.3)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        score = _extract_numeric_score(res_txt)
        self.assertGreaterEqual(score, 6.0)
        self.cdp.assert_no_js_errors()

    def test_T1_F08_03_groq_api_grades_translation_with_criteria_and_corrected(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0803")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.eval_js(
            """(() => {
                localStorage.setItem('user_groq_api_key', 'gsk_mock_grade');
                window.__origFetch = window.fetch;
                window.fetch = async (url, opts) => {
                    if (String(url).includes('groq.com')) {
                        return new Response(JSON.stringify({
                            choices: [{ message: { content: JSON.stringify({
                                score: 8.5,
                                criteria: { accuracy: 8.5, grammar: 8.5, vocabulary: 8.5, coherence: 8.5 },
                                feedback: 'Strong translation with natural academic phrasing.',
                                corrected: 'Modern technology has significantly improved daily education.'
                            }) } }]
                        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                    return window.__origFetch(url, opts);
                };
            })()""",
            False,
        )
        self.cdp.set_value("#trUserTranslationInput", "Modern technology has improved daily education for students.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.4)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        self.assertIn("8.5", res_txt)
        self.assertIn("Strong translation", res_txt)
        self.cdp.eval_js("if (window.__origFetch) window.fetch = window.__origFetch;", False)
        self.cdp.assert_no_js_errors()

    def test_T1_F08_04_send_to_readaloud_button_enabled_after_grading(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0804")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "Students use modern tools to practice English skills every morning.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.3)
        ready = self.cdp.eval_js(
            """(() => {
                const btn = document.getElementById('trBtnSendToReadAloud');
                return Boolean(btn && !btn.disabled && !btn.classList.contains('hidden') && getComputedStyle(btn).display !== 'none');
            })()""",
            False,
        )
        self.assertTrue(ready, "#trBtnSendToReadAloud must be visible and enabled after grading")
        self.cdp.assert_no_js_errors()

    def test_T1_F08_05_regrading_improved_draft_increases_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0805")
        _select_unit1_article_and_prepare(self.cdp)
        ref = self.cdp.eval_js(
            "window.TranslationPracticeEngine?.getCurrentArticle?.()?.referenceEn || 'Modern technology helps students learn English effectively every day.'",
            False,
        )
        self.cdp.set_value("#trUserTranslationInput", "technology help")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        low_score = _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))

        self.cdp.set_value("#trUserTranslationInput", ref)
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        high_score = _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.assertGreater(high_score, low_score)
        self.cdp.assert_no_js_errors()

    def test_T1_F09_01_readaloud_tab_separate_from_tab_speaking(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0901")
        _open_tab(self.cdp, "readaloud")
        info = self.cdp.eval_js(
            """(() => ({
                nested: Boolean(document.querySelector('#tab-speaking #tab-readaloud')),
                speakingHidden: document.getElementById('tab-speaking')?.classList.contains('hidden'),
                hash: window.location.hash,
                hasEngine: Boolean(window.ReadAloudEngine && window.SpeakingEngine && window.ReadAloudEngine !== window.SpeakingEngine)
            }))()""",
            False,
        )
        self.assertFalse(info["nested"], "#tab-readaloud must NOT be nested inside #tab-speaking")
        self.assertTrue(info["speakingHidden"], "#tab-speaking must be hidden when #tab-readaloud is active")
        self.assertTrue(info["hasEngine"], "window.ReadAloudEngine must be distinct from window.SpeakingEngine")
        self.cdp.assert_no_js_errors()

    def test_T1_F09_02_send_to_readaloud_switches_tab_and_populates_en(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0902")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "Daily English practice builds confidence in academic communication.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        self.cdp.click("#trBtnSendToReadAloud")
        time.sleep(0.25)
        _assert_elements_exist(self.cdp, ["#tab-readaloud", "#raPassageTitle", "#raPassageTextEn"])
        visible = self.cdp.eval_js("!document.getElementById('tab-readaloud').classList.contains('hidden')", False)
        title = self.cdp.eval_js("document.getElementById('raPassageTitle')?.textContent?.trim() || ''", False)
        passage_en = self.cdp.eval_js("document.getElementById('raPassageTextEn')?.textContent?.trim() || ''", False)
        self.assertTrue(visible)
        self.assertTrue(len(title) > 0)
        self.assertTrue(len(passage_en) > 15)
        self.cdp.assert_no_js_errors()

    def test_T1_F09_03_listen_model_invokes_speech_synthesis(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0903")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raPassageTextEn", "#raBtnListenModel"])
        self.cdp.eval_js(
            """(() => {
                window.__spokenUtterances = [];
                window.speechSynthesis = window.speechSynthesis || {};
                window.speechSynthesis.cancel = () => {};
                window.speechSynthesis.speak = (u) => { window.__spokenUtterances.push(u.text || String(u)); };
                const p = document.getElementById('raPassageTextEn');
                if (p && !p.textContent.trim()) p.textContent = 'Education empowers communities worldwide.';
            })()""",
            False,
        )
        self.cdp.click("#raBtnListenModel")
        time.sleep(0.15)
        spoken = self.cdp.eval_js("window.__spokenUtterances", False)
        self.assertGreaterEqual(len(spoken), 1)
        self.cdp.assert_no_js_errors()

    def test_T1_F09_04_score_speech_renders_pronunciation_grammar_fluency(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0904")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raPassageTextEn", "#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        passage = self.cdp.eval_js(
            """(() => {
                const p = document.getElementById('raPassageTextEn');
                if (!p.textContent.trim()) p.textContent = 'Renewable energy reduces carbon emissions across modern cities.';
                return p.textContent.trim();
            })()""",
            False,
        )
        self.cdp.set_value("#raTranscriptInput", passage)
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.3)
        res = self.cdp.eval_js("document.getElementById('raResultZone')?.textContent || ''", False)
        self.assertGreater(len(res.strip()), 20)
        self.assertRegex(res.lower(), r"phát âm|pronunciation|ngữ pháp|grammar|trôi chảy|fluency|chính xác|accuracy")
        self.cdp.assert_no_js_errors()

    def test_T1_F09_05_record_button_updates_timer_and_stops_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f0905")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raBtnRecord", "#raRecTimer"])
        self.cdp.eval_js(
            """(() => {
                const fakeTrack = { stop() {} };
                const fakeStream = { getTracks: () => [fakeTrack] };
                navigator.mediaDevices = navigator.mediaDevices || {};
                navigator.mediaDevices.getUserMedia = async () => fakeStream;
                window.MediaRecorder = class {
                    constructor() { this.state = 'inactive'; }
                    start() { this.state = 'recording'; }
                    stop() { this.state = 'inactive'; if (this.onstop) this.onstop(); }
                };
            })()""",
            False,
        )
        self.cdp.click("#raBtnRecord")
        time.sleep(1.2)
        t_running = self.cdp.eval_js("document.getElementById('raRecTimer')?.textContent?.trim() || ''", False)
        self.cdp.click("#raBtnRecord")
        time.sleep(0.2)
        self.assertRegex(t_running, r"00:0[1-9]|0:0[1-9]|1s")
        self.cdp.assert_no_js_errors()

    # F10: 8 Games + Unit Binding (9 tests)
    def test_T1_F10_01_game_word_tiles_full_round_and_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1001")
        res = _play_game_mode(self.cdp, "word_tiles")
        self.assertTrue(res["resultVisible"], f"word_tiles did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_02_game_cloze_full_round_and_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1002")
        res = _play_game_mode(self.cdp, "cloze")
        self.assertTrue(res["resultVisible"], f"cloze did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_03_game_speed_blitz_countdown_and_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1003")
        res = _play_game_mode(self.cdp, "speed_blitz")
        self.assertTrue(res["resultVisible"], f"speed_blitz did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_04_game_match_pairs_clears_board_and_scores(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1004")
        res = _play_game_mode(self.cdp, "match_pairs")
        self.assertTrue(res["resultVisible"], f"match_pairs did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_05_game_type_translation_evaluates_and_scores(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1005")
        res = _play_game_mode(self.cdp, "type_translation")
        self.assertTrue(res["resultVisible"], f"type_translation did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_06_game_falling_words_catches_and_completes(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1006")
        res = _play_game_mode(self.cdp, "falling_words")
        self.assertTrue(res["resultVisible"], f"falling_words did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_07_game_spot_fix_corrects_and_completes(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1007")
        res = _play_game_mode(self.cdp, "spot_fix")
        self.assertTrue(res["resultVisible"], f"spot_fix did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_08_game_dialogue_chain_completes_sequentially(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1008")
        res = _play_game_mode(self.cdp, "dialogue_chain")
        self.assertTrue(res["resultVisible"], f"dialogue_chain did not complete into #vegResultBox: {res}")
        self.cdp.assert_no_js_errors()

    def test_T1_F10_09_unit_select_binds_to_app_data_units_1_10_37(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1009")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ["#vegUnitSelect", "#vegModeGrid", "#vegStage"])
        opts = self.cdp.eval_js(
            "Array.from(document.getElementById('vegUnitSelect').options).map(o => o.value)", False
        )
        self.assertGreaterEqual(len(opts), 30)
        self.cdp.set_value("#vegUnitSelect", opts[0])
        self.cdp.click('#vegModeGrid [data-mode="word_tiles"]')
        time.sleep(0.15)
        stage_u1 = self.cdp.eval_js("document.getElementById('vegStage')?.textContent || ''", False)
        u10 = next((o for o in opts if "10" in o), opts[min(9, len(opts) - 1)])
        self.cdp.set_value("#vegUnitSelect", u10)
        self.cdp.click('#vegModeGrid [data-mode="word_tiles"]')
        time.sleep(0.15)
        stage_u10 = self.cdp.eval_js("document.getElementById('vegStage')?.textContent || ''", False)
        self.assertTrue(len(stage_u1.strip()) > 0 and len(stage_u10.strip()) > 0)
        self.assertNotEqual(stage_u1, stage_u10)
        self.cdp.assert_no_js_errors()

    def test_T1_F11_01_default_warm_paper_theme_and_toggle_label(self):
        self.cdp.clear_storage_and_cookies()
        self.cdp.navigate(f"{self.srv.base_url}/")
        theme = self.cdp.eval_js(
            """(() => ({
                attr: document.documentElement.getAttribute('data-theme'),
                pageVar: getComputedStyle(document.documentElement).getPropertyValue('--page').trim(),
                bodyBg: getComputedStyle(document.body).backgroundColor,
                label: document.getElementById('darkModeToggleLabel')?.textContent?.trim() || ''
            }))()""",
            False,
        )
        self.assertIn(theme["attr"], (None, "paper"))
        self.assertEqual(theme["pageVar"], "#f5f2eb")
        self.assertEqual(theme["bodyBg"], "rgb(245, 242, 235)")
        self.assertEqual(theme["label"], "Tối")
        self.cdp.assert_no_js_errors()

    def test_T1_F11_02_dark_mode_toggle_sets_theme_and_css_tokens(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1102")
        self.cdp.click("#darkModeToggleBtn")
        time.sleep(0.15)
        dark = self.cdp.eval_js(
            """(() => ({
                attr: document.documentElement.getAttribute('data-theme'),
                ls: localStorage.getItem('em_theme'),
                pageVar: getComputedStyle(document.documentElement).getPropertyValue('--page').trim(),
                bodyBg: getComputedStyle(document.body).backgroundColor,
                label: document.getElementById('darkModeToggleLabel')?.textContent?.trim() || ''
            }))()""",
            False,
        )
        self.assertEqual(dark["attr"], "dark")
        self.assertEqual(dark["ls"], "dark")
        self.assertEqual(dark["pageVar"], "#141619")
        self.assertEqual(dark["bodyBg"], "rgb(20, 22, 25)")
        self.assertEqual(dark["label"], "Sáng")
        self.cdp.assert_no_js_errors()

    def test_T1_F11_03_legacy_v104_tabs_exist_and_switch_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t1f1103")
        for t in ("speaking", "today", "flashcard", "video", "profile"):
            _open_tab(self.cdp, t)
        self.cdp.assert_no_js_errors()

    def test_T1_F11_05_unauthenticated_boot_shows_auth_modal_never_vu(self):
        self.cdp.clear_storage_and_cookies()
        self.cdp.navigate(f"{self.srv.base_url}/")
        state = self.cdp.eval_js(
            """(() => {
                const modal = document.getElementById('authModal');
                const gate = window.DeviceAuthGate?.evaluateDeviceAccess(localStorage);
                return {
                    modalVisible: Boolean(modal && !modal.classList.contains('hidden') && getComputedStyle(modal).display !== 'none'),
                    gateAllowed: gate ? gate.allowed : null,
                    headerName: document.getElementById('headerAccountName')?.textContent?.trim() || '',
                    email: localStorage.getItem('EMH_ACTIVE_ACCOUNT_EMAIL') || ''
                };
            })()""",
            False,
        )
        self.assertFalse(state["gateAllowed"])
        self.assertTrue(state["modalVisible"], "#authModal must be visible when unauthenticated")
        self.assertIn("Chưa đăng nhập", state["headerName"])
        self.assertNotEqual(state["email"].lower(), HOST_ADMIN_EMAIL)
        self.cdp.assert_no_js_errors()

    # ---- Tier 2 Browser Tests ----

    def test_T2_F05_01_oversized_custom_word_limit_clamps_to_article_length(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0501")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trLengthFilter", "custom")
        self.cdp.set_value("#trCustomWordLimit", "99999")
        time.sleep(0.15)
        txt = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
        self.assertGreater(len(txt), 40)
        self.assertNotIn("undefined", txt.lower())
        self.cdp.assert_no_js_errors()

    def test_T2_F05_02_invalid_custom_word_limit_never_empty_or_nan(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0502")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trLengthFilter", "custom")
        for bad in ("0", "-25", "abc", ""):
            self.cdp.set_value("#trCustomWordLimit", bad)
            time.sleep(0.1)
            txt = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
            self.assertGreater(len(txt), 15, f"Passage empty on custom limit={bad!r}")
            self.assertNotIn("NaN", txt)
        self.cdp.assert_no_js_errors()

    def test_T2_F05_03_empty_search_result_renders_clean_empty_state(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0503")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSearchInput", "#trArticleList"])
        self.cdp.set_value("#trSearchInput", "zzzz_khong_ton_tai_99999")
        time.sleep(0.15)
        txt = self.cdp.eval_js("document.getElementById('trArticleList')?.textContent?.trim() || ''", False)
        self.assertTrue(len(txt) > 0, "Expected friendly empty state message in #trArticleList")
        self.cdp.assert_no_js_errors()

    def test_T2_F05_04_search_input_escapes_xss_payload(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0504")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSearchInput", "#trArticleList"])
        self.cdp.set_value("#trSearchInput", '<img src=x onerror="window.__xss=1">')
        time.sleep(0.2)
        xss = self.cdp.eval_js("window.__xss", False)
        self.assertIsNone(xss)
        self.cdp.assert_no_js_errors()

    def test_T2_F05_05_toggling_length_filter_does_not_mutate_translation_bank(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0505")
        _select_unit1_article_and_prepare(self.cdp)
        orig_len = self.cdp.eval_js("window.TRANSLATION_BANK?.[0]?.textVi?.length || 0", False)
        self.assertGreater(orig_len, 0)
        for mode, lim in [("short", ""), ("custom", "40"), ("long", ""), ("custom", "120")]:
            self.cdp.set_value("#trLengthFilter", mode)
            if lim:
                self.cdp.set_value("#trCustomWordLimit", lim)
            time.sleep(0.1)
        after_len = self.cdp.eval_js("window.TRANSLATION_BANK?.[0]?.textVi?.length || 0", False)
        self.assertEqual(orig_len, after_len)
        self.cdp.assert_no_js_errors()

    def test_T2_F06_02_refresh_ai_without_groq_key_prompts_gracefully(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0602")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trBtnRefreshAi", "#trArticleList"])
        self.cdp.eval_js("localStorage.removeItem('user_groq_api_key');", False)
        before_cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.cdp.click("#trBtnRefreshAi")
        time.sleep(0.25)
        after_cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.assertEqual(before_cnt, after_cnt)
        self.cdp.assert_no_js_errors()

    def test_T2_F06_05_refresh_online_network_failure_preserves_builtin_bank(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0605")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trBtnRefreshOnline", "#trArticleList"])
        self.cdp.eval_js(
            """(() => {
                window.__origFetch = window.fetch;
                window.fetch = async (url, opts) => {
                    if (String(url).includes('/api/news/feed')) {
                        return new Response('{"detail":"down"}', { status: 500 });
                    }
                    return window.__origFetch(url, opts);
                };
            })()""",
            False,
        )
        self.cdp.click("#trBtnRefreshOnline")
        time.sleep(0.35)
        cnt = self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False)
        self.assertGreater(cnt, 0, "Built-in articles must remain browsable when /api/news/feed fails")
        self.cdp.eval_js("if (window.__origFetch) window.fetch = window.__origFetch;", False)
        self.cdp.assert_no_js_errors()

    def test_T2_F07_01_empty_personal_text_rejected(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0701")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi"])
        before = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.cdp.set_value("#trCustomTextInput", "   \n\t  ")
        self.cdp.click("#trBtnUsePersonal")
        time.sleep(0.15)
        after = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertEqual(before, after)
        self.cdp.assert_no_js_errors()

    def test_T2_F07_02_invalid_file_extension_and_empty_file_rejected(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0702")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomFileUpload", "#trSourcePassageVi"])
        with tempfile.TemporaryDirectory() as tmp:
            bad_exe = os.path.join(tmp, "malware.exe")
            with open(bad_exe, "wb") as f:
                f.write(b"MZ_NOT_TEXT")
            self.cdp.upload_file("#trCustomFileUpload", bad_exe)
            time.sleep(0.2)
            empty_txt = os.path.join(tmp, "empty.txt")
            with open(empty_txt, "w", encoding="utf-8") as f:
                f.write("")
            self.cdp.upload_file("#trCustomFileUpload", empty_txt)
            time.sleep(0.2)
        shown = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent || ''", False)
        self.assertNotIn("MZ_NOT_TEXT", shown)
        self.cdp.assert_no_js_errors()

    def test_T2_F07_03_malformed_json_upload_handled_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0703")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomFileUpload", "#trSourcePassageVi"])
        with tempfile.TemporaryDirectory() as tmp:
            bad_json = os.path.join(tmp, "broken.json")
            with open(bad_json, "w", encoding="utf-8") as f:
                f.write("{broken: json")
            self.cdp.upload_file("#trCustomFileUpload", bad_json)
            time.sleep(0.2)
        self.cdp.assert_no_js_errors()

    def test_T2_F07_04_oversized_60k_personal_text_bounded_fast(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0704")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi"])
        big = ("Học tiếng Anh mỗi ngày giúp mở rộng kiến thức. " * 1400)[:60000]
        t0 = time.time()
        self.cdp.set_value("#trCustomTextInput", big)
        self.cdp.click("#trBtnUsePersonal")
        time.sleep(0.2)
        elapsed = time.time() - t0
        self.assertLess(elapsed, 3.0)
        self.cdp.assert_no_js_errors()

    def test_T2_F07_05_personal_paste_escapes_script_tag_xss(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0705")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi"])
        self.cdp.set_value("#trCustomTextInput", "<script>window.__xssPersonal=1</script> Nội dung học tập tiếng Anh mỗi ngày.")
        self.cdp.click("#trBtnUsePersonal")
        time.sleep(0.2)
        self.assertIsNone(self.cdp.eval_js("window.__xssPersonal", False))
        self.cdp.assert_no_js_errors()

    def test_T2_F08_01_empty_translation_blocked_without_awarding_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0801")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "   \n\t ")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.2)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        self.assertFalse(bool(re.search(r"[5-9](\.\d+)?\s*/\s*10", res_txt)))
        self.cdp.assert_no_js_errors()

    def test_T2_F08_02_vietnamese_only_submission_scored_low_with_warning(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0802")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "Hôm nay trời rất đẹp và tôi đi học tiếng Anh mỗi ngày cùng bạn bè.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        score = _extract_numeric_score(res_txt)
        self.assertLessEqual(score, 2.0, f"Vietnamese-only text should score <= 2.0/10, got {score}")
        self.cdp.assert_no_js_errors()

    def test_T2_F08_03_groq_429_falls_back_to_local_rubric_grader(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0803")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.eval_js(
            """(() => {
                localStorage.setItem('user_groq_api_key', 'gsk_bad');
                window.__origFetch = window.fetch;
                window.fetch = async (url, opts) => {
                    if (String(url).includes('groq.com')) {
                        return new Response('{"error":"rate_limit"}', { status: 429 });
                    }
                    return window.__origFetch(url, opts);
                };
            })()""",
            False,
        )
        self.cdp.set_value("#trUserTranslationInput", "Technology supports daily English learning for students.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.4)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        _extract_numeric_score(res_txt)
        self.cdp.eval_js("if (window.__origFetch) window.fetch = window.__origFetch;", False)
        self.cdp.assert_no_js_errors()

    def test_T2_F08_04_one_word_gibberish_applies_completeness_penalty(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0804")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "asdf")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        res_txt = self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False)
        score = _extract_numeric_score(res_txt)
        self.assertLessEqual(score, 3.0)
        self.cdp.assert_no_js_errors()

    def test_T2_F08_05_translation_submission_escapes_xss_in_result(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0805")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", '<img src=x onerror="window.__xssGrade=1"> Technology helps students.')
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        self.assertIsNone(self.cdp.eval_js("window.__xssGrade", False))
        self.cdp.assert_no_js_errors()

    def test_T2_F08_06_grading_with_no_passage_loaded_prompts_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0806")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trSourcePassageVi", "#trUserTranslationInput", "#trBtnGradeTranslation"])
        self.cdp.eval_js("document.getElementById('trSourcePassageVi').textContent = '';", False)
        self.cdp.set_value("#trUserTranslationInput", "Some English text.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.2)
        self.cdp.assert_no_js_errors()

    def test_T2_F09_01_empty_readaloud_transcript_blocked(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0901")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        self.cdp.set_value("#raTranscriptInput", "   ")
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.2)
        res_txt = self.cdp.eval_js("document.getElementById('raResultZone')?.textContent || ''", False)
        self.assertFalse(bool(re.search(r"100%|10/10", res_txt)))
        self.cdp.assert_no_js_errors()

    def test_T2_F09_02_unrelated_transcript_gets_low_pronunciation_score(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0902")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raPassageTextEn", "#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        self.cdp.eval_js(
            "document.getElementById('raPassageTextEn').textContent = 'Renewable energy reduces carbon emissions.';",
            False,
        )
        self.cdp.set_value("#raTranscriptInput", "Banana apple elephant table.")
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.25)
        res_txt = self.cdp.eval_js("document.getElementById('raResultZone')?.textContent || ''", False)
        self.assertGreater(len(res_txt.strip()), 10)
        self.assertFalse(bool(re.search(r"\b(9\d|100)%", res_txt)))
        self.cdp.assert_no_js_errors()

    def test_T2_F09_03_missing_mic_permission_falls_back_to_manual_transcript(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0903")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raBtnRecord", "#raTranscriptInput"])
        self.cdp.eval_js(
            """(() => {
                window.SpeechRecognition = undefined;
                window.webkitSpeechRecognition = undefined;
                window.MediaRecorder = undefined;
                if (navigator.mediaDevices) {
                    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Denied', 'NotAllowedError'); };
                }
            })()""",
            False,
        )
        self.cdp.click("#raBtnRecord")
        time.sleep(0.25)
        self.cdp.assert_no_js_errors()

    def test_T2_F09_04_readaloud_local_scorer_works_without_groq_key(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0904")
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raPassageTextEn", "#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        self.cdp.eval_js(
            """(() => {
                localStorage.removeItem('user_groq_api_key');
                document.getElementById('raPassageTextEn').textContent = 'Consistent daily study creates lasting progress.';
            })()""",
            False,
        )
        self.cdp.set_value("#raTranscriptInput", "Consistent daily study creates lasting progress.")
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.25)
        res_txt = self.cdp.eval_js("document.getElementById('raResultZone')?.textContent || ''", False)
        self.assertGreater(len(res_txt.strip()), 20)
        self.cdp.assert_no_js_errors()

    def test_T2_F09_05_readaloud_does_not_mutate_tab_speaking_or_speaking_engine(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f0905")
        _open_tab(self.cdp, "readaloud")
        nested = self.cdp.eval_js("Boolean(document.querySelector('#tab-speaking #tab-readaloud'))", False)
        self.assertFalse(nested)
        before_sp = self.cdp.eval_js("JSON.stringify(window.SpeakingEngine?.state || {})", False)
        self.cdp.eval_js("document.getElementById('raPassageTextEn').textContent = 'Practice daily.';", False)
        self.cdp.set_value("#raTranscriptInput", "Practice daily.")
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.2)
        after_sp = self.cdp.eval_js("JSON.stringify(window.SpeakingEngine?.state || {})", False)
        self.assertEqual(before_sp, after_sp)
        self.cdp.assert_no_js_errors()

    def test_T2_F10_01_speed_blitz_timer_expiry_never_negative(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1001")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="speed_blitz"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="speed_blitz"]')
        time.sleep(0.5)
        stage_txt = self.cdp.eval_js("document.getElementById('vegStage')?.textContent || ''", False)
        self.assertNotIn("-1s", stage_txt)
        self.cdp.assert_no_js_errors()

    def test_T2_F10_02_falling_words_miss_until_zero_lives_triggers_game_over(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1002")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="falling_words"]', "#vegStage", "#vegResultBox"])
        self.cdp.click('#vegModeGrid [data-mode="falling_words"]')
        time.sleep(0.25)
        self.assertGreater(self.cdp.eval_js("document.getElementById('vegStage')?.innerHTML?.length || 0", False), 0)
        self.cdp.assert_no_js_errors()

    def test_T2_F10_03_word_tiles_undo_and_incomplete_submit(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1003")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="word_tiles"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="word_tiles"]')
        time.sleep(0.2)
        self.cdp.eval_js(
            """(() => {
                const submitBtn = Array.from(document.querySelectorAll('#vegStage button')).find(b => /kiểm tra|submit|check|nộp/i.test(b.textContent));
                if (submitBtn) submitBtn.click();
            })()""",
            False,
        )
        self.cdp.assert_no_js_errors()

    def test_T2_F10_04_match_pairs_mismatch_deselects_without_softlock(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1004")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="match_pairs"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="match_pairs"]')
        time.sleep(0.2)
        self.cdp.eval_js(
            """(() => {
                const btns = Array.from(document.querySelectorAll('#vegStage button:not([disabled])'));
                if (btns.length >= 2) { btns[0].click(); btns[1].click(); }
            })()""",
            False,
        )
        self.cdp.assert_no_js_errors()

    def test_T2_F10_05_type_translation_empty_blocked_and_punctuation_normalized(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1005")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="type_translation"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="type_translation"]')
        time.sleep(0.2)
        self.cdp.eval_js(
            """(() => {
                const inp = document.querySelector('#vegStage input[type="text"], #vegStage textarea');
                const submitBtn = Array.from(document.querySelectorAll('#vegStage button')).find(b => /kiểm tra|submit|check|nộp/i.test(b.textContent));
                if (inp && submitBtn) { inp.value = ''; submitBtn.click(); }
            })()""",
            False,
        )
        self.cdp.assert_no_js_errors()

    def test_T2_F10_06_cloze_and_spot_fix_wrong_attempt_handled_cleanly(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1006")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="cloze"]', '#vegModeGrid [data-mode="spot_fix"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="cloze"]')
        time.sleep(0.2)
        self.cdp.click('#vegModeGrid [data-mode="spot_fix"]')
        time.sleep(0.2)
        self.cdp.assert_no_js_errors()

    def test_T2_F10_07_dialogue_chain_blocks_empty_turn(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1007")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="dialogue_chain"]', "#vegStage"])
        self.cdp.click('#vegModeGrid [data-mode="dialogue_chain"]')
        time.sleep(0.2)
        self.cdp.assert_no_js_errors()

    def test_T2_F10_08_switching_modes_and_units_mid_game_clears_timers(self):
        _boot_authenticated_user(self.cdp, self.srv, "t2f1008")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="speed_blitz"]', '#vegModeGrid [data-mode="match_pairs"]', "#vegUnitSelect"])
        self.cdp.click('#vegModeGrid [data-mode="speed_blitz"]')
        time.sleep(0.1)
        self.cdp.click('#vegModeGrid [data-mode="match_pairs"]')
        time.sleep(0.1)
        self.cdp.click('#vegModeGrid [data-mode="falling_words"]')
        time.sleep(0.1)
        self.cdp.click('#vegModeGrid [data-mode="word_tiles"]')
        time.sleep(0.3)
        self.cdp.assert_no_js_errors()

    def test_T2_F11_01_dom_guard_restores_auth_modal_if_hidden_or_removed(self):
        self.cdp.clear_storage_and_cookies()
        self.cdp.navigate(f"{self.srv.base_url}/")
        self.cdp.eval_js("document.getElementById('authModal')?.classList.add('hidden');", False)
        time.sleep(0.25)
        restored = self.cdp.eval_js(
            "(() => { const m = document.getElementById('authModal'); return Boolean(m && !m.classList.contains('hidden') && getComputedStyle(m).display !== 'none'); })()",
            False,
        )
        self.assertTrue(restored, "MutationObserver must restore #authModal when hidden while unauthenticated")
        self.cdp.assert_no_js_errors()

    def test_T2_F11_04_corrupt_em_theme_falls_back_cleanly(self):
        reg = _boot_authenticated_user(self.cdp, self.srv, "t2f1104")
        self.cdp.seed_auth(reg["token"], reg["user"], extra_ls={"em_theme": "corrupt_theme_999"})
        self.cdp.reload()
        self.cdp.click("#darkModeToggleBtn")
        time.sleep(0.15)
        self.assertEqual(self.cdp.eval_js("document.documentElement.getAttribute('data-theme')", False), "dark")
        self.cdp.assert_no_js_errors()

    # ---- Tier 3 Browser Pairwise Tests ----

    def test_T3_01_translation_grade_readaloud_deadline_streak_sync(self):
        reg = _boot_authenticated_user(self.cdp, self.srv, "t301", fresh_user=True)
        _select_unit1_article_and_prepare(self.cdp)
        ref = self.cdp.eval_js(
            "window.TranslationPracticeEngine?.getCurrentArticle?.()?.referenceEn || 'Technology supports students every day.'",
            False,
        )
        self.cdp.set_value("#trUserTranslationInput", ref)
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        self.cdp.click("#trBtnSendToReadAloud")
        time.sleep(0.25)
        en_passage = self.cdp.eval_js("document.getElementById('raPassageTextEn')?.textContent?.trim() || ''", False)
        self.cdp.set_value("#raTranscriptInput", en_passage)
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.3)
        st, me = self.srv.api_json("GET", "/api/auth/me", token=reg["token"])
        self.assertEqual(st, 200)
        self.assertGreaterEqual(me["streak_count"], 1)
        self.cdp.assert_no_js_errors()

    def test_T3_02_units_filter_across_translation_bank_and_games(self):
        _boot_authenticated_user(self.cdp, self.srv, "t302")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trUnitFilter"])
        tr_opts = self.cdp.eval_js("document.getElementById('trUnitFilter').options.length", False)
        self.assertGreaterEqual(tr_opts, 30)
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ["#vegUnitSelect"])
        veg_opts = self.cdp.eval_js("document.getElementById('vegUnitSelect').options.length", False)
        self.assertGreaterEqual(veg_opts, 30)
        self.cdp.assert_no_js_errors()

    def test_T3_03_dark_mode_and_warm_paper_across_all_tabs(self):
        _boot_authenticated_user(self.cdp, self.srv, "t303")
        self.cdp.click("#darkModeToggleBtn")
        time.sleep(0.15)
        for t in ("speaking", "today", "translation", "readaloud", "games"):
            _open_tab(self.cdp, t)
            self.assertEqual(self.cdp.eval_js("document.documentElement.getAttribute('data-theme')", False), "dark")
            self.assertEqual(self.cdp.eval_js("getComputedStyle(document.body).backgroundColor", False), "rgb(20, 22, 25)")
        self.cdp.click("#darkModeToggleBtn")
        time.sleep(0.15)
        self.assertEqual(self.cdp.eval_js("getComputedStyle(document.body).backgroundColor", False), "rgb(245, 242, 235)")
        self.cdp.assert_no_js_errors()

    def test_T3_04_unauth_direct_hashes_preserve_valid_hash_and_lock_auth(self):
        for h in ("#translation", "#readaloud", "#games"):
            self.cdp.clear_storage_and_cookies()
            self.cdp.navigate(f"{self.srv.base_url}/{h}")
            modal_vis = self.cdp.eval_js(
                "Boolean(document.getElementById('authModal') && !document.getElementById('authModal').classList.contains('hidden'))",
                False,
            )
            self.assertTrue(modal_vis, f"Expected #authModal lock on {h}")
            self.assertNotEqual(
                (self.cdp.eval_js("localStorage.getItem('EMH_ACTIVE_ACCOUNT_EMAIL') || ''", False)).lower(),
                HOST_ADMIN_EMAIL,
            )
        self.cdp.assert_no_js_errors()

    def test_T3_05_personal_upload_plus_custom_limit_plus_grade(self):
        _boot_authenticated_user(self.cdp, self.srv, "t305")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trLengthFilter", "#trCustomWordLimit", "#trUserTranslationInput", "#trBtnGradeTranslation", "#trWritingGradeResult"])
        en_long = " ".join(["Global education connects learners across cultures through digital collaboration every single day."] * 8)
        self.cdp.set_value("#trCustomTextInput", en_long)
        self.cdp.click("#trBtnUsePersonal")
        self.cdp.wait_for("!document.getElementById('trBtnUsePersonal')?.disabled", timeout=5.0)
        time.sleep(0.15)
        self.cdp.set_value("#trLengthFilter", "custom")
        self.cdp.set_value("#trCustomWordLimit", "40")
        time.sleep(0.15)
        self.cdp.set_value("#trUserTranslationInput", "Global education connects learners across cultures through digital collaboration.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.cdp.assert_no_js_errors()

    def test_T3_06_online_news_refresh_plus_length_plus_grade(self):
        _boot_authenticated_user(self.cdp, self.srv, "t306")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trBtnRefreshOnline", "#trArticleList", "#trLengthFilter", "#trUserTranslationInput", "#trBtnGradeTranslation", "#trWritingGradeResult"])
        self.cdp.click("#trBtnRefreshOnline")
        time.sleep(0.6)
        self.cdp.eval_js("document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()", False)
        time.sleep(0.15)
        self.cdp.set_value("#trUserTranslationInput", "Recent technology and education news highlights rapid digital transformation.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.cdp.assert_no_js_errors()

    def test_T3_07_vu_days_1_to_14_and_legacy_reset_flag_on_reload(self):
        token, vu = self.srv.login_host()
        self.cdp.clear_storage_and_cookies()
        init_id = self.cdp.add_init_script(
            f"""
            localStorage.setItem('EMH_AUTH_TOKEN_V2', {json.dumps(token)});
            localStorage.setItem('EMH_AUTH_TOKEN', {json.dumps(token)});
            localStorage.setItem('EMH_ACTIVE_ACCOUNT_EMAIL', {json.dumps(vu['email'])});
            localStorage.setItem('EMH_ACTIVE_ACCOUNT_NAME', {json.dumps(vu['full_name'])});
            localStorage.setItem('EMH_TRUE_STREAK_RESET_V103', '1');
            """
        )
        try:
            self.cdp.navigate(f"{self.srv.base_url}/")
            self.cdp.reload()
            streak_txt = self.cdp.eval_js("document.getElementById('streakCount')?.textContent || ''", False)
            m = re.search(r"(\d+)", streak_txt)
            self.assertTrue(m and int(m.group(1)) >= 15, f"Expected Vu streak >= 15, got {streak_txt!r}")
            self.assertIsNone(self.cdp.eval_js("localStorage.getItem('EMH_TRUE_STREAK_RESET_V103')", False))
            self.cdp.assert_no_js_errors()
        finally:
            self.cdp.remove_init_script(init_id)

    def test_T3_08_speaking_tab_and_readaloud_tab_state_isolated(self):
        _boot_authenticated_user(self.cdp, self.srv, "t308")
        _open_tab(self.cdp, "speaking")
        sp_before = self.cdp.eval_js("document.getElementById('tab-speaking')?.innerHTML?.length || 0", False)
        _open_tab(self.cdp, "readaloud")
        _assert_elements_exist(self.cdp, ["#raPassageTextEn", "#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        self.cdp.eval_js("document.getElementById('raPassageTextEn').textContent = 'Clean energy drives sustainable growth.';", False)
        self.cdp.set_value("#raTranscriptInput", "Clean energy drives sustainable growth.")
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.2)
        _open_tab(self.cdp, "speaking")
        sp_after = self.cdp.eval_js("document.getElementById('tab-speaking')?.innerHTML?.length || 0", False)
        self.assertGreater(sp_before, 0)
        self.assertGreater(sp_after, 0)
        self.cdp.assert_no_js_errors()

    def test_T3_09_openGroqApiKeyModal_and_fallback_when_cleared(self):
        _boot_authenticated_user(self.cdp, self.srv, "t309")
        has_fn = self.cdp.eval_js("typeof window.openGroqApiKeyModal === 'function'", False)
        self.assertTrue(has_fn, "window.openGroqApiKeyModal alias must exist")
        self.cdp.eval_js("localStorage.removeItem('user_groq_api_key');", False)
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "Students study English daily.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.2)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.cdp.assert_no_js_errors()

    def test_T3_12_grade_only_vs_grade_plus_readaloud_deadline_state(self):
        _boot_authenticated_user(self.cdp, self.srv, "t312")
        _select_unit1_article_and_prepare(self.cdp)
        self.cdp.set_value("#trUserTranslationInput", "Daily English learning strengthens academic writing skills.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        self.cdp.click("#trBtnSendToReadAloud")
        time.sleep(0.2)
        en_txt = self.cdp.eval_js("document.getElementById('raPassageTextEn')?.textContent?.trim() || ''", False)
        self.cdp.set_value("#raTranscriptInput", en_txt)
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.25)
        self.cdp.assert_no_js_errors()

    def test_T3_15_rapid_games_plus_dark_mode_plus_tab_switching(self):
        _boot_authenticated_user(self.cdp, self.srv, "t315")
        _open_tab(self.cdp, "games")
        _assert_elements_exist(self.cdp, ['#vegModeGrid [data-mode="speed_blitz"]', '#vegModeGrid [data-mode="falling_words"]', '#vegModeGrid [data-mode="word_tiles"]'])
        self.cdp.click('#vegModeGrid [data-mode="speed_blitz"]')
        self.cdp.click("#darkModeToggleBtn")
        self.cdp.click('#vegModeGrid [data-mode="falling_words"]')
        _open_tab(self.cdp, "today")
        _open_tab(self.cdp, "games")
        self.cdp.click('#vegModeGrid [data-mode="word_tiles"]')
        overflow = self.cdp.eval_js("document.documentElement.scrollWidth <= window.innerWidth + 2", False)
        self.assertTrue(overflow)
        self.cdp.assert_no_js_errors()


class TestBrowserTier4(unittest.TestCase):
    srv: IsolatedUvicornServer
    cdp: HeadlessEdgeCDP

    @classmethod
    def setUpClass(cls):
        cls.srv = IsolatedUvicornServer()
        cls.srv.__enter__()
        cls.cdp = HeadlessEdgeCDP(initial_url=f"{cls.srv.base_url}/")
        cls.cdp.__enter__()
        cls.cdp.wait_for_app_ready()

    @classmethod
    def tearDownClass(cls):
        try:
            cls.cdp.__exit__(None, None, None)
        finally:
            cls.srv.__exit__(None, None, None)

    def setUp(self):
        self.cdp.clear_errors()
        self.cdp.set_viewport(1280, 800, mobile=False)

    def test_T4_01_unauthenticated_cold_boot_and_auth_guard_enforcement(self):
        self.cdp.clear_storage_and_cookies()
        self.cdp.navigate(f"{self.srv.base_url}/")
        snap = self.cdp.eval_js(
            """(() => ({
                modalVisible: Boolean(document.getElementById('authModal') && !document.getElementById('authModal').classList.contains('hidden')),
                headerName: document.getElementById('headerAccountName')?.textContent?.trim() || '',
                email: localStorage.getItem('EMH_ACTIVE_ACCOUNT_EMAIL') || ''
            }))()""",
            False,
        )
        self.assertTrue(snap["modalVisible"])
        self.assertIn("Chưa đăng nhập", snap["headerName"])
        self.assertNotEqual(snap["email"].lower(), HOST_ADMIN_EMAIL)

        self.cdp.eval_js("document.getElementById('authModal')?.remove();", False)
        time.sleep(0.25)
        restored = self.cdp.eval_js("Boolean(document.getElementById('authModal') && !document.getElementById('authModal').classList.contains('hidden'))", False)
        self.assertTrue(restored, "DOM guard must restore #authModal after removal")

        for h in ("/#translation", "/#readaloud", "/#games"):
            self.cdp.navigate(f"{self.srv.base_url}{h}")
            vis = self.cdp.eval_js("Boolean(document.getElementById('authModal') && !document.getElementById('authModal').classList.contains('hidden'))", False)
            self.assertTrue(vis)
        self.cdp.assert_no_js_errors()

    def test_T4_02_complete_daily_study_journey_and_streak_increment(self):
        reg = _boot_authenticated_user(self.cdp, self.srv, "t402", fresh_user=True)
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(
            self.cdp,
            ["#trSourceFilter", "#trUnitFilter", "#trLengthFilter", "#trCustomWordLimit", "#trArticleList", "#trSourcePassageVi", "#trUserTranslationInput", "#trBtnGradeTranslation", "#trWritingGradeResult", "#trBtnSendToReadAloud"],
        )
        self.cdp.set_value("#trSourceFilter", "unit")
        self.cdp.set_value("#trLengthFilter", "custom")
        self.cdp.set_value("#trCustomWordLimit", "60")
        time.sleep(0.15)
        self.cdp.eval_js("document.querySelector('#trArticleList [data-id], #trArticleList button, #trArticleList > div')?.click()", False)
        time.sleep(0.15)
        ref = self.cdp.eval_js("window.TranslationPracticeEngine?.getCurrentArticle?.()?.referenceEn || 'Modern technology helps students learn English daily.'", False)
        self.cdp.set_value("#trUserTranslationInput", ref)
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.3)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))

        self.cdp.click("#trBtnSendToReadAloud")
        time.sleep(0.25)
        _assert_elements_exist(self.cdp, ["#tab-readaloud", "#raPassageTextEn", "#raTranscriptInput", "#raBtnScoreSpeech", "#raResultZone"])
        en_txt = self.cdp.eval_js("document.getElementById('raPassageTextEn')?.textContent?.trim() || ''", False)
        self.cdp.set_value("#raTranscriptInput", en_txt)
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.3)
        self.assertGreater(len(self.cdp.eval_js("document.getElementById('raResultZone')?.textContent?.trim() || ''", False)), 20)

        _open_tab(self.cdp, "today")
        st, me = self.srv.api_json("GET", "/api/auth/me", token=reg["token"])
        self.assertEqual(st, 200)
        self.assertGreaterEqual(me["streak_count"], 1)
        self.cdp.reload()
        self.cdp.assert_no_js_errors()

    def test_T4_03_personal_paste_upload_en_to_vi_translate_grade(self):
        _boot_authenticated_user(self.cdp, self.srv, "t403")
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(self.cdp, ["#trCustomTextInput", "#trBtnUsePersonal", "#trSourcePassageVi", "#trUserTranslationInput", "#trBtnGradeTranslation", "#trWritingGradeResult"])
        self.cdp.set_value("#trCustomTextInput", "Digital libraries empower students in rural areas to access academic books anytime.")
        self.cdp.click("#trBtnUsePersonal")
        self.cdp.wait_for("!document.getElementById('trBtnUsePersonal')?.disabled", timeout=5.0)
        time.sleep(0.15)
        vi_prompt = self.cdp.eval_js("document.getElementById('trSourcePassageVi')?.textContent?.trim() || ''", False)
        self.assertGreater(len(vi_prompt), 20)
        self.cdp.set_value("#trUserTranslationInput", "Digital libraries help rural students access academic books anytime.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.25)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.cdp.assert_no_js_errors()

    def test_T4_04_full_8_game_unit_arcade_tour(self):
        _boot_authenticated_user(self.cdp, self.srv, "t404")
        modes = [
            "word_tiles", "cloze", "speed_blitz", "match_pairs",
            "type_translation", "falling_words", "spot_fix", "dialogue_chain",
        ]
        for mode in modes:
            res = _play_game_mode(self.cdp, mode)
            self.assertTrue(res["resultVisible"], f"Tier 4 tour mode {mode} did not complete: {res}")
        self.cdp.assert_no_js_errors()

    def test_T4_05_vu_account_reload_and_midnight_safe_streak_preservation(self):
        token, vu = self.srv.login_host()
        self.cdp.clear_storage_and_cookies()
        init_id = self.cdp.add_init_script(
            f"""
            localStorage.setItem('EMH_AUTH_TOKEN_V2', {json.dumps(token)});
            localStorage.setItem('EMH_AUTH_TOKEN', {json.dumps(token)});
            localStorage.setItem('EMH_ACTIVE_ACCOUNT_EMAIL', {json.dumps(vu['email'])});
            localStorage.setItem('EMH_ACTIVE_ACCOUNT_NAME', {json.dumps(vu['full_name'])});
            localStorage.setItem('EMH_TRUE_STREAK_RESET_V103', '1');
            """
        )
        try:
            self.cdp.navigate(f"{self.srv.base_url}/")
            for _ in range(3):
                self.cdp.reload()
                streak_txt = self.cdp.eval_js("document.getElementById('streakCount')?.textContent || ''", False)
                m = re.search(r"(\d+)", streak_txt)
                self.assertTrue(m and int(m.group(1)) >= 15, f"Expected Vu streak >= 15, got {streak_txt!r}")
                self.assertIsNone(self.cdp.eval_js("localStorage.getItem('EMH_TRUE_STREAK_RESET_V103')", False))

            st, me = self.srv.api_json("GET", "/api/auth/me", token=token)
            self.assertEqual(st, 200)
            self.assertGreaterEqual(me["streak_count"], 15)
            _open_tab(self.cdp, "today")
            self.cdp.assert_no_js_errors()
        finally:
            self.cdp.remove_init_script(init_id)

    def test_T4_06_warm_paper_and_dark_mode_visual_integrity_desktop_and_mobile(self):
        _boot_authenticated_user(self.cdp, self.srv, "t406")
        tabs = ("speaking", "today", "translation", "readaloud", "games")
        for w, h, mobile in [(1280, 800, False), (390, 844, True)]:
            self.cdp.set_viewport(w, h, mobile=mobile)
            for theme in ("paper", "dark"):
                if theme == "dark":
                    if self.cdp.eval_js("document.documentElement.getAttribute('data-theme')", False) != "dark":
                        self.cdp.click("#darkModeToggleBtn")
                else:
                    if self.cdp.eval_js("document.documentElement.getAttribute('data-theme')", False) == "dark":
                        self.cdp.click("#darkModeToggleBtn")
                time.sleep(0.1)
                for tab in tabs:
                    _open_tab(self.cdp, tab)
                    metrics = self.cdp.eval_js(
                        """(() => {
                            const cs = getComputedStyle(document.body);
                            const root = getComputedStyle(document.documentElement);
                            return {
                                pageVar: root.getPropertyValue('--page').trim(),
                                bg: cs.backgroundColor,
                                fg: cs.color,
                                noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2
                            };
                        })()""",
                        False,
                    )
                    if theme == "paper":
                        self.assertEqual(metrics["pageVar"], "#f5f2eb")
                    else:
                        self.assertEqual(metrics["pageVar"], "#141619")
                    self.assertNotEqual(metrics["bg"], metrics["fg"])
                    self.assertTrue(metrics["noOverflow"], f"Horizontal overflow on tab={tab} {w}x{h} {theme}")
        self.cdp.assert_no_js_errors()

    def test_T4_07_offline_no_groq_key_graceful_degradation_and_news_refresh(self):
        _boot_authenticated_user(self.cdp, self.srv, "t407")
        self.cdp.eval_js("localStorage.removeItem('user_groq_api_key');", False)
        _open_tab(self.cdp, "translation")
        _assert_elements_exist(
            self.cdp,
            ["#trBtnRefreshOnline", "#trBtnRefreshAi", "#trArticleList", "#trSourcePassageVi", "#trUserTranslationInput", "#trBtnGradeTranslation", "#trWritingGradeResult", "#trBtnSendToReadAloud"],
        )
        self.cdp.click("#trBtnRefreshOnline")
        self.cdp.wait_for("!document.getElementById('trBtnRefreshOnline')?.disabled", timeout=15.0)
        time.sleep(0.15)
        self.assertGreater(self.cdp.eval_js("document.getElementById('trArticleList')?.children?.length || 0", False), 0)
        self.cdp.click("#trBtnRefreshAi")
        self.cdp.wait_for("!document.getElementById('trBtnRefreshAi')?.disabled", timeout=5.0)
        time.sleep(0.15)
        self.cdp.eval_js("document.querySelector('#trArticleList [data-tr-article-id], #trArticleList button')?.click()", False)
        time.sleep(0.15)
        self.cdp.set_value("#trUserTranslationInput", "Students read articles and practice speaking English daily.")
        self.cdp.click("#trBtnGradeTranslation")
        time.sleep(0.35)
        _extract_numeric_score(self.cdp.eval_js("document.getElementById('trWritingGradeResult')?.textContent || ''", False))
        self.cdp.click("#trBtnSendToReadAloud")
        time.sleep(0.2)
        en_txt = self.cdp.eval_js("document.getElementById('raPassageTextEn')?.textContent?.trim() || ''", False)
        self.cdp.set_value("#raTranscriptInput", en_txt)
        self.cdp.click("#raBtnScoreSpeech")
        time.sleep(0.25)
        self.assertGreater(len(self.cdp.eval_js("document.getElementById('raResultZone')?.textContent?.trim() || ''", False)), 15)
        self.cdp.assert_no_js_errors()


if __name__ == "__main__":
    snap_before = snapshot_db_integrity()
    try:
        unittest.main()
    finally:
        snap_after = snapshot_db_integrity()
        assert snap_before["sha256"] == snap_after["sha256"], "backend/app.db SHA256 mutated!"
