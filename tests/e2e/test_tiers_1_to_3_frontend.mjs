import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const NEW_JS_FILES = [
  'translation_bank_units.js',
  'translation_bank_media.js',
  'translation_bank_ielts.js',
  'translation_bank_trends.js',
  'translation-practice-engine.js',
  'read-aloud-engine.js',
  'vi-en-games-engine.js',
];

const BANK_FILES = [
  'translation_bank_units.js',
  'translation_bank_media.js',
  'translation_bank_ielts.js',
  'translation_bank_trends.js',
];

const HTML_FILES = [
  'index.html',
  'flashcard.html',
  'flashcards.html',
  'speaking.html',
];

function repoPath(...parts) {
  return path.join(REPO_ROOT, ...parts);
}

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function createMockElement(id = '', tagName = 'DIV') {
  const classes = new Set();
  const attrs = new Map();
  const listeners = new Map();
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    style: {},
    value: '',
    checked: false,
    disabled: false,
    hidden: false,
    textContent: '',
    innerText: '',
    innerHTML: '',
    children: [],
    dataset: {},
    classList: {
      add(...names) { names.forEach((n) => classes.add(n)); },
      remove(...names) { names.forEach((n) => classes.delete(n)); },
      toggle(n, force) {
        if (force === undefined) {
          if (classes.has(n)) { classes.delete(n); return false; }
          classes.add(n); return true;
        }
        if (force) classes.add(n); else classes.delete(n);
        return !!force;
      },
      contains(n) { return classes.has(n); },
    },
    setAttribute(k, v) { attrs.set(k, String(v)); },
    getAttribute(k) { return attrs.has(k) ? attrs.get(k) : null; },
    removeAttribute(k) { attrs.delete(k); },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      if (!listeners.has(type)) return;
      listeners.set(type, listeners.get(type).filter((f) => f !== fn));
    },
    dispatchEvent(evt) {
      const list = listeners.get(evt?.type) || [];
      for (const fn of list) fn.call(el, evt);
      return true;
    },
    click() {
      if (typeof el.onclick === 'function') el.onclick({ target: el, preventDefault() {} });
      el.dispatchEvent({ type: 'click', target: el, preventDefault() {} });
    },
    appendChild(child) { el.children.push(child); return child; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    focus() {},
    scrollIntoView() {},
  };
  return el;
}

function createVmBrowserContext({ initialStorage = {}, elementsById = {}, urlHref = 'http://127.0.0.1:8000/' } = {}) {
  const store = new Map();
  for (const [k, v] of Object.entries(initialStorage)) {
    store.set(k, String(v));
  }
  const localStorage = {
    get length() { return store.size; },
    key(i) { return Array.from(store.keys())[i] ?? null; },
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(k, String(v)); },
    removeItem(k) { store.delete(k); },
    clear() { store.clear(); },
  };

  const elMap = new Map();
  for (const [id, el] of Object.entries(elementsById)) {
    elMap.set(id, el);
  }
  const docEl = createMockElement('html', 'HTML');
  const bodyEl = createMockElement('body', 'BODY');

  const u = new URL(urlHref);
  const locationObj = {
    origin: u.origin,
    protocol: u.protocol,
    host: u.host,
    hostname: u.hostname,
    port: u.port,
    pathname: u.pathname,
    search: u.search,
    hash: u.hash,
    href: u.href,
  };

  const docListeners = new Map();
  const winListeners = new Map();

  const documentObj = {
    title: 'English Mastery Hub',
    readyState: 'complete',
    documentElement: docEl,
    body: bodyEl,
    getElementById(id) {
      return elMap.get(id) || null;
    },
    querySelector(sel) {
      if (sel && sel.startsWith('#') && !sel.includes(' ')) {
        return elMap.get(sel.slice(1)) || null;
      }
      return null;
    },
    querySelectorAll() { return []; },
    createElement(tag) { return createMockElement('', tag); },
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
  };

  const activeIntervals = [];
  const activeTimeouts = [];
  const safeSetInterval = (fn, ms, ...args) => {
    const id = setInterval(fn, ms, ...args);
    if (id && typeof id.unref === 'function') id.unref();
    activeIntervals.push(id);
    return id;
  };
  const safeSetTimeout = (fn, ms, ...args) => {
    const id = setTimeout(fn, ms, ...args);
    if (id && typeof id.unref === 'function') id.unref();
    activeTimeouts.push(id);
    return id;
  };

  class MockMutationObserver {
    constructor(cb) { this.cb = cb; }
    observe() {}
    disconnect() {}
  }

  const sandbox = {
    console,
    setTimeout: safeSetTimeout,
    clearTimeout,
    setInterval: safeSetInterval,
    clearInterval,
    URL,
    URLSearchParams,
    Date,
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Set,
    Map,
    RegExp,
    Error,
    TypeError,
    Promise,
    parseInt,
    parseFloat,
    isNaN,
    encodeURIComponent,
    decodeURIComponent,
    btoa: (s) => Buffer.from(String(s), 'utf8').toString('base64'),
    atob: (s) => Buffer.from(String(s), 'base64').toString('utf8'),
    localStorage,
    sessionStorage: localStorage,
    location: locationObj,
    history: {
      replaceState(_s, _t, newUrl) {
        const parsed = new URL(newUrl, locationObj.origin);
        locationObj.pathname = parsed.pathname;
        locationObj.search = parsed.search;
        locationObj.hash = parsed.hash;
        locationObj.href = parsed.href;
      },
    },
    navigator: { userAgent: 'node-vm-e2e', language: 'vi-VN', onLine: true },
    document: documentObj,
    MutationObserver: MockMutationObserver,
    lucide: { createIcons() {} },
    fetch: async () => ({ ok: true, status: 200, json: async () => ({}) }),
    alert() {},
    confirm() { return true; },
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, []);
      winListeners.get(type).push(fn);
    },
  };

  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;

  const ctx = vm.createContext(sandbox);
  return {
    ctx,
    sandbox,
    localStorage,
    elMap,
    docListeners,
    winListeners,
    runFile(relPath) {
      const full = repoPath(relPath);
      const code = fs.readFileSync(full, 'utf8');
      vm.runInContext(code, ctx, { filename: relPath });
    },
    async triggerDomContentLoaded() {
      const fns = [...(winListeners.get('DOMContentLoaded') || []), ...(docListeners.get('DOMContentLoaded') || [])];
      for (const fn of fns) {
        await fn();
      }
    },
    cleanup() {
      for (const id of activeIntervals) clearInterval(id);
      for (const id of activeTimeouts) clearTimeout(id);
    },
  };
}

