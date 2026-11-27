/**
 * Vi-En Games Engine (v105.0)
 * 8 playable Vietnamese -> English translation games bound to window.APP_DATA.units
 * UMD module: works in browser (#tab-games + window.ViEnGamesEngine) and Node.js (module.exports / vm).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.ViEnGamesEngine = api;
  }
  if (typeof window !== 'undefined' && window !== root) {
    window.ViEnGamesEngine = api;
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis), function () {
  'use strict';

  var STATS_STORAGE_KEY = 'EMH_VI_EN_GAMES_STATS_V1';
  var STYLE_ELEMENT_ID = 'veg-inline-styles';

  var MODES = [
    {
      id: 'word_tiles',
      nameVi: 'Ghép thẻ sắp xếp câu',
      nameEn: 'Word Tiles',
      subtitleVi: 'Sắp xếp thẻ từ tiếng Anh đúng trật tự',
      icon: '🧩',
      badge: 'Câu chuẩn'
    },
    {
      id: 'cloze',
      nameVi: 'Điền từ theo ngữ cảnh',
      nameEn: 'Cloze Translation',
      subtitleVi: 'Hoàn thành câu tiếng Anh theo nghĩa Việt',
      icon: '✍️',
      badge: 'Ngữ cảnh'
    },
    {
      id: 'speed_blitz',
      nameVi: 'Phản xạ tốc độ',
      nameEn: 'Speed Blitz',
      subtitleVi: 'Đếm ngược 60s, chọn nhanh nghĩa chuẩn',
      icon: '⚡',
      badge: 'Tốc độ'
    },
    {
      id: 'match_pairs',
      nameVi: 'Nối cặp Việt – Anh',
      nameEn: 'Match Pairs',
      subtitleVi: 'Ghép 6 cặp nghĩa Việt – Anh siêu tốc',
      icon: '🔗',
      badge: 'Cặp từ'
    },
    {
      id: 'type_translation',
      nameVi: 'Gõ dịch & chấm tức thì',
      nameEn: 'Type Translation',
      subtitleVi: 'Tự gõ bản dịch tiếng Anh & xem diff',
      icon: '⌨️',
      badge: 'Chấm điểm'
    },
    {
      id: 'falling_words',
      nameVi: 'Săn từ rơi',
      nameEn: 'Falling Words',
      subtitleVi: 'Bắt từ tiếng Việt đang rơi trước khi chạm đáy',
      icon: '☄️',
      badge: 'Arcade'
    },
    {
      id: 'spot_fix',
      nameVi: 'Bắt lỗi sai bản dịch',
      nameEn: 'Spot & Fix',
      subtitleVi: 'Tìm đoạn dịch sai & sửa lại cho chuẩn',
      icon: '🔎',
      badge: 'Bắt lỗi'
    },
    {
      id: 'dialogue_chain',
      nameVi: 'Dịch nối tiếp hội thoại',
      nameEn: 'Dialogue Chain',
      subtitleVi: 'Hoàn thành mạch hội thoại / tin ngắn theo Unit',
      icon: '💬',
      badge: 'Mạch truyện'
    }
  ];

  var IRREGULAR_VERBS = {
    be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
    make: ['makes', 'made', 'making'],
    have: ['has', 'had', 'having'],
    do: ['does', 'did', 'done', 'doing'],
    give: ['gives', 'gave', 'given', 'giving'],
    take: ['takes', 'took', 'taken', 'taking'],
    get: ['gets', 'got', 'gotten', 'getting'],
    go: ['goes', 'went', 'gone', 'going'],
    come: ['comes', 'came', 'coming'],
    say: ['says', 'said', 'saying'],
    see: ['sees', 'saw', 'seen', 'seeing'],
    know: ['knows', 'knew', 'known', 'knowing'],
    think: ['thinks', 'thought', 'thinking'],
    find: ['finds', 'found', 'finding'],
    keep: ['keeps', 'kept', 'keeping'],
    hold: ['holds', 'held', 'holding'],
    pay: ['pays', 'paid', 'paying'],
    set: ['sets', 'setting'],
    put: ['puts', 'putting'],
    run: ['runs', 'ran', 'running'],
    wear: ['wears', 'wore', 'worn', 'wearing'],
    write: ['writes', 'wrote', 'written', 'writing'],
    bring: ['brings', 'brought', 'bringing'],
    feel: ['feels', 'felt', 'feeling'],
    leave: ['leaves', 'left', 'leaving'],
    meet: ['meets', 'met', 'meeting'],
    lose: ['loses', 'lost', 'losing'],
    buy: ['buys', 'bought', 'buying'],
    sell: ['sells', 'sold', 'selling'],
    spend: ['spends', 'spent', 'spending'],
    build: ['builds', 'built', 'building'],
    send: ['sends', 'sent', 'sending'],
    tell: ['tells', 'told', 'telling'],
    show: ['shows', 'showed', 'shown', 'showing'],
    begin: ['begins', 'began', 'begun', 'beginning'],
    break: ['breaks', 'broke', 'broken', 'breaking'],
    choose: ['chooses', 'chose', 'chosen', 'choosing'],
    eat: ['eats', 'ate', 'eaten', 'eating'],
    fall: ['falls', 'fell', 'fallen', 'falling'],
    forget: ['forgets', 'forgot', 'forgotten', 'forgeting', 'forgetting'],
    grow: ['grows', 'grew', 'grown', 'growing'],
    hear: ['hears', 'heard', 'hearing'],
    mean: ['means', 'meant', 'meaning'],
    read: ['reads', 'reading'],
    speak: ['speaks', 'spoke', 'spoken', 'speaking'],
    stand: ['stands', 'stood', 'standing'],
    understand: ['understands', 'understood', 'understanding'],
    win: ['wins', 'won', 'winning'],
    lead: ['leads', 'led', 'leading'],
    learn: ['learns', 'learned', 'learnt', 'learning'],
    catch: ['catches', 'caught', 'catching'],
    teach: ['teaches', 'taught', 'teaching'],
    draw: ['draws', 'drew', 'drawn', 'drawing'],
    drive: ['drives', 'drove', 'driven', 'driving'],
    feel: ['feels', 'felt', 'feeling'],
    become: ['becomes', 'became', 'becoming'],
    arise: ['arises', 'arose', 'arisen'],
    fall: ['falls', 'fell', 'fallen']
  };

  var UNCOUNTABLE_WORDS = {
    water: 1, air: 1, cotton: 1, leather: 1, wool: 1, rubber: 1, money: 1,
    advice: 1, information: 1, traffic: 1, pollution: 1, evidence: 1,
    equipment: 1, furniture: 1, knowledge: 1, research: 1, work: 1,
    dairy: 1, food: 1, time: 1, health: 1, energy: 1, electricity: 1,
    waste: 1, garbage: 1, litter: 1, adrenaline: 1, memorabilia: 1,
    music: 1, art: 1, history: 1, nature: 1, wildlife: 1, luck: 1,
    progress: 1, patience: 1, confidence: 1, courage: 1, wisdom: 1,
    plastic: 1, metal: 1, wood: 1, glass: 1, paper: 1, silk: 1, denim: 1
  };

  var CONTRACTIONS = [
    [/\bcan't\b/gi, 'cannot'],
    [/\bwon't\b/gi, 'will not'],
    [/\bshan't\b/gi, 'shall not'],
    [/\bdon't\b/gi, 'do not'],
    [/\bdoesn't\b/gi, 'does not'],
    [/\bdidn't\b/gi, 'did not'],
    [/\bisn't\b/gi, 'is not'],
    [/\baren't\b/gi, 'are not'],
    [/\bwasn't\b/gi, 'was not'],
    [/\bweren't\b/gi, 'were not'],
    [/\bhasn't\b/gi, 'has not'],
    [/\bhaven't\b/gi, 'have not'],
    [/\bhadn't\b/gi, 'had not'],
    [/\bcouldn't\b/gi, 'could not'],
    [/\bshouldn't\b/gi, 'should not'],
    [/\bwouldn't\b/gi, 'would not'],
    [/\bmustn't\b/gi, 'must not'],
    [/\bi'm\b/gi, 'i am'],
    [/\byou're\b/gi, 'you are'],
    [/\bwe're\b/gi, 'we are'],
    [/\bthey're\b/gi, 'they are'],
    [/\bhe's\b/gi, 'he is'],
    [/\bshe's\b/gi, 'she is'],
    [/\bit's\b/gi, 'it is'],
    [/\bthat's\b/gi, 'that is'],
    [/\bthere's\b/gi, 'there is'],
    [/\bi've\b/gi, 'i have'],
    [/\byou've\b/gi, 'you have'],
    [/\bwe've\b/gi, 'we have'],
    [/\bthey've\b/gi, 'they have'],
    [/\bi'll\b/gi, 'i will'],
    [/\byou'll\b/gi, 'you will'],
    [/\bwe'll\b/gi, 'we will'],
    [/\bthey'll\b/gi, 'they will'],
    [/\blet's\b/gi, 'let us']
  ];

  // Runtime & UI State
  var domInitAppData = null;
  var cachedUnitsRef = null;
  var cachedUnitsLen = -1;
  var cachedNormalizedUnits = null;
  var rootEl = null;
  var boundListeners = [];
  var blitzIntervalId = null;
  var fallingRafId = null;
  var fallingIntervalId = null;
  var lastFallingTs = 0;
  var autoBootTimeoutId = null;
  var autoBootListener = null;

  var state = createIdleState();

  function createIdleState() {
    return {
      status: 'idle',
      mode: 'word_tiles',
      unitId: null,
      unitNumber: null,
      unitTitle: '',
      seed: 0,
      currentIndex: 0,
      totalQuestions: 0,
      score: 0,
      maxScore: 0,
      streak: 0,
      bestStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0,
      elapsedMs: 0,
      remainingMs: null,
      questionElapsedMs: 0,
      currentQuestion: null,
      lastFeedback: null,
      history: [],
      tilesState: null,
      matchState: null,
      fallingState: null,
      dialogueState: null,
      summary: null,
      // Internal runtime helpers (not exposed raw in getState)
      _questions: [],
      _rng: null,
      _options: {},
      _unit: null,
      _fallingPool: [],
      _fallingNextIdx: 0,
      _fallingSpawnIdCounter: 0,
      _pickedFaultIndex: null
    };
  }

  // ==================== Utilities ====================

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    var out = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k.charAt(0) === '_') continue;
      out[k] = deepClone(obj[k]);
    }
    return out;
  }

  function hashSeed(seed) {
    if (typeof seed === 'number' && isFinite(seed)) {
      return (seed >>> 0) || 1;
    }
    var str = String(seed);
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) || 1;
  }

  function createRng(seed) {
    if (seed == null || seed === '') {
      var fallbackSeed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
      return createMulberry32(fallbackSeed || 123456789);
    }
    return createMulberry32(hashSeed(seed));
  }

  function createMulberry32(a) {
    var t = a >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleWithRng(arr, rng) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function capitalizeFirst(str) {
    var s = String(str || '').trim();
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function lowerFirstSmart(str) {
    var s = String(str || '').trim();
    if (!s) return '';
    // Preserve standalone "I" and "I'm", "I've", "I'll", "I'd"
    if (/^I(?:'m|'ve|'ll|'d)?(?:\s|$|[.,!?])/.test(s)) {
      return s;
    }
    // Keep acronyms/proper terms like DNA, IELTS, VTV, TV, AI, UK, US, Adrenalin, English, etc.
    if (/^[A-Z]{2,}(?:\b|(?=\s|[.,!?]))/.test(s) ||
        /^(Adrenalin|Vlogger|Internet|Facebook|YouTube|TikTok|Google|English|Vietnam|Vietnamese|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/.test(s)) {
      return s;
    }
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  function cleanOcrVi(text) {
    var s = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    if (!s) return '';
    // Join OCR-broken Vietnamese onset + accented vowel syllables (e.g. "s ản ph ẩm t ừ", "đư ợc", "nghi ệm")
    var pattern = /(^|[\s(])(ngh|ch|gh|gi|kh|ng|nh|ph|qu|th|tr|đư|nghi|bu|cu|hu|[bcdfghklmnpqrstvwxzđ])\s+([àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ])/gi;
    var prev;
    var guard = 0;
    do {
      prev = s;
      s = s.replace(pattern, '$1$2$3');
      guard++;
    } while (s !== prev && guard < 6);
    return s.replace(/\s+/g, ' ').trim();
  }

  function extractShortViAndGlosses(cleanVi) {
    var s = String(cleanVi || '').trim();
    if (!s) return { shortVi: '', viGlosses: [] };

    // Remove parenthetical notes (including unclosed trailing '(' from OCR truncation) if text precedes it
    var noParens = s.replace(/\s*\([^)]*(?:\)|$)/g, '').trim();
    if (noParens.length < 2) {
      noParens = s.replace(/[()]/g, '').trim();
    }

    // Collect all gloss fragments split by ; / ,
    var rawParts = noParens.split(/\s*[;/]\s*/);
    var glosses = [];
    for (var i = 0; i < rawParts.length; i++) {
      var part = rawParts[i].replace(/[,.;:]+$/, '').trim();
      if (part) glosses.push(part);
    }

    var primary = glosses[0] || noParens;
    // If primary still has comma clauses and is long, take first clause if meaningful
    if (primary.length > 42 && primary.indexOf(',') !== -1) {
      var commaFirst = primary.split(',')[0].trim();
      if (commaFirst.length >= 3) {
        primary = commaFirst;
      }
    }
    primary = primary.replace(/[,.;:]+$/, '').trim();

    if (glosses.indexOf(primary) === -1 && primary) {
      glosses.unshift(primary);
    }
    return {
      shortVi: primary || s,
      viGlosses: glosses.length ? glosses : [s]
    };
  }

  function isVerbPhraseOrPhrasalVerb(word) {
    var w = String(word || '').trim();
    if (!w) return false;
    if (/^(be|make|take|do|have|get|give|play|pay|keep|hold|bring|put|set|settle|knock|pass|operate|book|reach|sign|count|appreciate|eat|hang|fill|lock|push|wake|agree|go|come|deal|dress|identify|refer|contribute|meet|propose|present|face|type|enroll|log|afford|check|live|invest|struggle|force|raise|leave|threaten|look|watch|attend|feel|find|spend|drop|react|respond|achieve|solve|break|catch|cope|depend|belong|focus|rely|lead|stick|turn|carry|run|pick|work|offer|gain|shout|yell|stop|don't)\b/i.test(w)) {
      return true;
    }
    if (!/^(in|on|at|for|under|to|from|by|with|of|out\s+and|here\s+to|pros\s+and|the\s+|a\s+|an\s+)/i.test(w) &&
        /\s+(up|down|out|off|on|in|away|back|over|with|into|through|around|forward)$/i.test(w)) {
      return true;
    }
    return false;
  }

  function normalizePos(rawPos, word) {
    var p = String(rawPos || '').toLowerCase().trim();
    var w = String(word || '').trim();
    var wordCount = w ? w.split(/\s+/).length : 1;

    if (!p) {
      if (isVerbPhraseOrPhrasalVerb(w)) {
        return wordCount >= 2 ? 'phrase' : 'verb';
      }
      return wordCount >= 3 ? 'phrase' : 'noun';
    }
    if (/^phr\s*v\b/.test(p) || /^v\b/.test(p) || p.indexOf('v/') === 0 || /^gerund\b/.test(p) || /^v\s+/.test(p)) {
      return 'verb';
    }
    if (p === 'adv' || p === 'adverb') {
      return 'adv';
    }
    if (p === 'a' || p === 'adj' || p === 'adjective' || p.indexOf('a/') === 0 || p.indexOf('adj/') === 0) {
      return 'adj';
    }
    if (p === 'phrase' || p === 'phr' || p === 'collocation' || p === 'idiom' || p === 'np' ||
        p.indexOf('collocation') === 0 || p.indexOf('phr ') === 0 || p === 'p') {
      return 'phrase';
    }
    if (p === 'n' || p === 'noun' || p === 'n pl' || p.indexOf('n/') === 0) {
      return 'noun';
    }
    if (p.indexOf('past tense') !== -1 || p.indexOf('continuous') !== -1) {
      return p.indexOf('phr') === 0 ? 'phrase' : 'verb';
    }
    if (isVerbPhraseOrPhrasalVerb(w)) {
      return wordCount >= 2 ? 'phrase' : 'verb';
    }
    return wordCount >= 3 ? 'phrase' : 'noun';
  }

  function normalizeEnglishWordVariants(rawWord) {
    var raw = String(rawWord || '').trim().replace(/\s+/g, ' ');
    var alts = raw.split(/\s*=\s*/).map(function (x) { return x.trim(); }).filter(Boolean);
    var primaryRaw = alts[0] || raw;

    function expandPlaceholders(str) {
      var out = String(str || '').trim();
      // Known typo in data.js Unit 37: "pay a vist"
      out = out.replace(/\bvist\b/gi, 'visit');
      out = out.replace(/\bsb\/sth\b/gi, 'someone');
      out = out.replace(/\bsth\/sb\b/gi, 'something');
      out = out.replace(/\bsb\b/gi, 'someone');
      out = out.replace(/\bsth\b/gi, 'something');
      out = out.replace(/\s+/g, ' ').trim();
      return out;
    }

    function pickFirstSlash(str) {
      // Handle "Play a role/part in something" -> "Play a role in something"
      return str.replace(/\b([A-Za-z'-]+)\/([A-Za-z'-]+)\b/g, '$1');
    }

    function pickSecondSlash(str) {
      return str.replace(/\b([A-Za-z'-]+)\/([A-Za-z'-]+)\b/g, '$2');
    }

    var expandedPrimary = expandPlaceholders(primaryRaw);
    var cleanPrimary = pickFirstSlash(expandedPrimary).replace(/\(([^)]+)\)/g, '$1').replace(/\s+/g, ' ').trim();

    var accepted = [];
    function pushAcc(s) {
      var v = String(s || '').trim().replace(/\s+/g, ' ');
      if (v && accepted.indexOf(v) === -1) accepted.push(v);
    }

    pushAcc(cleanPrimary);
    pushAcc(expandedPrimary);
    pushAcc(pickSecondSlash(expandedPrimary));
    pushAcc(expandedPrimary.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim());
    for (var i = 0; i < alts.length; i++) {
      var ex = expandPlaceholders(alts[i]);
      pushAcc(ex);
      pushAcc(pickFirstSlash(ex));
      pushAcc(pickSecondSlash(ex));
      pushAcc(alts[i]);
    }

    return {
      rawWord: raw,
      cleanWord: cleanPrimary,
      acceptedWords: accepted
    };
  }

  // ==================== APP_DATA & Unit Normalization ====================

  function getRawAppData(overrideAppData) {
    if (overrideAppData && Array.isArray(overrideAppData.units)) return overrideAppData;
    if (typeof window !== 'undefined' && window.APP_DATA && Array.isArray(window.APP_DATA.units)) {
      return window.APP_DATA;
    }
    if (typeof globalThis !== 'undefined' && globalThis.APP_DATA && Array.isArray(globalThis.APP_DATA.units)) {
      return globalThis.APP_DATA;
    }
    return null;
  }

  function extractUnitTheme(unitTitle, unitNumber) {
    var title = String(unitTitle || '').trim();
    var stripped = title.replace(/^Unit\s+\d+\s*:\s*/i, '').trim();
    var themeVi = stripped;
    var themeEn = '';

    var parenMatch = stripped.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
    if (parenMatch) {
      var before = parenMatch[1].trim();
      var inside = parenMatch[2].trim();
      var insideHasVi = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(inside);
      var beforeHasVi = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(before);
      if (!insideHasVi && /[a-zA-Z]{2,}/.test(inside) && !/^Tuần\b/i.test(inside)) {
        themeVi = before || stripped;
        themeEn = inside;
      } else if (insideHasVi && !beforeHasVi && /[a-zA-Z]{2,}/.test(before) && !/^Tuần\b/i.test(inside)) {
        // Units 1-8 format: "Me & Mine (Sở hữu & Đồ vật)"
        themeVi = inside;
        themeEn = before;
      } else {
        themeVi = before || stripped;
      }
    }

    if (unitNumber === 37 || /Tuần\s*1\s*-\s*27/i.test(title)) {
      themeVi = 'từ vựng và cấu trúc chọn lọc';
      themeEn = 'selected vocabulary and structures';
    }

    if (!themeEn) {
      themeEn = 'everyday communication';
    }
    if (!themeVi) {
      themeVi = 'tiếng Anh giao tiếp';
    }

    // Make connector natural inside sentences
    var themeViSentence = lowerFirstSmart(themeVi).replace(/\s*&\s*/g, ' và ');
    var themeEnSentence = themeEn.toLowerCase().replace(/\s*&\s*/g, ' and ');

    return {
      themeVi: themeVi,
      themeEn: themeEn,
      themeViSentence: themeViSentence,
      themeEnSentence: themeEnSentence
    };
  }

  function getNormalizedUnits(overrideAppData) {
    var appData = getRawAppData(overrideAppData);
    if (!appData || !Array.isArray(appData.units)) return [];

    if (!overrideAppData && cachedNormalizedUnits && cachedUnitsRef === appData.units && cachedUnitsLen === appData.units.length) {
      return cachedNormalizedUnits;
    }

    var result = [];
    for (var idx = 0; idx < appData.units.length; idx++) {
      var u = appData.units[idx];
      if (!u || u.unitId === 'custom_items' || !Array.isArray(u.days)) continue;

      var title = String(u.unitTitle || '').trim();
      var unitNumber = null;
      if (typeof u.unitNumber === 'number' && isFinite(u.unitNumber)) {
        unitNumber = u.unitNumber;
      } else {
        var numMatch = title.match(/Unit\s+(\d+)/i);
        if (numMatch) {
          unitNumber = parseInt(numMatch[1], 10);
        } else {
          unitNumber = idx + 1;
        }
      }

      var canonicalId;
      if (u.unitId && String(u.unitId).trim()) {
        canonicalId = String(u.unitId).trim();
      } else if (unitNumber === 37) {
        canonicalId = 'unit37';
      } else {
        canonicalId = 'unit' + unitNumber;
      }

      var nonAllDays = u.days.filter(function (d) { return d && d.category !== 'all'; });
      var daysToUse = nonAllDays.length ? nonAllDays : u.days;

      var seenWords = {};
      var normalizedWords = [];
      var theme = extractUnitTheme(title, unitNumber);

      for (var dIdx = 0; dIdx < daysToUse.length; dIdx++) {
        var day = daysToUse[dIdx];
        if (!day || !Array.isArray(day.words)) continue;
        for (var wIdx = 0; wIdx < day.words.length; wIdx++) {
          var raw = day.words[wIdx];
          if (!raw) continue;
          var wordStr = String(raw.word || '').trim();
          if (!wordStr) continue;
          var dedupKey = wordStr.toLowerCase();
          if (seenWords[dedupKey]) continue;

          var rawVi = String(raw.meaning_vi || raw.meaning || '').trim();
          if (!rawVi) continue;

          seenWords[dedupKey] = true;

          var cleanVi = cleanOcrVi(rawVi);
          var glossInfo = extractShortViAndGlosses(cleanVi);
          var wordVariants = normalizeEnglishWordVariants(wordStr);
          var posNorm = normalizePos(raw.pos, wordVariants.cleanWord);

          var exRaw = String(raw.example || '').trim();
          var hasRealEx = Boolean(
            exRaw &&
            !/^Example(?:\s+context\s+with)?(?::|\b)/i.test(exRaw) &&
            exRaw.split(/\s+/).length >= 4
          );

          normalizedWords.push({
            id: canonicalId + '__' + normalizedWords.length,
            word: wordStr,
            cleanWord: wordVariants.cleanWord,
            acceptedWords: wordVariants.acceptedWords,
            posRaw: String(raw.pos || '').trim(),
            pos: posNorm,
            pron: String(raw.pron || raw.phonetic || '').trim(),
            meaningVi: cleanVi,
            shortVi: glossInfo.shortVi,
            viGlosses: glossInfo.viGlosses,
            meaningEn: String(raw.meaning_en || '').trim(),
            example: hasRealEx ? exRaw : '',
            hasRealExample: hasRealEx,
            level: String(raw.level || '').trim(),
            unitId: canonicalId,
            unitNumber: unitNumber
          });
        }
      }

      if (normalizedWords.length < 4) continue;

      result.push({
        unitId: canonicalId,
        unitNumber: unitNumber,
        unitTitle: title || ('Unit ' + unitNumber),
        themeVi: theme.themeVi,
        themeEn: theme.themeEn,
        themeViSentence: theme.themeViSentence,
        themeEnSentence: theme.themeEnSentence,
        wordCount: normalizedWords.length,
        words: normalizedWords
      });
    }

    if (!overrideAppData) {
      cachedUnitsRef = appData.units;
      cachedUnitsLen = appData.units.length;
      cachedNormalizedUnits = result;
    }
    return result;
  }

  function resolveUnit(unitIdOrNum, overrideAppData) {
    var units = getNormalizedUnits(overrideAppData);
    if (!units.length) return null;

    if (unitIdOrNum == null || unitIdOrNum === '') {
      return units[0];
    }

    var key = String(unitIdOrNum).trim();
    var lower = key.toLowerCase();

    // 1. Exact unitId match
    for (var i = 0; i < units.length; i++) {
      if (units[i].unitId === key || units[i].unitId.toLowerCase() === lower) {
        return units[i];
      }
    }

    // 2. Unit 37 aliases ('unit37', 'unit_37', '37')
    if (lower === 'unit37' || lower === 'unit_37' || lower === '37') {
      for (var j = 0; j < units.length; j++) {
        if (units[j].unitNumber === 37 || units[j].unitId === 'unit37') {
          return units[j];
        }
      }
    }

    // 3. Numeric match ('1'..'37') or 'unit1' / 'unit_1' / 'unit_1_...'
    var numMatch = lower.match(/^(?:unit_?)?(\d+)$/);
    if (numMatch) {
      var targetNum = parseInt(numMatch[1], 10);
      for (var k = 0; k < units.length; k++) {
        if (units[k].unitNumber === targetNum) {
          return units[k];
        }
      }
    }

    // 4. Prefix match 'unit_<num>_'
    var prefixMatch = lower.match(/^unit_?(\d+)_/);
    if (prefixMatch) {
      var pNum = parseInt(prefixMatch[1], 10);
      for (var m = 0; m < units.length; m++) {
        if (units[m].unitNumber === pNum) {
          return units[m];
        }
      }
    }

    return null;
  }

  function getAvailableUnits(overrideAppData) {
    return getNormalizedUnits(overrideAppData).map(function (u) {
      return {
        unitId: u.unitId,
        unitNumber: u.unitNumber,
        unitTitle: u.unitTitle,
        themeVi: u.themeVi,
        themeEn: u.themeEn,
        wordCount: u.wordCount
      };
    });
  }

  function getUnitVocabulary(unitId, overrideAppData) {
    if (String(unitId || '').toLowerCase() === 'all') {
      var allUnits = getNormalizedUnits(overrideAppData);
      var seen = {};
      var merged = [];
      for (var i = 0; i < allUnits.length; i++) {
        var list = allUnits[i].words;
        for (var j = 0; j < list.length; j++) {
          var key = list[j].word.toLowerCase();
          if (!seen[key]) {
            seen[key] = true;
            merged.push(deepClone(list[j]));
          }
        }
      }
      return merged;
    }
    var unit = resolveUnit(unitId, overrideAppData);
    if (!unit) return [];
    return unit.words.map(deepClone);
  }

  // ==================== Bilingual Synthesis & Cloze Blanker ====================

  function isUncountableOrMass(word) {
    var lower = String(word || '').toLowerCase().trim();
    if (!lower) return true;
    if (UNCOUNTABLE_WORDS[lower]) return true;
    if (/(ness|tion|sion|ity|ment|ism|logy|ship|hood|ance|ence)$/.test(lower)) return true;
    return false;
  }

  function hasLeadingDeterminer(phrase) {
    return /^(a|an|the|my|your|his|her|our|their|this|that|these|those|some|many|much|no|every)\b/i.test(String(phrase || '').trim());
  }

  function formatNounPhrase(item) {
    var w = lowerFirstSmart(item.cleanWord);
    var posRaw = (item.posRaw || '').toLowerCase();
    if (hasLeadingDeterminer(w)) return w;
    if (posRaw.indexOf('pl') !== -1 || /s$/.test(w) && !/(ss|us|is|ness)$/.test(w)) {
      return w;
    }
    if (w.split(/\s+/).length >= 3) return w;
    if (isUncountableOrMass(w)) return w;
    var firstWord = w.split(/\s+/)[0].toLowerCase();
    var useAn = /^[aeiou]/.test(firstWord) && !/^(uni|use|eu|one)/.test(firstWord);
    return (useAn ? 'an ' : 'a ') + w;
  }

  function conjugateBePhrase(subjectType, phrase) {
    var clean = String(phrase || '').trim();
    if (/^be\b/i.test(clean)) {
      var aux = subjectType === 'they' ? 'are' : (subjectType === 'he' ? 'is' : 'am');
      return clean.replace(/^be\b/i, aux);
    }
    return clean;
  }

  function stripLeadingTo(phrase) {
    return String(phrase || '').replace(/^to\s+/i, '').trim();
  }

  function formatVerbForBaseSlot(item) {
    var w = lowerFirstSmart(stripLeadingTo(item.cleanWord));
    var posRaw = (item.posRaw || '').toLowerCase();
    if (posRaw.indexOf('past tense') !== -1 || posRaw.indexOf('gerund') !== -1) {
      return w;
    }
    return w;
  }

  function appendDanglingObjectEn(phrase) {
    var s = String(phrase || '').trim();
    if (!s) return s;
    if (/\bat\s+the\s+age\s+of$/i.test(s)) return s + ' 20';
    if (/\b(?:be\s+careful\s+not|be\s+ready|don't\s+be\s+afraid|take\s+time)\s+to$/i.test(s)) return s + ' do it';
    if (/\b(?:keep\s+on|take\s+on|to\s+begin\s+with|out\s+and\s+about|hands-on)$/i.test(s)) return s;
    if (/\b(?:of|with|to|for|from|into|towards|about|at)$/i.test(s)) return s + ' it';
    return s;
  }

  function appendDanglingObjectVi(viText, origEn) {
    var s = String(viText || '').trim();
    var en = String(origEn || '').trim();
    if (!s) return s;
    if (/\bat\s+the\s+age\s+of$/i.test(en)) return s + ' 20';
    if (/\b(?:be\s+careful\s+not|be\s+ready|don't\s+be\s+afraid|take\s+time)\s+to$/i.test(en)) return s + ' làm điều đó';
    if (/\b(?:keep\s+on|take\s+on|to\s+begin\s+with|out\s+and\s+about|hands-on)$/i.test(en)) return s;
    if (/\b(?:of|with|to|for|from|into|towards|about|at)$/i.test(en)) {
      if (/(?:ai|điều gì|điều đó|nó|20)$/i.test(s)) return s;
      return s + ' điều đó';
    }
    return s;
  }

  function formatViProgressive(viText) {
    var v = String(viText || '').trim();
    return /^đang\b/i.test(v) ? v : ('đang ' + v);
  }

  function synthesizeBilingualPair(item, unit, templateSeed) {
    var vi = lowerFirstSmart(item.shortVi || item.meaningVi);
    var pos = item.pos;
    var posRaw = (item.posRaw || '').toLowerCase();
    var themeVi = unit ? unit.themeViSentence : 'cuộc sống hằng ngày';
    var themeEn = unit ? unit.themeEnSentence : 'daily life';
    var w = item.cleanWord;
    var wMid = lowerFirstSmart(w);
    var idx = Math.abs(templateSeed || 0);

    var en = '';
    var viOut = '';
    var keySpan = wMid;

    if (pos === 'noun') {
      var np = formatNounPhrase(item);
      var bareWord = wMid;
      var nounTemplates = [
        function () {
          return {
            en: 'We need to pay attention to ' + bareWord + ' in ' + themeEn + '.',
            vi: 'Chúng ta cần chú ý đến ' + vi + ' trong chủ đề ' + themeVi + '.',
            key: bareWord
          };
        },
        function () {
          return {
            en: capitalizeFirst(np) + ' plays an important role today.',
            vi: capitalizeFirst(vi) + ' đóng một vai trò quan trọng ngày nay.',
            key: np
          };
        },
        function () {
          return {
            en: 'Students are learning about ' + bareWord + ' right now.',
            vi: 'Học sinh đang tìm hiểu về ' + vi + ' ngay lúc này.',
            key: bareWord
          };
        },
        function () {
          return {
            en: 'This guide explains ' + bareWord + ' very clearly.',
            vi: 'Tài liệu này giải thích về ' + vi + ' rất rõ ràng.',
            key: bareWord
          };
        }
      ];
      var chosenN = nounTemplates[idx % nounTemplates.length]();
      en = chosenN.en;
      viOut = chosenN.vi;
      keySpan = chosenN.key;
    } else if (pos === 'verb') {
      var vCompleted = appendDanglingObjectEn(wMid);
      var viVerbComp = appendDanglingObjectVi(vi, w);
      if (posRaw.indexOf('past tense') !== -1) {
        en = 'She ' + vCompleted + ' yesterday morning.';
        viOut = 'Cô ấy đã ' + viVerbComp + ' vào sáng hôm qua.';
        keySpan = wMid;
      } else if (posRaw.indexOf('gerund') !== -1 || posRaw.indexOf('continuous') !== -1 || /ing\b/i.test(wMid.split(/\s+/)[0]) && /\b(to|with|for|at|about)$/i.test(wMid)) {
        en = 'They are ' + vCompleted + ' right now.';
        viOut = 'Họ ' + formatViProgressive(viVerbComp) + ' ngay lúc này.';
        keySpan = wMid;
      } else {
        var vBase = formatVerbForBaseSlot(item);
        var vBaseComp = appendDanglingObjectEn(vBase);
        var verbTemplates = [
          function () {
            return {
              en: 'We should ' + vBaseComp + ' carefully every day.',
              vi: 'Chúng ta nên ' + viVerbComp + ' cẩn thận mỗi ngày.',
              key: vBase
            };
          },
          function () {
            return {
              en: 'People often ' + vBaseComp + ' to solve this problem.',
              vi: 'Mọi người thường ' + viVerbComp + ' để giải quyết vấn đề này.',
              key: vBase
            };
          },
          function () {
            return {
              en: 'Students can ' + vBaseComp + ' together in class.',
              vi: 'Học sinh có thể ' + viVerbComp + ' cùng nhau trong lớp.',
              key: vBase
            };
          }
        ];
        var chosenV = verbTemplates[idx % verbTemplates.length]();
        en = chosenV.en;
        viOut = chosenV.vi;
        keySpan = chosenV.key;
      }
    } else if (pos === 'adj') {
      var adjTemplates = [
        function () {
          return {
            en: 'This new solution looks very ' + wMid + '.',
            vi: 'Giải pháp mới này trông rất ' + vi + '.',
            key: wMid
          };
        },
        function () {
          return {
            en: 'Many people feel ' + wMid + ' about this result.',
            vi: 'Nhiều người cảm thấy ' + vi + ' về kết quả này.',
            key: wMid
          };
        },
        function () {
          return {
            en: 'The plan becomes ' + wMid + ' in this situation.',
            vi: 'Kế hoạch trở nên ' + vi + ' trong tình huống này.',
            key: wMid
          };
        }
      ];
      var chosenA = adjTemplates[idx % adjTemplates.length]();
      en = chosenA.en;
      viOut = chosenA.vi;
      keySpan = chosenA.key;
    } else if (pos === 'adv') {
      var advTemplates = [
        function () {
          return {
            en: 'She spoke ' + wMid + ' during the meeting.',
            vi: 'Cô ấy đã nói ' + vi + ' trong cuộc họp.',
            key: wMid
          };
        },
        function () {
          return {
            en: 'The team worked ' + wMid + ' to finish on time.',
            vi: 'Cả nhóm đã làm việc ' + vi + ' để hoàn thành đúng hạn.',
            key: wMid
          };
        }
      ];
      var chosenAdv = advTemplates[idx % advTemplates.length]();
      en = chosenAdv.en;
      viOut = chosenAdv.vi;
      keySpan = chosenAdv.key;
    } else {
      // 'phrase' / collocation / idiom
      var wordCount = w.split(/\s+/).length;
      var viPhraseComp = appendDanglingObjectVi(vi, w);
      if (/^be\b/i.test(w)) {
        var conj = conjugateBePhrase('they', wMid);
        var conjComp = appendDanglingObjectEn(conj);
        en = 'They ' + conjComp + ' right now.';
        viOut = 'Họ ' + formatViProgressive(viPhraseComp) + ' ngay lúc này.';
        keySpan = conj;
      } else if (/^(on\s+vacation|out\s+and\s+about|in\s+search\s+of|in\s+the\s+middle|on\s+the\s+corner|on\s+the\s+outskirts|in\s+the\s+company|in\s+favor\s+of|in\s+support\s+of|for\s+or\s+against)$/i.test(w) ||
                 /^(in\s+search\s+of|on\s+the\s+outskirts|in\s+the\s+company|in\s+favor\s+of)/i.test(w)) {
        en = 'They are ' + appendDanglingObjectEn(wMid) + ' right now.';
        viOut = 'Họ ' + formatViProgressive(viPhraseComp) + ' ngay lúc này.';
        keySpan = wMid;
      } else if (/^(under\s+control|here\s+to\s+stay)$/i.test(w)) {
        en = 'Everything is ' + wMid + ' right now.';
        viOut = 'Mọi thứ ' + formatViProgressive(vi) + ' ngay lúc này.';
        keySpan = wMid;
      } else if (/^(to\s+begin\s+with|in\s+particular|at\s+least|to\s+date|in\s+addition|on\s+the\s+other\s+hand|as\s+a\s+result|for\s+example|in\s+fact|in\s+general|at\s+first)/i.test(w)) {
        en = capitalizeFirst(wMid) + ', we should stay focused today.';
        viOut = capitalizeFirst(vi) + ', hôm nay chúng ta nên giữ sự tập trung.';
        keySpan = wMid;
      } else if (/^\bat\s+the\s+age\s+of\b/i.test(w)) {
        en = 'She succeeded ' + appendDanglingObjectEn(wMid) + '.';
        viOut = 'Cô ấy đã thành công ' + appendDanglingObjectVi(vi, w) + '.';
        keySpan = wMid;
      } else if (/^(?:I'm|I\s+am|It's|It\s+is|That's|There's|Don't|Be\s+careful|Be\s+ready|Make\s+the\s+most|Pay\s+attention|Stop\s+worrying|Take\s+time)\b/i.test(w)) {
        en = capitalizeFirst(appendDanglingObjectEn(w)) + '.';
        viOut = capitalizeFirst(viPhraseComp) + '.';
        keySpan = w;
      } else if (/^(an?\s+ideal\s+spot\s+for|a\s+high\s+priority|the\s+end\s+of\s+the\s+world)\b/i.test(w)) {
        en = 'This is ' + appendDanglingObjectEn(wMid) + '.';
        viOut = 'Đây là ' + viPhraseComp + '.';
        keySpan = wMid;
      } else if (isVerbPhraseOrPhrasalVerb(w)) {
        var vPhComp = appendDanglingObjectEn(wMid);
        en = 'We should ' + vPhComp + ' in daily life.';
        viOut = 'Chúng ta nên ' + viPhraseComp + ' trong cuộc sống hằng ngày.';
        keySpan = wMid;
      } else if (wordCount >= 4) {
        // Long idiomatic/structural phrase: direct translation works cleanly as a 4+ token target!
        en = capitalizeFirst(appendDanglingObjectEn(w)) + '.';
        viOut = capitalizeFirst(viPhraseComp) + '.';
        keySpan = w;
      } else {
        en = 'Everyone cares about ' + appendDanglingObjectEn(wMid) + ' today.';
        viOut = 'Mọi người đều quan tâm đến ' + viPhraseComp + ' ngày nay.';
        keySpan = wMid;
      }
    }

    return {
      en: en.replace(/\s+/g, ' ').trim(),
      vi: viOut.replace(/\s+/g, ' ').trim(),
      keySpan: keySpan
    };
  }

  function buildInflectionPatternForWord(rawWord) {
    var tokens = String(rawWord || '').trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return null;

    // Strip leading "a ", "an ", "the ", "be ", "to " if optional
    var firstLower = tokens[0].toLowerCase();
    var startIdx = 0;
    if (tokens.length > 1 && (firstLower === 'a' || firstLower === 'an' || firstLower === 'the' || firstLower === 'to')) {
      startIdx = 1;
    }

    var parts = [];
    for (var i = startIdx; i < tokens.length; i++) {
      var tok = tokens[i];
      var tokLower = tok.toLowerCase();
      if (tokLower === 'sth' || tokLower === 'something') {
        parts.push('[A-Za-z0-9\'-]+(?:\\s+[A-Za-z0-9\'-]+){0,2}');
        continue;
      }
      if (tokLower === 'sb' || tokLower === 'someone' || tokLower === "one's") {
        parts.push('[A-Za-z0-9\'-]+(?:\\s+[A-Za-z0-9\'-]+){0,1}');
        continue;
      }
      var variants = [escapeRegex(tok)];
      if (IRREGULAR_VERBS[tokLower]) {
        for (var iv = 0; iv < IRREGULAR_VERBS[tokLower].length; iv++) {
          variants.push(escapeRegex(IRREGULAR_VERBS[tokLower][iv]));
        }
      } else if (i === startIdx && /^[a-z]+$/i.test(tok) && tok.length >= 3) {
        variants.push(escapeRegex(tok) + '(?:s|es|ed|d|ing)');
        if (/y$/i.test(tok)) {
          variants.push(escapeRegex(tok.slice(0, -1)) + '(?:ies|ied)');
        }
        if (/e$/i.test(tok)) {
          variants.push(escapeRegex(tok.slice(0, -1)) + 'ing');
        }
      }
      parts.push('(?:' + variants.join('|') + ')');
      // Allow optional pronoun/determiner between verb and noun/particle (e.g. "do me a favour", "achieve his goals")
      if (i === startIdx && tokens.length - startIdx >= 2) {
        parts.push('(?:\\s+(?:me|you|him|her|us|them|my|your|his|her|our|their|a|an|the))?');
      }
    }

    var regexStr = '\\b' + parts.join('\\s+') + '\\b';
    return new RegExp(regexStr, 'i');
  }

  function buildClozeFromExample(item, unit, seedIdx) {
    if (item.hasRealExample) {
      var ex = item.example;
      var candidates = [item.cleanWord].concat(item.acceptedWords || []);
      for (var i = 0; i < candidates.length; i++) {
        var cand = candidates[i];
        if (!cand) continue;
        // Exact match first
        var exactRe = new RegExp('\\b' + escapeRegex(cand) + '\\b', 'i');
        var m = ex.match(exactRe);
        if (!m) {
          var infRe = buildInflectionPatternForWord(cand);
          if (infRe) m = ex.match(infRe);
        }
        if (m && typeof m.index === 'number') {
          var matchedSpan = m[0];
          var blanked = ex.slice(0, m.index) + '______' + ex.slice(m.index + matchedSpan.length);
          var acc = [matchedSpan, item.cleanWord].concat(item.acceptedWords || []);
          var uniqAcc = [];
          for (var a = 0; a < acc.length; a++) {
            var v = String(acc[a] || '').trim();
            if (v && uniqAcc.indexOf(v) === -1) uniqAcc.push(v);
          }
          return {
            enWithBlank: blanked,
            blankAnswer: matchedSpan,
            acceptedAnswers: uniqAcc,
            viContext: 'Chọn từ/cụm từ mang nghĩa: "' + item.shortVi + '"' +
              (item.meaningVi !== item.shortVi ? ' (' + item.meaningVi + ')' : ''),
            fullEn: ex,
            sourceType: 'real_example'
          };
        }
      }
    }

    // Fallback to deterministic POS-synthesized sentence
    var synth = synthesizeBilingualPair(item, unit, seedIdx);
    var span = synth.keySpan || item.cleanWord;
    var spanRe = new RegExp('\\b' + escapeRegex(span) + '\\b', 'i');
    var matchSynth = synth.en.match(spanRe);
    var enBlank = matchSynth
      ? synth.en.slice(0, matchSynth.index) + '______' + synth.en.slice(matchSynth.index + matchSynth[0].length)
      : '______ — ' + synth.en;
    var answerText = matchSynth ? matchSynth[0] : span;
    var accSynth = [answerText, item.cleanWord].concat(item.acceptedWords || []);
    return {
      enWithBlank: enBlank,
      blankAnswer: answerText,
      acceptedAnswers: accSynth,
      viContext: synth.vi + ' [Gợi ý nghĩa: "' + item.shortVi + '"]',
      fullEn: synth.en,
      sourceType: 'synthesized'
    };
  }

  // ==================== Normalization & Fuzzy Grading ====================

  function normalizeEnglishAnswer(str) {
    var s = String(str == null ? '' : str)
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .trim()
      .toLowerCase();
    for (var i = 0; i < CONTRACTIONS.length; i++) {
      s = s.replace(CONTRACTIONS[i][0], CONTRACTIONS[i][1]);
    }
    s = s.replace(/[.,!?;:"'()\[\]{}]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  function tokenizeSentenceForTiles(sentence) {
    var cleaned = String(sentence || '').replace(/[.!?]+$/g, '').replace(/,/g, '').trim();
    return cleaned.split(/\s+/).filter(Boolean);
  }

  function computeWordLcsDiff(userWords, targetWords) {
    var m = userWords.length;
    var n = targetWords.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1);
      for (var j = 0; j <= n; j++) dp[i][j] = 0;
    }
    for (var i2 = 1; i2 <= m; i2++) {
      for (var j2 = 1; j2 <= n; j2++) {
        if (userWords[i2 - 1] === targetWords[j2 - 1]) {
          dp[i2][j2] = dp[i2 - 1][j2 - 1] + 1;
        } else {
          dp[i2][j2] = Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
        }
      }
    }

    // Backtrack for diff
    var diff = [];
    var x = m;
    var y = n;
    while (x > 0 || y > 0) {
      if (x > 0 && y > 0 && userWords[x - 1] === targetWords[y - 1]) {
        diff.unshift({ type: 'match', word: targetWords[y - 1] });
        x--;
        y--;
      } else if (y > 0 && (x === 0 || dp[x][y - 1] >= dp[x - 1][y])) {
        diff.unshift({ type: 'missing', word: targetWords[y - 1] });
        y--;
      } else {
        diff.unshift({ type: 'extra', word: userWords[x - 1] });
        x--;
      }
    }

    return {
      lcsLen: dp[m][n],
      diff: diff
    };
  }

  function evaluateTranslationText(userText, targetEn, keywords, acceptedAlternates) {
    var normUser = normalizeEnglishAnswer(userText);
    var normTarget = normalizeEnglishAnswer(targetEn);

    if (!normUser) {
      return {
        accuracy: 0,
        keywordCoverage: 0,
        diff: normalizeEnglishAnswer(targetEn).split(/\s+/).filter(Boolean).map(function (w) {
          return { type: 'missing', word: w };
        }),
        isExact: false,
        isCorrect: false,
        isPartial: false
      };
    }

    // Check exact match with target or accepted alternates
    var alts = [normTarget];
    if (Array.isArray(acceptedAlternates)) {
      for (var a = 0; a < acceptedAlternates.length; a++) {
        var na = normalizeEnglishAnswer(acceptedAlternates[a]);
        if (na && alts.indexOf(na) === -1) alts.push(na);
      }
    }

    if (alts.indexOf(normUser) !== -1) {
      var exactWords = normUser.split(/\s+/).filter(Boolean);
      return {
        accuracy: 100,
        keywordCoverage: 100,
        diff: exactWords.map(function (w) { return { type: 'match', word: w }; }),
        isExact: true,
        isCorrect: true,
        isPartial: false
      };
    }

    var userWords = normUser.split(/\s+/).filter(Boolean);
    var targetWords = normTarget.split(/\s+/).filter(Boolean);
    var lcsRes = computeWordLcsDiff(userWords, targetWords);
    var f1 = (userWords.length + targetWords.length) > 0
      ? (2 * lcsRes.lcsLen) / (userWords.length + targetWords.length)
      : 0;

    // Keyword coverage
    var kwList = (Array.isArray(keywords) ? keywords : []).map(normalizeEnglishAnswer).filter(Boolean);
    var kwHit = 0;
    if (kwList.length) {
      for (var k = 0; k < kwList.length; k++) {
        if (normUser.indexOf(kwList[k]) !== -1) {
          kwHit++;
        } else {
          // Token-level partial match for multi-word keywords
          var kwToks = kwList[k].split(/\s+/);
          var matchedToks = 0;
          for (var kt = 0; kt < kwToks.length; kt++) {
            if (userWords.indexOf(kwToks[kt]) !== -1) matchedToks++;
          }
          if (kwToks.length && matchedToks / kwToks.length >= 0.7) {
            kwHit += 0.7;
          }
        }
      }
    }
    var kwScore = kwList.length ? (kwHit / kwList.length) : f1;
    var rawAccuracy = Math.round((0.7 * f1 + 0.3 * kwScore) * 100);
    rawAccuracy = Math.max(0, Math.min(100, rawAccuracy));

    var kwPct = Math.round(kwScore * 100);
    return {
      accuracy: rawAccuracy,
      keywordCoverage: kwPct,
      diff: lcsRes.diff,
      isExact: false,
      isCorrect: rawAccuracy >= 80,
      isPartial: rawAccuracy >= 55 && rawAccuracy < 80
    };
  }

  // ==================== Distractor Selection (Dual Dedup) ====================

  function pickUniqueItems(pool, count, rng, excludeWords, excludeShortVis) {
    var usedWords = {};
    var usedVis = {};
    if (Array.isArray(excludeWords)) {
      for (var i = 0; i < excludeWords.length; i++) {
        usedWords[String(excludeWords[i] || '').toLowerCase()] = true;
      }
    }
    if (Array.isArray(excludeShortVis)) {
      for (var j = 0; j < excludeShortVis.length; j++) {
        usedVis[String(excludeShortVis[j] || '').toLowerCase()] = true;
      }
    }

    var shuffled = shuffleWithRng(pool, rng);
    var picked = [];
    for (var k = 0; k < shuffled.length && picked.length < count; k++) {
      var item = shuffled[k];
      var wKey = item.cleanWord.toLowerCase();
      var vKey = item.shortVi.toLowerCase();
      if (usedWords[wKey] || usedVis[vKey]) continue;
      usedWords[wKey] = true;
      usedVis[vKey] = true;
      picked.push(item);
    }
    return picked;
  }

  function buildMcqOptionsForItem(targetItem, targetLabel, unitWords, rng, preferSamePos) {
    var samePos = preferSamePos
      ? unitWords.filter(function (w) { return w.pos === targetItem.pos && w.id !== targetItem.id; })
      : [];
    var otherPool = unitWords.filter(function (w) { return w.id !== targetItem.id; });

    var distractors = pickUniqueItems(
      samePos,
      3,
      rng,
      [targetItem.cleanWord, targetLabel],
      [targetItem.shortVi]
    );
    if (distractors.length < 3) {
      var extra = pickUniqueItems(
        otherPool,
        3 - distractors.length,
        rng,
        [targetItem.cleanWord, targetLabel].concat(distractors.map(function (d) { return d.cleanWord; })),
        [targetItem.shortVi].concat(distractors.map(function (d) { return d.shortVi; }))
      );
      distractors = distractors.concat(extra);
    }

    var rawOpts = [{ text: targetLabel, isCorrect: true }];
    for (var i = 0; i < distractors.length; i++) {
      rawOpts.push({ text: distractors[i].cleanWord, isCorrect: false });
    }
    var shuffled = shuffleWithRng(rawOpts, rng);
    var correctIndex = 0;
    var labels = [];
    for (var j = 0; j < shuffled.length; j++) {
      labels.push(shuffled[j].text);
      if (shuffled[j].isCorrect) correctIndex = j;
    }
    return {
      options: labels,
      correctIndex: correctIndex
    };
  }

  // ==================== 8 Mode Question Generators ====================

  function buildWordTilesQuestions(unit, count, rng) {
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var allSingleTokens = [];
    for (var u = 0; u < unit.words.length; u++) {
      var toks = unit.words[u].cleanWord.split(/\s+/);
      for (var t = 0; t < toks.length; t++) {
        var cleanTok = toks[t].replace(/[^A-Za-z'-]/g, '');
        if (cleanTok.length >= 2) allSingleTokens.push(cleanTok);
      }
    }

    var questions = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var pair = synthesizeBilingualPair(item, unit, i);
      var targetTokens = tokenizeSentenceForTiles(pair.en);
      // Ensure 4-10 tokens cleanly
      var targetSet = {};
      for (var k = 0; k < targetTokens.length; k++) {
        targetSet[targetTokens[k].toLowerCase()] = true;
      }

      var tiles = [];
      for (var j = 0; j < targetTokens.length; j++) {
        tiles.push({
          tileId: 't_' + j,
          text: targetTokens[j],
          isDistractor: false
        });
      }

      // Add 2-3 distractor tiles not present in targetTokens
      var distractorPool = shuffleWithRng(allSingleTokens, rng);
      var addedDist = 0;
      for (var d = 0; d < distractorPool.length && addedDist < 2; d++) {
        var cand = distractorPool[d];
        if (!targetSet[cand.toLowerCase()]) {
          targetSet[cand.toLowerCase()] = true;
          tiles.push({
            tileId: 't_' + tiles.length,
            text: cand,
            isDistractor: true
          });
          addedDist++;
        }
      }

      questions.push({
        id: 'wt_' + i,
        itemId: item.id,
        word: item.cleanWord,
        pos: item.pos,
        promptVi: pair.vi,
        hintVi: item.shortVi,
        targetEn: pair.en,
        targetTokens: targetTokens,
        tiles: shuffleWithRng(tiles, rng),
        hintRevealed: false,
        answered: false
      });
    }
    return questions;
  }

  function buildClozeQuestions(unit, count, rng) {
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var questions = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var cloze = buildClozeFromExample(item, unit, i);
      var mcq = buildMcqOptionsForItem(item, cloze.blankAnswer, unit.words, rng, true);
      questions.push({
        id: 'clz_' + i,
        itemId: item.id,
        word: item.cleanWord,
        pos: item.pos,
        viContext: cloze.viContext,
        enWithBlank: cloze.enWithBlank,
        blankAnswer: cloze.blankAnswer,
        acceptedAnswers: cloze.acceptedAnswers,
        fullEn: cloze.fullEn,
        options: mcq.options,
        correctIndex: mcq.correctIndex,
        hintRevealed: false,
        answered: false
      });
    }
    return questions;
  }

  function buildSpeedBlitzQuestions(unit, count, rng) {
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var questions = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var mcq = buildMcqOptionsForItem(item, item.cleanWord, unit.words, rng, false);
      questions.push({
        id: 'sb_' + i,
        itemId: item.id,
        promptVi: item.shortVi,
        meaningVi: item.meaningVi,
        pos: item.pos,
        targetEn: item.cleanWord,
        options: mcq.options,
        correctIndex: mcq.correctIndex,
        answered: false
      });
    }
    return questions;
  }

  function buildMatchPairsBoard(unit, pairCount, rng) {
    var chosen = pickUniqueItems(unit.words, pairCount, rng, [], []);
    var pairs = [];
    var viItems = [];
    var enItems = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var pairId = 'p_' + i;
      pairs.push({
        pairId: pairId,
        vi: item.shortVi,
        en: item.cleanWord,
        pos: item.pos
      });
      viItems.push({ pairId: pairId, label: item.shortVi, matched: false });
      enItems.push({ pairId: pairId, label: item.cleanWord, matched: false });
    }
    return {
      pairs: pairs,
      viItems: shuffleWithRng(viItems, rng),
      enItems: shuffleWithRng(enItems, rng)
    };
  }

  function buildTypeTranslationQuestions(unit, count, rng) {
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var questions = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var pair = synthesizeBilingualPair(item, unit, i);
      var targetWordsCount = normalizeEnglishAnswer(pair.en).split(/\s+/).filter(Boolean).length;
      var rawAlts = [item.cleanWord].concat(item.acceptedWords || []);
      var acceptedAlts = [];
      if (targetWordsCount <= 1) {
        acceptedAlts = rawAlts;
      } else {
        // Do NOT accept isolated single-word/short keyword as 100% exact translation for a multi-word sentence
        for (var aa = 0; aa < rawAlts.length; aa++) {
          var altWordsCount = normalizeEnglishAnswer(rawAlts[aa]).split(/\s+/).filter(Boolean).length;
          if (altWordsCount >= 2 && altWordsCount >= targetWordsCount - 1) {
            acceptedAlts.push(rawAlts[aa]);
          }
        }
      }
      questions.push({
        id: 'tt_' + i,
        itemId: item.id,
        promptVi: pair.vi,
        shortVi: item.shortVi,
        pos: item.pos,
        targetEn: pair.en,
        keywords: [pair.keySpan || item.cleanWord],
        acceptedAlternates: acceptedAlts,
        hintText: '',
        hintUsed: false,
        answered: false
      });
    }
    return questions;
  }

  function buildFallingWordsPool(unit, count, rng) {
    // Allow cycling up to count items (deduplicated per unit first)
    var pool = pickUniqueItems(unit.words, Math.min(unit.words.length, Math.max(count, 12)), rng, [], []);
    return pool.map(function (item, idx) {
      return {
        id: 'fw_item_' + idx,
        vi: item.shortVi,
        en: item.cleanWord,
        acceptedEn: [item.cleanWord].concat(item.acceptedWords || []),
        pos: item.pos
      };
    });
  }

  function buildSpotFixQuestions(unit, count, rng) {
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var questions = [];

    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var pair = synthesizeBilingualPair(item, unit, i);
      var cleanEn = pair.en;
      var tokens = cleanEn.split(/\s+/);
      var errorKind = i % 3;

      var flawedTokens = tokens.slice();
      var faultIndex = -1;
      var faultyToken = '';
      var correctToken = '';
      var explanationVi = '';

      if (errorKind === 0) {
        // Error Type 1: Wrong unit vocab swap (semantic mistranslation)
        var keyTokens = String(pair.keySpan || item.cleanWord).split(/\s+/).filter(Boolean);
        var keyStart = 0;
        if (keyTokens.length > 1 && /^(a|an|the|to)$/i.test(keyTokens[0])) {
          keyStart = 1;
        }
        var targetFirst = (keyTokens[keyStart] || '').toLowerCase().replace(/[.,!?]+$/, '');
        var candFaultIdx = -1;
        for (var ti = 0; ti < tokens.length; ti++) {
          if (tokens[ti].toLowerCase().replace(/[.,!?]+$/, '') === targetFirst) {
            candFaultIdx = ti;
            break;
          }
        }
        if (candFaultIdx >= 0) {
          var candCorrect = tokens[candFaultIdx].replace(/[.,!?]+$/, '');
          var candCorrectLow = candCorrect.toLowerCase();
          var eligibleSamePos = unit.words.filter(function (w) {
            if (w.pos !== item.pos || w.id === item.id) return false;
            var wFirst = w.cleanWord.split(/\s+/)[0].toLowerCase().replace(/[.,!?]+$/, '');
            return Boolean(wFirst && wFirst !== targetFirst && wFirst !== candCorrectLow);
          });
          var swapCandidates = pickUniqueItems(eligibleSamePos, 1, rng, [item.cleanWord], [item.shortVi]);
          if (!swapCandidates.length) {
            var eligibleAnyPos = unit.words.filter(function (w) {
              if (w.id === item.id) return false;
              var wFirst = w.cleanWord.split(/\s+/)[0].toLowerCase().replace(/[.,!?]+$/, '');
              return Boolean(wFirst && wFirst !== targetFirst && wFirst !== candCorrectLow);
            });
            swapCandidates = pickUniqueItems(eligibleAnyPos, 1, rng, [item.cleanWord], [item.shortVi]);
          }
          if (swapCandidates.length) {
            var rawWrongFirst = swapCandidates[0].cleanWord.split(/\s+/)[0].replace(/[.,!?]+$/, '');
            var wrongWord = candFaultIdx > 0 ? lowerFirstSmart(rawWrongFirst) : capitalizeFirst(rawWrongFirst);
            if (wrongWord && wrongWord.toLowerCase() !== candCorrectLow) {
              faultIndex = candFaultIdx;
              var trailingPunct = (tokens[faultIndex].match(/[.,!?]+$/) || [''])[0];
              correctToken = candCorrect;
              faultyToken = wrongWord + trailingPunct;
              flawedTokens[faultIndex] = faultyToken;
              explanationVi = 'Từ "' + wrongWord + '" mang nghĩa "' + swapCandidates[0].shortVi +
                '", không khớp với nghĩa "' + item.shortVi + '" ("' + correctToken + '").';
            }
          }
        }
      }

      if (faultIndex < 0 && errorKind !== 2) {
        // Error Type 2: Grammar / agreement / modal error
        for (var g = 0; g < tokens.length; g++) {
          var low = tokens[g].toLowerCase();
          if (low === 'is') {
            faultIndex = g;
            correctToken = 'is';
            faultyToken = 'are';
            flawedTokens[g] = 'are';
            explanationVi = 'Chủ ngữ số ít phải đi với động từ "is", không dùng "are".';
            break;
          } else if (low === 'are') {
            faultIndex = g;
            correctToken = 'are';
            faultyToken = 'is';
            flawedTokens[g] = 'is';
            explanationVi = 'Chủ ngữ số nhiều phải đi với động từ "are", không dùng "is".';
            break;
          } else if (low === 'should') {
            faultIndex = g;
            correctToken = 'should';
            faultyToken = 'shoulds';
            flawedTokens[g] = 'shoulds';
            explanationVi = 'Động từ khuyết thiếu "should" không chia "-s".';
            break;
          } else if (low === 'plays') {
            faultIndex = g;
            correctToken = 'plays';
            faultyToken = 'play';
            flawedTokens[g] = 'play';
            explanationVi = 'Chủ ngữ số ít ở hiện tại đơn cần chia động từ "plays".';
            break;
          } else if (low === 'very') {
            faultIndex = g;
            correctToken = 'very';
            faultyToken = 'much';
            flawedTokens[g] = 'much';
            explanationVi = 'Trước tính từ dùng "very", không dùng "much".';
            break;
          }
        }
      }

      if (faultIndex < 0) {
        // Error Type 3: Polarity / negation inversion or determiner mismatch
        var insertedPolarity = false;
        for (var p = 0; p < tokens.length; p++) {
          var pLow = tokens[p].toLowerCase();
          if (pLow === 'should' || pLow === 'can' || pLow === 'are' || pLow === 'is' || pLow === 'often') {
            faultIndex = p;
            correctToken = tokens[p];
            faultyToken = tokens[p] + ' not';
            flawedTokens[p] = faultyToken;
            // Re-split cleanly so each segment is 1 token where "not" is the fault
            flawedTokens = flawedTokens.join(' ').split(/\s+/);
            faultIndex = p + 1;
            faultyToken = 'not';
            correctToken = '(bỏ "not")';
            explanationVi = 'Câu tiếng Việt mang nghĩa khẳng định, thêm "not" làm ngược nghĩa câu.';
            insertedPolarity = true;
            break;
          }
        }
        if (!insertedPolarity) {
          // Safe fallback: swap first token with wrong pronoun/negation
          faultIndex = 0;
          correctToken = tokens[0];
          var badFirst = tokens[0].toLowerCase() === 'never' ? 'Always' : 'Never';
          faultyToken = badFirst;
          flawedTokens[0] = badFirst;
          explanationVi = 'Từ đầu câu bị sai thành "' + badFirst + '" làm sai nghĩa gốc.';
        }
      }

      var flawedEn = flawedTokens.join(' ');
      var segments = flawedTokens.map(function (tok, sIdx) {
        return { index: sIdx, text: tok };
      });

      // Build 4 quick-fix options with strictly unique fix targets (avoiding multi-word truncation duplicates)
      var usedFixKeys = {};
      usedFixKeys[correctToken.toLowerCase().replace(/[.,!?]+$/, '')] = true;
      usedFixKeys[String(flawedTokens[faultIndex] || '').toLowerCase().replace(/[.,!?]+$/, '')] = true;

      var shuffledPool = shuffleWithRng(unit.words.filter(function (w) { return w.id !== item.id; }), rng);
      var altFixes = [];
      for (var ap = 0; ap < shuffledPool.length && altFixes.length < 3; ap++) {
        var candWord = String(shuffledPool[ap].cleanWord || '').trim();
        var candKey = candWord.toLowerCase().replace(/[.,!?]+$/, '');
        if (!candKey || usedFixKeys[candKey]) continue;
        usedFixKeys[candKey] = true;
        altFixes.push(candWord);
      }
      var fallbackFixes = ['change', 'check', 'review', 'improve', 'keep'];
      for (var fbIdx = 0; fbIdx < fallbackFixes.length && altFixes.length < 3; fbIdx++) {
        var fTok = fallbackFixes[fbIdx];
        if (!usedFixKeys[fTok]) {
          usedFixKeys[fTok] = true;
          altFixes.push(fTok);
        }
      }

      var rawFixOpts = [{
        label: 'Sửa vị trí #' + (faultIndex + 1) + ' "' + flawedTokens[faultIndex] + '" → "' + correctToken + '"',
        faultIndex: faultIndex,
        fix: correctToken,
        isCorrect: true
      }];
      for (var af = 0; af < altFixes.length; af++) {
        var fakeIdx = (faultIndex + af + 1) % flawedTokens.length;
        rawFixOpts.push({
          label: 'Sửa vị trí #' + (fakeIdx + 1) + ' "' + flawedTokens[fakeIdx] + '" → "' + altFixes[af] + '"',
          faultIndex: fakeIdx,
          fix: altFixes[af],
          isCorrect: false
        });
      }
      var shuffledOpts = shuffleWithRng(rawFixOpts, rng);
      var correctOptIdx = 0;
      for (var so = 0; so < shuffledOpts.length; so++) {
        if (shuffledOpts[so].isCorrect) correctOptIdx = so;
      }

      questions.push({
        id: 'sf_' + i,
        itemId: item.id,
        viSource: pair.vi,
        flawedEn: flawedEn,
        fullCorrectedEn: cleanEn,
        segments: segments,
        faultIndex: faultIndex,
        faultyToken: flawedTokens[faultIndex],
        correctToken: correctToken,
        explanationVi: explanationVi,
        options: shuffledOpts,
        correctOptionIndex: correctOptIdx,
        answered: false
      });
    }

    return questions;
  }

  function buildDialogueChainTurns(unit, turnsCount, rng) {
    var count = Math.max(4, Math.min(6, turnsCount || 5));
    var chosen = pickUniqueItems(unit.words, count, rng, [], []);
    var speakers = ['Minh', 'Lan', 'Minh', 'Lan', 'Minh', 'Lan'];
    var connectorsVi = [
      'Trong chủ đề ' + unit.themeViSentence + ', ',
      'Ngoài ra, ',
      'Vì vậy, ',
      'Thật vậy, ',
      'Cuối cùng, ',
      'Nhờ đó, '
    ];
    var connectorsEn = [
      'In ' + unit.themeEnSentence + ', ',
      'Also, ',
      'Therefore, ',
      'Indeed, ',
      'Finally, ',
      'As a result, '
    ];

    var turns = [];
    for (var i = 0; i < chosen.length; i++) {
      var item = chosen[i];
      var pair = synthesizeBilingualPair(item, unit, i + 1);
      var lineVi = connectorsVi[i] + lowerFirstSmart(pair.vi);
      var targetEn = connectorsEn[i] + lowerFirstSmart(pair.en);

      // Build 3 distractor English lines using other unit items
      var distractorItems = pickUniqueItems(
        unit.words.filter(function (w) { return w.id !== item.id; }),
        3,
        rng,
        [item.cleanWord],
        [item.shortVi]
      );
      var rawOpts = [{ text: targetEn, isCorrect: true }];
      for (var d = 0; d < distractorItems.length; d++) {
        var dPair = synthesizeBilingualPair(distractorItems[d], unit, i + d + 2);
        var dEn = connectorsEn[i] + lowerFirstSmart(dPair.en);
        rawOpts.push({ text: dEn, isCorrect: false });
      }
      var shuffled = shuffleWithRng(rawOpts, rng);
      var correctOptIdx = 0;
      var optLabels = [];
      for (var o = 0; o < shuffled.length; o++) {
        optLabels.push(shuffled[o].text);
        if (shuffled[o].isCorrect) correctOptIdx = o;
      }

      turns.push({
        id: 'dc_' + i,
        turnIndex: i,
        speaker: speakers[i % speakers.length],
        itemId: item.id,
        keyword: item.cleanWord,
        lineVi: lineVi,
        targetEn: targetEn,
        options: optLabels,
        correctOptionIndex: correctOptIdx,
        answered: false
      });
    }
    return turns;
  }

  // ==================== Falling Words Helpers ====================

  function buildFallingLiveOptions() {
    if (!state.fallingState || !state._unit) return [];
    var active = state.fallingState.activeWords || [];
    var opts = [];
    var usedWords = {};
    var usedVis = {};

    for (var i = 0; i < active.length && opts.length < 4; i++) {
      var aw = active[i];
      var key = aw.en.toLowerCase();
      if (!usedWords[key]) {
        usedWords[key] = true;
        usedVis[aw.vi.toLowerCase()] = true;
        opts.push(aw.en);
      }
    }

    if (opts.length < 4 && state._rng) {
      var fill = pickUniqueItems(
        state._unit.words,
        4 - opts.length,
        state._rng,
        Object.keys(usedWords),
        Object.keys(usedVis)
      );
      for (var j = 0; j < fill.length; j++) {
        opts.push(fill[j].cleanWord);
      }
    }

    return state._rng ? shuffleWithRng(opts, state._rng) : opts;
  }

  function spawnFallingWordIfNeeded() {
    if (!state.fallingState || !state._fallingPool.length) return;
    var active = state.fallingState.activeWords;
    if (active.length >= 3) return;

    var poolItem = state._fallingPool[state._fallingNextIdx % state._fallingPool.length];
    state._fallingNextIdx++;
    state._fallingSpawnIdCounter++;

    var wave = state.fallingState.wave || 1;
    var speed = 12 + (wave - 1) * 2.5;
    var x = 10 + Math.floor((state._rng ? state._rng() : Math.random()) * 70);

    active.push({
      wordId: 'fw_' + state._fallingSpawnIdCounter,
      vi: poolItem.vi,
      en: poolItem.en,
      acceptedEn: poolItem.acceptedEn,
      y: 0,
      x: x,
      speed: speed
    });
  }

  function syncFallingCurrentQuestion() {
    if (!state.fallingState) return;
    var opts = buildFallingLiveOptions();
    var target = state.fallingState.activeWords[0] || null;
    state.currentQuestion = {
      id: 'fw_live',
      activeCount: state.fallingState.activeWords.length,
      lowestWord: target ? target.vi : '',
      options: opts
    };
  }

  // ==================== Timer Management ====================

  function stopTimers() {
    if (blitzIntervalId !== null) {
      clearInterval(blitzIntervalId);
      blitzIntervalId = null;
    }
    if (fallingRafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(fallingRafId);
      fallingRafId = null;
    }
    if (fallingIntervalId !== null) {
      clearInterval(fallingIntervalId);
      fallingIntervalId = null;
    }
    lastFallingTs = 0;
  }

  function startBrowserTimersIfNeeded() {
    stopTimers();
    if (typeof document === 'undefined') return;
    if (state._options && state._options.manualTick) return;
    if (state._options && state._options.autoStartTimers === false) return;

    if (state.mode === 'speed_blitz' && typeof setInterval === 'function') {
      blitzIntervalId = setInterval(function () {
        if (state.status !== 'playing' || state.mode !== 'speed_blitz') {
          stopTimers();
          return;
        }
        tickTimer(100);
      }, 100);
    } else if (state.mode === 'falling_words') {
      if (typeof requestAnimationFrame === 'function') {
        lastFallingTs = Date.now();
        var step = function () {
          if (state.status !== 'playing' || state.mode !== 'falling_words') {
            stopTimers();
            return;
          }
          var now = Date.now();
          var rawDt = now - lastFallingTs;
          lastFallingTs = now;
          // Cap frame delta on tab resume so switching tabs never instant-kills lives
          var clampedDt = Math.max(0, Math.min(rawDt, 100));
          tickFallingWords(clampedDt);
          if (state.status === 'playing') {
            fallingRafId = requestAnimationFrame(step);
          }
        };
        fallingRafId = requestAnimationFrame(step);
      } else if (typeof setInterval === 'function') {
        fallingIntervalId = setInterval(function () {
          if (state.status !== 'playing' || state.mode !== 'falling_words') {
            stopTimers();
            return;
          }
          tickFallingWords(100);
        }, 100);
      }
    }
  }

  // ==================== Core Game Lifecycle ====================

  function isValidMode(modeId) {
    for (var i = 0; i < MODES.length; i++) {
      if (MODES[i].id === modeId) return true;
    }
    return false;
  }

  function recomputeAccuracy() {
    var totalAttempts = state.correctCount + state.wrongCount;
    state.accuracy = totalAttempts > 0 ? Math.round((state.correctCount / totalAttempts) * 100) : 0;
  }

  function startGame(mode, unitId, options) {
    stopTimers();
    var opts = options || {};
    var appDataOverride = opts.appData || null;

    var chosenMode = isValidMode(mode) ? mode : 'word_tiles';
    var unit = resolveUnit(unitId, appDataOverride);
    if (!unit) {
      throw new Error('Cannot resolve unit: ' + String(unitId));
    }

    var seedNum = opts.seed != null ? hashSeed(opts.seed) : hashSeed(Date.now() + ':' + chosenMode + ':' + unit.unitId);
    var rng = createMulberry32(seedNum);

    state = createIdleState();
    state.status = 'playing';
    state.mode = chosenMode;
    state.unitId = unit.unitId;
    state.unitNumber = unit.unitNumber;
    state.unitTitle = unit.unitTitle;
    state.seed = seedNum;
    state._rng = rng;
    state._options = opts;
    state._unit = unit;

    var qCount;
    if (chosenMode === 'match_pairs') {
      qCount = Math.max(4, Math.min(8, opts.questionCount || opts.pairCount || 6, unit.words.length));
      var board = buildMatchPairsBoard(unit, qCount, rng);
      state.totalQuestions = qCount;
      state.maxScore = qCount * 100 + 150;
      state.matchState = {
        pairsTotal: qCount,
        matchedPairIds: [],
        selectedViId: null,
        selectedEnId: null,
        moves: 0,
        errors: 0,
        viItems: board.viItems,
        enItems: board.enItems
      };
      state.currentQuestion = {
        id: 'mp_board',
        viItems: board.viItems,
        enItems: board.enItems
      };
    } else if (chosenMode === 'speed_blitz') {
      qCount = Math.max(4, Math.min(unit.words.length, opts.questionCount || 15));
      var durationSec = (typeof opts.durationSec === 'number' && opts.durationSec > 0) ? opts.durationSec : 60;
      state._questions = buildSpeedBlitzQuestions(unit, qCount, rng);
      state.totalQuestions = state._questions.length;
      state.remainingMs = Math.round(durationSec * 1000);
      state.maxScore = state.totalQuestions * 150;
      state.currentQuestion = state._questions[0] || null;
    } else if (chosenMode === 'falling_words') {
      var targetCatches = Math.max(4, Math.min(30, opts.questionCount || 12));
      var maxLives = Math.max(1, Math.min(5, opts.lives || 3));
      state._fallingPool = buildFallingWordsPool(unit, targetCatches, rng);
      state.totalQuestions = targetCatches;
      state.maxScore = targetCatches * 160;
      state.fallingState = {
        lives: maxLives,
        maxLives: maxLives,
        wave: 1,
        caughtCount: 0,
        missedCount: 0,
        targetCatches: targetCatches,
        activeWords: [],
        speedMultiplier: 1,
        spawnCooldownMs: 1400
      };
      spawnFallingWordIfNeeded();
      syncFallingCurrentQuestion();
    } else if (chosenMode === 'dialogue_chain') {
      qCount = Math.max(4, Math.min(6, opts.questionCount || 5, unit.words.length));
      var turns = buildDialogueChainTurns(unit, qCount, rng);
      state._questions = turns;
      state.totalQuestions = turns.length;
      state.maxScore = turns.length * 115 + 50;
      state.dialogueState = {
        completedTurns: [],
        currentTurnIndex: 0,
        totalTurns: turns.length
      };
      state.currentQuestion = turns[0] || null;
    } else if (chosenMode === 'word_tiles') {
      qCount = Math.max(2, Math.min(unit.words.length, opts.questionCount || 8));
      state._questions = buildWordTilesQuestions(unit, qCount, rng);
      state.totalQuestions = state._questions.length;
      state.maxScore = state.totalQuestions * 130;
      state.tilesState = { selectedTileIds: [] };
      state.currentQuestion = state._questions[0] || null;
    } else if (chosenMode === 'cloze') {
      qCount = Math.max(2, Math.min(unit.words.length, opts.questionCount || 8));
      state._questions = buildClozeQuestions(unit, qCount, rng);
      state.totalQuestions = state._questions.length;
      state.maxScore = state.totalQuestions * 130;
      state.currentQuestion = state._questions[0] || null;
    } else if (chosenMode === 'type_translation') {
      qCount = Math.max(2, Math.min(unit.words.length, opts.questionCount || 8));
      state._questions = buildTypeTranslationQuestions(unit, qCount, rng);
      state.totalQuestions = state._questions.length;
      state.maxScore = state.totalQuestions * 120;
      state.currentQuestion = state._questions[0] || null;
    } else if (chosenMode === 'spot_fix') {
      qCount = Math.max(2, Math.min(unit.words.length, opts.questionCount || 8));
      state._questions = buildSpotFixQuestions(unit, qCount, rng);
      state.totalQuestions = state._questions.length;
      state.maxScore = state.totalQuestions * 130;
      state.currentQuestion = state._questions[0] || null;
    }

    startBrowserTimersIfNeeded();
    renderAll();
    return getState();
  }

  // ==================== Word Tiles Controls ====================

  function selectTile(tileId) {
    if (state.status !== 'playing' || state.mode !== 'word_tiles' || !state.currentQuestion) return getState();
    if (state.currentQuestion.answered) return getState();
    var exists = false;
    for (var i = 0; i < state.currentQuestion.tiles.length; i++) {
      if (state.currentQuestion.tiles[i].tileId === tileId) {
        exists = true;
        break;
      }
    }
    if (!exists) return getState();
    if (state.tilesState.selectedTileIds.indexOf(tileId) === -1) {
      state.tilesState.selectedTileIds.push(tileId);
      renderStage();
    }
    return getState();
  }

  function undoTile() {
    if (state.status !== 'playing' || state.mode !== 'word_tiles' || !state.tilesState) return getState();
    if (state.currentQuestion && state.currentQuestion.answered) return getState();
    if (state.tilesState.selectedTileIds.length > 0) {
      state.tilesState.selectedTileIds.pop();
      renderStage();
    }
    return getState();
  }

  function clearTiles() {
    if (state.status !== 'playing' || state.mode !== 'word_tiles' || !state.tilesState) return getState();
    if (state.currentQuestion && state.currentQuestion.answered) return getState();
    state.tilesState.selectedTileIds = [];
    renderStage();
    return getState();
  }

  function useHint() {
    if (state.status !== 'playing' || !state.currentQuestion) return null;
    var q = state.currentQuestion;
    if (state.mode === 'type_translation') {
      q.hintUsed = true;
      var words = String(q.targetEn || '').replace(/[.!?]+$/, '').split(/\s+/).filter(Boolean);
      var masked = words.map(function (w) {
        return w.length <= 2 ? w.charAt(0) + '_' : (w.charAt(0) + '___' + w.charAt(w.length - 1));
      }).join(' ');
      q.hintText = 'Số từ: ' + words.length + ' | Từ khóa: "' + (q.keywords[0] || '') + '" | Dạng: ' + masked;
      renderStage();
      return q.hintText;
    }
    if (state.mode === 'word_tiles') {
      q.hintRevealed = true;
      var firstTileText = q.targetTokens[0] || '';
      var msg = 'Từ đầu câu: "' + firstTileText + '" (' + q.targetTokens.length + ' từ)';
      q.hintText = msg;
      renderStage();
      return msg;
    }
    if (state.mode === 'cloze') {
      q.hintRevealed = true;
      var cMsg = 'Nghĩa: "' + q.viContext + '" — Bắt đầu bằng "' + String(q.blankAnswer || '').slice(0, 2) + '..."';
      q.hintText = cMsg;
      renderStage();
      return cMsg;
    }
    return null;
  }

  // ==================== Submit Answer Handlers ====================

  function submitAnswer(payload) {
    if (state.status !== 'playing') {
      return { error: 'Game is not active', status: state.status };
    }
    var p = payload || {};
    var res;

    if (state.mode === 'word_tiles') {
      res = handleWordTilesSubmit(p);
    } else if (state.mode === 'cloze') {
      res = handleClozeSubmit(p);
    } else if (state.mode === 'speed_blitz') {
      res = handleSpeedBlitzSubmit(p);
    } else if (state.mode === 'match_pairs') {
      res = handleMatchPairsSubmit(p);
    } else if (state.mode === 'type_translation') {
      res = handleTypeTranslationSubmit(p);
    } else if (state.mode === 'falling_words') {
      res = handleFallingWordsSubmit(p);
    } else if (state.mode === 'spot_fix') {
      res = handleSpotFixSubmit(p);
    } else if (state.mode === 'dialogue_chain') {
      res = handleDialogueChainSubmit(p);
    } else {
      return { error: 'Unsupported mode' };
    }

    recomputeAccuracy();
    renderAll();
    return res;
  }

  function handleWordTilesSubmit(p) {
    var q = state.currentQuestion;
    if (!q || q.answered) return { alreadyAnswered: true, isCorrect: false };

    var userTokens = [];
    if (Array.isArray(p.tileIds)) {
      var seenTileIds = {};
      for (var i = 0; i < p.tileIds.length; i++) {
        var tid = p.tileIds[i];
        if (seenTileIds[tid]) continue;
        seenTileIds[tid] = true;
        for (var t = 0; t < q.tiles.length; t++) {
          if (q.tiles[t].tileId === tid) {
            userTokens.push(q.tiles[t].text);
            break;
          }
        }
      }
    } else if (typeof p.text === 'string') {
      userTokens = tokenizeSentenceForTiles(p.text);
    } else if (state.tilesState && state.tilesState.selectedTileIds.length) {
      for (var s = 0; s < state.tilesState.selectedTileIds.length; s++) {
        var stid = state.tilesState.selectedTileIds[s];
        for (var tt = 0; tt < q.tiles.length; tt++) {
          if (q.tiles[tt].tileId === stid) {
            userTokens.push(q.tiles[tt].text);
            break;
          }
        }
      }
    }

    var userStr = userTokens.join(' ').toLowerCase();
    var targetStr = q.targetTokens.join(' ').toLowerCase();
    var isExact = userStr === targetStr;

    var lcs = computeWordLcsDiff(
      userTokens.map(function (x) { return x.toLowerCase(); }),
      q.targetTokens.map(function (x) { return x.toLowerCase(); })
    );
    var acc = (userTokens.length + q.targetTokens.length) > 0
      ? Math.round((2 * lcs.lcsLen / (userTokens.length + q.targetTokens.length)) * 100)
      : 0;

    q.answered = true;
    var delta = 0;
    if (isExact) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100 + (state.streak - 1) * 15 - (q.hintRevealed ? 10 : 0);
      delta = Math.max(50, delta);
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
    }

    var feedback = {
      isCorrect: isExact,
      scoreDelta: delta,
      accuracy: isExact ? 100 : acc,
      userAnswer: userTokens.join(' '),
      correctAnswer: q.targetEn,
      orderDiff: lcs.diff,
      messageVi: isExact
        ? 'Chính xác! +' + delta + ' điểm'
        : (acc >= 75 ? 'Gần đúng trật tự từ (' + acc + '%). Đáp án: ' + q.targetEn : 'Chưa đúng. Đáp án: ' + q.targetEn)
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: isExact, scoreDelta: delta, userAnswer: feedback.userAnswer, correctAnswer: q.targetEn });
    return feedback;
  }

  function handleClozeSubmit(p) {
    var q = state.currentQuestion;
    if (!q || q.answered) return { alreadyAnswered: true, isCorrect: false };

    var chosenText = '';
    var chosenIndex = null;
    if (typeof p.optionIndex === 'number' && q.options[p.optionIndex] != null) {
      chosenIndex = p.optionIndex;
      chosenText = q.options[p.optionIndex];
    } else if (typeof p.selected === 'string') {
      chosenText = p.selected;
      chosenIndex = q.options.indexOf(p.selected);
    } else if (typeof p.text === 'string') {
      chosenText = p.text;
    }

    var normUser = normalizeEnglishAnswer(chosenText);
    var isCorrect = false;
    if (chosenIndex === q.correctIndex) {
      isCorrect = true;
    } else if (normUser) {
      var accepted = [q.blankAnswer].concat(q.acceptedAnswers || []);
      for (var i = 0; i < accepted.length; i++) {
        if (normalizeEnglishAnswer(accepted[i]) === normUser) {
          isCorrect = true;
          break;
        }
      }
    }

    q.answered = true;
    var delta = 0;
    if (isCorrect) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100 + (state.streak - 1) * 15;
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
    }

    var feedback = {
      isCorrect: isCorrect,
      scoreDelta: delta,
      chosenIndex: chosenIndex,
      correctIndex: q.correctIndex,
      userAnswer: chosenText,
      correctAnswer: q.blankAnswer,
      fullEn: q.fullEn,
      messageVi: isCorrect
        ? 'Chuẩn xác! +' + delta + ' điểm'
        : 'Chưa đúng. Đáp án đúng: "' + q.blankAnswer + '"'
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: isCorrect, scoreDelta: delta, userAnswer: chosenText, correctAnswer: q.blankAnswer });
    return feedback;
  }

  function handleSpeedBlitzSubmit(p) {
    var q = state.currentQuestion;
    if (!q) return { isCorrect: false };

    var chosenText = '';
    var chosenIndex = null;
    if (typeof p.optionIndex === 'number' && q.options[p.optionIndex] != null) {
      chosenIndex = p.optionIndex;
      chosenText = q.options[p.optionIndex];
    } else if (typeof p.selected === 'string') {
      chosenText = p.selected;
      chosenIndex = q.options.indexOf(p.selected);
    } else if (typeof p.text === 'string') {
      chosenText = p.text;
    }

    var isCorrect = chosenIndex === q.correctIndex ||
      (normalizeEnglishAnswer(chosenText) === normalizeEnglishAnswer(q.targetEn));

    var speedBonus = 0;
    var delta = 0;
    if (isCorrect) {
      speedBonus = state.questionElapsedMs < 2000 ? 50 : (state.questionElapsedMs < 4000 ? 25 : 0);
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100 + (state.streak - 1) * 20 + speedBonus;
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
    }

    var feedback = {
      isCorrect: isCorrect,
      scoreDelta: delta,
      speedBonus: speedBonus,
      userAnswer: chosenText,
      correctAnswer: q.targetEn,
      messageVi: isCorrect
        ? 'Nhanh & chuẩn! +' + delta + ' điểm' + (speedBonus ? ' (Thưởng tốc độ +' + speedBonus + ')' : '')
        : 'Sai rồi! Đáp án: ' + q.targetEn
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: isCorrect, scoreDelta: delta, userAnswer: chosenText, correctAnswer: q.targetEn });

    // Speed Blitz auto-advances immediately
    state.questionElapsedMs = 0;
    state.currentIndex++;
    if (state.currentIndex >= state._questions.length || (state.remainingMs != null && state.remainingMs <= 0)) {
      finishGame();
    } else {
      state.currentQuestion = state._questions[state.currentIndex];
    }
    return feedback;
  }

  function findMatchItem(list, pairId) {
    if (!Array.isArray(list) || !pairId) return null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].pairId === pairId) return list[i];
    }
    return null;
  }

  function handleMatchPairsSubmit(p) {
    var ms = state.matchState;
    if (!ms) return { isCorrect: false };

    // Handle click-selection shorthand from UI: { selectVi } or { selectEn }
    if (p.selectVi) {
      var selViItem = findMatchItem(ms.viItems, p.selectVi);
      if (!selViItem) return { isCorrect: false, error: 'Invalid pair selection' };
      if (selViItem.matched || ms.matchedPairIds.indexOf(p.selectVi) !== -1) {
        return { alreadyMatched: true, isCorrect: true };
      }
      ms.selectedViId = (ms.selectedViId === p.selectVi) ? null : p.selectVi;
      if (!ms.selectedEnId) {
        return { selected: true, selectedViId: ms.selectedViId };
      }
      p = { viId: ms.selectedViId, enId: ms.selectedEnId };
    } else if (p.selectEn) {
      var selEnItem = findMatchItem(ms.enItems, p.selectEn);
      if (!selEnItem) return { isCorrect: false, error: 'Invalid pair selection' };
      if (selEnItem.matched || ms.matchedPairIds.indexOf(p.selectEn) !== -1) {
        return { alreadyMatched: true, isCorrect: true };
      }
      ms.selectedEnId = (ms.selectedEnId === p.selectEn) ? null : p.selectEn;
      if (!ms.selectedViId) {
        return { selected: true, selectedEnId: ms.selectedEnId };
      }
      p = { viId: ms.selectedViId, enId: ms.selectedEnId };
    }

    var viId = p.viId || p.pairId || null;
    var enId = p.enId || p.pairId || null;

    if (typeof p.leftIndex === 'number' && ms.viItems[p.leftIndex]) {
      viId = ms.viItems[p.leftIndex].pairId;
    }
    if (typeof p.rightIndex === 'number' && ms.enItems[p.rightIndex]) {
      enId = ms.enItems[p.rightIndex].pairId;
    }

    ms.selectedViId = null;
    ms.selectedEnId = null;

    if (!viId || !enId) {
      return { isCorrect: false, error: 'Missing pair selection' };
    }

    var viItem = findMatchItem(ms.viItems, viId);
    var enItem = findMatchItem(ms.enItems, enId);
    if (!viItem || !enItem) {
      return { isCorrect: false, error: 'Invalid pair selection' };
    }

    if (ms.matchedPairIds.indexOf(viId) !== -1 || ms.matchedPairIds.indexOf(enId) !== -1 || viItem.matched || enItem.matched) {
      return { alreadyMatched: true, isCorrect: viId === enId };
    }

    ms.moves++;
    var isMatch = viId === enId;
    var delta = 0;
    if (isMatch) {
      ms.matchedPairIds.push(viId);
      for (var i = 0; i < ms.viItems.length; i++) {
        if (ms.viItems[i].pairId === viId) ms.viItems[i].matched = true;
      }
      for (var j = 0; j < ms.enItems.length; j++) {
        if (ms.enItems[j].pairId === enId) ms.enItems[j].matched = true;
      }
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100;
      state.score += delta;
    } else {
      ms.errors++;
      state.streak = 0;
      state.wrongCount++;
      var before = state.score;
      state.score = Math.max(0, state.score - 10);
      delta = state.score - before;
    }

    var finished = ms.matchedPairIds.length >= ms.pairsTotal;
    var bonus = 0;
    if (finished) {
      bonus = Math.max(0, 150 - ms.errors * 25 - Math.floor(state.elapsedMs / 1000));
      state.score += bonus;
    }

    var expectedEnItem = findMatchItem(ms.enItems, viId);
    var correctAnswerText = viItem.label + ' → ' + (expectedEnItem ? expectedEnItem.label : enItem.label);

    var feedback = {
      isCorrect: isMatch,
      matched: isMatch,
      scoreDelta: delta + bonus,
      bonus: bonus,
      moves: ms.moves,
      errors: ms.errors,
      matchedCount: ms.matchedPairIds.length,
      pairsTotal: ms.pairsTotal,
      finished: finished,
      messageVi: isMatch
        ? (finished ? 'Hoàn thành tất cả cặp! Thưởng +' + bonus + ' điểm' : 'Khớp cặp! +100 điểm')
        : 'Chưa khớp cặp! (-10 điểm)'
    };
    state.lastFeedback = feedback;
    state.history.push({
      questionId: viId + ':' + enId,
      isCorrect: isMatch,
      scoreDelta: delta,
      userAnswer: viItem.label + ' ↔ ' + enItem.label,
      correctAnswer: correctAnswerText
    });

    if (finished) {
      finishGame();
    }
    return feedback;
  }

  function handleTypeTranslationSubmit(p) {
    var q = state.currentQuestion;
    if (!q || q.answered) return { alreadyAnswered: true, isCorrect: false };

    var text = String(p.text || '').trim();
    var evalRes = evaluateTranslationText(text, q.targetEn, q.keywords, q.acceptedAlternates);
    q.answered = true;

    var delta = 0;
    if (evalRes.isCorrect) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = Math.max(20, Math.round(evalRes.accuracy) - (q.hintUsed ? 15 : 0) + (state.streak - 1) * 10);
      state.score += delta;
    } else if (evalRes.isPartial) {
      state.streak = 0;
      state.wrongCount++;
      delta = Math.max(10, Math.round(evalRes.accuracy * 0.5) - (q.hintUsed ? 10 : 0));
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
    }

    var feedback = {
      isCorrect: evalRes.isCorrect,
      isPartial: evalRes.isPartial,
      accuracy: evalRes.accuracy,
      keywordCoverage: evalRes.keywordCoverage,
      diff: evalRes.diff,
      referenceEn: q.targetEn,
      userAnswer: text,
      scoreDelta: delta,
      messageVi: evalRes.isCorrect
        ? 'Tuyệt vời! Độ chính xác ' + evalRes.accuracy + '% (+' + delta + ' điểm)'
        : (evalRes.isPartial
          ? 'Khá tốt (' + evalRes.accuracy + '%). Đáp án chuẩn: ' + q.targetEn
          : 'Độ chính xác ' + evalRes.accuracy + '%. Đáp án chuẩn: ' + q.targetEn)
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: evalRes.isCorrect, accuracy: evalRes.accuracy, scoreDelta: delta, userAnswer: text, correctAnswer: q.targetEn });
    return feedback;
  }

  function handleFallingWordsSubmit(p) {
    var fs = state.fallingState;
    if (!fs) return { isCorrect: false };

    var active = fs.activeWords;
    var matchIdx = -1;
    var queryText = '';

    if (p.wordId) {
      for (var i = 0; i < active.length; i++) {
        if (active[i].wordId === p.wordId) {
          matchIdx = i;
          break;
        }
      }
    } else {
      if (typeof p.optionIndex === 'number' && state.currentQuestion && state.currentQuestion.options[p.optionIndex] != null) {
        queryText = state.currentQuestion.options[p.optionIndex];
      } else {
        queryText = String(p.selectedEn || p.text || '').trim();
      }
      var normQuery = normalizeEnglishAnswer(queryText);
      if (normQuery) {
        // Prefer lowest falling word (largest y) when multiple match
        var bestY = -1;
        for (var j = 0; j < active.length; j++) {
          var aw = active[j];
          var accList = aw.acceptedEn || [aw.en];
          var hit = false;
          for (var a = 0; a < accList.length; a++) {
            if (normalizeEnglishAnswer(accList[a]) === normQuery) {
              hit = true;
              break;
            }
          }
          if (hit && aw.y >= bestY) {
            bestY = aw.y;
            matchIdx = j;
          }
        }
      }
    }

    if (matchIdx >= 0) {
      var caught = active.splice(matchIdx, 1)[0];
      fs.caughtCount++;
      state.correctCount++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      fs.wave = 1 + Math.floor(fs.caughtCount / 5);
      fs.speedMultiplier = Number((1 + (fs.wave - 1) * 0.18).toFixed(2));
      var delta = 100 + fs.wave * 20 + (state.streak - 1) * 15;
      state.score += delta;

      var feedback = {
        isCorrect: true,
        caughtWord: caught,
        scoreDelta: delta,
        caughtCount: fs.caughtCount,
        lives: fs.lives,
        wave: fs.wave,
        messageVi: 'Bắt trúng "' + caught.vi + '" → "' + caught.en + '"! +' + delta + ' điểm'
      };
      state.lastFeedback = feedback;
      state.history.push({ questionId: caught.wordId, isCorrect: true, scoreDelta: delta, userAnswer: caught.en, correctAnswer: caught.en });

      if (fs.caughtCount >= fs.targetCatches) {
        finishGame();
        return feedback;
      }

      if (active.length === 0) {
        spawnFallingWordIfNeeded();
      }
      syncFallingCurrentQuestion();
      return feedback;
    } else {
      state.wrongCount++;
      state.streak = 0;
      var missFb = {
        isCorrect: false,
        scoreDelta: 0,
        userAnswer: queryText,
        lives: fs.lives,
        messageVi: 'Không có từ rơi nào khớp với "' + queryText + '"!'
      };
      state.lastFeedback = missFb;
      state.history.push({ questionId: 'fw_miss_' + state.history.length, isCorrect: false, scoreDelta: 0, userAnswer: queryText });
      return missFb;
    }
  }

  function handleSpotFixSubmit(p) {
    var q = state.currentQuestion;
    if (!q || q.answered) return { alreadyAnswered: true, isCorrect: false };

    var submittedFaultIdx = null;
    var submittedFix = '';
    if (typeof p.optionIndex === 'number' && q.options[p.optionIndex]) {
      submittedFaultIdx = q.options[p.optionIndex].faultIndex;
      submittedFix = q.options[p.optionIndex].fix;
    } else {
      if (typeof p.faultIndex === 'number') submittedFaultIdx = p.faultIndex;
      submittedFix = String(p.fix || p.text || '').trim();
    }

    var idxMatched = submittedFaultIdx === q.faultIndex;
    var normFix = normalizeEnglishAnswer(submittedFix);
    var normCorrect = normalizeEnglishAnswer(q.correctToken);
    var fixMatched = false;
    if (q.correctToken === '(bỏ "not")') {
      fixMatched = normFix === 'bo not' || normFix === 'remove' || normFix === 'delete' ||
        (idxMatched && normFix === '') ||
        normFix === normalizeEnglishAnswer(q.correctToken);
    } else {
      fixMatched = normFix === normCorrect;
    }

    var isFullCorrect = idxMatched && fixMatched;
    var isPartial = !isFullCorrect && (idxMatched || fixMatched);
    q.answered = true;

    var delta = 0;
    if (isFullCorrect) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100 + (state.streak - 1) * 15;
      state.score += delta;
    } else if (isPartial) {
      state.streak = 0;
      state.wrongCount++;
      delta = 40;
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
    }

    var feedback = {
      isCorrect: isFullCorrect,
      isPartial: isPartial,
      scoreDelta: delta,
      faultIndex: q.faultIndex,
      correctToken: q.correctToken,
      fullCorrectedEn: q.fullCorrectedEn,
      explanationVi: q.explanationVi,
      messageVi: isFullCorrect
        ? 'Bắt & sửa lỗi chính xác! +' + delta + ' điểm'
        : (isPartial
          ? 'Đúng một phần (+40 điểm). Câu chuẩn: ' + q.fullCorrectedEn
          : 'Chưa đúng. Câu chuẩn: ' + q.fullCorrectedEn)
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: isFullCorrect, scoreDelta: delta, userAnswer: submittedFix, correctAnswer: q.fullCorrectedEn });
    return feedback;
  }

  function handleDialogueChainSubmit(p) {
    var q = state.currentQuestion;
    if (!q || q.answered) return { alreadyAnswered: true, isCorrect: false };

    var isCorrect = false;
    var accuracy = 0;
    var userAnswer = '';

    if (typeof p.optionIndex === 'number' && q.options[p.optionIndex] != null) {
      userAnswer = q.options[p.optionIndex];
      isCorrect = p.optionIndex === q.correctOptionIndex;
      accuracy = isCorrect ? 100 : 0;
    } else if (typeof p.text === 'string') {
      userAnswer = p.text;
      var evalRes = evaluateTranslationText(p.text, q.targetEn, [q.keyword], []);
      isCorrect = evalRes.isCorrect;
      accuracy = evalRes.accuracy;
    }

    q.answered = true;
    var delta = 0;
    if (isCorrect) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.correctCount++;
      delta = 100 + (state.streak - 1) * 15;
      state.score += delta;
    } else {
      state.streak = 0;
      state.wrongCount++;
      if (accuracy >= 55) {
        delta = Math.round(accuracy * 0.4);
        state.score += delta;
      }
    }

    if (state.dialogueState) {
      state.dialogueState.completedTurns.push({
        turnIndex: q.turnIndex,
        speaker: q.speaker,
        lineVi: q.lineVi,
        targetEn: q.targetEn,
        userAnswer: userAnswer,
        isCorrect: isCorrect
      });
    }

    var feedback = {
      isCorrect: isCorrect,
      accuracy: accuracy,
      scoreDelta: delta,
      userAnswer: userAnswer,
      correctAnswer: q.targetEn,
      messageVi: isCorrect
        ? 'Hoàn thành lượt ' + (q.turnIndex + 1) + '! +' + delta + ' điểm'
        : 'Lượt ' + (q.turnIndex + 1) + ' cần chỉnh lại: "' + q.targetEn + '"'
    };
    state.lastFeedback = feedback;
    state.history.push({ questionId: q.id, isCorrect: isCorrect, scoreDelta: delta, userAnswer: userAnswer, correctAnswer: q.targetEn });
    return feedback;
  }

  // ==================== Progression, Ticks & Finish ====================

  function nextQuestion() {
    if (state.status !== 'playing') return getState();

    if (state.mode === 'match_pairs' || state.mode === 'falling_words') {
      return getState();
    }

    state.questionElapsedMs = 0;
    state.lastFeedback = null;
    state._pickedFaultIndex = null;
    state.currentIndex++;

    if (state.currentIndex >= state._questions.length) {
      if (state.mode === 'dialogue_chain' && state.correctCount > 0) {
        state.score += 50; // Story chain completion bonus
      }
      finishGame();
      return getState();
    }

    state.currentQuestion = state._questions[state.currentIndex];
    if (state.mode === 'word_tiles') {
      state.tilesState = { selectedTileIds: [] };
    }
    if (state.mode === 'dialogue_chain' && state.dialogueState) {
      state.dialogueState.currentTurnIndex = state.currentIndex;
    }

    renderAll();
    return getState();
  }

  function tickTimer(dtMs) {
    if (state.status !== 'playing') return getState();
    var rawDt = Number(dtMs);
    var dt = (isFinite(rawDt) && rawDt > 0) ? Math.min(rawDt, 3600000) : 0;
    state.elapsedMs += dt;
    state.questionElapsedMs += dt;

    if (state.mode === 'speed_blitz' && state.remainingMs != null) {
      state.remainingMs = Math.max(0, state.remainingMs - dt);
      if (state.remainingMs <= 0) {
        finishGame();
        return getState();
      }
      renderScoreHud();
      updateTimerBarDom();
    }
    return getState();
  }

  function tickFallingWords(dtMs) {
    if (state.status !== 'playing' || state.mode !== 'falling_words' || !state.fallingState) {
      return getState();
    }
    var rawDt = Number(dtMs);
    var totalDt = (isFinite(rawDt) && rawDt > 0) ? Math.min(rawDt, 3600000) : 0;
    var fs = state.fallingState;
    var stepSize = 100;
    var prevIds = fs.activeWords.map(function (w) { return w.wordId; }).join(',');

    while (totalDt > 0 && state.status === 'playing') {
      var step = Math.min(totalDt, stepSize);
      totalDt -= step;
      state.elapsedMs += step;

      var remaining = [];
      for (var i = 0; i < fs.activeWords.length; i++) {
        var aw = fs.activeWords[i];
        aw.y += aw.speed * (step / 1000);
        if (aw.y >= 100) {
          fs.missedCount++;
          state.wrongCount++;
          state.streak = 0;
          fs.lives = Math.max(0, fs.lives - 1);
          state.lastFeedback = {
            isCorrect: false,
            missedWord: aw,
            lives: fs.lives,
            messageVi: 'Rơi mất từ "' + aw.vi + '" (' + aw.en + ')! Còn ' + fs.lives + ' mạng.'
          };
          state.history.push({ questionId: aw.wordId, isCorrect: false, scoreDelta: 0, correctAnswer: aw.en });
        } else {
          remaining.push(aw);
        }
      }
      fs.activeWords = remaining;

      if (fs.lives <= 0) {
        recomputeAccuracy();
        finishGame();
        return getState();
      }

      fs.spawnCooldownMs -= step;
      if (fs.activeWords.length === 0 || (fs.spawnCooldownMs <= 0 && fs.activeWords.length < 3)) {
        spawnFallingWordIfNeeded();
        fs.spawnCooldownMs = Math.round(1800 / (fs.speedMultiplier || 1));
      }
    }

    var afterIds = fs.activeWords.map(function (w) { return w.wordId; }).join(',');
    var membershipChanged = prevIds !== afterIds;

    recomputeAccuracy();
    if (membershipChanged) {
      syncFallingCurrentQuestion();
    }
    if (rootEl && typeof document !== 'undefined') {
      if (findEl('vegFallingArena') && findEl('vegFallingOptions') && findEl('vegTextInput')) {
        renderScoreHud();
        updateFallingWordsDom(membershipChanged);
      } else {
        renderAll();
      }
    }
    return getState();
  }

  function computeGrade(accuracy) {
    if (accuracy >= 90) return 'S';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 65) return 'B';
    if (accuracy >= 50) return 'C';
    return 'D';
  }

  function finishGame() {
    stopTimers();
    if (state.status === 'finished') {
      return deepClone(state.summary);
    }

    recomputeAccuracy();
    state.status = 'finished';

    var hasPositiveProgress = state.correctCount > 0 || state.score > 0;
    var xpEarned = hasPositiveProgress ? Math.max(5, Math.round(state.score / 20)) : 0;
    var grade = computeGrade(state.accuracy);
    var streakCompleted = false;

    // Persist stats safely in localStorage (skip 0-action exits)
    if (state.history.length > 0 || state.correctCount > 0 || state.score > 0) {
      persistStats(xpEarned);
    }

    // Safe global daily deadline hook (only when player made genuine positive progress)
    if (typeof window !== 'undefined' && typeof window.markDailyStreakTaskCompleted === 'function') {
      if (hasPositiveProgress) {
        try {
          window.markDailyStreakTaskCompleted('games');
          streakCompleted = true;
        } catch (e) {}
      }
    }

    // Safe authenticated-only XP recording (NEVER default to tonguyenvu@265.com!)
    if (xpEarned > 0) {
      awardAuthenticatedGameXp(xpEarned);
    }

    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      try {
        window.showToast('Hoàn thành trò chơi: ' + state.score + ' điểm (' + state.accuracy + '%)', 'success');
      } catch (e) {}
    }

    state.summary = {
      mode: state.mode,
      unitId: state.unitId,
      unitTitle: state.unitTitle,
      finalScore: state.score,
      accuracy: state.accuracy,
      correctCount: state.correctCount,
      wrongCount: state.wrongCount,
      bestStreak: state.bestStreak,
      xpEarned: xpEarned,
      grade: grade,
      durationMs: state.elapsedMs,
      streakCompleted: streakCompleted,
      transcript: state.dialogueState ? state.dialogueState.completedTurns.slice() : null
    };

    renderAll();
    return deepClone(state.summary);
  }

  function getState() {
    return deepClone(state);
  }

  // ==================== Safe Persistence & Auth Guard ====================

  function readStatsSafe() {
    var empty = { byUnitMode: {}, totalGamesPlayed: 0, totalCorrect: 0, totalXp: 0 };
    if (typeof localStorage === 'undefined') return empty;
    try {
      var raw = localStorage.getItem(STATS_STORAGE_KEY);
      if (!raw) return empty;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return empty;
      return {
        byUnitMode: parsed.byUnitMode || {},
        totalGamesPlayed: Number(parsed.totalGamesPlayed) || 0,
        totalCorrect: Number(parsed.totalCorrect) || 0,
        totalXp: Number(parsed.totalXp) || 0
      };
    } catch (e) {
      return empty;
    }
  }

  function persistStats(xpEarned) {
    if (typeof localStorage === 'undefined') return;
    try {
      var stats = readStatsSafe();
      var key = String(state.unitId || '') + '::' + String(state.mode || '');
      var prev = stats.byUnitMode[key] || { bestScore: 0, bestAccuracy: 0, attempts: 0, lastScore: 0 };
      stats.byUnitMode[key] = {
        bestScore: Math.max(prev.bestScore || 0, state.score),
        bestAccuracy: Math.max(prev.bestAccuracy || 0, state.accuracy),
        attempts: (prev.attempts || 0) + 1,
        lastScore: state.score,
        updatedAt: new Date().toISOString()
      };
      stats.totalGamesPlayed += 1;
      stats.totalCorrect += state.correctCount;
      var earned = typeof xpEarned === 'number'
        ? xpEarned
        : ((state.correctCount > 0 || state.score > 0) ? Math.max(5, Math.round(state.score / 20)) : 0);
      stats.totalXp += earned;
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  function awardAuthenticatedGameXp(xpEarned) {
    if (typeof localStorage === 'undefined') return;
    try {
      var activeEmail = localStorage.getItem('EMH_ACTIVE_ACCOUNT_EMAIL');
      if (!activeEmail || !String(activeEmail).trim()) {
        return; // Unauthenticated visitor: do NOT credit any account
      }
      var normEmail = String(activeEmail).trim().toLowerCase();
      var rawAccounts = localStorage.getItem('EMH_SAVED_ACCOUNTS_V2');
      if (!rawAccounts) return;
      var accounts = JSON.parse(rawAccounts);
      if (accounts && typeof accounts === 'object' && accounts[normEmail]) {
        accounts[normEmail].xp = (Number(accounts[normEmail].xp) || 0) + xpEarned;
        localStorage.setItem('EMH_SAVED_ACCOUNTS_V2', JSON.stringify(accounts));
      }
    } catch (e) {}
  }

  function getStats() {
    return readStatsSafe();
  }

  function speak(text) {
    var clean = String(text || '').trim();
    if (!clean || typeof window === 'undefined') return;
    try {
      if (typeof window.speakWord === 'function') {
        window.speakWord(clean);
        return;
      }
      if (window.SpeakingEngine && typeof window.SpeakingEngine.speakText === 'function') {
        window.SpeakingEngine.speakText(clean);
        return;
      }
      if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = 'en-US';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  // ==================== Scoped CSS Injection ====================

  function injectStyles(targetRoot) {
    if (typeof document === 'undefined') return;
    if (typeof document.getElementById === 'function' && document.getElementById(STYLE_ELEMENT_ID)) return;

    var css = [
      '#tab-games .veg-title, [data-veg-root] .veg-title { margin: 6px 0 0; font-size: 1.15rem; font-weight: 800; color: var(--ink, #1f2937); }',
      '#tab-games .veg-header-top, [data-veg-root] .veg-header-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }',
      '#tab-games .veg-controls-row, [data-veg-root] .veg-controls-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--rule, #e5dfd3); margin-bottom: 14px; }',
      '#tab-games .veg-label, [data-veg-root] .veg-label { font-size: 12.5px; font-weight: 700; color: var(--ink-2, #4b5563); white-space: nowrap; }',
      '#tab-games .veg-unit-select, [data-veg-root] .veg-unit-select { flex: 1 1 240px; min-width: 200px; }',
      '#tab-games .veg-score-hud, [data-veg-root] .veg-score-hud { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }',
      '#tab-games .veg-stat-pill, [data-veg-root] .veg-stat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: var(--page, #f5f2eb); border: 1px solid var(--rule, #e5dfd3); color: var(--ink, #1f2937); font-variant-numeric: tabular-nums; }',
      '#tab-games .veg-stat-pill.accent, [data-veg-root] .veg-stat-pill.accent { background: var(--accent-wash, #eaf3ef); color: var(--accent-ink, #1e4d40); border-color: transparent; }',
      '#tab-games .veg-mode-grid, [data-veg-root] .veg-mode-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }',
      '@media (max-width: 860px) { #tab-games .veg-mode-grid, [data-veg-root] .veg-mode-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
      '#tab-games .veg-mode-btn, [data-veg-root] .veg-mode-btn { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--rule, #e5dfd3); background: var(--page, #f5f2eb); color: var(--ink, #1f2937); cursor: pointer; text-align: left; transition: border-color .15s, background .15s, transform .1s; }',
      '#tab-games .veg-mode-btn:hover, [data-veg-root] .veg-mode-btn:hover { background: var(--hover-bg, #eeeae0); border-color: var(--accent, #2f6f5e); }',
      '#tab-games .veg-mode-btn.is-active, [data-veg-root] .veg-mode-btn.is-active { background: var(--accent-wash, #eaf3ef); border-color: var(--accent, #2f6f5e); color: var(--accent-ink, #1e4d40); box-shadow: 0 0 0 1px var(--accent, #2f6f5e); }',
      '#tab-games .veg-mode-name, [data-veg-root] .veg-mode-name { font-size: 12.5px; font-weight: 700; color: inherit; }',
      '#tab-games .veg-mode-sub, [data-veg-root] .veg-mode-sub { font-size: 11px; color: var(--ink-3, #6b7280); }',
      '#tab-games .veg-mode-best, [data-veg-root] .veg-mode-best { margin-top: 2px; font-size: 10.5px; font-weight: 700; color: var(--accent-ink, #1e4d40); }',
      '#tab-games .veg-prompt-box, [data-veg-root] .veg-prompt-box { background: var(--page, #f5f2eb); border: 1px solid var(--rule, #e5dfd3); border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; }',
      '#tab-games .veg-prompt-vi, [data-veg-root] .veg-prompt-vi { font-size: 1.05rem; font-weight: 700; color: var(--ink, #1f2937); line-height: 1.5; }',
      '#tab-games .veg-hint, [data-veg-root] .veg-hint { font-size: 12px; color: var(--ink-3, #6b7280); margin-top: 6px; }',
      '#tab-games .veg-tile-zone, [data-veg-root] .veg-tile-zone { min-height: 54px; display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 12px; border-radius: 12px; border: 1.5px dashed var(--rule, #e5dfd3); background: var(--page, #f5f2eb); margin-bottom: 12px; align-items: center; }',
      '#tab-games .veg-tile-bank, [data-veg-root] .veg-tile-bank { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }',
      '#tab-games .veg-tile, [data-veg-root] .veg-tile { padding: 7px 12px; border-radius: 10px; border: 1px solid var(--rule, #e5dfd3); background: var(--sheet, #fcfbf7); color: var(--ink, #1f2937); font-size: 13.5px; font-weight: 600; cursor: pointer; }',
      '#tab-games .veg-tile:hover, [data-veg-root] .veg-tile:hover { background: var(--hover-bg, #eeeae0); border-color: var(--accent, #2f6f5e); }',
      '#tab-games .veg-tile.is-used, [data-veg-root] .veg-tile.is-used { opacity: 0.35; pointer-events: none; }',
      '#tab-games .veg-options-grid, [data-veg-root] .veg-options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }',
      '@media (max-width: 640px) { #tab-games .veg-options-grid, [data-veg-root] .veg-options-grid { grid-template-columns: 1fr; } }',
      '#tab-games .veg-opt-btn, [data-veg-root] .veg-opt-btn { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--rule, #e5dfd3); background: var(--page, #f5f2eb); color: var(--ink, #1f2937); font-size: 13.5px; font-weight: 600; text-align: left; cursor: pointer; }',
      '#tab-games .veg-opt-btn:hover, [data-veg-root] .veg-opt-btn:hover { background: var(--hover-bg, #eeeae0); border-color: var(--accent, #2f6f5e); }',
      '#tab-games .veg-opt-btn.is-correct, [data-veg-root] .veg-opt-btn.is-correct { background: var(--good-wash, #ecf6f1); border-color: var(--good, #1f7a5c); color: var(--good, #1f7a5c); }',
      '#tab-games .veg-opt-btn.is-wrong, [data-veg-root] .veg-opt-btn.is-wrong { background: rgba(185, 28, 28, 0.12); border-color: var(--incorrect-color, #b91c1c); color: var(--incorrect-color, #b91c1c); }',
      '#tab-games .veg-match-grid, [data-veg-root] .veg-match-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }',
      '#tab-games .veg-match-col, [data-veg-root] .veg-match-col { display: flex; flex-direction: column; gap: 8px; }',
      '#tab-games .veg-match-card, [data-veg-root] .veg-match-card { padding: 11px 13px; border-radius: 12px; border: 1px solid var(--rule, #e5dfd3); background: var(--page, #f5f2eb); color: var(--ink, #1f2937); font-size: 13px; font-weight: 600; text-align: left; cursor: pointer; }',
      '#tab-games .veg-match-card.is-selected, [data-veg-root] .veg-match-card.is-selected { background: var(--accent-wash, #eaf3ef); border-color: var(--accent, #2f6f5e); color: var(--accent-ink, #1e4d40); }',
      '#tab-games .veg-match-card.is-matched, [data-veg-root] .veg-match-card.is-matched { background: var(--good-wash, #ecf6f1); border-color: var(--good, #1f7a5c); color: var(--good, #1f7a5c); opacity: 0.7; pointer-events: none; }',
      '#tab-games .veg-timer-bar, [data-veg-root] .veg-timer-bar { height: 7px; width: 100%; background: var(--rule, #e5dfd3); border-radius: 999px; overflow: hidden; margin-bottom: 12px; }',
      '#tab-games .veg-timer-fill, [data-veg-root] .veg-timer-fill { height: 100%; background: var(--accent, #2f6f5e); transition: width .15s linear; }',
      '#tab-games .veg-arena, [data-veg-root] .veg-arena { position: relative; height: 240px; border-radius: 14px; border: 1px solid var(--rule, #e5dfd3); background: var(--page, #f5f2eb); overflow: hidden; margin-bottom: 12px; }',
      '#tab-games .veg-falling-item, [data-veg-root] .veg-falling-item { position: absolute; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--accent, #2f6f5e); background: var(--sheet, #fcfbf7); color: var(--ink, #1f2937); font-size: 13px; font-weight: 700; white-space: nowrap; }',
      '#tab-games .veg-seg-token, [data-veg-root] .veg-seg-token { display: inline-block; padding: 4px 8px; margin: 2px; border-radius: 8px; border: 1px solid var(--rule, #e5dfd3); background: var(--sheet, #fcfbf7); color: var(--ink, #1f2937); cursor: pointer; font-weight: 600; }',
      '#tab-games .veg-seg-token.is-picked, [data-veg-root] .veg-seg-token.is-picked { background: rgba(185, 28, 28, 0.14); border-color: var(--incorrect-color, #b91c1c); color: var(--incorrect-color, #b91c1c); }',
      '#tab-games .veg-chat-log, [data-veg-root] .veg-chat-log { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }',
      '#tab-games .veg-chat-turn, [data-veg-root] .veg-chat-turn { padding: 10px 12px; border-radius: 12px; border: 1px solid var(--rule, #e5dfd3); background: var(--page, #f5f2eb); color: var(--ink, #1f2937); font-size: 13px; }',
      '#tab-games .veg-chat-turn.is-done, [data-veg-root] .veg-chat-turn.is-done { background: var(--good-wash, #ecf6f1); border-color: var(--good, #1f7a5c); }',
      '#tab-games .veg-actions-row, [data-veg-root] .veg-actions-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }',
      '#tab-games .veg-feedback-ok, [data-veg-root] .veg-feedback-ok { background: var(--good-wash, #ecf6f1); border: 1px solid var(--good, #1f7a5c); color: var(--good, #1f7a5c); border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-top: 10px; }',
      '#tab-games .veg-feedback-err, [data-veg-root] .veg-feedback-err { background: rgba(185, 28, 28, 0.10); border: 1px solid var(--incorrect-color, #b91c1c); color: var(--incorrect-color, #b91c1c); border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-top: 10px; }',
      '#tab-games .veg-diff-row, [data-veg-root] .veg-diff-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }',
      '#tab-games .veg-diff-tok, [data-veg-root] .veg-diff-tok { padding: 2px 6px; border-radius: 6px; font-size: 12px; font-weight: 600; }',
      '#tab-games .veg-diff-tok.match, [data-veg-root] .veg-diff-tok.match { background: var(--good-wash, #ecf6f1); color: var(--good, #1f7a5c); }',
      '#tab-games .veg-diff-tok.missing, [data-veg-root] .veg-diff-tok.missing { background: rgba(245, 158, 11, 0.18); color: #92400e; text-decoration: underline; }',
      '#tab-games .veg-diff-tok.extra, [data-veg-root] .veg-diff-tok.extra { background: rgba(185, 28, 28, 0.14); color: var(--incorrect-color, #b91c1c); text-decoration: line-through; }',
      '[data-theme="dark"] #tab-games .err-box, [data-theme="dark"] [data-veg-root] .err-box { background: rgba(185, 28, 28, 0.16) !important; border-color: rgba(229, 115, 115, 0.4) !important; color: var(--ink, #e8e4dc) !important; }',
      '[data-theme="dark"] #tab-games .ni-badge-neutral, [data-theme="dark"] [data-veg-root] .ni-badge-neutral { background: #252932; color: var(--ink-2, #b8b3a8); }',
      '[data-theme="dark"] #tab-games .ni-badge-amber, [data-theme="dark"] [data-veg-root] .ni-badge-amber { background: rgba(245, 158, 11, 0.16); color: #fcd34d; }',
      '[data-theme="dark"] #tab-games .veg-diff-tok.missing, [data-theme="dark"] [data-veg-root] .veg-diff-tok.missing { color: #fcd34d; }',
      '[data-theme="dark"] #tab-games .veg-feedback-err, [data-theme="dark"] [data-veg-root] .veg-feedback-err { background: rgba(229, 115, 115, 0.16); color: #fca5a5; border-color: rgba(229, 115, 115, 0.45); }'
    ].join('\n');

    var styleEl = document.createElement('style');
    styleEl.id = STYLE_ELEMENT_ID;
    styleEl.textContent = css;
    if (document.head && typeof document.head.appendChild === 'function') {
      document.head.appendChild(styleEl);
    } else if (targetRoot && typeof targetRoot.appendChild === 'function') {
      targetRoot.appendChild(styleEl);
    }
  }

  // ==================== Dual-Mode DOM Hydration & Rendering ====================

  function findEl(id) {
    if (rootEl && typeof rootEl.querySelector === 'function') {
      var inside = rootEl.querySelector('#' + id);
      if (inside) return inside;
    }
    if (typeof document !== 'undefined' && typeof document.getElementById === 'function') {
      return document.getElementById(id);
    }
    return null;
  }

  function ensureShellMounted(container) {
    var hasUnitSelect = Boolean(findEl('vegUnitSelect'));
    var hasModeGrid = Boolean(findEl('vegModeGrid'));
    var hasStage = Boolean(findEl('vegStage'));
    var hasScore = Boolean(findEl('vegScore'));
    var hasResultBox = Boolean(findEl('vegResultBox'));

    if (hasUnitSelect && hasModeGrid && hasStage && hasScore && hasResultBox) {
      return; // Pre-populated HTML preserved
    }

    container.innerHTML = [
      '<div class="pv-card veg-header-card">',
      '  <div class="veg-header-top">',
      '    <div>',
      '      <span class="ni-badge ni-badge-pink">🎮 Trò Chơi Dịch Việt → Anh Theo Unit</span>',
      '      <h2 class="veg-title">8 Chế Độ Luyện Phản Xạ Dịch Câu &amp; Từ Vựng</h2>',
      '    </div>',
      '    <div id="vegScore" class="veg-score-hud"></div>',
      '  </div>',
      '  <div class="veg-controls-row">',
      '    <label for="vegUnitSelect" class="veg-label">Chọn Unit:</label>',
      '    <select id="vegUnitSelect" class="ni-input veg-unit-select"></select>',
      '    <button type="button" id="vegBtnRestart" class="ni-nav-btn" data-action="restart">🔄 Chơi lại</button>',
      '  </div>',
      '  <div id="vegModeGrid" class="veg-mode-grid"></div>',
      '</div>',
      '<div id="vegStage" class="pv-card veg-stage"></div>',
      '<div id="vegResultBox" class="pv-card veg-result-box hidden"></div>'
    ].join('\n');
  }

  function populateUnitSelect(overrideAppData) {
    var sel = findEl('vegUnitSelect');
    if (!sel) return;
    var units = getAvailableUnits(overrideAppData);
    var html = '';
    for (var i = 0; i < units.length; i++) {
      var u = units[i];
      var isSelected = (state.unitId && u.unitId === state.unitId) || (!state.unitId && i === 0);
      html += '<option value="' + escapeHtml(u.unitId) + '"' + (isSelected ? ' selected' : '') + '>' +
        escapeHtml(u.unitTitle) + ' (' + u.wordCount + ' từ)</option>';
    }
    sel.innerHTML = html;
    if (state.unitId) {
      sel.value = state.unitId;
    }
  }

  function renderModeGrid() {
    var grid = findEl('vegModeGrid');
    if (!grid) return;
    var stats = readStatsSafe();
    var html = '';
    for (var i = 0; i < MODES.length; i++) {
      var m = MODES[i];
      var isActive = state.mode === m.id;
      var statKey = String(state.unitId || '') + '::' + m.id;
      var best = stats.byUnitMode[statKey];
      var bestText = best && best.bestScore ? ('Kỷ lục: ' + best.bestScore + 'đ') : m.badge;
      html += '<button type="button" class="veg-mode-btn' + (isActive ? ' is-active' : '') + '" data-mode="' + escapeHtml(m.id) + '" data-action="select-mode">' +
        '<span class="veg-mode-name">' + escapeHtml(m.icon + ' ' + m.nameVi) + '</span>' +
        '<span class="veg-mode-sub">' + escapeHtml(m.subtitleVi) + '</span>' +
        '<span class="veg-mode-best">' + escapeHtml(bestText) + '</span>' +
        '</button>';
    }
    grid.innerHTML = html;
  }

  function renderScoreHud() {
    var hud = findEl('vegScore');
    if (!hud) return;
    var progressLabel = state.mode === 'match_pairs' && state.matchState
      ? (state.matchState.matchedPairIds.length + '/' + state.matchState.pairsTotal + ' cặp')
      : (state.mode === 'falling_words' && state.fallingState
        ? (state.fallingState.caughtCount + '/' + state.fallingState.targetCatches + ' từ')
        : (Math.min(state.currentIndex + (state.status === 'finished' ? 0 : 1), state.totalQuestions) + '/' + state.totalQuestions));

    var pills = [
      '<span class="veg-stat-pill accent">Điểm: <strong>' + state.score + '</strong></span>',
      '<span class="veg-stat-pill">Chuỗi: <strong>' + state.streak + '</strong></span>',
      '<span class="veg-stat-pill">Đúng: <strong>' + state.accuracy + '%</strong></span>',
      '<span class="veg-stat-pill">Tiến độ: <strong>' + escapeHtml(progressLabel) + '</strong></span>'
    ];
    if (state.mode === 'speed_blitz' && state.remainingMs != null) {
      pills.push('<span class="veg-stat-pill accent">⏱ ' + Math.ceil(state.remainingMs / 1000) + 's</span>');
    }
    if (state.mode === 'falling_words' && state.fallingState) {
      pills.push('<span class="veg-stat-pill">❤️ ' + state.fallingState.lives + '/' + state.fallingState.maxLives + '</span>');
    }
    hud.innerHTML = pills.join('');
  }

  function updateTimerBarDom() {
    if (!rootEl || state.mode !== 'speed_blitz' || !state._options) return;
    var fill = findEl('vegBlitzTimerFill');
    if (fill && state.remainingMs != null) {
      var totalMs = ((state._options.durationSec || 60) * 1000);
      var pct = Math.max(0, Math.min(100, Math.round((state.remainingMs / totalMs) * 100)));
      fill.style.width = pct + '%';
    }
  }

  function renderFeedbackHtml() {
    if (!state.lastFeedback) return '';
    var fb = state.lastFeedback;
    var cls = fb.isCorrect ? 'veg-feedback-ok' : 'veg-feedback-err';
    var html = '<div class="' + cls + '">' + escapeHtml(fb.messageVi || '');
    if (Array.isArray(fb.diff) && fb.diff.length) {
      html += '<div class="veg-diff-row">';
      for (var i = 0; i < fb.diff.length; i++) {
        var d = fb.diff[i];
        html += '<span class="veg-diff-tok ' + escapeHtml(d.type) + '">' + escapeHtml(d.word) + '</span>';
      }
      html += '</div>';
    }
    if (fb.explanationVi) {
      html += '<div style="margin-top:6px;font-weight:500;">💡 ' + escapeHtml(fb.explanationVi) + '</div>';
    }
    html += '</div>';
    return html;
  }

  function buildFallingArenaHtml(fs) {
    var arenaItems = '';
    for (var fi = 0; fi < fs.activeWords.length; fi++) {
      var fw = fs.activeWords[fi];
      arenaItems += '<div class="veg-falling-item" data-word-id="' + escapeHtml(fw.wordId) + '" style="top:' + Math.min(88, Math.round(fw.y)) + '%;left:' + fw.x + '%;">' + escapeHtml(fw.vi) + '</div>';
    }
    return arenaItems;
  }

  function buildFallingOptionsHtml(q) {
    var fwOpts = '';
    var liveOpts = (q && q.options) || [];
    for (var fo = 0; fo < liveOpts.length; fo++) {
      fwOpts += '<button type="button" class="veg-opt-btn" data-action="submit-option" data-option-index="' + fo + '">' + escapeHtml(liveOpts[fo]) + '</button>';
    }
    return fwOpts;
  }

  function updateFallingWordsDom(membershipChanged) {
    if (state.status !== 'playing' || state.mode !== 'falling_words' || !state.fallingState) return;
    var fs = state.fallingState;
    var q = state.currentQuestion;
    var header = findEl('vegFallingHeader');
    var arena = findEl('vegFallingArena');
    var optsEl = findEl('vegFallingOptions');
    var fbEl = findEl('vegFallingFeedback');

    if (header) {
      header.innerHTML = 'Wave ' + fs.wave + ' • Bắt nghĩa tiếng Anh của các từ đang rơi!';
    }
    if (arena) {
      var updatedInPlace = false;
      if (!membershipChanged && typeof arena.querySelectorAll === 'function') {
        var nodes = arena.querySelectorAll('.veg-falling-item');
        if (nodes && nodes.length === fs.activeWords.length) {
          var allMatched = true;
          for (var i = 0; i < fs.activeWords.length; i++) {
            var wid = nodes[i].dataset
              ? nodes[i].dataset.wordId
              : (typeof nodes[i].getAttribute === 'function' ? nodes[i].getAttribute('data-word-id') : null);
            if (wid !== fs.activeWords[i].wordId) {
              allMatched = false;
              break;
            }
          }
          if (allMatched) {
            for (var j = 0; j < fs.activeWords.length; j++) {
              if (nodes[j].style) {
                nodes[j].style.top = Math.min(88, Math.round(fs.activeWords[j].y)) + '%';
              }
            }
            updatedInPlace = true;
          }
        }
      }
      if (!updatedInPlace) {
        arena.innerHTML = buildFallingArenaHtml(fs);
      }
    }
    if (membershipChanged && optsEl) {
      optsEl.innerHTML = buildFallingOptionsHtml(q);
    }
    if (fbEl) {
      fbEl.innerHTML = renderFeedbackHtml();
    }
  }

  function renderStage() {
    var stage = findEl('vegStage');
    if (!stage) return;

    if (state.status === 'idle') {
      stage.innerHTML = '<div class="veg-prompt-box"><div class="veg-prompt-vi">Chọn một Unit và chế độ chơi ở trên để bắt đầu!</div></div>';
      return;
    }
    if (state.status === 'finished') {
      stage.innerHTML = '<div class="veg-prompt-box"><div class="veg-prompt-vi">Lượt chơi đã kết thúc. Xem tổng kết bên dưới hoặc nhấn Chơi lại!</div></div>';
      return;
    }

    var q = state.currentQuestion;
    if (!q) return;

    var html = '';
    if (state.mode === 'word_tiles') {
      var selectedIds = (state.tilesState && state.tilesState.selectedTileIds) || [];
      var selectedBtns = '';
      for (var s = 0; s < selectedIds.length; s++) {
        var tid = selectedIds[s];
        var tileObj = null;
        for (var t = 0; t < q.tiles.length; t++) {
          if (q.tiles[t].tileId === tid) { tileObj = q.tiles[t]; break; }
        }
        if (tileObj) {
          selectedBtns += '<button type="button" class="veg-tile" data-action="undo-tile">' + escapeHtml(tileObj.text) + '</button>';
        }
      }
      var bankBtns = '';
      for (var b = 0; b < q.tiles.length; b++) {
        var bt = q.tiles[b];
        var isUsed = selectedIds.indexOf(bt.tileId) !== -1;
        bankBtns += '<button type="button" class="veg-tile' + (isUsed ? ' is-used' : '') + '" data-action="select-tile" data-tile-id="' + escapeHtml(bt.tileId) + '">' +
          escapeHtml(bt.text) + '</button>';
      }
      html = [
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-neutral">' + escapeHtml(q.pos.toUpperCase()) + '</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">' + escapeHtml(q.promptVi) + '</div>',
        q.hintText ? '<div class="veg-hint">💡 ' + escapeHtml(q.hintText) + '</div>' : '',
        '</div>',
        '<div class="veg-tile-zone">' + (selectedBtns || '<span class="veg-hint">Nhấn vào các thẻ từ bên dưới để ghép câu tiếng Anh...</span>') + '</div>',
        '<div class="veg-tile-bank">' + bankBtns + '</div>',
        '<div class="veg-actions-row">',
        !q.answered ? '<button type="button" class="ni-submit-btn" data-action="submit-tiles">Kiểm tra</button>' : '<button type="button" class="ni-submit-btn" data-action="next-question">Câu tiếp theo →</button>',
        '  <button type="button" class="ni-nav-btn" data-action="undo-tile">↩ Hoàn tác</button>',
        '  <button type="button" class="ni-nav-btn" data-action="clear-tiles">🗑 Xóa hết</button>',
        '  <button type="button" class="ni-nav-btn" data-action="use-hint">💡 Gợi ý</button>',
        '  <button type="button" class="ni-nav-btn" data-action="speak" data-speak-text="' + escapeHtml(q.targetEn) + '">🔊 Nghe mẫu</button>',
        '</div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'cloze') {
      var cOpts = '';
      for (var ci = 0; ci < q.options.length; ci++) {
        var cCls = 'veg-opt-btn';
        if (q.answered && state.lastFeedback) {
          if (ci === q.correctIndex) cCls += ' is-correct';
          else if (ci === state.lastFeedback.chosenIndex) cCls += ' is-wrong';
        }
        cOpts += '<button type="button" class="' + cCls + '" data-action="submit-option" data-option-index="' + ci + '">' + escapeHtml(q.options[ci]) + '</button>';
      }
      html = [
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-amber">' + escapeHtml(q.pos.toUpperCase()) + '</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">' + escapeHtml(q.enWithBlank) + '</div>',
        '  <div class="veg-hint">' + escapeHtml(q.viContext) + '</div>',
        '</div>',
        '<div class="veg-options-grid">' + cOpts + '</div>',
        '<div class="veg-actions-row">',
        '  <input type="text" id="vegTextInput" class="ni-input" placeholder="Hoặc gõ từ cần điền rồi nhấn Enter..." style="flex:1;min-width:180px;">',
        !q.answered ? '<button type="button" class="ni-submit-btn" data-action="submit-text">Nộp từ</button>' : '<button type="button" class="ni-submit-btn" data-action="next-question">Câu tiếp theo →</button>',
        '  <button type="button" class="ni-nav-btn" data-action="use-hint">💡 Gợi ý</button>',
        '</div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'speed_blitz') {
      var totalMs = ((state._options.durationSec || 60) * 1000);
      var pct = state.remainingMs != null ? Math.max(0, Math.min(100, Math.round((state.remainingMs / totalMs) * 100))) : 100;
      var sbOpts = '';
      for (var si = 0; si < q.options.length; si++) {
        sbOpts += '<button type="button" class="veg-opt-btn" data-action="submit-option" data-option-index="' + si + '">' + escapeHtml(q.options[si]) + '</button>';
      }
      html = [
        '<div class="veg-timer-bar"><div id="vegBlitzTimerFill" class="veg-timer-fill" style="width:' + pct + '%;"></div></div>',
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-pink">⚡ Phản xạ nhanh</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">' + escapeHtml(q.promptVi) + '</div>',
        '</div>',
        '<div class="veg-options-grid">' + sbOpts + '</div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'match_pairs') {
      var ms = state.matchState;
      var viCol = '';
      var enCol = '';
      for (var mi = 0; mi < ms.viItems.length; mi++) {
        var viIt = ms.viItems[mi];
        var vCls = 'veg-match-card' + (viIt.matched ? ' is-matched' : (ms.selectedViId === viIt.pairId ? ' is-selected' : ''));
        viCol += '<button type="button" class="' + vCls + '"' + (viIt.matched ? ' disabled' : '') + ' data-action="match-vi" data-pair-id="' + escapeHtml(viIt.pairId) + '">' + escapeHtml(viIt.label) + '</button>';
      }
      for (var ei = 0; ei < ms.enItems.length; ei++) {
        var enIt = ms.enItems[ei];
        var eCls = 'veg-match-card' + (enIt.matched ? ' is-matched' : (ms.selectedEnId === enIt.pairId ? ' is-selected' : ''));
        enCol += '<button type="button" class="' + eCls + '"' + (enIt.matched ? ' disabled' : '') + ' data-action="match-en" data-pair-id="' + escapeHtml(enIt.pairId) + '">' + escapeHtml(enIt.label) + '</button>';
      }
      html = [
        '<div class="veg-prompt-box"><div class="veg-prompt-vi">Chọn 1 thẻ tiếng Việt và 1 thẻ tiếng Anh tương ứng (Số lượt: ' + ms.moves + ', Lỗi: ' + ms.errors + ')</div></div>',
        '<div class="veg-match-grid"><div class="veg-match-col">' + viCol + '</div><div class="veg-match-col">' + enCol + '</div></div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'type_translation') {
      html = [
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-neutral">' + escapeHtml(q.pos.toUpperCase()) + '</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">' + escapeHtml(q.promptVi) + '</div>',
        q.hintText ? '<div class="veg-hint">💡 ' + escapeHtml(q.hintText) + '</div>' : '',
        '</div>',
        '<input type="text" id="vegTextInput" class="ni-input" placeholder="Gõ bản dịch tiếng Anh của bạn...">',
        '<div class="veg-actions-row">',
        !q.answered ? '<button type="button" class="ni-submit-btn" data-action="submit-text">Chấm bản dịch</button>' : '<button type="button" class="ni-submit-btn" data-action="next-question">Câu tiếp theo →</button>',
        '  <button type="button" class="ni-nav-btn" data-action="use-hint">💡 Gợi ý (-15đ)</button>',
        '  <button type="button" class="ni-nav-btn" data-action="speak" data-speak-text="' + escapeHtml(q.targetEn) + '">🔊 Nghe mẫu</button>',
        '</div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'falling_words') {
      if (findEl('vegFallingArena') && findEl('vegFallingOptions') && findEl('vegTextInput')) {
        updateFallingWordsDom(true);
        return;
      }
      var fs = state.fallingState;
      html = [
        '<div class="veg-prompt-box"><div id="vegFallingHeader" class="veg-prompt-vi">Wave ' + fs.wave + ' • Bắt nghĩa tiếng Anh của các từ đang rơi!</div></div>',
        '<div id="vegFallingArena" class="veg-arena">' + buildFallingArenaHtml(fs) + '</div>',
        '<div id="vegFallingOptions" class="veg-options-grid">' + buildFallingOptionsHtml(q) + '</div>',
        '<div class="veg-actions-row">',
        '  <input type="text" id="vegTextInput" class="ni-input" placeholder="Hoặc gõ nhanh từ tiếng Anh rồi nhấn Enter..." style="flex:1;min-width:180px;">',
        '  <button type="button" class="ni-submit-btn" data-action="submit-text">Bắt từ</button>',
        '</div>',
        '<div id="vegFallingFeedback">' + renderFeedbackHtml() + '</div>'
      ].join('\n');
    } else if (state.mode === 'spot_fix') {
      var segHtml = '';
      for (var sgi = 0; sgi < q.segments.length; sgi++) {
        var seg = q.segments[sgi];
        var picked = (state._pickedFaultIndex === seg.index) ? ' is-picked' : '';
        segHtml += '<button type="button" class="veg-seg-token' + picked + '" data-action="pick-segment" data-seg-index="' + seg.index + '">' + escapeHtml(seg.text) + '</button>';
      }
      var sfOpts = '';
      for (var sfi = 0; sfi < q.options.length; sfi++) {
        var sCls = 'veg-opt-btn';
        if (q.answered && state.lastFeedback) {
          if (sfi === q.correctOptionIndex) sCls += ' is-correct';
        }
        sfOpts += '<button type="button" class="' + sCls + '" data-action="submit-option" data-option-index="' + sfi + '">' + escapeHtml(q.options[sfi].label) + '</button>';
      }
      html = [
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-amber">🔎 Tìm &amp; sửa 1 lỗi dịch sai</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">Tiếng Việt gốc: "' + escapeHtml(q.viSource) + '"</div>',
        '  <div style="margin-top:10px;">' + segHtml + '</div>',
        '</div>',
        '<div class="veg-options-grid">' + sfOpts + '</div>',
        '<div class="veg-actions-row">',
        '  <input type="text" id="vegTextInput" class="ni-input" placeholder="Hoặc chọn đoạn sai ở trên rồi gõ từ sửa đúng..." style="flex:1;min-width:180px;">',
        !q.answered ? '<button type="button" class="ni-submit-btn" data-action="submit-spot-fix">Sửa lỗi</button>' : '<button type="button" class="ni-submit-btn" data-action="next-question">Câu tiếp theo →</button>',
        '</div>',
        renderFeedbackHtml()
      ].join('\n');
    } else if (state.mode === 'dialogue_chain') {
      var ds = state.dialogueState;
      var logHtml = '';
      if (ds && ds.completedTurns.length) {
        logHtml += '<div class="veg-chat-log">';
        for (var dt = 0; dt < ds.completedTurns.length; dt++) {
          var turnDone = ds.completedTurns[dt];
          logHtml += '<div class="veg-chat-turn is-done"><strong>' + escapeHtml(turnDone.speaker) + ':</strong> ' + escapeHtml(turnDone.targetEn) + ' <span class="veg-hint">(' + escapeHtml(turnDone.lineVi) + ')</span></div>';
        }
        logHtml += '</div>';
      }
      var dcOpts = '';
      for (var dci = 0; dci < q.options.length; dci++) {
        var dCls = 'veg-opt-btn';
        if (q.answered && state.lastFeedback) {
          if (dci === q.correctOptionIndex) dCls += ' is-correct';
        }
        dcOpts += '<button type="button" class="' + dCls + '" data-action="submit-option" data-option-index="' + dci + '">' + escapeHtml(q.options[dci]) + '</button>';
      }
      html = [
        logHtml,
        '<div class="veg-prompt-box">',
        '  <span class="ni-badge ni-badge-green">💬 Lượt ' + (q.turnIndex + 1) + '/' + (ds ? ds.totalTurns : state.totalQuestions) + ' — ' + escapeHtml(q.speaker) + '</span>',
        '  <div class="veg-prompt-vi" style="margin-top:6px;">' + escapeHtml(q.lineVi) + '</div>',
        '</div>',
        '<div class="veg-options-grid">' + dcOpts + '</div>',
        '<div class="veg-actions-row">',
        '  <input type="text" id="vegTextInput" class="ni-input" placeholder="Hoặc tự gõ câu dịch tiếng Anh cho lượt này..." style="flex:1;min-width:180px;">',
        !q.answered ? '<button type="button" class="ni-submit-btn" data-action="submit-text">Gửi lượt</button>' : '<button type="button" class="ni-submit-btn" data-action="next-question">Lượt tiếp theo →</button>',
        '</div>',
        renderFeedbackHtml()
      ].join('\n');
    }

    stage.innerHTML = html;
  }

  function renderResultBox() {
    var box = findEl('vegResultBox');
    if (!box) return;

    if (state.status !== 'finished' || !state.summary) {
      if (box.classList && typeof box.classList.add === 'function') {
        box.classList.add('hidden');
      }
      box.innerHTML = '';
      return;
    }

    if (box.classList && typeof box.classList.remove === 'function') {
      box.classList.remove('hidden');
    }

    var sum = state.summary;
    var mistakes = state.history.filter(function (h) { return !h.isCorrect && h.correctAnswer; });
    var mistakesHtml = '';
    if (mistakes.length) {
      mistakesHtml = '<div class="err-box" style="margin-top:12px;text-align:left;"><strong>Cần ôn lại (' + mistakes.length + '):</strong><ul style="margin:6px 0 0 18px;">';
      for (var i = 0; i < Math.min(mistakes.length, 6); i++) {
        mistakesHtml += '<li>' + escapeHtml(mistakes[i].correctAnswer) + '</li>';
      }
      mistakesHtml += '</ul></div>';
    }

    box.innerHTML = [
      '<div class="score-line">',
      '  <div class="score-main">' + sum.finalScore + ' <span style="font-size:18px;font-weight:700;">điểm (Hạng ' + escapeHtml(sum.grade) + ')</span></div>',
      '  <div class="mini-bands">',
      '    <div class="mini-band"><span>Chính xác</span><strong>' + sum.accuracy + '%</strong></div>',
      '    <div class="mini-band"><span>Đúng/Tổng</span><strong>' + sum.correctCount + '/' + (sum.correctCount + sum.wrongCount) + '</strong></div>',
      '    <div class="mini-band"><span>Chuỗi cao nhất</span><strong>' + sum.bestStreak + '</strong></div>',
      '    <div class="mini-band"><span>XP</span><strong>+' + sum.xpEarned + '</strong></div>',
      '  </div>',
      '</div>',
      mistakesHtml,
      '<div class="veg-actions-row" style="margin-top:14px;">',
      '  <button type="button" class="ni-submit-btn" data-action="restart">🔄 Chơi lại lượt mới</button>',
      '  <button type="button" class="ni-nav-btn" data-action="next-mode">🎮 Chuyển chế độ tiếp theo</button>',
      '</div>'
    ].join('\n');
  }

  function renderAll() {
    if (!rootEl || typeof document === 'undefined') return;
    var sel = findEl('vegUnitSelect');
    if (sel && state.unitId && sel.value !== state.unitId) {
      sel.value = state.unitId;
    }
    renderModeGrid();
    renderScoreHud();
    renderStage();
    renderResultBox();
  }

  // ==================== Event Delegation & Init/Destroy ====================

  function attachDelegatedEvents(root) {
    detachDelegatedEvents();
    if (!root || typeof root.addEventListener !== 'function') return;

    var onClick = function (e) {
      var target = e && e.target;
      while (target && target !== root && !(target.dataset && target.dataset.action)) {
        target = target.parentNode;
      }
      if (!target || !target.dataset || !target.dataset.action) return;

      var domOpts = domInitAppData ? { appData: domInitAppData } : undefined;
      var action = target.dataset.action;
      if (action === 'select-mode') {
        var newMode = target.dataset.mode;
        if (newMode) startGame(newMode, state.unitId || (getAvailableUnits(domInitAppData)[0] && getAvailableUnits(domInitAppData)[0].unitId), domOpts);
      } else if (action === 'restart') {
        startGame(state.mode, state.unitId || (getAvailableUnits(domInitAppData)[0] && getAvailableUnits(domInitAppData)[0].unitId), domOpts);
      } else if (action === 'next-mode') {
        var idx = 0;
        for (var i = 0; i < MODES.length; i++) {
          if (MODES[i].id === state.mode) { idx = (i + 1) % MODES.length; break; }
        }
        startGame(MODES[idx].id, state.unitId, domOpts);
      } else if (action === 'select-tile') {
        selectTile(target.dataset.tileId);
      } else if (action === 'undo-tile') {
        undoTile();
      } else if (action === 'clear-tiles') {
        clearTiles();
      } else if (action === 'submit-tiles') {
        submitAnswer({});
      } else if (action === 'use-hint') {
        useHint();
      } else if (action === 'next-question') {
        nextQuestion();
      } else if (action === 'submit-option') {
        submitAnswer({ optionIndex: parseInt(target.dataset.optionIndex, 10) });
      } else if (action === 'submit-text') {
        var inputEl = findEl('vegTextInput');
        var subRes = submitAnswer({ text: inputEl ? inputEl.value : '' });
        if (state.mode === 'falling_words' && subRes && subRes.isCorrect && inputEl) {
          inputEl.value = '';
        }
      } else if (action === 'match-vi') {
        submitAnswer({ selectVi: target.dataset.pairId });
      } else if (action === 'match-en') {
        submitAnswer({ selectEn: target.dataset.pairId });
      } else if (action === 'pick-segment') {
        state._pickedFaultIndex = parseInt(target.dataset.segIndex, 10);
        renderStage();
      } else if (action === 'submit-spot-fix') {
        var fixInput = findEl('vegTextInput');
        submitAnswer({
          faultIndex: typeof state._pickedFaultIndex === 'number' ? state._pickedFaultIndex : 0,
          fix: fixInput ? fixInput.value : ''
        });
      } else if (action === 'speak') {
        speak(target.dataset.speakText || '');
      }
    };

    var onChange = function (e) {
      var target = e && e.target;
      if (target && target.id === 'vegUnitSelect') {
        var domOpts = domInitAppData ? { appData: domInitAppData } : undefined;
        startGame(state.mode, target.value, domOpts);
      }
    };

    var onKeyDown = function (e) {
      if (e && e.key === 'Enter' && e.target && e.target.id === 'vegTextInput') {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (state.mode === 'spot_fix') {
          submitAnswer({
            faultIndex: typeof state._pickedFaultIndex === 'number' ? state._pickedFaultIndex : 0,
            fix: e.target.value
          });
        } else {
          var keyRes = submitAnswer({ text: e.target.value });
          if (state.mode === 'falling_words' && keyRes && keyRes.isCorrect) {
            e.target.value = '';
          }
        }
      }
    };

    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKeyDown);
    boundListeners.push({ root: root, type: 'click', fn: onClick });
    boundListeners.push({ root: root, type: 'change', fn: onChange });
    boundListeners.push({ root: root, type: 'keydown', fn: onKeyDown });
    if (root.dataset) root.dataset.vegBound = '1';
  }

  function detachDelegatedEvents() {
    for (var i = 0; i < boundListeners.length; i++) {
      var b = boundListeners[i];
      if (b.root && typeof b.root.removeEventListener === 'function') {
        b.root.removeEventListener(b.type, b.fn);
      }
      if (b.root && b.root.dataset) {
        delete b.root.dataset.vegBound;
      }
    }
    boundListeners = [];
  }

  function cancelAutoBoot() {
    if (autoBootTimeoutId !== null && typeof clearTimeout === 'function') {
      clearTimeout(autoBootTimeoutId);
      autoBootTimeoutId = null;
    }
    if (autoBootListener !== null && typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
      document.removeEventListener('DOMContentLoaded', autoBootListener);
      autoBootListener = null;
    }
  }

  function init(containerEl, opts) {
    cancelAutoBoot();
    domInitAppData = (opts && opts.appData) || null;
    if (typeof document === 'undefined') {
      return getState();
    }

    var target = containerEl || (typeof document.getElementById === 'function' ? document.getElementById('tab-games') : null);
    if (!target) return getState();

    rootEl = target;
    if (typeof rootEl.setAttribute === 'function') {
      rootEl.setAttribute('data-veg-root', '1');
    } else if (rootEl.dataset) {
      rootEl.dataset.vegRoot = '1';
    }

    injectStyles(rootEl);
    ensureShellMounted(rootEl);
    attachDelegatedEvents(rootEl);

    var units = getAvailableUnits(domInitAppData);
    var initialUnitId = (opts && opts.unitId) || state.unitId || (units[0] && units[0].unitId);
    var initialMode = (opts && opts.mode) || state.mode || 'word_tiles';

    if (units.length && (state.status === 'idle' || (opts && opts.autoStart))) {
      startGame(initialMode, initialUnitId, opts);
      populateUnitSelect(domInitAppData);
    } else {
      populateUnitSelect(domInitAppData);
      renderAll();
    }

    return getState();
  }

  function destroy() {
    cancelAutoBoot();
    stopTimers();
    detachDelegatedEvents();
    domInitAppData = null;
    rootEl = null;
    state = createIdleState();
  }

  // Browser DOMContentLoaded auto-init if #tab-games is already present
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    autoBootListener = function () {
      autoBootTimeoutId = null;
      autoBootListener = null;
      var tab = typeof document.getElementById === 'function' ? document.getElementById('tab-games') : null;
      if (tab) init(tab);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoBootListener);
    } else if (typeof setTimeout === 'function') {
      autoBootTimeoutId = setTimeout(autoBootListener, 10);
    }
  }

  return {
    MODES: deepClone(MODES),
    init: init,
    destroy: destroy,
    getAvailableUnits: getAvailableUnits,
    getModes: function () { return deepClone(MODES); },
    getUnitVocabulary: getUnitVocabulary,
    resolveUnit: function (idOrNum) {
      var u = resolveUnit(idOrNum);
      return u ? deepClone({ unitId: u.unitId, unitNumber: u.unitNumber, unitTitle: u.unitTitle, wordCount: u.wordCount }) : null;
    },
    startGame: startGame,
    submitAnswer: submitAnswer,
    nextQuestion: nextQuestion,
    selectTile: selectTile,
    undoTile: undoTile,
    clearTiles: clearTiles,
    useHint: useHint,
    tickTimer: tickTimer,
    tickFallingWords: tickFallingWords,
    finishGame: finishGame,
    getState: getState,
    getStats: getStats,
    speak: speak
  };
}));
