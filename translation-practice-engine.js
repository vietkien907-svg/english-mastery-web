/**
 * Translation Practice & Automated Writing Grader Engine (v105.0 - Milestone M3)
 * - Multi-source Vietnamese article browser (window.TRANSLATION_BANK + AI + Online News + Personal)
 * - Unit-normalized filtering, diacritic-insensitive search, sentence-boundary word-limit slicing
 * - Personal EN/VI paste & .txt/.md/.json upload with Groq BYOK -> Google gtx -> local lexicon fallback
 * - Calibrated IELTS-style Vi->En Writing Grader (0-10 & 0-9) + Groq LLM enhancement
 * - Daily deadline hook ('translation') & Read-Aloud handoff to window.ReadAloudEngine
 * - UMD compatible (browser global + Node vm/CommonJS testing)
 */

(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.TranslationPracticeEngine = api;
  }
}(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis), function (root) {
  'use strict';

  const STORAGE_GROQ_KEY = 'user_groq_api_key';
  const STORAGE_TR_HISTORY = 'emh_tr_history_v1';
  const STORAGE_TR_RUNTIME = 'emh_tr_runtime_articles_v1';
  const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];

  const VIETNAMESE_DIACRITIC_RX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi;
  const UNACCENTED_VI_MARKERS = new Set([
    'cua', 'nhung', 'nguoi', 'duoc', 'khong', 'trong', 'chung', 'nhieu', 'nhu',
    'nay', 'khi', 'voi', 'cac', 'mot', 'nha', 'viet', 'nam', 'hoc', 'sinh',
    'cong', 'nghe', 'cuoc', 'song', 'hang', 'ngay', 'chuyen', 'gia', 'phat', 'trien',
    'hom', 'toi', 'troi', 'dep', 'qua', 'viec', 'lam', 'tieng', 'anh', 'biet',
    'hieu', 'muon', 'thich', 'nhin', 'nghe', 'doc', 'xem', 'ngay', 'buoi', 'sang',
    'chieu', 'nhanh', 'cham', 'nho', 'lon', 'moi', 'rat', 'cung', 'chi', 'chu',
    'nhung', 'ma', 'thi', 'roi', 'nhe', 'tu', 'den', 'cho', 'de', 'di', 've',
    'ban', 'ong', 'ba', 'em', 'yeu', 'gioi', 'hay', 'truong', 'lop', 'thay'
  ]);

  const COMMON_EN_ANCHORS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by',
    'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all',
    'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
    'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
    'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
    'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
    'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has', 'had', 'did', 'does',
    'very', 'more', 'many', 'much', 'should', 'must', 'need', 'help', 'learn',
    'study', 'english', 'life', 'world', 'city', 'country', 'important', 'modern',
    'technology', 'education', 'health', 'environment', 'students', 'government'
  ]);

  const EN_STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this',
    'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'to', 'of', 'in', 'on', 'at', 'by',
    'for', 'with', 'from', 'as', 'into', 'onto', 'upon', 'about', 'above', 'below',
    'between', 'through', 'during', 'before', 'after', 'while', 'where', 'when',
    'who', 'whom', 'whose', 'which', 'what', 'why', 'how', 'it', 'its', 'they',
    'them', 'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she',
    'her', 'i', 'me', 'my', 'mine', 'not', 'no', 'so', 'too', 'very', 'just', 'only'
  ]);

  const DISCOURSE_MARKERS = [
    'however', 'moreover', 'therefore', 'consequently', 'furthermore', 'nevertheless',
    'additionally', 'meanwhile', 'otherwise', 'instead', 'similarly', 'likewise',
    'for example', 'for instance', 'in addition', 'on the other hand', 'as a result',
    'in contrast', 'in conclusion', 'to sum up', 'firstly', 'secondly', 'finally',
    'although', 'even though', 'despite', 'because', 'since', 'whereas', 'while'
  ];

  // Built-in core En->Vi dictionary (~260 phrases & high-frequency words) for offline fallback
  const CORE_EN_VI_PHRASES = [
    ['in order to', 'để'],
    ['for example', 'ví dụ như'],
    ['for instance', 'chẳng hạn như'],
    ['as a result', 'kết quả là'],
    ['because of', 'bởi vì'],
    ['due to', 'do'],
    ['according to', 'theo như'],
    ['on the other hand', 'mặt khác'],
    ['in addition', 'ngoài ra'],
    ['more and more', 'ngày càng nhiều'],
    ['play an important role', 'đóng một vai trò quan trọng'],
    ['plays an important role', 'đóng một vai trò quan trọng'],
    ['take part in', 'tham gia vào'],
    ['participate in', 'tham gia vào'],
    ['focus on', 'tập trung vào'],
    ['depend on', 'phụ thuộc vào'],
    ['depends on', 'phụ thuộc vào'],
    ['lead to', 'dẫn đến'],
    ['leads to', 'dẫn đến'],
    ['instead of', 'thay vì'],
    ['even though', 'mặc dù'],
    ['a lot of', 'rất nhiều'],
    ['lots of', 'rất nhiều'],
    ['such as', 'như là'],
    ['artificial intelligence', 'trí tuệ nhân tạo'],
    ['climate change', 'biến đổi khí hậu'],
    ['social media', 'mạng xã hội'],
    ['mental health', 'sức khỏe tinh thần'],
    ['daily life', 'cuộc sống hằng ngày'],
    ['every day', 'mỗi ngày'],
    ['high school', 'trường trung học phổ thông'],
    ['public transport', 'giao thông công cộng'],
    ['young people', 'giới trẻ'],
    ['in the future', 'trong tương lai'],
    ['nowadays', 'ngày nay']
  ];

  const CORE_EN_VI_WORDS = {
    i: 'tôi', me: 'tôi', my: 'của tôi', we: 'chúng tôi', us: 'chúng ta', our: 'của chúng ta',
    you: 'bạn', your: 'của bạn', they: 'họ', them: 'họ', their: 'của họ',
    he: 'anh ấy', him: 'anh ấy', his: 'của anh ấy', she: 'cô ấy', her: 'của cô ấy',
    it: 'nó', its: 'của nó', this: 'này', that: 'đó', these: 'những điều này', those: 'những điều đó',
    there: 'có', here: 'ở đây', who: 'người mà', which: 'điều mà', what: 'cái gì', where: 'nơi mà',
    when: 'khi', why: 'tại sao', how: 'cách mà', if: 'nếu', unless: 'trừ khi',
    because: 'bởi vì', since: 'vì', although: 'mặc dù', though: 'dù', while: 'trong khi',
    whereas: 'trong khi đó', however: 'tuy nhiên', moreover: 'hơn nữa', therefore: 'vì vậy',
    consequently: 'do đó', furthermore: 'thêm vào đó', finally: 'cuối cùng',
    first: 'đầu tiên', second: 'thứ hai', also: 'cũng', still: 'vẫn', already: 'đã',
    always: 'luôn luôn', often: 'thường xuyên', usually: 'thường', sometimes: 'đôi khi',
    never: 'không bao giờ', today: 'hôm nay', yesterday: 'hôm qua', tomorrow: 'ngày mai',
    now: 'bây giờ', soon: 'sớm', recently: 'gần đây',
    and: 'và', or: 'hoặc', but: 'nhưng', so: 'nên', not: 'không', no: 'không',
    very: 'rất', quite: 'khá', really: 'thực sự', too: 'quá', more: 'nhiều hơn', most: 'nhất',
    many: 'nhiều', much: 'nhiều', few: 'ít', little: 'một chút', some: 'một số', any: 'bất kỳ',
    all: 'tất cả', every: 'mỗi', each: 'mỗi', other: 'khác', another: 'một khác',
    in: 'trong', on: 'trên', at: 'tại', to: 'đến', for: 'cho', of: 'của', with: 'với',
    without: 'không có', by: 'bởi', from: 'từ', about: 'về', into: 'vào trong',
    through: 'thông qua', during: 'trong suốt', before: 'trước khi', after: 'sau khi',
    between: 'giữa', among: 'trong số', under: 'dưới', over: 'hơn',
    is: 'là', are: 'là', was: 'đã là', were: 'đã là', be: 'trở thành', been: 'đã được',
    am: 'là', have: 'có', has: 'có', had: 'đã có', do: 'làm', does: 'làm', did: 'đã làm',
    can: 'có thể', could: 'có thể', will: 'sẽ', would: 'sẽ', should: 'nên', must: 'phải',
    may: 'có thể', might: 'có lẽ', need: 'cần', want: 'muốn',
    make: 'tạo ra', makes: 'tạo ra', made: 'đã tạo ra',
    take: 'lấy', takes: 'lấy', took: 'đã lấy',
    give: 'đưa ra', gives: 'đưa ra', gave: 'đã đưa ra',
    get: 'nhận được', gets: 'nhận được', got: 'đã nhận được',
    go: 'đi', goes: 'đi', went: 'đã đi', come: 'đến', comes: 'đến', came: 'đã đến',
    see: 'thấy', look: 'nhìn', watch: 'xem', listen: 'nghe', speak: 'nói', talk: 'trò chuyện',
    say: 'nói', tell: 'kể', ask: 'hỏi', answer: 'trả lời', read: 'đọc', write: 'viết',
    learn: 'học', study: 'nghiên cứu', teach: 'dạy', practice: 'luyện tập',
    work: 'làm việc', works: 'làm việc', worked: 'đã làm việc',
    live: 'sống', lives: 'sống', lived: 'đã sống',
    use: 'sử dụng', uses: 'sử dụng', used: 'đã sử dụng', using: 'việc sử dụng',
    help: 'giúp đỡ', helps: 'giúp đỡ', helped: 'đã giúp đỡ',
    improve: 'cải thiện', improves: 'cải thiện', improved: 'đã cải thiện',
    develop: 'phát triển', develops: 'phát triển', developed: 'đã phát triển', development: 'sự phát triển',
    create: 'tạo nên', creates: 'tạo nên', created: 'đã tạo nên',
    build: 'xây dựng', change: 'thay đổi', changes: 'thay đổi',
    increase: 'tăng lên', reduce: 'giảm bớt', protect: 'bảo vệ', save: 'tiết kiệm',
    share: 'chia sẻ', connect: 'kết nối', support: 'hỗ trợ', solve: 'giải quyết',
    understand: 'hiểu', know: 'biết', think: 'nghĩ', believe: 'tin rằng', feel: 'cảm thấy',
    become: 'trở nên', becomes: 'trở nên', became: 'đã trở nên',
    remain: 'vẫn giữ', continue: 'tiếp tục', start: 'bắt đầu', begin: 'bắt đầu',
    stop: 'dừng lại', finish: 'hoàn thành', achieve: 'đạt được',
    people: 'mọi người', person: 'người', student: 'học sinh', students: 'học sinh',
    teacher: 'giáo viên', teachers: 'giáo viên', family: 'gia đình', friend: 'bạn bè', friends: 'bạn bè',
    child: 'trẻ em', children: 'trẻ em', parent: 'cha mẹ', parents: 'cha mẹ',
    government: 'chính phủ', society: 'xã hội', community: 'cộng đồng', country: 'đất nước',
    city: 'thành phố', cities: 'các thành phố', world: 'thế giới',
    school: 'trường học', university: 'trường đại học', education: 'giáo dục',
    knowledge: 'kiến thức', skill: 'kỹ năng', skills: 'các kỹ năng', language: 'ngôn ngữ',
    english: 'tiếng Anh', vietnamese: 'tiếng Việt',
    technology: 'công nghệ', internet: 'mạng internet', computer: 'máy tính', phone: 'điện thoại',
    data: 'dữ liệu', information: 'thông tin', system: 'hệ thống',
    health: 'sức khỏe', exercise: 'tập thể dục', food: 'thực phẩm', water: 'nước',
    environment: 'môi trường', nature: 'thiên nhiên', energy: 'năng lượng',
    pollution: 'ô nhiễm', traffic: 'giao thông', economy: 'kinh tế', business: 'kinh doanh',
    money: 'tiền bạc', job: 'công việc', jobs: 'việc làm', career: 'sự nghiệp',
    time: 'thời gian', life: 'cuộc sống', day: 'ngày', week: 'tuần', month: 'tháng', year: 'năm', years: 'năm',
    problem: 'vấn đề', problems: 'các vấn đề', solution: 'giải pháp', solutions: 'các giải pháp',
    benefit: 'lợi ích', benefits: 'những lợi ích', challenge: 'thách thức', challenges: 'những thách thức',
    opportunity: 'cơ hội', opportunities: 'cơ hội', experience: 'kinh nghiệm',
    idea: 'ý tưởng', ideas: 'những ý tưởng', habit: 'thói quen', habits: 'thói quen',
    culture: 'văn hóa', travel: 'du lịch', book: 'sách', books: 'sách', news: 'tin tức',
    good: 'tốt', better: 'tốt hơn', best: 'tốt nhất', bad: 'xấu', worse: 'tệ hơn',
    important: 'quan trọng', essential: 'thiết yếu', necessary: 'cần thiết',
    useful: 'hữu ích', helpful: 'hữu ích', effective: 'hiệu quả', efficient: 'hiệu quả',
    easy: 'dễ dàng', difficult: 'khó khăn', hard: 'khó khăn', simple: 'đơn giản', complex: 'phức tạp',
    modern: 'hiện đại', traditional: 'truyền thống', new: 'mới', old: 'cũ',
    young: 'trẻ', large: 'lớn', big: 'lớn', small: 'nhỏ', high: 'cao', low: 'thấp',
    long: 'dài', short: 'ngắn', fast: 'nhanh', quick: 'nhanh chóng', slow: 'chậm',
    different: 'khác nhau', similar: 'tương tự', same: 'giống nhau',
    positive: 'tích cực', negative: 'tiêu cực', popular: 'phổ biến', common: 'phổ biến',
    clear: 'rõ ràng', strong: 'mạnh mẽ', healthy: 'khỏe mạnh', safe: 'an toàn',
    busy: 'bận rộn', happy: 'hạnh phúc', free: 'miễn phí', public: 'công cộng',
    global: 'toàn cầu', local: 'địa phương', digital: 'kỹ thuật số', online: 'trực tuyến',
    daily: 'hằng ngày', natural: 'tự nhiên', sustainable: 'bền vững'
  };

  let cachedEnViLexicon = null;
  let cachedLexiconUnitCount = -1;

  const state = {
    mounted: false,
    runtimeArticles: [],
    filters: {
      sourceGroup: 'all',
      unitId: 'all',
      lengthTier: 'all',
      customWordLimit: 120,
      search: '',
      page: 1,
      pageSize: 10
    },
    activeArticle: null,
    activePassageVi: '',
    lastGradeResult: null,
    translationCompletedForCurrent: false,
    completedArticleIds: Object.create(null),
    isGrading: false,
    isRefreshing: false,
    history: []
  };

  function getGlobal() {
    if (typeof window !== 'undefined') return window;
    if (typeof root !== 'undefined' && root) return root;
    return globalThis;
  }

  function safeStorageGet(key) {
    try {
      const g = getGlobal();
      if (g && g.localStorage && typeof g.localStorage.getItem === 'function') {
        return g.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  }

  function safeStorageSet(key, value) {
    try {
      const g = getGlobal();
      if (g && g.localStorage && typeof g.localStorage.setItem === 'function') {
        g.localStorage.setItem(key, value);
      }
    } catch (e) {}
  }

  function loadPersistedState() {
    try {
      const rawHist = safeStorageGet(STORAGE_TR_HISTORY);
      if (rawHist) {
        const parsed = JSON.parse(rawHist);
        if (Array.isArray(parsed)) state.history = parsed.slice(0, 50);
      }
    } catch (e) {}
    try {
      const rawRun = safeStorageGet(STORAGE_TR_RUNTIME);
      if (rawRun) {
        const parsed = JSON.parse(rawRun);
        if (Array.isArray(parsed)) state.runtimeArticles = parsed.slice(0, 40);
      }
    } catch (e) {}
  }

  function persistRuntimeArticles() {
    try {
      safeStorageSet(STORAGE_TR_RUNTIME, JSON.stringify(state.runtimeArticles.slice(0, 40)));
    } catch (e) {}
  }

  function persistHistory() {
    try {
      safeStorageSet(STORAGE_TR_HISTORY, JSON.stringify(state.history.slice(0, 50)));
    } catch (e) {}
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==================== A. NORMALIZATION & CATALOG HELPERS ====================

  function normalizeVi(str) {
    return String(str == null ? '' : str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeUnitKey(ref) {
    if (ref === null || ref === undefined) return null;
    if (typeof ref === 'number' && Number.isFinite(ref) && ref > 0) {
      return 'unit' + Math.trunc(ref);
    }
    const raw = String(ref).trim();
    if (!raw || raw.toLowerCase() === 'all') return null;
    if (/^custom[_\s-]*items?$/i.test(raw) || /custom_items/i.test(raw)) {
      return 'custom_items';
    }
    const unitMatch = raw.match(/(?:^|\b)unit[_\s-]*(\d+)(?!\d)/i);
    if (unitMatch) {
      return 'unit' + Number(unitMatch[1]);
    }
    const numOnly = raw.match(/^(\d+)$/);
    if (numOnly) {
      return 'unit' + Number(numOnly[1]);
    }
    return normalizeVi(raw).replace(/\s+/g, '_');
  }

  function getUnitCatalog(appDataOpt) {
    const g = getGlobal();
    const appData = appDataOpt || g.APP_DATA;
    const units = appData && Array.isArray(appData.units) ? appData.units : [];
    const seen = new Set();
    const catalog = [];

    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (!u || typeof u !== 'object') continue;
      const key = normalizeUnitKey(
        u.unitNumber != null ? u.unitNumber : (u.unitId || u.unitTitle || i + 1)
      );
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const numMatch = key.match(/^unit(\d+)$/);
      catalog.push({
        key,
        unitId: u.unitId || key,
        unitNumber: u.unitNumber != null ? Number(u.unitNumber) : (numMatch ? Number(numMatch[1]) : null),
        unitTitle: u.unitTitle || (numMatch ? 'Unit ' + numMatch[1] : key)
      });
    }
    return catalog;
  }

  function countWords(text) {
    const clean = String(text == null ? '' : text).trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  }

  function getLengthTierFromWordCount(wordCount) {
    const wc = Number(wordCount) || 0;
    if (wc < 90) return 'short';
    if (wc <= 180) return 'medium';
    return 'long';
  }

  function normalizeArticleRecord(raw, idx) {
    if (!raw || typeof raw !== 'object') return null;
    const rawText = typeof raw.textVi === 'string'
      ? raw.textVi
      : (typeof raw.text === 'string' ? raw.text : '');
    const textVi = rawText.trim();
    if (!textVi) return null;
    const wc = raw.wordCountVi > 0 ? Number(raw.wordCountVi) : countWords(textVi);
    const tier = raw.lengthTier && ['short', 'medium', 'long'].includes(raw.lengthTier)
      ? raw.lengthTier
      : getLengthTierFromWordCount(wc);
    const unitKey = normalizeUnitKey(raw.unitId != null ? raw.unitId : raw.unitNumber);
    const numMatch = unitKey ? unitKey.match(/^unit(\d+)$/) : null;
    const hasExplicitId = raw.id !== undefined && raw.id !== null && String(raw.id) !== '';

    return {
      id: hasExplicitId ? String(raw.id) : ('tb_item_' + (idx || 0)),
      title: String(raw.title || raw.titleEn || 'Bài luyện dịch').trim(),
      titleEn: String(raw.titleEn || '').trim(),
      sourceGroup: String(raw.sourceGroup || 'unit').trim(),
      sourceLabel: String(raw.sourceLabel || 'Kho bài dịch').trim(),
      unitId: raw.unitId || unitKey || null,
      unitNumber: raw.unitNumber != null ? Number(raw.unitNumber) : (numMatch ? Number(numMatch[1]) : null),
      unitKey,
      topic: String(raw.topic || '').trim(),
      level: String(raw.level || 'B1').trim(),
      lengthTier: tier,
      wordCountVi: wc,
      textVi,
      referenceEn: String(raw.referenceEn || '').trim(),
      keywords: Array.isArray(raw.keywords) ? raw.keywords.map(k => String(k).trim()).filter(Boolean) : [],
      isAiGenerated: Boolean(raw.isAiGenerated)
    };
  }

  function getMergedBank() {
    const g = getGlobal();
    const builtin = Array.isArray(g.TRANSLATION_BANK) ? g.TRANSLATION_BANK : [];
    const combined = [];
    const seenIds = new Set();

    for (let i = 0; i < state.runtimeArticles.length; i++) {
      const norm = normalizeArticleRecord(state.runtimeArticles[i], i);
      if (norm && !seenIds.has(norm.id)) {
        seenIds.add(norm.id);
        combined.push(norm);
      }
    }
    for (let i = 0; i < builtin.length; i++) {
      const norm = normalizeArticleRecord(builtin[i], i);
      if (norm && !seenIds.has(norm.id)) {
        seenIds.add(norm.id);
        combined.push(norm);
      }
    }
    return combined;
  }

  // ==================== B. ARTICLE FILTERING & SLICING ====================

  function filterArticles(articles, filters) {
    const list = Array.isArray(articles) ? articles : getMergedBank();
    const f = filters || {};
    const sourceGroup = f.sourceGroup && f.sourceGroup !== 'all' ? String(f.sourceGroup).trim() : null;
    const unitKeyFilter = f.unitId && f.unitId !== 'all' ? normalizeUnitKey(f.unitId) : null;
    const lengthTier = f.lengthTier && f.lengthTier !== 'all' && f.lengthTier !== 'custom'
      ? String(f.lengthTier).trim()
      : null;
    const searchNorm = f.search ? normalizeVi(f.search) : '';

    const matched = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item || !item.textVi) continue;

      if (sourceGroup === 'study4') {
        if (!String(item.id || '').startsWith('tb_study4_')) continue;
      } else if (sourceGroup && item.sourceGroup !== sourceGroup) {
        continue;
      }

      if (unitKeyFilter) {
        const itemUnitKey = item.unitKey || normalizeUnitKey(item.unitId != null ? item.unitId : item.unitNumber);
        if (itemUnitKey !== unitKeyFilter) continue;
      }

      if (lengthTier) {
        const itemTier = item.lengthTier || getLengthTierFromWordCount(item.wordCountVi || countWords(item.textVi));
        if (itemTier !== lengthTier) continue;
      }

      if (searchNorm) {
        const haystack = normalizeVi([
          item.title,
          item.titleEn,
          item.textVi,
          item.topic,
          item.sourceLabel,
          Array.isArray(item.keywords) ? item.keywords.join(' ') : ''
        ].join(' '));
        if (!haystack.includes(searchNorm)) continue;
      }

      matched.push(item);
    }

    if (typeof f.offset === 'number' || typeof f.limit === 'number') {
      const offset = Math.max(0, Number(f.offset) || 0);
      const limit = typeof f.limit === 'number' && Number.isFinite(f.limit) && f.limit >= 0
        ? Number(f.limit)
        : matched.length;
      return matched.slice(offset, offset + limit);
    }

    if (typeof f.page === 'number' && typeof f.pageSize === 'number' && f.pageSize > 0) {
      const page = Math.max(1, Number(f.page));
      const pageSize = Number(f.pageSize);
      const start = (page - 1) * pageSize;
      return matched.slice(start, start + pageSize);
    }

    return matched;
  }

  function queryArticles(articles, filters) {
    const f = filters || {};
    const pageSize = Math.max(1, Number(f.pageSize) || 10);
    const allMatched = filterArticles(articles, {
      sourceGroup: f.sourceGroup,
      unitId: f.unitId,
      lengthTier: f.lengthTier,
      search: f.search
    });
    const total = allMatched.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number(f.page) || 1));
    const start = (page - 1) * pageSize;
    return {
      items: allMatched.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages
    };
  }

  function splitSentencesSafe(text) {
    const protectedItems = [];
    const mask = (str) => {
      const token = '@@PROT' + protectedItems.length + '@@';
      protectedItems.push(str);
      return token;
    };

    // Protect decimals, prefix titles (Mr., Dr., ...), and mid-sentence abbreviations.
    // Sentence-ending abbreviations (U.S., etc., v.v., i.e., e.g.) followed by whitespace + uppercase
    // preserve their final '.' unmasked so sentence splitting works cleanly while internal dots stay protected.
    const UPPER_CHAR = 'A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ';
    const prefixRx = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Tp|TP|ThS|TS|PGS|GS)\./g;
    const midAbbrRx = new RegExp('\\b(?:e\\.g|E\\.g|i\\.e|I\\.e|etc|Etc|v\\.v|V\\.v|U\\.S|u\\.s|U\\.K|u\\.k)\\.(?!\\s+[' + UPPER_CHAR + '])', 'g');
    const endAbbrRx = new RegExp('\\b(?:e\\.g|E\\.g|i\\.e|I\\.e|v\\.v|V\\.v|U\\.S|u\\.s|U\\.K|u\\.k)(?=\\.\\s+[' + UPPER_CHAR + '])', 'g');

    let masked = String(text)
      .replace(/\d+\.\d+/g, (m) => mask(m))
      .replace(prefixRx, (m) => mask(m))
      .replace(midAbbrRx, (m) => mask(m))
      .replace(endAbbrRx, (m) => mask(m));

    const rawParts = masked.match(/[^.!?…]+(?:[.!?…]+|$)/g) || [masked];
    return rawParts
      .map((part) => {
        let restored = part;
        for (let i = 0; i < protectedItems.length; i++) {
          restored = restored.replace('@@PROT' + i + '@@', protectedItems[i]);
        }
        return restored.trim();
      })
      .filter(Boolean);
  }

  function sliceByWordLimit(text, targetWords) {
    const clean = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    const limit = Number(targetWords);
    if (!Number.isFinite(limit) || limit <= 0) return clean;
    if (countWords(clean) <= limit) return clean;

    const sentences = splitSentencesSafe(clean);
    if (sentences.length === 0) return clean;

    const selected = [];
    let running = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sent = sentences[i];
      const sw = countWords(sent);
      if (i === 0 && sw > limit) {
        // First sentence itself exceeds targetWords: preserve complete first sentence (never empty / never cut mid-sentence)
        // Unless there is NO terminal punctuation at all and block > 1.5x limit with clause breaks
        if (!/[.!?…]$/.test(sent) && sw > limit * 1.5 && /[,;]/.test(sent)) {
          const clauses = sent.split(/(?<=[,;])\s+/);
          const clauseBuf = [];
          let cw = 0;
          for (let c = 0; c < clauses.length; c++) {
            const w = countWords(clauses[c]);
            if (c === 0 || cw + w <= limit) {
              clauseBuf.push(clauses[c]);
              cw += w;
            } else {
              break;
            }
          }
          return clauseBuf.join(' ').trim();
        }
        return sent;
      }
      if (running + sw <= limit) {
        selected.push(sent);
        running += sw;
      } else {
        break;
      }
    }

    return selected.length > 0 ? selected.join(' ').trim() : sentences[0];
  }

  // ==================== C. LANGUAGE DETECTION, FILE PARSING & EN->VI FALLBACK ====================

  const VIETNAMESE_DIACRITIC_SINGLE_RX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

  function detectLanguageDetailed(text) {
    const clean = String(text == null ? '' : text).trim();
    const alphaChars = (clean.match(/[a-zA-ZÀ-ỹ]/g) || []).length;
    if (!clean || alphaChars < 2) {
      return { lang: 'unknown', viDiacritics: 0, enAnchors: 0, viMarkers: 0, viDensity: 0, viWordRatio: 0 };
    }

    const viMatches = clean.match(VIETNAMESE_DIACRITIC_RX) || [];
    const viDiacritics = viMatches.length;
    const rawTokens = clean.split(/\s+/).filter(Boolean);
    let viWordCount = 0;
    for (let i = 0; i < rawTokens.length; i++) {
      if (VIETNAMESE_DIACRITIC_SINGLE_RX.test(rawTokens[i])) viWordCount++;
    }
    const viDensity = viDiacritics / Math.max(1, alphaChars);
    const viWordRatio = rawTokens.length > 0 ? viWordCount / rawTokens.length : 0;

    const words = clean.toLowerCase().match(/[a-z']+/g) || [];
    let enAnchors = 0;
    let viMarkers = 0;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (COMMON_EN_ANCHORS.has(w)) enAnchors++;
      if (UNACCENTED_VI_MARKERS.has(w)) viMarkers++;
    }

    if (viDiacritics > 0) {
      if (
        viDensity > 0.06 ||
        viWordRatio > 0.25 ||
        (enAnchors === 0 && (viDiacritics >= 2 || viMarkers >= 1)) ||
        (rawTokens.length < 6 && viDiacritics >= 2 && enAnchors <= 1)
      ) {
        return { lang: 'vi', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
      }
      if (enAnchors >= 1 || words.length >= 4) {
        return { lang: 'en', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
      }
      return { lang: 'vi', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
    }

    if (viMarkers >= 3 && (enAnchors === 0 || (viMarkers / Math.max(1, words.length) >= 0.35 && viMarkers > enAnchors))) {
      return { lang: 'vi', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
    }
    if (enAnchors > viMarkers && enAnchors >= 1) {
      return { lang: 'en', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
    }
    if (words.length >= 2) {
      return { lang: 'en', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
    }
    return { lang: 'unknown', viDiacritics, enAnchors, viMarkers, viDensity, viWordRatio };
  }

  function detectLanguage(text) {
    return detectLanguageDetailed(text).lang;
  }

  function parseUploadedFileContent(filename, rawText) {
    const name = String(filename || 'article.txt').trim();
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : 'txt';
    const content = String(rawText == null ? '' : rawText).replace(/\r\n?/g, '\n').trim();

    if (!content) {
      throw new Error('Tệp tải lên đang trống, không có nội dung văn bản.');
    }

    if (ext === 'json') {
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        throw new Error('Tệp JSON không hợp lệ: ' + (e && e.message ? e.message : 'Syntax error'));
      }
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      if (typeof item === 'string') {
        const trimmedItem = item.trim();
        if (!trimmedItem) {
          throw new Error('Tệp JSON đang chứa chuỗi văn bản trống.');
        }
        return { text: trimmedItem, title: name.replace(/\.json$/i, ''), titleEn: '', referenceEn: '' };
      }
      if (!item || typeof item !== 'object') {
        throw new Error('Tệp JSON không chứa đối tượng bài viết hợp lệ.');
      }
      const extractedText = String(
        item.textVi || item.text || item.content || item.passage || item.textEn || item.referenceEn || ''
      ).trim();
      if (!extractedText) {
        throw new Error('Tệp JSON thiếu trường nội dung (textVi / text / content / passage).');
      }
      return {
        text: extractedText,
        title: String(item.title || item.titleEn || name.replace(/\.json$/i, '')).trim(),
        titleEn: String(item.titleEn || '').trim(),
        referenceEn: String(item.referenceEn || '').trim()
      };
    }

    if (ext === 'md' || ext === 'markdown') {
      let title = '';
      const lines = content.split('\n');
      const cleanedLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!title && /^#\s+(.+)/.test(line)) {
          title = line.replace(/^#+\s+/, '').trim();
          continue;
        }
        const stripped = line
          .replace(/^#+\s+/, '')
          .replace(/!?\[([^\]]*)\]\(((?:[^()]+|\([^)]*\))+)\)/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/__([^_]+)__/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/^[-*+]\s+/, '')
          .replace(/^>\s+/, '');
        if (stripped) cleanedLines.push(stripped);
      }
      const mdText = cleanedLines.join(' ').replace(/\s+/g, ' ').trim();
      if (!mdText) {
        throw new Error('Tệp Markdown không có nội dung văn bản sau khi lọc tiêu đề.');
      }
      return {
        text: mdText,
        title: title || name.replace(/\.(md|markdown)$/i, ''),
        titleEn: '',
        referenceEn: ''
      };
    }

    return {
      text: content.replace(/\n{2,}/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      title: name.replace(/\.[^.]+$/, ''),
      titleEn: '',
      referenceEn: ''
    };
  }

  function cleanGloss(rawGloss) {
    if (!rawGloss) return '';
    let gloss = String(rawGloss)
      .split(/[;,(/]/)[0]
      .replace(/\[[^\]]*\]/g, '')
      .trim();
    if (!gloss || gloss.length > 40) return '';
    return gloss;
  }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function buildLocalEnViLexicon() {
    const g = getGlobal();
    const units = g.APP_DATA && Array.isArray(g.APP_DATA.units) ? g.APP_DATA.units : [];
    if (cachedEnViLexicon && cachedLexiconUnitCount === units.length) {
      return cachedEnViLexicon;
    }

    const map = Object.create(null);
    const coreKeys = Object.keys(CORE_EN_VI_WORDS);
    for (let i = 0; i < coreKeys.length; i++) {
      const k = coreKeys[i];
      map[k] = CORE_EN_VI_WORDS[k];
    }

    for (let u = 0; u < units.length; u++) {
      const unit = units[u];
      if (!unit || !Array.isArray(unit.days)) continue;
      for (let d = 0; d < unit.days.length; d++) {
        const day = unit.days[d];
        const words = day && Array.isArray(day.words) ? day.words : [];
        for (let w = 0; w < words.length; w++) {
          const entry = words[w];
          if (!entry || !entry.word) continue;
          const enKey = String(entry.word).trim().toLowerCase();
          const viVal = cleanGloss(entry.meaning_vi || entry.meaning || '');
          if (enKey && viVal && !hasOwn(map, enKey)) {
            map[enKey] = viVal;
          }
        }
      }
    }

    cachedEnViLexicon = map;
    cachedLexiconUnitCount = units.length;
    return map;
  }

  function lookupWordWithStemming(tokenLower, lex) {
    if (!lex || typeof lex !== 'object') return null;
    if (hasOwn(lex, tokenLower)) return lex[tokenLower];
    if (tokenLower.endsWith('ies') && tokenLower.length > 4) {
      const stem = tokenLower.slice(0, -3) + 'y';
      if (hasOwn(lex, stem)) return lex[stem];
    }
    if (tokenLower.endsWith('es') && tokenLower.length > 3) {
      const stem = tokenLower.slice(0, -2);
      if (hasOwn(lex, stem)) return lex[stem];
    }
    if (tokenLower.endsWith('s') && tokenLower.length > 3) {
      const stem = tokenLower.slice(0, -1);
      if (hasOwn(lex, stem)) return lex[stem];
    }
    if (tokenLower.endsWith('ied') && tokenLower.length > 4) {
      const stem = tokenLower.slice(0, -3) + 'y';
      if (hasOwn(lex, stem)) return 'đã ' + lex[stem];
    }
    if (tokenLower.endsWith('ed') && tokenLower.length > 3) {
      const stem = tokenLower.slice(0, -2);
      const stemE = tokenLower.slice(0, -1);
      if (hasOwn(lex, stem)) return 'đã ' + lex[stem];
      if (hasOwn(lex, stemE)) return 'đã ' + lex[stemE];
    }
    if (tokenLower.endsWith('ing') && tokenLower.length > 4) {
      const stem = tokenLower.slice(0, -3);
      const stemE = tokenLower.slice(0, -3) + 'e';
      if (hasOwn(lex, stem)) return 'đang ' + lex[stem];
      if (hasOwn(lex, stemE)) return 'đang ' + lex[stemE];
    }
    if (tokenLower.endsWith('ly') && tokenLower.length > 4) {
      const stem = tokenLower.slice(0, -2);
      if (hasOwn(lex, stem)) return 'một cách ' + lex[stem];
    }
    return null;
  }

  function convertEnglishToVietnameseFallback(text) {
    const clean = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    if (!clean) return '';

    const lex = buildLocalEnViLexicon();
    const sentences = splitSentencesSafe(clean);
    const translatedSentences = [];

    for (let s = 0; s < sentences.length; s++) {
      let sent = sentences[s];
      // Replace multi-word phrases first with protected slots
      const slotMap = [];
      for (let p = 0; p < CORE_EN_VI_PHRASES.length; p++) {
        const [phrase, vi] = CORE_EN_VI_PHRASES[p];
        const rx = new RegExp('\\b' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
        sent = sent.replace(rx, () => {
          const key = '@@PH' + slotMap.length + '@@';
          slotMap.push(vi);
          return key;
        });
      }

      const parts = sent.split(/(\s+|[,.;:!?()"]+)/);
      const out = [];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        const phMatch = part.match(/^@@PH(\d+)@@$/);
        if (phMatch) {
          out.push(slotMap[Number(phMatch[1])]);
          continue;
        }
        if (/^\s+$/.test(part) || /^[,.;:!?()"]+$/.test(part)) {
          out.push(part);
          continue;
        }
        const lower = part.toLowerCase();
        // Drop English articles a/an/the in Vietnamese when standalone to read more naturally
        if (lower === 'a' || lower === 'an' || lower === 'the') {
          if (out.length > 0 && /^\s+$/.test(out[out.length - 1])) {
            out.pop();
          }
          continue;
        }
        const hit = lookupWordWithStemming(lower, lex);
        out.push(hit || part);
      }

      let joined = out.join('').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
      if (joined) {
        joined = joined.charAt(0).toUpperCase() + joined.slice(1);
        if (!/[.!?…]$/.test(joined)) joined += '.';
        translatedSentences.push(joined);
      }
    }

    return translatedSentences.join(' ').trim();
  }

  function extractKeywordsFromEnglish(textEn, limit) {
    const words = String(textEn || '').toLowerCase().match(/[a-z]{4,}/g) || [];
    const freq = Object.create(null);
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (EN_STOPWORDS.has(w)) continue;
      freq[w] = (hasOwn(freq, w) ? freq[w] : 0) + 1;
    }
    return Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a] || b.length - a.length)
      .slice(0, limit || 6);
  }

  function getGroqKey() {
    const k = safeStorageGet(STORAGE_GROQ_KEY);
    return k ? String(k).trim() : '';
  }

  function stripJsonFences(rawText) {
    let cleaned = String(rawText || '').trim();
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/i, '').replace(/\s*```$/i, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return cleaned.slice(firstBrace, lastBrace + 1);
    }
    return cleaned;
  }

  function fetchWithTimeout(fetchFn, url, fetchOpts, timeoutMs) {
    const ms = Number(timeoutMs) > 0 ? Number(timeoutMs) : 12000;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const reqOpts = controller
      ? Object.assign({}, fetchOpts || {}, { signal: controller.signal })
      : (fetchOpts || undefined);
    let timerId = null;
    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => {
        if (controller) {
          try { controller.abort(); } catch (e) {}
        }
        const err = new Error('REQUEST_TIMEOUT');
        err.name = 'AbortError';
        reject(err);
      }, ms);
    });
    return Promise.race([
      Promise.resolve().then(() => fetchFn(url, reqOpts)),
      timeoutPromise
    ]).finally(() => {
      if (timerId) clearTimeout(timerId);
    });
  }

  async function callGroqJson(promptSystem, promptUser, options) {
    const opts = options || {};
    const apiKey = opts.apiKey || getGroqKey();
    const fetchFn = opts.fetchImpl || (typeof fetch === 'function' ? fetch : null);
    if (!apiKey || !fetchFn) {
      throw new Error('NO_GROQ_OR_FETCH');
    }
    const timeoutMs = Number(opts.timeoutMs) > 0 ? Number(opts.timeoutMs) : 12000;

    let lastErr = null;
    for (let i = 0; i < GROQ_MODELS.length; i++) {
      const model = GROQ_MODELS[i];
      try {
        const resp = await fetchWithTimeout(fetchFn, 'https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify({
            model,
            temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.2,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: promptSystem },
              { role: 'user', content: promptUser }
            ]
          })
        }, timeoutMs);

        if (resp.status === 401) {
          const err = new Error('GROQ_UNAUTHORIZED_401');
          err.status = 401;
          throw err;
        }
        if (!resp.ok) {
          lastErr = new Error('GROQ_HTTP_' + resp.status);
          lastErr.status = resp.status;
          continue;
        }

        const data = await resp.json();
        const rawContent = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!rawContent) {
          lastErr = new Error('GROQ_EMPTY_RESPONSE');
          continue;
        }
        return JSON.parse(stripJsonFences(rawContent));
      } catch (err) {
        if (err && err.status === 401) throw err;
        lastErr = err || new Error('GROQ_MODEL_ERROR');
      }
    }

    throw lastErr || new Error('GROQ_ALL_MODELS_FAILED');
  }

  async function translateViaGoogleGtx(textEn, fetchImpl, options) {
    const fetchFn = fetchImpl || (typeof fetch === 'function' ? fetch : null);
    if (!fetchFn) throw new Error('NO_FETCH');
    const timeoutMs = options && Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 1800;

    const sentences = splitSentencesSafe(textEn);
    const chunks = [];
    let current = '';

    for (let i = 0; i < sentences.length; i++) {
      const candidate = current ? current + ' ' + sentences[i] : sentences[i];
      if (candidate.length > 1100 && current) {
        chunks.push(current);
        current = sentences[i];
      } else {
        current = candidate;
      }
    }
    if (current) chunks.push(current);

    const translated = [];
    for (let c = 0; c < chunks.length; c++) {
      const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' +
        encodeURIComponent(chunks[c]);
      const resp = await fetchWithTimeout(fetchFn, url, undefined, timeoutMs);
      if (!resp.ok) throw new Error('GTX_HTTP_' + resp.status);
      const data = await resp.json();
      const joined = Array.isArray(data && data[0])
        ? data[0].map((part) => (part && part[0]) || '').join('').trim()
        : '';
      if (!joined || joined.toLowerCase() === chunks[c].trim().toLowerCase()) {
        throw new Error('GTX_UNCHANGED');
      }
      translated.push(joined);
    }
    return translated.join(' ').trim();
  }

  async function preparePersonalPassage(text, options) {
    const opts = options || {};
    const clean = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    if (countWords(clean) < 3 && clean.length < 12) {
      throw new Error('Vui lòng nhập đoạn văn bản cá nhân dài ít nhất 3 từ để tạo bài luyện dịch.');
    }

    const lang = detectLanguage(clean);
    const id = 'personal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

    if (lang === 'vi') {
      const textVi = opts.targetWords ? sliceByWordLimit(clean, opts.targetWords) : clean;
      const wc = countWords(textVi);
      return normalizeArticleRecord({
        id,
        title: opts.title || 'Bài viết cá nhân (Tiếng Việt)',
        titleEn: opts.titleEn || '',
        sourceGroup: 'personal',
        sourceLabel: 'Bài cá nhân (Tiếng Việt)',
        unitId: null,
        unitNumber: null,
        topic: 'Personal',
        level: 'B2',
        lengthTier: getLengthTierFromWordCount(wc),
        wordCountVi: wc,
        textVi,
        referenceEn: opts.referenceEn || '',
        keywords: []
      });
    }

    // English or ASCII text -> preserve referenceEn and convert to Vietnamese
    const referenceEn = clean;
    let textVi = '';
    let titleVi = opts.title || '';
    let sourceLabel = 'Cá nhân (Từ điển nội bộ)';
    let keywords = extractKeywordsFromEnglish(referenceEn, 6);

    const apiKey = opts.apiKey || getGroqKey();
    if (apiKey) {
      try {
        const res = await callGroqJson(
          'You are an expert English-Vietnamese translator. Return strict JSON: {"titleVi":"...","textVi":"...","keywords":["..."]}. Translate naturally into clear Vietnamese suitable for reverse-translation practice.',
          'Translate this English passage into natural Vietnamese:\n\n' + referenceEn,
          { apiKey, fetchImpl: opts.fetchImpl, temperature: 0.25, timeoutMs: opts.timeoutMs }
        );
        if (res && typeof res.textVi === 'string' && res.textVi.trim()) {
          textVi = res.textVi.trim();
          if (res.titleVi) titleVi = String(res.titleVi).trim();
          if (Array.isArray(res.keywords) && res.keywords.length > 0) {
            keywords = res.keywords.map(String).slice(0, 8);
          }
          sourceLabel = 'Cá nhân (Groq AI)';
        }
      } catch (e) {
        if (e && e.status === 401) {
          // Fall through to gtx/local fallback cleanly
        }
      }
    }

    if (!textVi && !opts.skipGtx) {
      try {
        const gtxVi = await translateViaGoogleGtx(referenceEn, opts.fetchImpl, { timeoutMs: opts.timeoutMs });
        if (gtxVi) {
          textVi = gtxVi;
          sourceLabel = 'Cá nhân (Google Translate)';
        }
      } catch (e) {}
    }

    if (!textVi) {
      textVi = convertEnglishToVietnameseFallback(referenceEn);
      sourceLabel = 'Cá nhân (Từ điển nội bộ)';
    }

    if (opts.targetWords) {
      textVi = sliceByWordLimit(textVi, opts.targetWords);
    }

    const wc = countWords(textVi);
    return normalizeArticleRecord({
      id,
      title: titleVi || 'Bài cá nhân chuyển thể Việt-Anh',
      titleEn: opts.titleEn || opts.title || 'Personal Passage',
      sourceGroup: 'personal',
      sourceLabel,
      unitId: null,
      unitNumber: null,
      topic: 'Personal',
      level: 'B2',
      lengthTier: getLengthTierFromWordCount(wc),
      wordCountVi: wc,
      textVi,
      referenceEn,
      keywords
    });
  }

  // ==================== D. AI & ONLINE NEWS REFRESH ====================

  function openGroqKeyModalFallback() {
    const g = getGlobal();
    if (typeof g.openGroqApiKeyModal === 'function') {
      g.openGroqApiKeyModal();
      return;
    }
    if (g.SpeakingEngine && typeof g.SpeakingEngine.openGroqModal === 'function') {
      g.SpeakingEngine.openGroqModal();
      return;
    }
    if (typeof document === 'undefined') return;

    let modal = document.getElementById('trGroqKeyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'trGroqKeyModal';
      modal.className = 'groq-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4';
      modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:16px;';
      modal.innerHTML =
        '<div class="groq-modal pv-card" style="max-width:440px;width:100%;padding:20px;">' +
          '<h3 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:var(--ink);">Cài đặt Groq API Key (BYOK)</h3>' +
          '<p style="margin:0 0 12px 0;font-size:13px;color:var(--ink-2);">Nhập Groq API Key để tạo bài luyện dịch bằng AI và chấm bài chuyên sâu.</p>' +
          '<input id="trGroqKeyInput" type="password" class="ni-input" placeholder="gsk_..." style="width:100%;margin-bottom:12px;" />' +
          '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
            '<button type="button" id="trGroqModalCancel" class="ni-nav-btn">Đóng</button>' +
            '<button type="button" id="trGroqModalSave" class="ni-submit-btn">Lưu Key</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);

      const cancelBtn = document.getElementById('trGroqModalCancel');
      const saveBtn = document.getElementById('trGroqModalSave');
      if (cancelBtn) cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const inp = document.getElementById('trGroqKeyInput');
          const val = inp ? inp.value.trim() : '';
          if (val) {
            safeStorageSet(STORAGE_GROQ_KEY, val);
            setStatusBanner('Đã lưu Groq API Key thành công.', 'good');
          }
          modal.style.display = 'none';
        });
      }
    }
    const inp = document.getElementById('trGroqKeyInput');
    if (inp) inp.value = getGroqKey();
    modal.style.display = 'flex';
  }

  async function generateAiArticle(topic, options) {
    const opts = options || {};
    const apiKey = opts.apiKey || getGroqKey();
    if (!apiKey) {
      openGroqKeyModalFallback();
      setStatusBanner('Chưa có Groq API Key — vui lòng nhập key để tạo bài mới bằng AI.', 'warn');
      return null;
    }

    const topicText = String(topic || '').trim() || 'Modern daily life, technology, and learning English';
    const targetWords = Number(opts.targetWords) > 0 ? Number(opts.targetWords) : 120;
    state.isRefreshing = true;
    renderBusyStates();

    try {
      const payload = await callGroqJson(
        'You are an IELTS & Vietnamese-English translation curriculum author. Return strict JSON: {"title":"Vietnamese title","titleEn":"English title","topic":"Topic","level":"B1|B2|C1","textVi":"Natural Vietnamese passage around ' + targetWords + ' words","referenceEn":"Natural accurate English translation","keywords":["kw1","kw2","kw3","kw4","kw5"]}.',
        'Write a fresh, engaging Vietnamese practice passage about: "' + topicText + '" with an accurate English reference translation.',
        { apiKey, fetchImpl: opts.fetchImpl, temperature: 0.7, timeoutMs: opts.timeoutMs }
      );

      if (!payload || !payload.textVi || !payload.referenceEn) {
        throw new Error('AI_INVALID_ARTICLE_JSON');
      }

      const article = normalizeArticleRecord({
        id: 'ai_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        title: payload.title || ('Bài AI: ' + topicText),
        titleEn: payload.titleEn || topicText,
        sourceGroup: opts.sourceGroup || 'hot_trends',
        sourceLabel: 'Groq AI Topic',
        unitId: opts.unitId && opts.unitId !== 'all' ? opts.unitId : null,
        topic: payload.topic || topicText,
        level: payload.level || 'B2',
        textVi: payload.textVi,
        referenceEn: payload.referenceEn,
        keywords: payload.keywords || [],
        isAiGenerated: true
      });

      if (article) {
        prependRuntimeArticles([article]);
        selectArticle(article);
        renderArticleList();
        setStatusBanner('Đã tạo bài viết AI mới: "' + article.title + '"', 'good');
      }
      return article;
    } catch (err) {
      setStatusBanner('Không thể tạo bài AI lúc này (' + (err && err.message ? err.message : 'Network error') + ').', 'warn');
      return null;
    } finally {
      state.isRefreshing = false;
      renderBusyStates();
    }
  }

  async function fetchOnlineNewsFeed(options) {
    const opts = options || {};
    const fetchFn = opts.fetchImpl || (typeof fetch === 'function' ? fetch : null);
    if (!fetchFn) {
      setStatusBanner('Môi trường hiện tại không hỗ trợ tải tin trực tuyến.', 'warn');
      return { status: 'offline', source: 'none', items: [] };
    }

    const topic = String(opts.topic || state.filters.search || 'general').trim();
    const limit = Math.max(1, Math.min(20, Number(opts.limit) || 8));
    state.isRefreshing = true;
    renderBusyStates();

    try {
      const timeoutMs = Number(opts.timeoutMs) > 0 ? Number(opts.timeoutMs) : 8000;
      const url = '/api/news/feed?topic=' + encodeURIComponent(topic) + '&limit=' + limit;
      const resp = await fetchWithTimeout(fetchFn, url, undefined, timeoutMs);
      if (!resp.ok) {
        throw new Error('HTTP_' + resp.status);
      }
      const data = await resp.json();
      const rawItems = Array.isArray(data && data.items) ? data.items : [];
      const mapped = [];

      for (let i = 0; i < rawItems.length; i++) {
        const it = rawItems[i];
        if (!it || typeof it !== 'object') continue;
        const norm = normalizeArticleRecord({
          id: it.id !== undefined && it.id !== null && String(it.id) !== '' ? it.id : ('online_' + Date.now() + '_' + i),
          title: it.title || it.titleEn || 'Tin tức trực tuyến',
          titleEn: it.titleEn || '',
          sourceGroup: 'hot_trends',
          sourceLabel: it.sourceLabel || 'Online News',
          unitId: null,
          unitNumber: null,
          topic: it.topic || topic,
          level: it.level || 'B2',
          lengthTier: it.lengthTier,
          wordCountVi: it.wordCountVi,
          textVi: it.textVi,
          referenceEn: it.referenceEn || '',
          keywords: it.keywords || []
        }, i);
        if (norm) mapped.push(norm);
      }

      const added = prependRuntimeArticles(mapped);
      if (added.length > 0) {
        selectArticle(added[0]);
      }
      renderArticleList();
      setStatusBanner('Đã cập nhật ' + added.length + ' bài tin mới (' + (data.source || 'feed') + ').', 'good');
      return { status: 'ok', source: data.source || 'feed', items: mapped };
    } catch (err) {
      setStatusBanner('Không thể tải tin trực tuyến (đang dùng kho bài tích hợp sẵn).', 'warn');
      return { status: 'error', source: 'offline_fallback', items: [], error: err && err.message };
    } finally {
      state.isRefreshing = false;
      renderBusyStates();
    }
  }

  function prependRuntimeArticles(newItems) {
    if (!Array.isArray(newItems) || newItems.length === 0) return [];
    const existingAll = getMergedBank();
    const seenIds = new Set(existingAll.map(a => a.id));
    const seenTexts = new Set(existingAll.map(a => normalizeVi(a.textVi)));
    const added = [];

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (!item || !item.textVi) continue;
      const textNorm = normalizeVi(item.textVi);
      if (seenIds.has(item.id) || seenTexts.has(textNorm)) continue;
      seenIds.add(item.id);
      seenTexts.add(textNorm);
      added.push(item);
    }

    if (added.length > 0) {
      state.runtimeArticles = added.concat(state.runtimeArticles).slice(0, 40);
      persistRuntimeArticles();
    }
    return added;
  }

  // ==================== E. INPUT VALIDATION & CALIBRATED WRITING GRADER ====================

  function isPlausibleEnglishWord(rawToken) {
    const w = String(rawToken || '').toLowerCase().replace(/^'+|'+$/g, '');
    if (!w) return false;
    if (w.length === 1) return w === 'i' || w === 'a';
    if (w.length < 2 || w.length > 24) return false;
    if (!/^[a-z'-]+$/.test(w)) return false;
    const plain = w.replace(/['-]/g, '');
    if (!plain) return false;
    if (!/[aeiouy]/.test(plain)) return false;
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(plain)) return false;
    if (/(.)\1{3,}/.test(plain)) return false;
    return true;
  }

  function validateTranslationInput(text, contextArticle) {
    const clean = String(text == null ? '' : text).trim();
    if (!clean) {
      return {
        valid: false,
        reason: 'EMPTY',
        message: 'Bạn chưa nhập bản dịch tiếng Anh. Hãy dịch đoạn văn tiếng Việt sang tiếng Anh trước khi chấm.'
      };
    }

    const alphaChars = (clean.match(/[a-zA-ZÀ-ỹ]/g) || []).length;
    const viMatches = clean.match(VIETNAMESE_DIACRITIC_RX) || [];
    const viDiacritics = viMatches.length;
    const rawTokens = clean.split(/\s+/).filter(Boolean);
    let viWordCount = 0;
    for (let i = 0; i < rawTokens.length; i++) {
      if (VIETNAMESE_DIACRITIC_SINGLE_RX.test(rawTokens[i])) viWordCount++;
    }
    const viDensity = viDiacritics / Math.max(1, alphaChars);
    const viWordRatio = rawTokens.length > 0 ? viWordCount / rawTokens.length : 0;

    const alphaTokens = clean.match(/[A-Za-z][A-Za-z'-]*/g) || [];
    const validWords = [];
    for (let i = 0; i < alphaTokens.length; i++) {
      if (isPlausibleEnglishWord(alphaTokens[i])) {
        validWords.push(alphaTokens[i].toLowerCase());
      }
    }

    const uniqueValid = new Set(validWords);
    let anchorHits = 0;
    let viMarkerTokens = 0;
    for (let i = 0; i < validWords.length; i++) {
      const w = validWords[i];
      if (COMMON_EN_ANCHORS.has(w)) anchorHits++;
      if (UNACCENTED_VI_MARKERS.has(w)) viMarkerTokens++;
    }

    let refOrKwHits = 0;
    if (contextArticle && typeof contextArticle === 'object') {
      const refWordSet = new Set(
        String(contextArticle.referenceEn || '').toLowerCase().match(/[a-z]{3,}/g) || []
      );
      const kwList = Array.isArray(contextArticle.keywords) ? contextArticle.keywords : [];
      for (let k = 0; k < kwList.length; k++) {
        const parts = String(kwList[k] || '').toLowerCase().match(/[a-z]{2,}/g) || [];
        for (let p = 0; p < parts.length; p++) refWordSet.add(parts[p]);
      }
      uniqueValid.forEach((w) => {
        if (refWordSet.has(w)) refOrKwHits++;
      });
    }

    if (viDiacritics > 0) {
      if (
        viDensity > 0.06 ||
        viWordRatio > 0.25 ||
        (anchorHits === 0 && refOrKwHits === 0 && viDiacritics >= 2) ||
        (validWords.length < 6 && viDiacritics >= 2)
      ) {
        return {
          valid: false,
          reason: 'VIETNAMESE_TEXT',
          message: 'Hệ thống phát hiện văn bản tiếng Việt có dấu. Vui lòng nhập bản dịch bằng tiếng Anh.'
        };
      }
    }

    if (
      viMarkerTokens >= 3 &&
      (
        (anchorHits === 0 && refOrKwHits === 0) ||
        (viMarkerTokens / Math.max(1, validWords.length) >= 0.30 && viMarkerTokens > anchorHits && refOrKwHits < 2)
      )
    ) {
      return {
        valid: false,
        reason: 'VIETNAMESE_TEXT',
        message: 'Hệ thống phát hiện nội dung tiếng Việt không dấu. Vui lòng nhập bản dịch bằng tiếng Anh.'
      };
    }

    if (validWords.length < 4) {
      return {
        valid: false,
        reason: 'TOO_FEW_ENGLISH_WORDS',
        message: 'Bản dịch quá ngắn hoặc thiếu từ tiếng Anh hợp lệ (tối thiểu 4 từ tiếng Anh).'
      };
    }

    if (
      (anchorHits === 0 && refOrKwHits === 0) ||
      (validWords.length >= 5 && uniqueValid.size < 3) ||
      (validWords.length >= 6 && uniqueValid.size / validWords.length <= 0.30) ||
      (validWords.length >= 12 && uniqueValid.size < Math.min(6, Math.ceil(validWords.length * 0.20)))
    ) {
      return {
        valid: false,
        reason: 'GIBBERISH_OR_SPAM',
        message: 'Nội dung nhập chưa phải câu tiếng Anh có nghĩa (phát hiện ký tự vô nghĩa hoặc lặp từ).'
      };
    }

    return {
      valid: true,
      validWordCount: validWords.length,
      uniqueValidCount: uniqueValid.size,
      validWords
    };
  }

  function stemEn(word) {
    const w = String(word || '').toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 4) return w;
    return w.replace(/(?:ing|ied|ies|ed|es|ly|s)$/, '').slice(0, 5) || w.slice(0, 4);
  }

  function detectGrammarErrors(text) {
    const clean = String(text || '').trim();
    if (!clean) return [];
    const errors = [];
    const seen = new Set();

    const addErr = (original, correction, reason) => {
      const key = String(original).toLowerCase() + '->' + String(correction).toLowerCase();
      if (seen.has(key) || errors.length >= 10) return;
      seen.add(key);
      errors.push({ original, correction, reason });
    };

    const rules = [
      {
        rx: /\b(he|she|it)\s+(don't|have|go|want|make|need|say|like|do|work|live|know|think)\b/gi,
        fix: (m, p1, p2) => {
          const map = { "don't": "doesn't", have: 'has', go: 'goes', do: 'does' };
          const fixedVerb = map[p2.toLowerCase()] || (p2.toLowerCase() + 's');
          return p1 + ' ' + fixedVerb;
        },
        reason: 'Chủ ngữ ngôi thứ 3 số ít (he/she/it) cần chia động từ ở thì hiện tại đơn.'
      },
      {
        rx: /\b(everybody|everyone|nobody|someone|anyone|everything)\s+(are|were|have|do)\b/gi,
        fix: (m, p1, p2) => {
          const map = { are: 'is', were: 'was', have: 'has', do: 'does' };
          return p1 + ' ' + (map[p2.toLowerCase()] || p2);
        },
        reason: 'Đại từ bất định (everyone/everybody/...) luôn đi với động từ số ít.'
      },
      {
        rx: /\bthere\s+is\s+(many|several|two|three|four|five|some|a\s+lot\s+of)\b/gi,
        fix: (m, p1) => 'there are ' + p1,
        reason: 'Dùng "there are" khi đi cùng danh từ số nhiều.'
      },
      {
        rx: /\bthere\s+are\s+(a|an)\s+([a-z]+)\b/gi,
        fix: (m, p1, p2) => 'there is ' + p1 + ' ' + p2,
        reason: 'Dùng "there is" khi đi cùng danh từ số ít đếm được.'
      },
      {
        rx: /\b(did|didn't|does|doesn't|do|don't)\s+(went|saw|bought|ate|came|made|took|gave|wrote|spoke|had|ran)\b/gi,
        fix: (m, p1, p2) => {
          const baseMap = {
            went: 'go', saw: 'see', bought: 'buy', ate: 'eat', came: 'come',
            made: 'make', took: 'take', gave: 'give', wrote: 'write', spoke: 'speak', had: 'have', ran: 'run'
          };
          return p1 + ' ' + (baseMap[p2.toLowerCase()] || p2);
        },
        reason: 'Sau trợ động từ do/does/did phải dùng động từ nguyên mẫu (V-inf).'
      },
      {
        rx: /\bto\s+(went|saw|bought|ate|came|made|took|gave|wrote|spoke|had|ran|did)\b/gi,
        fix: (m, p1) => {
          const baseMap = {
            went: 'go', saw: 'see', bought: 'buy', ate: 'eat', came: 'come',
            made: 'make', took: 'take', gave: 'give', wrote: 'write', spoke: 'speak',
            had: 'have', ran: 'run', did: 'do'
          };
          return 'to ' + (baseMap[p1.toLowerCase()] || p1);
        },
        reason: 'Sau "to" (to-infinitive) phải dùng động từ nguyên mẫu (V-inf), không chia quá khứ.'
      },
      {
        rx: /\b(can|could|will|would|should|must)\s+able\s+to\b/gi,
        fix: (m, p1) => {
          const low = p1.toLowerCase();
          if (low === 'can' || low === 'could') {
            return p1 + ' / be able to';
          }
          return p1 + ' be able to';
        },
        reason: 'Không ghép trực tiếp động từ khuyết thiếu (can/will/should...) với "able to"; hãy dùng "can" hoặc thêm "be" trước "able to".'
      },
      {
        rx: /\bin\s+(?:the\s+)?(yesterday|tomorrow|last\s+[a-z]+|next\s+[a-z]+)\b/gi,
        fix: (m, p1) => p1,
        reason: 'Không dùng giới từ "in" trước yesterday/tomorrow/last.../next...'
      },
      {
        rx: /\b(listen|listening)\s+(music|songs|the\s+radio|podcasts?)\b/gi,
        fix: (m, p1, p2) => p1 + ' to ' + p2,
        reason: 'Động từ "listen" cần giới từ "to" trước tân ngữ (listen to music).'
      },
      {
        rx: /\bdespite\s+of\b/gi,
        fix: () => 'despite',
        reason: '"Despite" không đi kèm "of" (hoặc dùng "in spite of").'
      },
      {
        rx: /\bdiscuss\s+about\b/gi,
        fix: () => 'discuss',
        reason: '"Discuss" là ngoại động từ, không dùng giới từ "about" ngay sau.'
      },
      {
        rx: /\bmarried\s+with\b/gi,
        fix: () => 'married to',
        reason: 'Cụm chuẩn là "be married to someone".'
      },
      {
        rx: /\ba\s+(apple|orange|umbrella|hour|honest|idea|example|airport|animal|office|important|interesting|effective)\b/gi,
        fix: (m, p1) => 'an ' + p1,
        reason: 'Dùng mạo từ "an" trước từ bắt đầu bằng âm nguyên âm.'
      },
      {
        rx: /\b(informations|advices|equipments|homeworks|knowledges|furnitures)\b/gi,
        fix: (m, p1) => p1.slice(0, -1),
        reason: 'Danh từ không đếm được (information, advice, equipment, knowledge...) không thêm "-s".'
      },
      {
        rx: /\b(much|less)\s+(people|students|cars|books|things|days|years|problems|ways)\b/gi,
        fix: (m, p1, p2) => (p1.toLowerCase() === 'much' ? 'many' : 'fewer') + ' ' + p2,
        reason: 'Danh từ đếm được số nhiều dùng "many/fewer" thay cho "much/less".'
      },
      {
        rx: /\bvery\s+(delicious|exhausted|freezing|furious|impossible|vital|essential|excellent|amazing|terrible)\b/gi,
        fix: (m, p1) => 'truly ' + p1,
        reason: 'Không dùng "very" trước tính từ cực hạn (extreme adjectives); hãy dùng "truly/absolutely/extremely".'
      }
    ];

    for (let r = 0; r < rules.length; r++) {
      const rule = rules[r];
      let match;
      rule.rx.lastIndex = 0;
      while ((match = rule.rx.exec(clean)) !== null) {
        const correction = rule.fix.apply(null, match);
        addErr(match[0], correction, rule.reason);
      }
    }

    if (/(?:^|\s)i(?=\s|['’])/.test(clean)) {
      addErr('i', 'I', 'Đại từ nhân xưng "I" luôn phải viết hoa.');
    }

    if (countWords(clean) >= 8 && !/[.!?]$/.test(clean)) {
      addErr('(cuối câu thiếu dấu chấm)', '.', 'Nên kết thúc câu tiếng Anh bằng dấu chấm/chấm hỏi phù hợp.');
    }

    return errors;
  }

  function detectLexicalUpgrades(text) {
    const clean = String(text || '');
    const patterns = [
      { rx: /\bvery good\b/i, original: 'very good', upgrade: 'remarkable / highly effective', reason: 'Nâng cấp từ vựng học thuật thay cho "very good".' },
      { rx: /\bvery bad\b/i, original: 'very bad', upgrade: 'detrimental / severe', reason: 'Dùng tính từ trang trọng thay cho "very bad".' },
      { rx: /\ba lot of\b/i, original: 'a lot of', upgrade: 'a substantial number of / numerous', reason: 'Cụm định lượng tự nhiên và học thuật hơn trong văn viết.' },
      { rx: /\bthink that\b/i, original: 'think that', upgrade: 'argue that / hold the view that', reason: 'Đa dạng hóa động từ diễn đạt quan điểm.' },
      { rx: /\bget better\b/i, original: 'get better', upgrade: 'improve significantly / enhance', reason: 'Dùng động từ chính xác thay cho cụm "get better".' },
      { rx: /\bbig problem\b/i, original: 'big problem', upgrade: 'pressing issue / major challenge', reason: 'Collocation tự nhiên trong bài viết IELTS.' }
    ];
    const upgrades = [];
    for (let i = 0; i < patterns.length; i++) {
      if (patterns[i].rx.test(clean)) {
        upgrades.push({
          original: patterns[i].original,
          upgrade: patterns[i].upgrade,
          reason: patterns[i].reason
        });
      }
    }
    return upgrades;
  }

  function toBandHalf(score10) {
    const clamped = Math.max(1.0, Math.min(9.0, Number(score10) * 0.9));
    return Math.round(clamped * 2) / 2;
  }

  function round1(n) {
    return Math.round(Number(n) * 10) / 10;
  }

  function getEffectiveArticleForGrading(article) {
    if (!article || typeof article !== 'object') return article;
    if (
      state.activeArticle &&
      state.activeArticle.id === article.id &&
      state.activePassageVi &&
      typeof article.textVi === 'string'
    ) {
      const fullViWords = article.wordCountVi > 0 ? Number(article.wordCountVi) : countWords(article.textVi);
      const activeViWords = countWords(state.activePassageVi);
      if (activeViWords > 0 && fullViWords > 0 && activeViWords < fullViWords) {
        const fullRef = String(article.referenceEn || '').trim();
        let slicedRef = '';
        if (fullRef) {
          const ratio = activeViWords / fullViWords;
          const fullRefWords = countWords(fullRef);
          const targetEnWords = Math.max(10, Math.round(fullRefWords * ratio));
          slicedRef = sliceByWordLimit(fullRef, targetEnWords);
        }
        let slicedKeywords = Array.isArray(article.keywords) ? article.keywords.slice() : [];
        if (slicedRef && slicedKeywords.length > 0) {
          const refLow = slicedRef.toLowerCase();
          const refStems = new Set((refLow.match(/[a-z]{3,}/g) || []).map(stemEn));
          const matchingKw = slicedKeywords.filter((kw) => {
            const kl = String(kw).toLowerCase();
            return refLow.includes(kl) || refStems.has(stemEn(kl));
          });
          slicedKeywords = matchingKw.length > 0 ? matchingKw : extractKeywordsFromEnglish(slicedRef, 4);
        }
        return Object.assign({}, article, {
          textVi: state.activePassageVi,
          wordCountVi: activeViWords,
          referenceEn: slicedRef,
          keywords: slicedKeywords
        });
      }
    }
    return article;
  }

  function gradeTranslationLocally(article, userText) {
    const art = getEffectiveArticleForGrading(article) || { textVi: '', wordCountVi: 0, referenceEn: '', keywords: [] };
    const cleanUser = String(userText == null ? '' : userText).trim();
    const val = validateTranslationInput(cleanUser, art);

    if (!val.valid) {
      return {
        valid: false,
        invalid: true,
        invalidReason: val.reason,
        invalidMessage: val.message,
        score: 0,
        maxScore: 10,
        overallBand: 0,
        criteria: {
          taskAchievement: { score: 0, band: 0, label: 'Độ phủ ý & Nghĩa', feedback: val.message, coveragePct: 0 },
          lexical: { score: 0, band: 0, label: 'Từ vựng (Lexical)', feedback: val.message, matchedKeywords: [], missingKeywords: art.keywords || [], suggestedUpgrades: [] },
          grammar: { score: 0, band: 0, label: 'Ngữ pháp (Grammar)', feedback: val.message, errors: [] },
          coherence: { score: 0, band: 0, label: 'Mạch lạc (Coherence)', feedback: val.message }
        },
        feedback: val.message,
        strengths: [],
        improvements: [val.message],
        errors: [],
        missingKeywords: Array.isArray(art.keywords) ? art.keywords.slice() : [],
        matchedKeywords: [],
        suggestedUpgrades: [],
        upgradedAnswer: art.referenceEn || '',
        referenceEn: art.referenceEn || '',
        userTranslation: cleanUser,
        source: 'Input Validator'
      };
    }

    const userWords = val.validWords;
    const userCount = userWords.length;
    const userLower = cleanUser.toLowerCase();

    // Sentence deduplication & n-gram repetition detection to block duplicate-sentence padding
    const sentenceList = splitSentencesSafe(cleanUser);
    const seenSentNorms = new Set();
    const uniqueSentences = [];
    for (let s = 0; s < sentenceList.length; s++) {
      const sentNorm = sentenceList[s]
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!sentNorm) continue;
      if (!seenSentNorms.has(sentNorm)) {
        seenSentNorms.add(sentNorm);
        uniqueSentences.push(sentenceList[s]);
      }
    }
    const duplicateSentenceCount = Math.max(0, sentenceList.length - uniqueSentences.length);
    const uniqueSentenceRatio = sentenceList.length > 0 ? uniqueSentences.length / sentenceList.length : 1;

    let fourGramRatio = 1;
    if (userWords.length >= 12) {
      const total4Grams = userWords.length - 3;
      const fourGramSet = new Set();
      for (let gIdx = 0; gIdx < total4Grams; gIdx++) {
        fourGramSet.add(
          userWords[gIdx] + ' ' + userWords[gIdx + 1] + ' ' + userWords[gIdx + 2] + ' ' + userWords[gIdx + 3]
        );
      }
      fourGramRatio = fourGramSet.size / Math.max(1, total4Grams);
    }
    const hasHeavyRepetition = duplicateSentenceCount > 0 || (userWords.length >= 12 && fourGramRatio < 0.65);

    const dedupWordsRaw = uniqueSentences.length > 0
      ? (uniqueSentences.join(' ').toLowerCase().match(/[a-z][a-z'-]*/g) || [])
      : userWords;
    const effectiveWords = [];
    for (let i = 0; i < dedupWordsRaw.length; i++) {
      if (isPlausibleEnglishWord(dedupWordsRaw[i])) effectiveWords.push(dedupWordsRaw[i]);
    }
    const effectiveCount = effectiveWords.length > 0 ? effectiveWords.length : userCount;
    const userStems = new Set(effectiveWords.map(stemEn));

    const sourceViWords = art.wordCountVi > 0 ? Number(art.wordCountVi) : countWords(art.textVi);
    const refEn = String(art.referenceEn || '').trim();
    const refWords = refEn ? (refEn.toLowerCase().match(/[a-z]{3,}/g) || []) : [];
    const expectedEnWords = refWords.length > 0
      ? Math.max(5, refWords.length)
      : Math.max(6, Math.round(Math.max(10, sourceViWords) * 0.78));

    const lengthRatio = effectiveCount / Math.max(1, expectedEnWords);

    // 1. Task Achievement / Semantic Coverage
    const refContentStems = new Set();
    for (let i = 0; i < refWords.length; i++) {
      const w = refWords[i];
      if (!EN_STOPWORDS.has(w) && w.length >= 3) {
        refContentStems.add(stemEn(w));
      }
    }

    let refHits = 0;
    refContentStems.forEach((st) => {
      if (userStems.has(st)) refHits++;
    });
    const refCoverage = refContentStems.size > 0 ? refHits / refContentStems.size : Math.min(1, lengthRatio);

    const targetKeywords = Array.isArray(art.keywords) ? art.keywords.filter(Boolean) : [];
    const matchedKeywords = [];
    const missingKeywords = [];
    for (let k = 0; k < targetKeywords.length; k++) {
      const kw = String(targetKeywords[k]).trim();
      const kwLower = kw.toLowerCase();
      const kwStem = stemEn(kwLower);
      if (userLower.includes(kwLower) || userStems.has(kwStem)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }
    const kwCoverage = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : refCoverage;

    const adequacyScore = lengthRatio >= 0.72 && lengthRatio <= 1.45
      ? 1.0
      : lengthRatio < 0.72
        ? Math.max(0.1, lengthRatio / 0.72)
        : Math.max(0.65, 1 - (lengthRatio - 1.45) * 0.35);

    let taScore = 2.5 + 7.2 * (0.55 * refCoverage + 0.25 * kwCoverage + 0.2 * adequacyScore);
    if (lengthRatio < 0.45) taScore = Math.min(taScore, 4.4);
    if (refContentStems.size >= 6 && refCoverage < 0.15) taScore = Math.min(taScore, 4.2);
    taScore = round1(Math.max(2.0, Math.min(9.6, taScore)));

    // 2. Lexical Resource
    const ttr = val.uniqueValidCount / Math.max(1, userCount);
    const uniqueEffectiveSet = new Set(effectiveWords);
    const advancedCount = Array.from(uniqueEffectiveSet).filter(w => w.length >= 7 && !EN_STOPWORDS.has(w)).length;
    const advRatio = advancedCount / Math.max(1, userCount);
    const suggestedUpgrades = detectLexicalUpgrades(cleanUser);
    const repPenalty = duplicateSentenceCount * 1.5 + (fourGramRatio < 0.65 ? (0.65 - fourGramRatio) * 5.0 : 0);
    let lrScore = 4.0 + Math.min(2.6, ttr * 3.1) + Math.min(1.8, advRatio * 9.0) + kwCoverage * 1.4 - suggestedUpgrades.length * 0.25 - repPenalty;
    if (lengthRatio < 0.45) lrScore = Math.min(lrScore, 5.4);
    if (uniqueSentenceRatio <= 0.5 || (userWords.length >= 12 && fourGramRatio < 0.55)) {
      lrScore = Math.min(lrScore, 4.5);
    }
    lrScore = round1(Math.max(2.5, Math.min(9.5, lrScore)));

    // 3. Grammatical Range & Accuracy
    const errors = detectGrammarErrors(cleanUser);
    const sentenceCount = Math.max(1, uniqueSentences.length || sentenceList.length);
    let complexConnectors = 0;
    for (let d = 0; d < DISCOURSE_MARKERS.length; d++) {
      if (userLower.includes(DISCOURSE_MARKERS[d])) complexConnectors++;
    }
    let graScore = 7.4 + Math.min(1.6, complexConnectors * 0.45) + (sentenceCount >= 2 ? 0.4 : 0) - errors.length * 0.65;
    if (lengthRatio < 0.45) graScore = Math.min(graScore, 5.8);
    graScore = round1(Math.max(2.0, Math.min(9.5, graScore)));

    // 4. Coherence & Cohesion
    const avgWordsPerSentence = effectiveCount / sentenceCount;
    const balanceBonus = avgWordsPerSentence >= 7 && avgWordsPerSentence <= 26 ? 1.0 : 0.3;
    let ccScore = 4.6 + Math.min(2.2, complexConnectors * 0.65) + (sentenceCount >= 2 ? 1.2 : 0.2) + balanceBonus - repPenalty;
    if (lengthRatio < 0.45) ccScore = Math.min(ccScore, 5.2);
    if (uniqueSentenceRatio <= 0.5 || (userWords.length >= 12 && fourGramRatio < 0.55)) {
      ccScore = Math.min(ccScore, 4.2);
    }
    ccScore = round1(Math.max(2.5, Math.min(9.5, ccScore)));

    // Weighted overall 0-10 & IELTS 0-9
    let rawOverall = 0.35 * taScore + 0.25 * lrScore + 0.25 * graScore + 0.15 * ccScore;
    if (lengthRatio < 0.45) {
      rawOverall = Math.min(rawOverall, 4.9);
    }
    if (refContentStems.size >= 6 && refCoverage < 0.12) {
      rawOverall = Math.min(rawOverall, 4.8);
    }
    if (hasHeavyRepetition) {
      rawOverall = Math.min(rawOverall - Math.min(1.5, repPenalty * 0.5), (uniqueSentenceRatio <= 0.5 || fourGramRatio < 0.55) ? 4.5 : 5.8);
    }
    const score = round1(Math.max(1.0, Math.min(9.8, rawOverall)));
    const overallBand = toBandHalf(score);
    const coveragePct = Math.round(Math.max(0, Math.min(100, refCoverage * 100)));

    const strengths = [];
    const improvements = [];
    if (hasHeavyRepetition) {
      improvements.push('Phát hiện câu hoặc cụm từ bị lặp lại nhiều lần — cần dịch đầy đủ các ý tiếp theo thay vì lặp câu.');
    }
    if (coveragePct >= 65) strengths.push('Bản dịch truyền tải khá đầy đủ ý chính của đoạn tiếng Việt (' + coveragePct + '% từ khóa nghĩa).');
    else improvements.push('Bổ sung thêm ý còn thiếu để bao quát trọn vẹn đoạn nguồn (' + coveragePct + '% độ phủ ý).');

    if (errors.length === 0) strengths.push('Không phát hiện lỗi ngữ pháp cơ bản phổ biến.');
    else improvements.push('Cần sửa ' + errors.length + ' lỗi ngữ pháp/cấu trúc câu đã được chỉ ra.');

    if (matchedKeywords.length > 0) strengths.push('Đã vận dụng được từ khóa mục tiêu: ' + matchedKeywords.slice(0, 5).join(', ') + '.');
    if (missingKeywords.length > 0) improvements.push('Nên lồng ghép các từ khóa chủ đề: ' + missingKeywords.slice(0, 5).join(', ') + '.');
    if (lengthRatio < 0.6) improvements.push('Độ dài bản dịch còn ngắn so với bài nguồn (' + effectiveCount + '/' + expectedEnWords + ' từ dự kiến).');

    const feedback =
      'Điểm tổng hợp: ' + score + '/10 (IELTS Band ~' + overallBand.toFixed(1) + '). ' +
      (strengths[0] || '') + ' ' + (improvements[0] || '');

    return {
      valid: true,
      invalid: false,
      score,
      maxScore: 10,
      overallBand,
      criteria: {
        taskAchievement: {
          score: taScore,
          band: toBandHalf(taScore),
          label: 'Độ phủ ý & Nghĩa',
          coveragePct,
          feedback: lengthRatio < 0.45
            ? 'Bản dịch mới hoàn thành một phần nhỏ (' + effectiveCount + '/' + expectedEnWords + ' từ), chưa bao quát hết đoạn nguồn.'
            : 'Độ phủ nội dung đạt khoảng ' + coveragePct + '% so với ý cốt lõi của bài.'
        },
        lexical: {
          score: lrScore,
          band: toBandHalf(lrScore),
          label: 'Từ vựng (Lexical)',
          matchedKeywords,
          missingKeywords,
          suggestedUpgrades,
          feedback: missingKeywords.length > 0
            ? 'Vốn từ khá ổn; có thể bổ sung thêm: ' + missingKeywords.slice(0, 4).join(', ') + '.'
            : 'Từ vựng đa dạng và bám sát ngữ cảnh chủ đề.'
        },
        grammar: {
          score: graScore,
          band: toBandHalf(graScore),
          label: 'Ngữ pháp (Grammar)',
          errors,
          feedback: errors.length > 0
            ? 'Phát hiện ' + errors.length + ' điểm cần chỉnh sửa về ngữ pháp/collocation.'
            : 'Ngữ pháp ổn định, chia động từ và giới từ hợp lý.'
        },
        coherence: {
          score: ccScore,
          band: toBandHalf(ccScore),
          label: 'Mạch lạc (Coherence)',
          feedback: complexConnectors >= 1
            ? 'Bố cục câu rõ ràng, có sử dụng từ nối liên kết ý.'
            : 'Nên tách câu hợp lý và thêm từ nối (however, moreover, therefore...) để bài trôi chảy hơn.'
        }
      },
      feedback: feedback.trim(),
      strengths,
      improvements,
      errors,
      missingKeywords,
      matchedKeywords,
      suggestedUpgrades,
      upgradedAnswer: refEn || cleanUser,
      referenceEn: refEn,
      userTranslation: cleanUser,
      source: 'Local Calibrated Grader'
    };
  }

  async function gradeTranslation(article, userText, options) {
    if (state.isGrading) return state.lastGradeResult;
    const opts = options || {};

    if (!article || typeof article.textVi !== 'string' || !article.textVi.trim()) {
      const noArticleMsg = 'Vui lòng chọn một bài viết tiếng Việt trước khi chấm điểm.';
      const noArticleRes = {
        valid: false,
        invalid: true,
        invalidReason: 'NO_ARTICLE',
        invalidMessage: noArticleMsg,
        score: 0,
        maxScore: 10,
        overallBand: 0,
        criteria: {
          taskAchievement: { score: 0, band: 0, label: 'Độ phủ ý & Nghĩa', feedback: noArticleMsg, coveragePct: 0 },
          lexical: { score: 0, band: 0, label: 'Từ vựng (Lexical)', feedback: noArticleMsg, matchedKeywords: [], missingKeywords: [], suggestedUpgrades: [] },
          grammar: { score: 0, band: 0, label: 'Ngữ pháp (Grammar)', feedback: noArticleMsg, errors: [] },
          coherence: { score: 0, band: 0, label: 'Mạch lạc (Coherence)', feedback: noArticleMsg }
        },
        feedback: noArticleMsg,
        strengths: [],
        improvements: [noArticleMsg],
        errors: [],
        missingKeywords: [],
        matchedKeywords: [],
        suggestedUpgrades: [],
        upgradedAnswer: '',
        referenceEn: '',
        userTranslation: String(userText == null ? '' : userText).trim(),
        source: 'Input Validator'
      };
      state.lastGradeResult = noArticleRes;
      renderGradeResult(noArticleRes);
      return noArticleRes;
    }

    const effectiveArticle = getEffectiveArticleForGrading(article);
    const baseline = gradeTranslationLocally(effectiveArticle, userText);
    if (baseline.invalid) {
      state.lastGradeResult = baseline;
      renderGradeResult(baseline);
      return baseline;
    }

    let finalResult = baseline;
    const apiKey = opts.apiKey || getGroqKey();

    state.isGrading = true;
    renderBusyStates();
    try {
      if (apiKey) {
        try {
          const art = effectiveArticle || {};
          const aiJson = await callGroqJson(
            'You are an experienced IELTS Writing & Translation examiner. Grade the Vietnamese-to-English translation strictly and return JSON: {"score":0-10,"overallBand":0-9,"criteria":{"taskAchievement":{"score":0-10,"feedback":"Vietnamese"},"lexical":{"score":0-10,"feedback":"Vietnamese"},"grammar":{"score":0-10,"feedback":"Vietnamese"},"coherence":{"score":0-10,"feedback":"Vietnamese"}},"feedback":"Vietnamese summary","strengths":["..."],"improvements":["..."],"errors":[{"original":"...","correction":"...","reason":"Vietnamese"}],"upgradedAnswer":"Natural Band 8.0 English translation"}.',
            'Vietnamese source:\n' + (art.textVi || '') +
            (art.referenceEn ? '\n\nReference English:\n' + art.referenceEn : '') +
            '\n\nLearner English translation:\n' + userText,
            { apiKey, fetchImpl: opts.fetchImpl, temperature: 0.2, timeoutMs: opts.timeoutMs }
          );

          const aiScoreNum = aiJson ? Number(aiJson.score) : NaN;
          if (aiJson && Number.isFinite(aiScoreNum)) {
            // Calibrate only severely short/repetitive inputs (<6 words or baseline < 2.5)
            const baselineCap = (countWords(userText) < 6 || baseline.score < 2.5) ? 5.5 : 10.0;
            const mergedScore = round1(Math.max(1.0, Math.min(baselineCap, aiScoreNum)));
            const aiBandNum = Number(aiJson.overallBand);
            const mergedBand = Number.isFinite(aiBandNum)
              ? Math.round(Math.max(1.0, Math.min(9.0, Math.min(aiBandNum, baselineCap * 0.9))) * 2) / 2
              : toBandHalf(mergedScore);

            const c = aiJson.criteria || {};
            finalResult = Object.assign({}, baseline, {
              score: mergedScore,
              overallBand: mergedBand,
              criteria: {
                taskAchievement: Object.assign({}, baseline.criteria.taskAchievement, c.taskAchievement || {}),
                lexical: Object.assign({}, baseline.criteria.lexical, c.lexical || {}),
                grammar: Object.assign({}, baseline.criteria.grammar, c.grammar || {}),
                coherence: Object.assign({}, baseline.criteria.coherence, c.coherence || {})
              },
              feedback: aiJson.feedback || baseline.feedback,
              strengths: Array.isArray(aiJson.strengths) && aiJson.strengths.length ? aiJson.strengths : baseline.strengths,
              improvements: Array.isArray(aiJson.improvements) && aiJson.improvements.length ? aiJson.improvements : baseline.improvements,
              errors: Array.isArray(aiJson.errors) && aiJson.errors.length ? aiJson.errors : baseline.errors,
              upgradedAnswer: aiJson.upgradedAnswer || baseline.upgradedAnswer,
              source: 'Groq AI Examiner + Local Calibration'
            });
          }
        } catch (err) {
          finalResult = Object.assign({}, baseline, {
            source: 'Local Calibrated Grader (' + (err && err.status === 401 ? 'Invalid Groq Key' : 'Offline Fallback') + ')'
          });
        }
      }

      state.lastGradeResult = finalResult;
      state.translationCompletedForCurrent = true;
      if (article && article.id) {
        state.completedArticleIds[article.id] = true;
      }

      state.history.unshift({
        id: (article && article.id) || 'tr_' + Date.now(),
        title: (article && article.title) || 'Bài luyện dịch',
        score: finalResult.score,
        overallBand: finalResult.overallBand,
        timestamp: new Date().toISOString()
      });
      state.history = state.history.slice(0, 50);
      persistHistory();

      notifyDailyStreak('translation');
      renderGradeResult(finalResult);
      return finalResult;
    } finally {
      state.isGrading = false;
      renderBusyStates();
    }
  }

  function notifyDailyStreak(taskType) {
    try {
      const g = getGlobal();
      if (typeof g.markDailyStreakTaskCompleted === 'function') {
        g.markDailyStreakTaskCompleted(taskType);
      }
      if (typeof g.refreshDailyStreakDeadlineUI === 'function') {
        g.refreshDailyStreakDeadlineUI();
      }
    } catch (e) {}
  }

  function hasCompletedTranslation(sourceId) {
    if (sourceId && hasOwn(state.completedArticleIds, sourceId) && state.completedArticleIds[sourceId]) return true;
    if (sourceId && state.history.some(h => h.id === sourceId)) return true;
    if (!sourceId && (state.translationCompletedForCurrent || state.history.length > 0)) return true;
    return false;
  }

  // ==================== F. READ-ALOUD HANDOFF ====================

  function buildReadAloudPayload(article, gradeResult, userText) {
    const art = article || state.activeArticle || {};
    const gr = gradeResult || state.lastGradeResult;
    let textEn = '';

    if (art.referenceEn && String(art.referenceEn).trim()) {
      const fullRef = String(art.referenceEn).trim();
      const activeVi = state.activePassageVi || art.textVi || '';
      const fullViWords = art.textVi ? countWords(art.textVi) : 0;
      const activeViWords = activeVi ? countWords(activeVi) : 0;
      if (fullViWords > 0 && activeViWords > 0 && activeViWords < fullViWords) {
        const ratio = activeViWords / fullViWords;
        const targetEnWords = Math.max(10, Math.round(countWords(fullRef) * ratio));
        textEn = sliceByWordLimit(fullRef, targetEnWords);
      } else {
        textEn = fullRef;
      }
    } else if (gr && gr.upgradedAnswer && String(gr.upgradedAnswer).trim()) {
      textEn = String(gr.upgradedAnswer).trim();
    } else if (userText && String(userText).trim()) {
      textEn = String(userText).trim();
    }

    const completed = Boolean(
      state.translationCompletedForCurrent ||
      (art.id && hasOwn(state.completedArticleIds, art.id) && state.completedArticleIds[art.id])
    );

    return {
      title: art.titleEn || art.title || 'Read-Aloud Practice',
      textEn,
      textVi: state.activePassageVi || art.textVi || '',
      sourceId: art.id || '',
      fromTranslation: completed
    };
  }

  function sendToReadAloud() {
    const g = getGlobal();
    const inputEl = typeof document !== 'undefined' ? document.getElementById('trUserTranslationInput') : null;
    const userText = inputEl ? inputEl.value : '';
    const payload = buildReadAloudPayload(state.activeArticle, state.lastGradeResult, userText);

    if (!payload.textEn) {
      setStatusBanner('Chưa có văn bản tiếng Anh để chuyển sang Luyện đọc. Hãy chọn bài có bản mẫu hoặc nhập bản dịch của bạn.', 'warn');
      return null;
    }

    if (g.ReadAloudEngine && typeof g.ReadAloudEngine.loadPassage === 'function') {
      g.ReadAloudEngine.loadPassage(payload);
    }
    if (typeof g.switchTab === 'function') {
      g.switchTab('readaloud');
    }
    return payload;
  }

  // ==================== G. DOM RENDERING & IDEMPOTENT MOUNTING ====================

  function setStatusBanner(msg, tone) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('trStatusBanner');
    if (!el) return;
    if (!msg) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    el.style.display = 'block';
    el.textContent = msg;
    el.style.color = tone === 'good' ? 'var(--good)' : (tone === 'warn' ? 'var(--lexical)' : 'var(--ink-2)');
    el.style.background = tone === 'good' ? 'var(--good-wash)' : 'var(--accent-wash)';
  }

  function renderBusyStates() {
    if (typeof document === 'undefined') return;
    const btnGrade = document.getElementById('trBtnGradeTranslation');
    if (btnGrade) {
      btnGrade.disabled = state.isGrading;
      btnGrade.textContent = state.isGrading ? 'Đang chấm bài...' : 'Chấm bản dịch';
    }
    const btnAi = document.getElementById('trBtnRefreshAi');
    if (btnAi) btnAi.disabled = state.isRefreshing;
    const btnOnline = document.getElementById('trBtnRefreshOnline');
    if (btnOnline) btnOnline.disabled = state.isRefreshing;
  }

  function selectArticle(article) {
    if (!article) return;
    state.activeArticle = article;
    state.lastGradeResult = null;
    state.translationCompletedForCurrent = false;

    const customLimit = Number(state.filters.customWordLimit) || 120;
    const displayedVi = state.filters.lengthTier === 'custom'
      ? sliceByWordLimit(article.textVi, customLimit)
      : article.textVi;
    state.activePassageVi = displayedVi;

    if (typeof document !== 'undefined') {
      const viBox = document.getElementById('trSourcePassageVi');
      if (viBox) {
        viBox.textContent = displayedVi;
      }
      const metaEl = document.getElementById('trPassageMeta');
      if (metaEl) {
        metaEl.innerHTML =
          '<span class="ni-badge ni-badge-neutral">' + escapeHtml(article.sourceLabel) + '</span> ' +
          '<span class="ni-badge ni-badge-green">' + countWords(displayedVi) + ' từ</span> ' +
          (article.level ? '<span class="ni-badge ni-badge-amber">' + escapeHtml(article.level) + '</span>' : '');
      }
      const userInp = document.getElementById('trUserTranslationInput');
      if (userInp) {
        userInp.value = '';
        updateUserWordCount();
      }
      const resultEl = document.getElementById('trWritingGradeResult');
      if (resultEl) {
        resultEl.innerHTML = '<div class="pv-card" style="color:var(--ink-3);font-size:13px;">Nhập bản dịch tiếng Anh ở khung bên trái rồi nhấn <strong>Chấm bản dịch</strong> để nhận điểm và nhận xét chi tiết.</div>';
      }
    }
  }

  function updateUserWordCount() {
    if (typeof document === 'undefined') return;
    const inp = document.getElementById('trUserTranslationInput');
    const badge = document.getElementById('trUserWordCount');
    if (inp && badge) {
      badge.textContent = countWords(inp.value) + ' từ';
    }
  }

  function renderArticleList() {
    if (typeof document === 'undefined') return;
    const listEl = document.getElementById('trArticleList');
    if (!listEl) return;

    const q = queryArticles(getMergedBank(), state.filters);
    state.filters.page = q.page;

    if (q.items.length === 0) {
      const bankSize = getMergedBank().length;
      listEl.innerHTML =
        '<div class="sc-crd" style="color:var(--ink-2);font-size:13px;">' +
          (bankSize === 0
            ? 'Kho bài tích hợp chưa nạp dữ liệu. Bạn có thể dán/tải bài cá nhân hoặc dùng nút tạo AI / tải tin trực tuyến bên trên.'
            : 'Không tìm thấy bài viết khớp bộ lọc hiện tại. Hãy thử đổi nguồn hoặc từ khóa tìm kiếm.') +
        '</div>';
      return;
    }

    let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
    for (let i = 0; i < q.items.length; i++) {
      const art = q.items[i];
      const isActive = state.activeArticle && state.activeArticle.id === art.id;
      const done = Boolean(hasOwn(state.completedArticleIds, art.id) && state.completedArticleIds[art.id]);
      html +=
        '<button type="button" data-tr-article-id="' + escapeHtml(art.id) + '" class="sc-crd" style="text-align:left;width:100%;cursor:pointer;' +
          (isActive ? 'border-color:var(--accent) !important;background:var(--accent-wash) !important;' : '') + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">' +
            '<strong style="font-size:14px;color:var(--ink);">' + escapeHtml(art.title) + '</strong>' +
            '<span class="ni-badge ' + (done ? 'ni-badge-green' : 'ni-badge-neutral') + '">' +
              (done ? 'Đã dịch' : (art.wordCountVi + ' từ')) +
            '</span>' +
          '</div>' +
          '<div style="margin-top:4px;font-size:12px;color:var(--ink-3);">' +
            escapeHtml(art.sourceLabel) + (art.topic ? ' • ' + escapeHtml(art.topic) : '') + ' • ' + escapeHtml(art.lengthTier) +
          '</div>' +
        '</button>';
    }
    html += '</div>';

    if (q.totalPages > 1) {
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;gap:8px;">' +
          '<button type="button" data-tr-page="' + (q.page - 1) + '" class="ni-nav-btn"' + (q.page <= 1 ? ' disabled' : '') + '>← Trước</button>' +
          '<span style="font-size:12px;color:var(--ink-2);">Trang ' + q.page + '/' + q.totalPages + ' (' + q.total + ' bài)</span>' +
          '<button type="button" data-tr-page="' + (q.page + 1) + '" class="ni-nav-btn"' + (q.page >= q.totalPages ? ' disabled' : '') + '>Sau →</button>' +
        '</div>';
    }

    listEl.innerHTML = html;
  }

  function renderGradeResult(result) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('trWritingGradeResult');
    if (!container || !result) return;

    if (result.invalid) {
      container.innerHTML =
        '<div class="sc-crd" style="border-left:4px solid var(--incorrect-color) !important;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
            '<strong style="color:var(--incorrect-color);font-size:14px;">Chưa thể chấm bài</strong>' +
            '<span class="ni-badge ni-badge-neutral">0/10 (Band 0.0)</span>' +
          '</div>' +
          '<p style="margin:6px 0 0 0;font-size:13px;color:var(--ink);">' + escapeHtml(result.invalidMessage || result.feedback) + '</p>' +
        '</div>';
      return;
    }

    const c = result.criteria || {};
    const critRows = [
      { key: 'taskAchievement', cls: 'fluency', data: c.taskAchievement },
      { key: 'lexical', cls: 'lexical', data: c.lexical },
      { key: 'grammar', cls: 'grammar', data: c.grammar },
      { key: 'coherence', cls: 'pronunciation', data: c.coherence }
    ];

    let miniBandsHtml = '<div class="mini-bands">';
    for (let i = 0; i < critRows.length; i++) {
      const cr = critRows[i];
      const rawSc = cr.data ? Number(cr.data.score) : NaN;
      const sc = Number.isFinite(rawSc) ? rawSc : 0;
      const lbl = cr.data && cr.data.label ? cr.data.label : cr.key;
      miniBandsHtml +=
        '<div class="mini-band">' +
          '<b>' + sc.toFixed(1) + '/10</b>' +
          '<span><i class="dot ' + cr.cls + '"></i>' + escapeHtml(lbl) + '</span>' +
        '</div>';
    }
    miniBandsHtml += '</div>';

    let errorsHtml = '';
    if (Array.isArray(result.errors) && result.errors.length > 0) {
      errorsHtml += '<div style="margin-top:12px;"><strong style="font-size:13px;color:var(--ink);">Lỗi cần chỉnh sửa</strong>';
      for (let i = 0; i < result.errors.length; i++) {
        const er = result.errors[i];
        errorsHtml +=
          '<div class="sc-crd" style="margin-top:6px;border-left:4px solid var(--incorrect-color) !important;">' +
            '<div style="font-size:13px;color:var(--ink);"><del style="color:var(--incorrect-color);">' + escapeHtml(er.original) + '</del> → <strong style="color:var(--good);">' + escapeHtml(er.correction) + '</strong></div>' +
            '<div style="font-size:12px;color:var(--ink-2);margin-top:2px;">' + escapeHtml(er.reason) + '</div>' +
          '</div>';
      }
      errorsHtml += '</div>';
    }

    let keywordsHtml = '';
    if ((result.matchedKeywords && result.matchedKeywords.length) || (result.missingKeywords && result.missingKeywords.length)) {
      keywordsHtml += '<div class="sc-crd" style="margin-top:12px;">';
      if (result.matchedKeywords && result.matchedKeywords.length) {
        keywordsHtml += '<div style="font-size:12px;color:var(--good);margin-bottom:4px;"><strong>Từ khóa đã dùng:</strong> ' + escapeHtml(result.matchedKeywords.join(', ')) + '</div>';
      }
      if (result.missingKeywords && result.missingKeywords.length) {
        keywordsHtml += '<div style="font-size:12px;color:var(--lexical);"><strong>Từ khóa nên bổ sung:</strong> ' + escapeHtml(result.missingKeywords.join(', ')) + '</div>';
      }
      keywordsHtml += '</div>';
    }

    let refHtml = '';
    if (result.upgradedAnswer || result.referenceEn) {
      refHtml +=
        '<div class="upg-box" style="margin-top:12px;">' +
          '<strong style="font-size:13px;color:var(--ink);">Bản tiếng Anh tham khảo</strong>' +
          '<p style="margin:6px 0 0 0;font-size:13px;line-height:1.55;color:var(--ink);">' + escapeHtml(result.upgradedAnswer || result.referenceEn) + '</p>' +
        '</div>';
    }

    container.innerHTML =
      '<div class="pv-card">' +
        '<div class="score-line">' +
          '<div>' +
            '<div style="font-size:12px;color:var(--ink-3);">' + escapeHtml(result.source) + '</div>' +
            '<div class="score-main">' + Number(result.score).toFixed(1) + '<span style="font-size:14px;color:var(--ink-3);">/10 (Band ' + Number(result.overallBand).toFixed(1) + ')</span></div>' +
          '</div>' +
          '<span class="ni-badge ni-badge-green">Đã hoàn thành dịch</span>' +
        '</div>' +
        '<p style="margin:8px 0 12px 0;font-size:13px;color:var(--ink-2);">' + escapeHtml(result.feedback) + '</p>' +
        miniBandsHtml +
        '<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">' +
          critRows.map(cr =>
            '<div class="sc-crd" style="font-size:12px;color:var(--ink-2);"><strong style="color:var(--ink);">' +
              escapeHtml(cr.data && cr.data.label) + ':</strong> ' + escapeHtml(cr.data && cr.data.feedback) + '</div>'
          ).join('') +
        '</div>' +
        keywordsHtml +
        errorsHtml +
        refHtml +
      '</div>';
  }

  function populateUnitSelect() {
    if (typeof document === 'undefined') return;
    const sel = document.getElementById('trUnitFilter');
    if (!sel) return;
    const catalog = getUnitCatalog();
    let html = '<option value="all">Tất cả Unit</option>';
    for (let i = 0; i < catalog.length; i++) {
      html += '<option value="' + escapeHtml(catalog[i].key) + '">' + escapeHtml(catalog[i].unitTitle) + '</option>';
    }
    sel.innerHTML = html;
  }

  function buildShellMarkup() {
    return (
      '<div id="trEngineBody" class="space-y-4">' +
        '<div class="pv-card">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;">' +
            '<div>' +
              '<h2 style="margin:0;font-size:18px;font-weight:700;color:var(--ink);">Luyện dịch Việt → Anh & Chấm bài viết</h2>' +
              '<p style="margin:2px 0 0 0;font-size:13px;color:var(--ink-2);">Chọn bài từ kho đa nguồn, tùy chỉnh độ dài hoặc dán bài viết cá nhân để luyện dịch và chấm điểm.</p>' +
            '</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
              '<button type="button" id="trBtnRefreshAi" class="ni-nav-btn">✨ Tạo bài bằng AI</button>' +
              '<button type="button" id="trBtnRefreshOnline" class="ni-nav-btn">🌐 Tải tin mới</button>' +
            '</div>' +
          '</div>' +
          '<div id="trStatusBanner" style="display:none;padding:8px 12px;border-radius:10px;font-size:13px;margin-bottom:10px;"></div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;max-width:100%;min-width:0;">' +
            '<select id="trSourceFilter" class="ni-input" style="width:auto;max-width:100%;min-width:0;">' +
              '<option value="all">Tất cả nguồn</option>' +
              '<option value="study4">Bộ đề Study4 Speaking (23 chủ đề)</option>' +
              '<option value="unit">Theo Unit</option>' +
              '<option value="video">Video Xem tiếng Anh</option>' +
              '<option value="ielts_reading">Bài đọc IELTS</option>' +
              '<option value="hot_trends">Tin nóng & Xu hướng</option>' +
              '<option value="personal">Bài cá nhân</option>' +
            '</select>' +
            '<select id="trUnitFilter" class="ni-input" style="width:auto;max-width:100%;min-width:0;"><option value="all">Tất cả Unit</option></select>' +
            '<select id="trLengthFilter" class="ni-input" style="width:auto;max-width:100%;min-width:0;">' +
              '<option value="all">Mọi độ dài</option>' +
              '<option value="short">Ngắn (&lt;90 từ)</option>' +
              '<option value="medium">Trung bình (90-180 từ)</option>' +
              '<option value="long">Dài (&gt;180 từ)</option>' +
              '<option value="custom">Tự chọn số từ</option>' +
            '</select>' +
            '<input id="trCustomWordLimit" type="number" min="20" max="1000" step="10" value="120" class="ni-input" style="width:96px;max-width:100%;" title="Số từ mục tiêu" />' +
            '<input id="trSearchInput" type="search" class="ni-input" placeholder="Tìm tiêu đề, chủ đề, từ khóa..." style="flex:1;min-width:0;max-width:100%;" />' +
          '</div>' +
        '</div>' +
        '<div class="pv-grid">' +
          '<div class="pv-left">' +
            '<div class="pv-card">' +
              '<h3 style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:var(--ink);">Danh sách bài luyện dịch</h3>' +
              '<div id="trArticleList"></div>' +
            '</div>' +
            '<div class="pv-card">' +
              '<h3 style="margin:0 0 8px 0;font-size:15px;font-weight:700;color:var(--ink);">Dán hoặc tải bài viết cá nhân (Anh / Việt)</h3>' +
              '<textarea id="trCustomTextInput" rows="3" class="ni-input" placeholder="Dán đoạn tiếng Anh hoặc tiếng Việt tại đây..." style="margin-bottom:8px;"></textarea>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;">' +
                '<input id="trCustomFileUpload" type="file" accept=".txt,.md,.json,text/plain,text/markdown,application/json" style="font-size:12px;color:var(--ink-2);" />' +
                '<button type="button" id="trBtnUsePersonal" class="ni-submit-btn">Tạo đề từ văn bản này</button>' +
              '</div>' +
            '</div>' +
            '<div class="pv-card">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">' +
                '<h3 style="margin:0;font-size:15px;font-weight:700;color:var(--ink);">Đề bài tiếng Việt</h3>' +
                '<div id="trPassageMeta"></div>' +
              '</div>' +
              '<div id="trSourcePassageVi" style="font-size:14px;line-height:1.65;color:var(--ink);padding:10px 12px;border-radius:10px;background:var(--accent-wash);border:1px solid var(--rule);margin-bottom:12px;">Chọn một bài bên trên hoặc dán văn bản cá nhân để bắt đầu.</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                '<label for="trUserTranslationInput" style="font-size:13px;font-weight:600;color:var(--ink);">Bản dịch tiếng Anh của bạn</label>' +
                '<span id="trUserWordCount" class="ni-badge ni-badge-neutral">0 từ</span>' +
              '</div>' +
              '<textarea id="trUserTranslationInput" rows="6" class="ni-input" placeholder="Write your English translation here..." style="margin-bottom:10px;"></textarea>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;">' +
                '<button type="button" id="trBtnGradeTranslation" class="ni-submit-btn">Chấm bản dịch</button>' +
                '<button type="button" id="trBtnSendToReadAloud" class="ni-submit-btn">Đọc lại bài này (Luyện nói) →</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="pv-right">' +
            '<div id="trWritingGradeResult">' +
              '<div class="pv-card" style="color:var(--ink-3);font-size:13px;">Kết quả chấm bài viết (điểm số, 4 tiêu chí IELTS, lỗi ngữ pháp và gợi ý nâng cấp) sẽ hiển thị tại đây.</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindEventsOnce() {
    if (typeof document === 'undefined') return;

    const bind = (id, evt, handler) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.trBound === '1') return;
      el.dataset.trBound = '1';
      el.addEventListener(evt, handler);
    };

    bind('trSourceFilter', 'change', (e) => {
      state.filters.sourceGroup = e.target.value || 'all';
      state.filters.page = 1;
      renderArticleList();
    });

    bind('trUnitFilter', 'change', (e) => {
      state.filters.unitId = e.target.value || 'all';
      state.filters.page = 1;
      renderArticleList();
    });

    bind('trLengthFilter', 'change', (e) => {
      state.filters.lengthTier = e.target.value || 'all';
      state.filters.page = 1;
      const tier = state.filters.lengthTier;
      if (tier !== 'all' && tier !== 'custom' && (!state.activeArticle || state.activeArticle.lengthTier !== tier)) {
        const matched = queryArticles(getMergedBank(), state.filters).items;
        if (matched && matched.length > 0) {
          selectArticle(matched[0]);
        }
      } else if (state.activeArticle) {
        selectArticle(state.activeArticle);
      }
      renderArticleList();
    });

    bind('trCustomWordLimit', 'input', (e) => {
      const v = Number(e.target.value);
      if (Number.isFinite(v) && v >= 20) {
        state.filters.customWordLimit = v;
        if (state.filters.lengthTier === 'custom' && state.activeArticle) {
          selectArticle(state.activeArticle);
        }
      }
    });

    bind('trSearchInput', 'input', (e) => {
      state.filters.search = e.target.value || '';
      state.filters.page = 1;
      renderArticleList();
    });

    bind('trArticleList', 'click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('[data-tr-article-id], [data-tr-page]') : null;
      if (!btn) return;
      const artId = btn.getAttribute('data-tr-article-id');
      if (artId) {
        const found = getMergedBank().find(a => a.id === artId);
        if (found) {
          selectArticle(found);
          renderArticleList();
        }
        return;
      }
      const nextPage = btn.getAttribute('data-tr-page');
      if (nextPage) {
        state.filters.page = Math.max(1, Number(nextPage) || 1);
        renderArticleList();
      }
    });

    bind('trCustomFileUpload', 'change', (e) => {
      const file = e.target && e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 512 * 1024) {
        setStatusBanner('Tệp vượt quá giới hạn 512KB.', 'warn');
        return;
      }
      if (typeof FileReader === 'undefined') return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const parsed = parseUploadedFileContent(file.name, reader.result);
          const customBox = document.getElementById('trCustomTextInput');
          if (customBox) customBox.value = parsed.text;
          const art = await preparePersonalPassage(parsed.text, {
            title: parsed.title,
            titleEn: parsed.titleEn,
            referenceEn: parsed.referenceEn,
            targetWords: state.filters.lengthTier === 'custom' ? state.filters.customWordLimit : undefined
          });
          prependRuntimeArticles([art]);
          selectArticle(art);
          renderArticleList();
          setStatusBanner('Đã nạp bài cá nhân từ tệp "' + file.name + '".', 'good');
        } catch (err) {
          setStatusBanner(err && err.message ? err.message : 'Không thể đọc tệp.', 'warn');
        }
      };
      reader.readAsText(file, 'UTF-8');
    });

    bind('trBtnUsePersonal', 'click', async () => {
      const btn = document.getElementById('trBtnUsePersonal');
      const customBox = document.getElementById('trCustomTextInput');
      const raw = customBox ? customBox.value : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Đang tạo đề...';
      }
      try {
        const art = await preparePersonalPassage(raw, {
          targetWords: state.filters.lengthTier === 'custom' ? state.filters.customWordLimit : undefined
        });
        prependRuntimeArticles([art]);
        selectArticle(art);
        renderArticleList();
        setStatusBanner('Đã chuẩn bị bài viết cá nhân sẵn sàng để dịch.', 'good');
      } catch (err) {
        setStatusBanner(err && err.message ? err.message : 'Vui lòng kiểm tra lại nội dung đã dán.', 'warn');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Tạo đề từ văn bản này';
        }
      }
    });

    bind('trBtnRefreshAi', 'click', () => {
      const topic = state.filters.search || (state.activeArticle && state.activeArticle.topic) || '';
      generateAiArticle(topic, {
        targetWords: state.filters.lengthTier === 'custom' ? state.filters.customWordLimit : 120
      });
    });

    bind('trBtnRefreshOnline', 'click', () => {
      fetchOnlineNewsFeed({ topic: state.filters.search || 'general', limit: 8 });
    });

    bind('trUserTranslationInput', 'input', updateUserWordCount);

    bind('trBtnGradeTranslation', 'click', () => {
      const inp = document.getElementById('trUserTranslationInput');
      const userText = inp ? inp.value : '';
      gradeTranslation(state.activeArticle, userText);
    });

    bind('trBtnSendToReadAloud', 'click', () => {
      sendToReadAloud();
    });
  }

  function mount(containerOverride) {
    if (typeof document === 'undefined') return false;
    const section = containerOverride || document.getElementById('tab-translation');
    if (!section) return false;

    if (!document.getElementById('trSourceFilter')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = buildShellMarkup();
      section.appendChild(wrapper.firstElementChild);
    }

    populateUnitSelect();
    bindEventsOnce();
    renderArticleList();

    if (!state.activeArticle) {
      const bank = getMergedBank();
      if (bank.length > 0) {
        selectArticle(bank[0]);
      }
    }

    const g = getGlobal();
    if (g.lucide && typeof g.lucide.createIcons === 'function') {
      try { g.lucide.createIcons(); } catch (e) {}
    }

    state.mounted = true;
    return true;
  }

  function init() {
    loadPersistedState();
    return mount();
  }

  function refreshBank() {
    populateUnitSelect();
    renderArticleList();
    if (!state.activeArticle) {
      const bank = getMergedBank();
      if (bank.length > 0) selectArticle(bank[0]);
    }
  }

  function getState() {
    return {
      mounted: state.mounted,
      runtimeArticlesCount: state.runtimeArticles.length,
      filters: Object.assign({}, state.filters),
      activeArticle: state.activeArticle,
      activePassageVi: state.activePassageVi,
      lastGradeResult: state.lastGradeResult,
      translationCompletedForCurrent: state.translationCompletedForCurrent,
      isGrading: state.isGrading,
      isRefreshing: state.isRefreshing,
      historyCount: state.history.length
    };
  }

  function getCurrentArticle() {
    return state.activeArticle;
  }

  // Auto-mount if DOM is ready and #tab-translation exists
  if (typeof document !== 'undefined') {
    const autoBoot = () => {
      if (document.getElementById('tab-translation')) {
        init();
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoBoot);
    } else {
      autoBoot();
    }
  }

  return {
    init,
    mount,
    refreshBank,
    getState,
    getCurrentArticle,
    // Normalization & Catalog
    normalizeVi,
    normalizeUnitKey,
    getUnitCatalog,
    countWords,
    getLengthTierFromWordCount,
    // Filtering & Slicing
    filterArticles,
    queryArticles,
    sliceByWordLimit,
    selectArticle,
    // Personal Paste, Upload & Offline Translation
    detectLanguage,
    detectLanguageDetailed,
    parseUploadedFileContent,
    convertEnglishToVietnameseFallback,
    preparePersonalPassage,
    // AI & Online Refresh
    generateAiArticle,
    fetchOnlineNewsFeed,
    // Validation & Grading
    getEffectiveArticleForGrading,
    validateTranslationInput,
    detectGrammarErrors,
    gradeTranslationLocally,
    gradeTranslation,
    hasCompletedTranslation,
    // Read-Aloud Handoff
    buildReadAloudPayload,
    sendToReadAloud
  };
}));