function loadAppVm({ initialStorage = {}, withStreakDom = false } = {}) {
  const elementsById = {};
  if (withStreakDom) {
    for (const id of ['streakCount', 'statStreakDisplay', 'streakSubtext', 'todayStreakBadge', 'realDeadlineCountdown', 'todayRealStreakPill', 'todayDeadlineStatus', 'missionProgressRatio']) {
      elementsById[id] = createMockElement(id);
    }
  }
  const env = createVmBrowserContext({ initialStorage, elementsById });
  env.runFile('streak-deadline-engine.js');
  env.runFile('auth-gate-engine.js');
  env.runFile('security-guard-engine.js');
  env.runFile('app.js');
  return env;
}

function countViWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function loadTranslationBankInVm({ reverseOrder = false } = {}) {
  for (const f of BANK_FILES) {
    assert.ok(fs.existsSync(repoPath(f)), `Missing required M2 data file: ${f}`);
  }
  const env = createVmBrowserContext();
  try {
    env.runFile('data.js');
    const order = reverseOrder ? [...BANK_FILES].reverse() : BANK_FILES;
    for (const f of order) {
      env.runFile(f);
    }
    return {
      bank: env.sandbox.window.TRANSLATION_BANK,
      appData: env.sandbox.window.APP_DATA,
    };
  } finally {
    env.cleanup();
  }
}

function extractSwAssets(swCode) {
  const ctx = vm.createContext({
    self: { addEventListener() {}, skipWaiting() {}, clients: { claim() {} } },
    caches: {},
    location: { origin: 'http://127.0.0.1:8000' },
    fetch: async () => ({}),
    URL,
  });
  vm.runInContext(
    swCode + '\n;globalThis.__E2E_SW = { CACHE_NAME: typeof CACHE_NAME !== "undefined" ? CACHE_NAME : null, ASSETS_TO_CACHE: typeof ASSETS_TO_CACHE !== "undefined" ? ASSETS_TO_CACHE : null };',
    ctx,
    { filename: 'sw.js' }
  );
  return ctx.__E2E_SW;
}

// ============================================================================
// TIER 1 — FEATURE COVERAGE (Node VM & Static Contract Tests)
// ============================================================================

test('T1-F01-01: markDailyStreakTaskCompleted("translation") marks translationDone without altering other tasks', () => {
  const env = loadAppVm();
  try {
    vm.runInContext(
      `missionRegistry = { currentDay: 1, history: { "1": { vocabDone: true, vocabCount: 20, videoDone: false, readingDone: false, grammarDone: false, studiedIndices: [] } } };`,
      env.ctx
    );
    env.sandbox.window.markDailyStreakTaskCompleted('translation');
    const day1 = vm.runInContext(`missionRegistry.history["1"]`, env.ctx);
    assert.equal(day1.translationDone, true, 'history["1"].translationDone must be true');
    assert.equal(day1.vocabDone, true, 'vocabDone must remain true');
    assert.equal(day1.videoDone, false, 'videoDone must remain false');
  } finally {
    env.cleanup();
  }
});

test('T1-F01-02: markDailyStreakTaskCompleted("readaloud") after translationDone sets combined completion', () => {
  const env = loadAppVm();
  try {
    vm.runInContext(
      `missionRegistry = { currentDay: 1, history: { "1": { vocabDone: false, vocabCount: 0, videoDone: false, translationDone: true, readaloudDone: false, translationReadaloudDone: false, studiedIndices: [] } } };`,
      env.ctx
    );
    env.sandbox.window.markDailyStreakTaskCompleted('readaloud');
    const day1 = vm.runInContext(`missionRegistry.history["1"]`, env.ctx);
    const status = vm.runInContext(`getDayMissionStatus(1)`, env.ctx);
    assert.equal(day1.readaloudDone, true, 'readaloudDone must be true');
    assert.equal(day1.translationReadaloudDone, true, 'translationReadaloudDone must be true when both done');
    assert.equal(status.isTranslationReadaloud, true, 'getDayMissionStatus(1).isTranslationReadaloud must be true');
  } finally {
    env.cleanup();
  }
});

test('T1-F01-03: markDailyStreakTaskCompleted("translation_readaloud") sets all 3 translation/readaloud flags', () => {
  const env = loadAppVm();
  try {
    vm.runInContext(
      `missionRegistry = { currentDay: 2, history: { "2": { vocabDone: false, vocabCount: 0, videoDone: false, studiedIndices: [] } } };`,
      env.ctx
    );
    env.sandbox.window.markDailyStreakTaskCompleted('translation_readaloud');
    const day2 = vm.runInContext(`missionRegistry.history["2"]`, env.ctx);
    assert.equal(day2.translationDone, true, 'translationDone must be true');
    assert.equal(day2.readaloudDone, true, 'readaloudDone must be true');
    assert.equal(day2.translationReadaloudDone, true, 'translationReadaloudDone must be true');
  } finally {
    env.cleanup();
  }
});

test('T1-F01-04: StreakDeadlineEngine.recordCoreTaskCompletion increments streak for "translation"', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 20, 0, 0);
    const res = Engine.recordCoreTaskCompletion(
      { streak: 4, longestStreak: 4, lastCompletedDate: '2026-11-25' },
      'translation',
      now
    );
    assert.equal(res.streakIncremented, true);
    assert.equal(res.newStreak, 5);
    assert.equal(res.state.lastCompletedDate, '2026-11-26');
    assert.ok(res.state.todayCompletedTasks.includes('translation'));
  } finally {
    env.cleanup();
  }
});

test('T1-F02-01: Legacy EMH_TRUE_STREAK_RESET_V103 flag is neutralized via EMH_STREAK_V105_MIGRATED without zeroing EMH_STREAK', async () => {
  const env = loadAppVm({
    withStreakDom: true,
    initialStorage: {
      EMH_STREAK: '15',
      EMH_TRUE_STREAK_RESET_V103: '1',
      EMH_ACTIVE_ACCOUNT_EMAIL: 'tonguyenvu@265.com',
      EMH_AUTH_TOKEN: 'emhs1.valid_test_token_placeholder',
      EMH_AUTH_TOKEN_V2: 'emhs1.valid_test_token_placeholder',
    },
  });
  try {
    env.runFile('data.js');
    vm.runInContext(
      `if (typeof initDailyMissionEngine === 'function') initDailyMissionEngine();
       if (typeof initDailyDeadlineSystem === 'function') initDailyDeadlineSystem();`,
      env.ctx
    );
    assert.ok(
      env.localStorage.getItem('EMH_STREAK_V105_MIGRATED'),
      'EMH_STREAK_V105_MIGRATED migration flag must be set'
    );
    assert.equal(
      env.localStorage.getItem('EMH_TRUE_STREAK_RESET_V103'),
      null,
      'Stale EMH_TRUE_STREAK_RESET_V103 flag must be removed'
    );
    assert.equal(env.localStorage.getItem('EMH_STREAK'), '15', 'EMH_STREAK must stay 15');
  } finally {
    env.cleanup();
  }
});

test('T1-F02-02: StreakDeadlineEngine.toLocalDateStr returns local calendar date (not UTC lagged date)', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const earlyMorning = new Date(2026, 10, 26, 1, 30, 0); // 01:30 local
    assert.equal(Engine.toLocalDateStr(earlyMorning), '2026-11-26');
  } finally {
    env.cleanup();
  }
});

test('T1-F02-03: StreakDeadlineEngine.evaluateDeadline preserves active streak before 23:59 when completed yesterday', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 21, 0, 0);
    const ev = Engine.evaluateDeadline({ streak: 15, lastCompletedDate: '2026-11-25' }, now);
    assert.equal(ev.status, 'PENDING_TODAY');
    assert.equal(ev.state.streak, 15);
    assert.equal(ev.completedToday, false);
    assert.ok(ev.countdown.msLeft > 0);
  } finally {
    env.cleanup();
  }
});

test('T1-F02-04: Completing "readaloud" increments streak 14 -> 15 and updates EMH_STREAK & #streakCount', () => {
  const env = loadAppVm({
    withStreakDom: true,
    initialStorage: {
      EMH_ACTIVE_ACCOUNT_EMAIL: 'tester@e2e.local',
      EMH_AUTH_TOKEN: 'emhs1.valid_test_token_placeholder',
      EMH_STREAK: '14',
      EMH_LAST_COMPLETED_DATE: '2026-11-25',
    },
  });
  try {
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 10, 0, 0);
    const res = Engine.recordCoreTaskCompletion(
      { streak: 14, longestStreak: 14, lastCompletedDate: '2026-11-25' },
      'readaloud',
      now
    );
    assert.equal(res.newStreak, 15);
    assert.ok(res.state.longestStreak >= 15);

    vm.runInContext(
      `if (typeof saveStreakDeadlineState === 'function') saveStreakDeadlineState(${JSON.stringify(res.state)});
       if (typeof renderAllStreakUI === 'function') renderAllStreakUI(15, true);`,
      env.ctx
    );
    assert.equal(env.localStorage.getItem('EMH_STREAK'), '15');
    assert.equal(env.elMap.get('streakCount').innerText, '15 ngày');
  } finally {
    env.cleanup();
  }
});

test('T1-F04-01: window.TRANSLATION_BANK exists and contains >= 1,080 articles', () => {
  const { bank } = loadTranslationBankInVm();
  assert.ok(Array.isArray(bank), 'window.TRANSLATION_BANK must be an Array');
  assert.ok(bank.length >= 1080, `Expected >= 1080 articles, got ${bank.length}`);
});

test('T1-F04-02: window.TRANSLATION_BANK satisfies per-source minimums and sourceLabel diversity', () => {
  const { bank } = loadTranslationBankInVm();
  const counts = { unit: 0, video: 0, ielts_reading: 0, hot_trends: 0 };
  const videoLabels = new Set();
  const trendLabels = new Set();
  for (const item of bank) {
    if (item.sourceGroup in counts) counts[item.sourceGroup]++;
    if (item.sourceGroup === 'video') videoLabels.add(item.sourceLabel);
    if (item.sourceGroup === 'hot_trends') trendLabels.add(item.sourceLabel);
  }
  assert.ok(counts.unit >= 340, `Expected unit >= 340, got ${counts.unit}`);
  assert.ok(counts.video >= 200, `Expected video >= 200, got ${counts.video}`);
  assert.ok(counts.ielts_reading >= 140, `Expected ielts_reading >= 140, got ${counts.ielts_reading}`);
  assert.ok(counts.hot_trends >= 340, `Expected hot_trends >= 340, got ${counts.hot_trends}`);
  assert.ok(videoLabels.size >= 3, `Expected >= 3 video sourceLabels, got ${Array.from(videoLabels).join(', ')}`);
  assert.ok(trendLabels.size >= 2, `Expected >= 2 hot_trends sourceLabels, got ${Array.from(trendLabels).join(', ')}`);
});

test('T1-F04-03: Every article in window.TRANSLATION_BANK satisfies schema §1', () => {
  const { bank } = loadTranslationBankInVm();
  const validGroups = new Set(['unit', 'video', 'ielts_reading', 'hot_trends']);
  const validLevels = new Set(['B1', 'B2', 'C1']);
  const validTiers = new Set(['short', 'medium', 'long']);
  for (let i = 0; i < bank.length; i++) {
    const a = bank[i];
    assert.equal(typeof a.id, 'string', `Item ${i} id must be string`);
    assert.ok(a.id.trim().length > 0, `Item ${i} id non-empty`);
    assert.equal(typeof a.title, 'string', `Item ${a.id} title must be string`);
    assert.ok(a.title.trim().length > 0, `Item ${a.id} title non-empty`);
    assert.ok(validGroups.has(a.sourceGroup), `Item ${a.id} invalid sourceGroup: ${a.sourceGroup}`);
    assert.ok(typeof a.sourceLabel === 'string' && a.sourceLabel.trim().length > 0, `Item ${a.id} sourceLabel non-empty`);
    assert.ok(typeof a.topic === 'string' && a.topic.trim().length > 0, `Item ${a.id} topic non-empty`);
    assert.ok(validLevels.has(a.level), `Item ${a.id} invalid level: ${a.level}`);
    assert.ok(validTiers.has(a.lengthTier), `Item ${a.id} invalid lengthTier: ${a.lengthTier}`);
    const wc = countViWords(a.textVi);
    assert.ok(wc >= 35, `Item ${a.id} textVi word count ${wc} < 35`);
    assert.ok(typeof a.referenceEn === 'string' && a.referenceEn.trim().length >= 20, `Item ${a.id} referenceEn invalid`);
    assert.ok(Array.isArray(a.keywords) && a.keywords.length >= 1, `Item ${a.id} keywords must have >= 1 entry`);
  }
});

test('T1-F04-04: Unit articles cover all valid APP_DATA.units (1..35 and 37) with zero dangling unitIds', () => {
  const { bank, appData } = loadTranslationBankInVm();
  const validUnits = new Map();
  for (const u of appData.units) {
    if (u.unitId === 'custom_items') continue;
    const uId = u.unitId || (u.unitNumber ? `unit${u.unitNumber}` : '');
    if (uId) validUnits.set(uId, u.unitNumber || null);
  }
  const coveredUnitIds = new Set();
  for (const a of bank) {
    if (a.sourceGroup === 'unit') {
      assert.ok(validUnits.has(a.unitId), `Dangling unitId "${a.unitId}" on article ${a.id}`);
      coveredUnitIds.add(a.unitId);
    }
  }
  for (const uId of validUnits.keys()) {
    assert.ok(coveredUnitIds.has(uId), `Unit ${uId} has zero articles in TRANSLATION_BANK`);
  }
});

test('T1-F04-05: wordCountVi matches whitespace count and all 3 lengthTiers are represented', () => {
  const { bank } = loadTranslationBankInVm();
  const tierSeen = new Set();
  for (const a of bank) {
    const actual = countViWords(a.textVi);
    assert.ok(
      Math.abs((a.wordCountVi || 0) - actual) <= 2,
      `Article ${a.id} wordCountVi=${a.wordCountVi} differs from actual=${actual}`
    );
    tierSeen.add(a.lengthTier);
  }
  assert.deepEqual(Array.from(tierSeen).sort(), ['long', 'medium', 'short']);
});

test('T1-F08-02: Local writing grader ranks accurate translation above broken translation with actionable feedback', () => {
  const engineFile = 'translation-practice-engine.js';
  assert.ok(fs.existsSync(repoPath(engineFile)), `Missing required M3 file: ${engineFile}`);

  const ids = [
    'tab-translation', 'trSourceFilter', 'trUnitFilter', 'trLengthFilter', 'trCustomWordLimit', 'trSearchInput',
    'trArticleList', 'trCustomTextInput', 'trCustomFileUpload', 'trBtnUsePersonal',
    'trBtnRefreshAi', 'trBtnRefreshOnline', 'trSourcePassageVi', 'trUserTranslationInput',
    'trBtnGradeTranslation', 'trWritingGradeResult', 'trBtnSendToReadAloud',
  ];
  const elementsById = {};
  for (const id of ids) elementsById[id] = createMockElement(id);
  const env = createVmBrowserContext({ elementsById });
  try {
    env.runFile('data.js');
    for (const f of BANK_FILES) {
      if (fs.existsSync(repoPath(f))) env.runFile(f);
    }
    env.runFile(engineFile);
    const engine = env.sandbox.window.TranslationPracticeEngine;
    assert.ok(engine, 'window.TranslationPracticeEngine must be defined');

    const sampleArticle = {
      id: 'tb_test_01',
      title: 'Công nghệ trong giáo dục',
      sourceGroup: 'unit',
      sourceLabel: 'Unit 1',
      lengthTier: 'short',
      wordCountVi: 42,
      textVi: 'Công nghệ hiện đại đã thay đổi cách học sinh tiếp thu kiến thức mỗi ngày trong lớp học.',
      referenceEn: 'Modern technology has changed how students acquire knowledge every day in the classroom.',
      keywords: ['technology', 'students', 'knowledge', 'classroom'],
    };
    env.sandbox.window.TRANSLATION_BANK = [sampleArticle, ...(env.sandbox.window.TRANSLATION_BANK || [])];
    if (typeof engine.init === 'function') engine.init();
    if (typeof engine.selectArticle === 'function') engine.selectArticle(sampleArticle.id);
    else if (typeof engine.loadArticle === 'function') engine.loadArticle(sampleArticle);
    else elementsById.trSourcePassageVi.textContent = sampleArticle.textVi;

    const runGrade = async (draft) => {
      elementsById.trUserTranslationInput.value = draft;
      if (typeof engine.gradeTranslation === 'function') {
        await engine.gradeTranslation(sampleArticle, draft);
      } else {
        elementsById.trBtnGradeTranslation.click();
        await new Promise((r) => setTimeout(r, 20));
      }
      const txt = `${elementsById.trWritingGradeResult.textContent} ${elementsById.trWritingGradeResult.innerText} ${elementsById.trWritingGradeResult.innerHTML}`;
      const match = txt.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*(?:10|100)|%|điểm)/i);
      assert.ok(match, `Expected numeric score in #trWritingGradeResult, got: ${txt.slice(0, 200)}`);
      let num = parseFloat(match[1]);
      if (txt.includes('/100') || txt.includes('%')) num = num / 10;
      return { score: num, text: txt };
    };

    return (async () => {
      const resA = await runGrade('Modern technology has transformed how students gain knowledge in the classroom every day.');
      const resB = await runGrade('technology change student learn');
      assert.ok(resA.score > resB.score, `Expected accurate score (${resA.score}) > broken score (${resB.score})`);
      assert.ok(resB.text.trim().length > 20, 'Broken translation result must include improvement feedback');
    })();
  } finally {
    env.cleanup();
  }
});

test('T1-F12-01: 4 HTML files (index, flashcard, flashcards, speaking) have 100% identical SHA256', () => {
  const hashes = HTML_FILES.map((f) => {
    const p = repoPath(f);
    assert.ok(fs.existsSync(p), `Missing HTML file: ${f}`);
    return { f, hash: sha256File(p) };
  });
  const base = hashes[0].hash;
  for (const entry of hashes) {
    assert.equal(entry.hash, base, `SHA256 mismatch for ${entry.f} vs ${hashes[0].f}`);
  }
});

test('T1-F12-02: sw.js uses CACHE_NAME "english-mastery-v105.0" and caches conversation_data.js + all 7 new JS files', () => {
  const swCode = fs.readFileSync(repoPath('sw.js'), 'utf8');
  const { CACHE_NAME, ASSETS_TO_CACHE } = extractSwAssets(swCode);
  assert.equal(CACHE_NAME, 'english-mastery-v105.0');
  assert.ok(Array.isArray(ASSETS_TO_CACHE), 'ASSETS_TO_CACHE must be an array');
  const set = new Set(ASSETS_TO_CACHE);
  assert.ok(set.has('./conversation_data.js'), 'ASSETS_TO_CACHE missing ./conversation_data.js');
  for (const jsFile of NEW_JS_FILES) {
    assert.ok(set.has(`./${jsFile}`), `ASSETS_TO_CACHE missing ./${jsFile}`);
  }
});

test('T1-F12-03: index.html uses ?v=105.0 for style.css, all scripts (incl. 7 new JS), sw.js, and zero ?v=104.0', () => {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  assert.ok(!html.includes('?v=104.0'), 'index.html still contains stale ?v=104.0 references');
  assert.ok(html.includes('./style.css?v=105.0'), 'index.html missing ./style.css?v=105.0');
  assert.ok(html.includes('/sw.js?v=105.0'), 'index.html missing /sw.js?v=105.0');
  for (const jsFile of NEW_JS_FILES) {
    assert.ok(html.includes(`./${jsFile}?v=105.0`), `index.html missing <script src="./${jsFile}?v=105.0">`);
  }
});

test('T1-F12-05: index.html has new tabs/nav buttons and SecurityGuardEngine permits #translation, #readaloud, #games', () => {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  for (const id of ['nav-btn-translation', 'nav-btn-readaloud', 'nav-btn-games', 'tab-translation', 'tab-readaloud', 'tab-games']) {
    assert.ok(html.includes(`id="${id}"`) || html.includes(`id='${id}'`), `index.html missing id="${id}"`);
  }
  const env = createVmBrowserContext();
  try {
    env.runFile('security-guard-engine.js');
    const Guard = env.sandbox.SecurityGuardEngine;
    for (const h of ['#translation', '#readaloud', '#games']) {
      const res = Guard.inspectAndSanitizeUrl({ pathname: '/', search: '', hash: h });
      assert.equal(res.safe, true, `Expected ${h} to be safe`);
      assert.equal(res.cleanUrl, `/${h}`);
    }
  } finally {
    env.cleanup();
  }
});

// ============================================================================
// TIER 2 — BOUNDARY, CORNER & NEGATIVE CASES
// ============================================================================

test('T2-F01-01: Days 1-14 with legacy fields only still return isAllDone === true in getDayMissionStatus', () => {
  const env = loadAppVm();
  try {
    const history = {};
    for (let d = 1; d <= 14; d++) {
      history[String(d)] = { vocabDone: true, vocabCount: 20, videoDone: true, readingDone: true, grammarDone: true };
    }
    vm.runInContext(`missionRegistry = { currentDay: 15, history: ${JSON.stringify(history)} };`, env.ctx);
    for (let d = 1; d <= 14; d++) {
      const st = vm.runInContext(`getDayMissionStatus(${d})`, env.ctx);
      assert.equal(st.isAllDone, true, `Day ${d} legacy mission status must remain isAllDone === true`);
    }
  } finally {
    env.cleanup();
  }
});

test('T2-F01-02: markDailyStreakTaskCompleted("translation") alone does not mark translationReadaloudDone true', () => {
  const env = loadAppVm();
  try {
    vm.runInContext(
      `missionRegistry = { currentDay: 3, history: { "3": { vocabDone: false, vocabCount: 0, videoDone: false, studiedIndices: [] } } };`,
      env.ctx
    );
    env.sandbox.window.markDailyStreakTaskCompleted('translation');
    const day3 = vm.runInContext(`missionRegistry.history["3"]`, env.ctx);
    assert.equal(day3.translationDone, true);
    assert.ok(!day3.readaloudDone, 'readaloudDone must remain falsy');
    assert.equal(Boolean(day3.translationReadaloudDone), false, 'translationReadaloudDone must be false');
  } finally {
    env.cleanup();
  }
});

test('T2-F01-03: recordCoreTaskCompletion increments streak at most once per calendar day', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 18, 0, 0);
    let st = { streak: 6, longestStreak: 6, lastCompletedDate: '2026-11-25' };
    const r1 = Engine.recordCoreTaskCompletion(st, 'translation', now);
    const r2 = Engine.recordCoreTaskCompletion(r1.state, 'readaloud', now);
    const r3 = Engine.recordCoreTaskCompletion(r2.state, 'translation_readaloud', now);
    assert.equal(r1.streakIncremented, true);
    assert.equal(r2.streakIncremented, false);
    assert.equal(r3.streakIncremented, false);
    assert.equal(r3.newStreak, 7);
  } finally {
    env.cleanup();
  }
});

test('T2-F01-04: markDailyStreakTaskCompleted ignores empty, null, and __proto__ without error or pollution', () => {
  const env = loadAppVm();
  try {
    vm.runInContext(
      `missionRegistry = { currentDay: 4, history: { "4": { vocabDone: true, vocabCount: 20, videoDone: false, readingDone: true, studiedIndices: [] } } };`,
      env.ctx
    );
    for (const bad of ['', null, '__proto__']) {
      env.sandbox.window.markDailyStreakTaskCompleted(bad);
    }
    const day4 = vm.runInContext(`missionRegistry.history["4"]`, env.ctx);
    assert.equal(day4.vocabDone, true);
    assert.equal(day4.videoDone, false);
    assert.equal(day4.readingDone, true);
    assert.equal(({}).polluted, undefined);
  } finally {
    env.cleanup();
  }
});

test('T2-F01-05: evaluateDeadline boundary at 23:58:59 vs 23:59:59 vs 00:05:00 next day', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const base = { streak: 10, longestStreak: 10, lastCompletedDate: '2026-11-25' };

    const eBefore = Engine.evaluateDeadline(base, new Date(2026, 10, 26, 23, 58, 59, 999));
    assert.equal(eBefore.status, 'PENDING_TODAY');
    assert.equal(eBefore.state.streak, 10);
    assert.equal(eBefore.countdown.msLeft, 60000);

    const eEdge = Engine.evaluateDeadline(base, new Date(2026, 10, 26, 23, 59, 59, 999));
    assert.equal(eEdge.status, 'PENDING_TODAY');
    assert.equal(eEdge.countdown.msLeft, 0);

    const eAfter = Engine.evaluateDeadline(base, new Date(2026, 10, 27, 0, 5, 0, 0));
    assert.equal(eAfter.status, 'MISSED_RECOVERABLE');
    assert.equal(eAfter.state.missedPreviousStreak, 10);
    assert.equal(eAfter.state.streak, 0);
  } finally {
    env.cleanup();
  }
});

test('T2-F02-01: EMH_STREAK = "0" does not suffer truthiness fallback to 1 for authenticated 0-streak user', () => {
  const env = loadAppVm({
    withStreakDom: true,
    initialStorage: {
      EMH_ACTIVE_ACCOUNT_EMAIL: 'zero@e2e.local',
      EMH_AUTH_TOKEN: 'emhs1.valid_test_token_placeholder',
      EMH_STREAK: '0',
    },
  });
  try {
    vm.runInContext(`appState.currentUser = { email: 'zero@e2e.local', streak_count: 0 }; updateAuthUI();`, env.ctx);
    assert.equal(env.elMap.get('streakCount').innerText, '0 ngày', 'String "0" in EMH_STREAK must not fall back to 1');
  } finally {
    env.cleanup();
  }
});

test('T2-F02-02: toLocalDateStr respects local calendar date across late-night and early-morning boundaries', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    assert.equal(Engine.toLocalDateStr(new Date(2026, 10, 26, 23, 58, 0)), '2026-11-26');
    assert.equal(Engine.toLocalDateStr(new Date(2026, 10, 27, 0, 5, 0)), '2026-11-27');
    assert.equal(Engine.toLocalDateStr(new Date(2026, 10, 27, 6, 55, 0)), '2026-11-27');
  } finally {
    env.cleanup();
  }
});

test('T2-F02-03: Multi-day gap triggers MISSED_RECOVERABLE and recoverMissedStreak restores streak=15', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 12, 0, 0);
    const ev = Engine.evaluateDeadline(
      { streak: 15, longestStreak: 15, lastCompletedDate: '2026-11-20', recoveriesUsedThisMonth: 0, recoveryMonth: '2026-11' },
      now
    );
    assert.equal(ev.status, 'MISSED_RECOVERABLE');
    assert.equal(ev.state.missedPreviousStreak, 15);
    const rec = Engine.recoverMissedStreak(ev.state, now);
    assert.equal(rec.success, true);
    assert.equal(rec.state.streak, 15);
    assert.equal(rec.recoveriesRemaining, 2);
    assert.equal(rec.state.lastCompletedDate, '2026-11-25');
  } finally {
    env.cleanup();
  }
});

test('T2-F02-04: Exhausted recovery credits (3/3) yields LOST_NO_RECOVERY and blocks recovery', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const now = new Date(2026, 10, 26, 12, 0, 0);
    const st = {
      streak: 0,
      missedPreviousStreak: 15,
      lastCompletedDate: '2026-11-20',
      recoveriesUsedThisMonth: 3,
      recoveryMonth: '2026-11',
    };
    const ev = Engine.evaluateDeadline(st, now);
    assert.equal(ev.status, 'LOST_NO_RECOVERY');
    assert.equal(ev.canRecover, false);
    const rec = Engine.recoverMissedStreak(st, now);
    assert.equal(rec.success, false);
    assert.equal(rec.recoveriesRemaining, 0);
  } finally {
    env.cleanup();
  }
});

test('T2-F02-05: Month boundary rollover resets recoveriesUsedThisMonth to 0 and recoveriesRemaining to 3', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const ev = Engine.evaluateDeadline(
      { streak: 5, lastCompletedDate: '2026-11-30', recoveryMonth: '2026-11', recoveriesUsedThisMonth: 3 },
      new Date(2026, 11, 1, 9, 0, 0)
    );
    assert.equal(ev.state.recoveryMonth, '2026-12');
    assert.equal(ev.state.recoveriesUsedThisMonth, 0);
    assert.equal(ev.recoveriesRemaining, 3);
  } finally {
    env.cleanup();
  }
});

test('T2-F04-01: Zero duplicate id and zero duplicate normalized textVi across TRANSLATION_BANK', () => {
  const { bank } = loadTranslationBankInVm();
  const ids = new Set();
  const bodies = new Set();
  for (const a of bank) {
    assert.ok(!ids.has(a.id), `Duplicate article id: ${a.id}`);
    ids.add(a.id);
    const norm = String(a.textVi || '').trim().toLowerCase();
    assert.ok(!bodies.has(norm), `Duplicate article textVi on id=${a.id}`);
    bodies.add(norm);
  }
});

test('T2-F04-02: Zero custom_items stubs or placeholder text across TRANSLATION_BANK', () => {
  const { bank } = loadTranslationBankInVm();
  for (const a of bank) {
    assert.notEqual(a.unitId, 'custom_items', `Unexpected custom_items stub: ${a.id}`);
    const lower = `${a.title} ${a.textVi} ${a.referenceEn}`.toLowerCase();
    assert.ok(!/\blorem ipsum\b/.test(lower), `Placeholder lorem ipsum found in ${a.id}`);
    assert.ok(!/\bsample stub\b/.test(lower), `Placeholder sample stub found in ${a.id}`);
    assert.ok(!/\btodo\b/.test(lower), `Placeholder TODO found in ${a.id}`);
  }
});

test('T2-F04-03: Zero duplicate normalized textVi or referenceEn among ielts_reading entries', () => {
  const { bank } = loadTranslationBankInVm();
  const ielts = bank.filter((a) => a.sourceGroup === 'ielts_reading');
  assert.ok(ielts.length >= 140, `Expected >= 140 ielts_reading entries, got ${ielts.length}`);
  const bodies = new Set();
  const refs = new Set();
  for (const a of ielts) {
    const b = String(a.textVi || '').trim().toLowerCase();
    const r = String(a.referenceEn || '').trim().toLowerCase();
    assert.ok(!bodies.has(b), `Duplicate IELTS textVi on ${a.id}`);
    assert.ok(!refs.has(r), `Duplicate IELTS referenceEn on ${a.id}`);
    bodies.add(b);
    refs.add(r);
  }
});

test('T2-F04-04: Every textVi has >= 35 words, contains Vietnamese diacritics, and differs from referenceEn', () => {
  const { bank } = loadTranslationBankInVm();
  const viDiacriticsRx = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  for (const a of bank) {
    assert.ok(countViWords(a.textVi) >= 35, `Article ${a.id} has < 35 words`);
    assert.ok(viDiacriticsRx.test(a.textVi), `Article ${a.id} textVi lacks Vietnamese diacritics`);
    assert.notEqual(a.referenceEn.trim(), a.textVi.trim(), `Article ${a.id} referenceEn equals textVi`);
  }
});

test('T2-F04-05: Reverse load order of 4 translation_bank_*.js files yields identical article count and IDs', () => {
  const fwd = loadTranslationBankInVm({ reverseOrder: false }).bank;
  const rev = loadTranslationBankInVm({ reverseOrder: true }).bank;
  assert.equal(rev.length, fwd.length);
  const fwdIds = new Set(fwd.map((a) => a.id));
  const revIds = new Set(rev.map((a) => a.id));
  assert.equal(revIds.size, fwdIds.size);
  for (const id of fwdIds) assert.ok(revIds.has(id), `Missing id ${id} in reverse load order`);
});

test('T2-F04-06: lengthTier boundaries (<90 short, 90..180 medium, >180 long) are strictly consistent', () => {
  const { bank } = loadTranslationBankInVm();
  for (const a of bank) {
    const wc = a.wordCountVi;
    const expectedTier = wc < 90 ? 'short' : wc <= 180 ? 'medium' : 'long';
    assert.equal(
      a.lengthTier,
      expectedTier,
      `Article ${a.id} has wordCountVi=${wc} with lengthTier=${a.lengthTier} (expected ${expectedTier})`
    );
  }
});

test('T2-F11-02: SecurityGuardEngine strips evil query params, XSS hashes, traversal, and javascript: URIs', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('security-guard-engine.js');
    const Guard = env.sandbox.SecurityGuardEngine;
    const cases = [
      { pathname: '/', search: '?evil=1', hash: '' },
      { pathname: '/', search: '', hash: '#<script>alert(1)</script>' },
      { pathname: '/', search: '', hash: '#../../etc/passwd' },
      { pathname: '/', search: '', hash: '#javascript:alert(1)' },
    ];
    for (const c of cases) {
      const res = Guard.inspectAndSanitizeUrl(c);
      assert.equal(res.tampered, true, `Expected tampered=true for ${JSON.stringify(c)}`);
      assert.equal(res.safe, false, `Expected safe=false for ${JSON.stringify(c)}`);
      assert.equal(res.cleanUrl, '/', `Expected cleanUrl='/' for ${JSON.stringify(c)}`);
    }
  } finally {
    env.cleanup();
  }
});

test('T2-F11-05: DeviceAuthGate blocks tonguyenvu@265.com when EMH_AUTH_TOKEN is missing or too short', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('auth-gate-engine.js');
    const Gate = env.sandbox.DeviceAuthGate;
    for (const tok of ['', '123']) {
      const res = Gate.evaluateDeviceAccess({
        EMH_ACTIVE_ACCOUNT_EMAIL: 'tonguyenvu@265.com',
        EMH_AUTH_TOKEN: tok,
      });
      assert.equal(res.allowed, false);
      assert.equal(res.mode, 'GATE_LOCKED');
    }
  } finally {
    env.cleanup();
  }
});

test('T2-F12-01: Every asset in sw.js ASSETS_TO_CACHE exists on disk', () => {
  const swCode = fs.readFileSync(repoPath('sw.js'), 'utf8');
  const { ASSETS_TO_CACHE } = extractSwAssets(swCode);
  for (const asset of ASSETS_TO_CACHE) {
    if (asset === './' || asset === '/') continue;
    const rel = asset.replace(/^\.\//, '');
    assert.ok(fs.existsSync(repoPath(rel)), `Asset listed in sw.js missing on disk: ${asset}`);
  }
});

test('T2-F12-02: index.html loads data.js and all 4 translation_bank_*.js BEFORE new engines and app.js', () => {
  const html = fs.readFileSync(repoPath('index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script\s+[^>]*src=["']\.\/([^"'?]+)/gi)].map((m) => m[1]);
  const dataIdx = scripts.indexOf('data.js');
  assert.ok(dataIdx >= 0, 'data.js script tag missing');
  const bankIdxs = BANK_FILES.map((f) => {
    const idx = scripts.indexOf(f);
    assert.ok(idx > dataIdx, `${f} must appear after data.js in index.html`);
    return idx;
  });
  const maxBankIdx = Math.max(...bankIdxs);
  for (const eng of ['translation-practice-engine.js', 'read-aloud-engine.js', 'vi-en-games-engine.js', 'app.js']) {
    const idx = scripts.indexOf(eng);
    assert.ok(idx > maxBankIdx, `${eng} must load after all translation_bank_*.js files (idx=${idx}, maxBank=${maxBankIdx})`);
  }
});

test('T2-F12-05: SecurityGuardEngine allows #translation, #readaloud, #games and rejects #unknown_tab_xyz', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('security-guard-engine.js');
    const Guard = env.sandbox.SecurityGuardEngine;
    for (const tab of ['#translation', '#readaloud', '#games']) {
      const res = Guard.inspectAndSanitizeUrl({ pathname: '/', search: '', hash: tab });
      assert.equal(res.safe, true);
      assert.equal(res.cleanUrl, `/${tab}`);
    }
    const bad = Guard.inspectAndSanitizeUrl({ pathname: '/', search: '', hash: '#unknown_tab_xyz' });
    assert.equal(bad.tampered, true);
    assert.equal(bad.cleanUrl, '/');
  } finally {
    env.cleanup();
  }
});

// ============================================================================
// TIER 3 — CROSS-FEATURE PAIRWISE COMBINATION (Node VM)
// ============================================================================

test('T3-11: Late-night 23:58 completion + rollover to 00:05 next day preserves streak and starts new PENDING_TODAY', () => {
  const env = createVmBrowserContext();
  try {
    env.runFile('streak-deadline-engine.js');
    const Engine = env.sandbox.StreakDeadlineEngine;
    const t1 = new Date(2026, 10, 26, 23, 58, 0);
    const doneRes = Engine.recordCoreTaskCompletion(
      { streak: 9, longestStreak: 9, lastCompletedDate: '2026-11-25' },
      'translation_readaloud',
      t1
    );
    assert.equal(doneRes.newStreak, 10);
    assert.equal(doneRes.state.lastCompletedDate, '2026-11-26');

    const t2 = new Date(2026, 10, 27, 0, 5, 0);
    const nextEval = Engine.evaluateDeadline(doneRes.state, t2);
    assert.equal(nextEval.status, 'PENDING_TODAY');
    assert.equal(nextEval.state.streak, 10);
    assert.deepEqual(Array.from(nextEval.state.todayCompletedTasks), []);
  } finally {
    env.cleanup();
  }
});
