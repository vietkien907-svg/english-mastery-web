/**
 * Read-Aloud Speaking Practice Engine (v105.0 - Milestone M3)
 * - Strictly isolated dedicated tab (#tab-readaloud) — zero shared DOM IDs or state with other tabs
 * - Accepts passages handed off from TranslationPracticeEngine or standalone bank/readings/custom English text
 * - Sentence-chunked TTS model playback (en-US / en-GB / en-AU, 0.8x / 1.0x / 1.2x)
 * - MediaRecorder + continuous SpeechRecognition (onend auto-restart, strictly updating .value on textarea)
 * - Word-level Levenshtein DP alignment, WER, Pronunciation, Grammar, Fluency & Pace, Lexical scoring
 * - Groq Whisper + Llama hybrid evaluation with calibrated local fallback
 * - Daily deadline hooks ('readaloud' and 'translation_readaloud')
 * - UMD compatible (browser global + Node vm/CommonJS testing)
 */

(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.ReadAloudEngine = api;
  }
}(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis), function (root) {
  'use strict';

  const STORAGE_GROQ_KEY = 'user_groq_api_key';
  const STORAGE_RA_HISTORY = 'ra_practice_history_v1';
  const STORAGE_RA_ACCENT = 'ra_examiner_accent_v1';
  const STORAGE_RA_RATE = 'ra_examiner_rate_v1';
  const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];

  const VIETNAMESE_DIACRITIC_RX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi;
  const VIETNAMESE_DIACRITIC_SINGLE_RX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const UNACCENTED_VI_SYLLABLES = new Set([
    'toi', 'ban', 'khong', 'duoc', 'nay', 'cua', 'nhung', 'nguoi', 'trong',
    'chung', 'viet', 'nam', 'hoc', 'sinh', 'ngay', 'hom', 'di', 'troi', 'dep',
    'qua', 'cac', 'viec', 'lam', 'tieng', 'anh', 'biet', 'hieu', 'muon', 'thich',
    'nhin', 'nghe', 'doc', 'xem', 'buoi', 'sang', 'chieu', 'nhanh', 'cham', 'nho',
    'lon', 'moi', 'rat', 'cung', 'chi', 'chu', 'ma', 'thi', 'roi', 'nhe', 'tu',
    'den', 'cho', 'de', 've', 'ong', 'ba', 'em', 'yeu', 'gioi', 'hay', 'truong',
    'lop', 'thay', 'song', 'hang', 'phat', 'trien', 'cong', 'nghe', 'nhieu', 'nhu',
    'khi', 'voi', 'mot', 'nha', 'chuyen', 'gia'
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
    'hello', 'world', 'quick', 'brown', 'fox', 'jumps', 'english', 'reading', 'practice'
  ]);

  const EN_STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this',
    'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'can',
    'could', 'may', 'might', 'must', 'to', 'of', 'in', 'on', 'at', 'by', 'for',
    'with', 'from', 'as', 'into', 'about', 'it', 'its', 'they', 'them', 'their',
    'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'i', 'me', 'my'
  ]);

  const DEFAULT_PASSAGE = {
    id: 'ra_default_01',
    title: 'Daily English Read-Aloud Practice',
    textEn: 'Consistent daily practice is one of the most effective ways to improve both your pronunciation and spoken fluency. Reading short English passages aloud helps your mouth muscles adapt to natural rhythm and stress patterns.',
    textVi: 'Luyện tập đều đặn hằng ngày là một trong những cách hiệu quả nhất để cải thiện cả phát âm và độ trôi chảy khi nói.',
    sourceId: 'ra_default_01',
    sourceType: 'bank',
    fromTranslation: false
  };

  const state = {
    mounted: false,
    passage: Object.assign({}, DEFAULT_PASSAGE),
    accent: 'en-US',
    rate: 1.0,
    isSpeakingModel: false,
    ttsQueueCancelled: false,
    // Recording & STT
    mediaRecorder: null,
    mediaStream: null,
    audioChunks: [],
    audioBlob: null,
    audioUrl: null,
    isRecording: false,
    recordingStartTime: null,
    recordingTimerInterval: null,
    durationSec: 0,
    recognition: null,
    committedTranscript: '',
    sessionFinalTranscript: '',
    liveTranscript: '',
    recognitionRestarts: 0,
    recognitionRestartTimer: null,
    // Scoring & History
    isScoring: false,
    lastEvaluation: null,
    completedPassages: {},
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

  function safeStorageSet(key, val) {
    try {
      const g = getGlobal();
      if (g && g.localStorage && typeof g.localStorage.setItem === 'function') {
        g.localStorage.setItem(key, val);
      }
    } catch (e) {}
  }

  function loadPersistedPrefs() {
    const savedAccent = safeStorageGet(STORAGE_RA_ACCENT);
    if (savedAccent) state.accent = savedAccent;
    const savedRate = Number(safeStorageGet(STORAGE_RA_RATE));
    if (Number.isFinite(savedRate) && savedRate >= 0.6 && savedRate <= 1.5) {
      state.rate = savedRate;
    }
    try {
      const rawHist = safeStorageGet(STORAGE_RA_HISTORY);
      if (rawHist) {
        const parsed = JSON.parse(rawHist);
        if (Array.isArray(parsed)) state.history = parsed.slice(0, 50);
      }
    } catch (e) {}
  }

  function persistHistory() {
    try {
      safeStorageSet(STORAGE_RA_HISTORY, JSON.stringify(state.history.slice(0, 50)));
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

  function formatTimer(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  function setStatusMessage(msg, tone) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('raRecordingStatus');
    if (!el) return;
    if (!msg) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    el.style.display = 'block';
    el.textContent = msg;
    el.style.color = tone === 'good' ? 'var(--good)' : (tone === 'error' ? 'var(--incorrect-color)' : 'var(--ink-2)');
    el.style.background = tone === 'good' ? 'var(--good-wash)' : 'var(--accent-wash)';
  }

  // ==================== A. STANDALONE PASSAGE CATALOG & LOADING ====================

  function getStandalonePassages(sourceType) {
    const g = getGlobal();
    const type = sourceType || 'all';
    const items = [];
    const bank = Array.isArray(g.TRANSLATION_BANK) ? g.TRANSLATION_BANK : [];

    if (type === 'study4') {
      for (let i = 0; i < bank.length; i++) {
        const b = bank[i];
        if (!b || !String(b.id || '').startsWith('tb_study4_') || !b.referenceEn || !String(b.referenceEn).trim()) continue;
        items.push({
          id: String(b.id),
          title: String(b.titleEn || b.title || ('Study4 ' + (i + 1))).trim(),
          textEn: String(b.referenceEn).trim(),
          textVi: String(b.textVi || '').trim(),
          sourceId: String(b.id),
          sourceType: 'study4',
          fromTranslation: false
        });
      }
      return items;
    }

    if (type === 'all' || type === 'bank') {
      // Surface Study4 Speaking passages prominently alongside all bank passages
      const ordered = [];
      for (let i = 0; i < bank.length; i++) {
        if (bank[i] && String(bank[i].id || '').startsWith('tb_study4_')) ordered.push(bank[i]);
      }
      for (let i = 0; i < bank.length; i++) {
        if (bank[i] && !String(bank[i].id || '').startsWith('tb_study4_')) ordered.push(bank[i]);
      }
      let bankAdded = 0;
      for (let i = 0; i < ordered.length; i++) {
        const b = ordered[i];
        if (!b || !b.referenceEn || !String(b.referenceEn).trim()) continue;
        items.push({
          id: String(b.id || ('bank_' + i)),
          title: String(b.titleEn || b.title || ('Passage ' + (i + 1))).trim(),
          textEn: String(b.referenceEn).trim(),
          textVi: String(b.textVi || '').trim(),
          sourceId: String(b.id || ('bank_' + i)),
          sourceType: 'bank',
          fromTranslation: false
        });
        bankAdded++;
        if (bankAdded >= 2000) break;
      }
    }

    if (type === 'all' || type === 'reading') {
      const readings = g.APP_DATA && Array.isArray(g.APP_DATA.readings) ? g.APP_DATA.readings : [];
      let readingAdded = 0;
      for (let r = 0; r < readings.length; r++) {
        const rd = readings[r];
        if (!rd || !rd.content || !String(rd.content).trim()) continue;
        items.push({
          id: 'reading_' + String(rd.id || r),
          title: String(rd.title || ('IELTS Reading ' + (r + 1))).trim(),
          textEn: String(rd.content).trim(),
          textVi: String(rd.translation_vi || '').trim(),
          sourceId: 'reading_' + String(rd.id || r),
          sourceType: 'reading',
          fromTranslation: false
        });
        readingAdded++;
        if (readingAdded >= 500) break;
      }
    }

    return items;
  }

  function loadPassage(passage) {
    stopRecording();
    stopModelSpeech();

    const p = passage || {};
    const normalized = {
      id: String(p.sourceId || p.id || ('ra_' + Date.now())),
      title: String(p.title || 'Read-Aloud Practice').trim(),
      textEn: String(p.textEn || '').trim(),
      textVi: String(p.textVi || '').trim(),
      sourceId: String(p.sourceId || p.id || ''),
      sourceType: p.fromTranslation ? 'translation' : (p.sourceType || 'custom'),
      fromTranslation: Boolean(p.fromTranslation)
    };

    state.passage = normalized;
    state.audioChunks = [];
    state.audioBlob = null;
    if (state.audioUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      try { URL.revokeObjectURL(state.audioUrl); } catch (e) {}
    }
    state.audioUrl = null;
    state.durationSec = 0;
    state.committedTranscript = '';
    state.sessionFinalTranscript = '';
    state.liveTranscript = '';
    state.lastEvaluation = null;

    if (typeof document !== 'undefined') {
      const titleEl = document.getElementById('raPassageTitle');
      if (titleEl) titleEl.textContent = normalized.title;

      const textEl = document.getElementById('raPassageTextEn');
      if (textEl) textEl.textContent = normalized.textEn || 'Chưa có nội dung tiếng Anh. Hãy chọn bài hoặc dán văn bản bên trên.';

      const viEl = document.getElementById('raPassageTextVi');
      if (viEl) {
        if (normalized.textVi) {
          viEl.style.display = 'block';
          viEl.textContent = normalized.textVi;
        } else {
          viEl.style.display = 'none';
          viEl.textContent = '';
        }
      }

      const badgeEl = document.getElementById('raSourceBadge');
      if (badgeEl) {
        badgeEl.textContent = normalized.fromTranslation
          ? 'Từ bài luyện dịch'
          : (normalized.sourceType === 'reading' ? 'IELTS Reading' : (normalized.sourceType === 'custom' ? 'Văn bản cá nhân' : 'Kho luyện đọc'));
      }

      const trInput = document.getElementById('raTranscriptInput');
      if (trInput) trInput.value = '';
      updateWordCountUI('');

      const timerEl = document.getElementById('raRecTimer');
      if (timerEl) timerEl.textContent = '00:00';

      const audioZone = document.getElementById('raAudioPlayerZone');
      if (audioZone) audioZone.style.display = 'none';

      const resultZone = document.getElementById('raResultZone');
      if (resultZone) resultZone.innerHTML = '';

      const placeholder = document.getElementById('raResultPlaceholder');
      if (placeholder) placeholder.style.display = 'block';

      setStatusMessage('', 'info');
    }

    return Object.assign({}, state.passage);
  }

  function loadCustomPassage(textEn, title) {
    const clean = String(textEn || '').trim();
    if (!clean) {
      setStatusMessage('Vui lòng nhập hoặc dán đoạn tiếng Anh trước khi nạp.', 'error');
      return null;
    }
    return loadPassage({
      id: 'ra_custom_' + Date.now(),
      title: String(title || 'Custom English Read-Aloud').trim(),
      textEn: clean,
      textVi: '',
      sourceId: 'ra_custom_' + Date.now(),
      sourceType: 'custom',
      fromTranslation: false
    });
  }

  // ==================== B. CHUNKED TTS MODEL PLAYBACK ====================

  function pickEnglishVoice(accent) {
    const g = getGlobal();
    const synth = g && g.speechSynthesis;
    if (!synth || typeof synth.getVoices !== 'function') return null;
    const voices = synth.getVoices() || [];
    if (!voices.length) return null;
    const target = accent && accent !== 'auto' ? accent.toLowerCase() : 'en-us';
    return (
      voices.find(v => v.lang && v.lang.toLowerCase() === target) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith(target.split('-')[0])) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      null
    );
  }

  function updateListenButtonUI() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('raBtnListenModel');
    if (btn) {
      btn.textContent = state.isSpeakingModel ? '⏹️ Dừng đọc mẫu' : '🔊 Nghe đọc mẫu';
    }
  }

  function stopModelSpeech() {
    state.ttsQueueCancelled = true;
    state.isSpeakingModel = false;
    const g = getGlobal();
    if (g && g.speechSynthesis && typeof g.speechSynthesis.cancel === 'function') {
      try { g.speechSynthesis.cancel(); } catch (e) {}
    }
    updateListenButtonUI();
  }

  function speakModel(overrideText) {
    const g = getGlobal();
    const text = String(overrideText || state.passage.textEn || '').trim();
    if (!text) return false;

    if (state.isSpeakingModel && !overrideText) {
      stopModelSpeech();
      return false;
    }

    const synth = g && g.speechSynthesis;
    const UtteranceCtor = g && g.SpeechSynthesisUtterance;
    if (!synth || typeof synth.speak !== 'function' || typeof UtteranceCtor !== 'function') {
      setStatusMessage('Trình duyệt không hỗ trợ phát âm TTS (SpeechSynthesis).', 'info');
      return false;
    }

    stopModelSpeech();
    state.ttsQueueCancelled = false;
    state.isSpeakingModel = true;
    updateListenButtonUI();

    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const voice = pickEnglishVoice(state.accent);
    let idx = 0;

    const speakNext = () => {
      if (state.ttsQueueCancelled || idx >= sentences.length) {
        state.isSpeakingModel = false;
        updateListenButtonUI();
        return;
      }
      const chunk = sentences[idx++].trim();
      if (!chunk) {
        speakNext();
        return;
      }
      const utter = new UtteranceCtor(chunk);
      utter.lang = state.accent === 'auto' ? 'en-US' : state.accent;
      utter.rate = state.rate || 1.0;
      if (voice) utter.voice = voice;
      utter.onend = speakNext;
      utter.onerror = () => {
        state.isSpeakingModel = false;
        updateListenButtonUI();
      };
      try {
        synth.speak(utter);
      } catch (e) {
        state.isSpeakingModel = false;
        updateListenButtonUI();
      }
    };

    speakNext();
    return true;
  }

  function setAccent(accent) {
    state.accent = String(accent || 'en-US');
    safeStorageSet(STORAGE_RA_ACCENT, state.accent);
  }

  function setRate(rate) {
    const r = Number(rate);
    if (Number.isFinite(r) && r >= 0.6 && r <= 1.5) {
      state.rate = r;
      safeStorageSet(STORAGE_RA_RATE, String(r));
    }
  }

  // ==================== C. AUDIO RECORDING & LIVE STT (.value ONLY) ====================

  function updateWordCountUI(text) {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('raWordCountBadge');
    if (!badge) return;
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    badge.textContent = words.length + ' từ';
  }

  function syncTranscriptToTextarea(val) {
    state.liveTranscript = String(val || '');
    if (typeof document !== 'undefined') {
      const el = document.getElementById('raTranscriptInput');
      if (el) {
        // Strictly update .value — NEVER .textContent!
        el.value = state.liveTranscript;
      }
    }
    updateWordCountUI(state.liveTranscript);
  }

  function handleTranscriptInput(val) {
    state.committedTranscript = String(val || '');
    state.sessionFinalTranscript = '';
    state.liveTranscript = state.committedTranscript;
    updateWordCountUI(state.liveTranscript);
  }

  function clearTranscript() {
    state.committedTranscript = '';
    state.sessionFinalTranscript = '';
    syncTranscriptToTextarea('');
  }

  function updateRecordButtonUI() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('raBtnRecord');
    if (!btn) return;
    if (state.isRecording) {
      btn.classList.add('recording');
      btn.style.background = 'var(--incorrect-color)';
      btn.textContent = '⏹️ Dừng ghi âm';
    } else {
      btn.classList.remove('recording');
      btn.style.background = '';
      btn.textContent = '🎙️ Bắt đầu đọc';
    }
  }

  function syncPreexistingTextareaValue() {
    if (typeof document === 'undefined') return;
    const trInput = document.getElementById('raTranscriptInput');
    if (trInput && typeof trInput.value === 'string' && trInput.value.trim() && !state.committedTranscript) {
      state.committedTranscript = trInput.value.trim();
      state.liveTranscript = trInput.value;
    }
  }

  function startLiveRecognition() {
    syncPreexistingTextareaValue();
    const g = getGlobal();
    const RecCtor = g && (g.SpeechRecognition || g.webkitSpeechRecognition);
    if (!RecCtor) {
      setStatusMessage('Trình duyệt không hỗ trợ nhận diện giọng nói trực tiếp — file ghi âm sẽ được Groq Whisper phiên âm, hoặc bạn có thể gõ/sửa văn bản bên dưới.', 'info');
      return;
    }

    if (state.recognition) {
      try { state.recognition.onend = null; state.recognition.stop(); } catch (e) {}
    }

    const rec = new RecCtor();
    rec.lang = state.accent === 'auto' ? 'en-US' : state.accent;
    rec.continuous = true;
    rec.interimResults = true;
    state.sessionFinalTranscript = '';

    rec.onresult = (event) => {
      let finals = '';
      let interim = '';
      const results = event && event.results ? event.results : [];
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        const txt = res && res[0] && res[0].transcript ? String(res[0].transcript) : '';
        if (res.isFinal) {
          finals += (finals ? ' ' : '') + txt.trim();
        } else {
          interim += (interim ? ' ' : '') + txt.trim();
        }
      }
      state.sessionFinalTranscript = finals.trim();
      const combined = [state.committedTranscript, state.sessionFinalTranscript, interim.trim()]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      syncTranscriptToTextarea(combined);
    };

    rec.onerror = (ev) => {
      const errCode = ev && ev.error ? ev.error : 'unknown';
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed' || errCode === 'audio-capture') {
        state.recognitionRestarts = 999; // Do not spin-restart on permission error
        setStatusMessage('Không thể truy cập micro cho nhận diện giọng nói (' + errCode + '). Bạn vẫn có thể nhập hoặc sửa transcript thủ công.', 'error');
      }
    };

    rec.onend = () => {
      if (state.sessionFinalTranscript) {
        state.committedTranscript = [state.committedTranscript, state.sessionFinalTranscript]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        state.sessionFinalTranscript = '';
        syncTranscriptToTextarea(state.committedTranscript);
      }
      if (state.isRecording && state.recognitionRestarts < 12) {
        state.recognitionRestarts++;
        state.recognitionRestartTimer = setTimeout(() => {
          if (state.isRecording) startLiveRecognition();
        }, 150);
      }
    };

    state.recognition = rec;
    try {
      rec.start();
    } catch (e) {}
  }

  async function startRecording() {
    if (state.isRecording) return true;
    stopModelSpeech();

    if (typeof document !== 'undefined') {
      const trInput = document.getElementById('raTranscriptInput');
      if (trInput && typeof trInput.value === 'string') {
        state.committedTranscript = trInput.value.trim();
        state.sessionFinalTranscript = '';
        state.liveTranscript = trInput.value;
      }
    }

    const g = getGlobal();
    const nav = g && g.navigator;
    const MediaRecCtor = g && g.MediaRecorder;

    if (!nav || !nav.mediaDevices || typeof nav.mediaDevices.getUserMedia !== 'function' || typeof MediaRecCtor !== 'function') {
      setStatusMessage('Thiết bị/trình duyệt không hỗ trợ ghi âm trực tiếp. Bạn có thể đọc luyện và nhập transcript vào khung bên dưới để chấm.', 'error');
      return false;
    }

    try {
      const stream = await nav.mediaDevices.getUserMedia({ audio: true });
      state.mediaStream = stream;
      state.audioChunks = [];
      state.audioBlob = null;
      state.recognitionRestarts = 0;

      let options;
      if (typeof MediaRecCtor.isTypeSupported === 'function') {
        if (MediaRecCtor.isTypeSupported('audio/webm;codecs=opus')) options = { mimeType: 'audio/webm;codecs=opus' };
        else if (MediaRecCtor.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };
      }

      const recorder = options ? new MediaRecCtor(stream, options) : new MediaRecCtor(stream);
      state.mediaRecorder = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev && ev.data && ev.data.size > 0) {
          state.audioChunks.push(ev.data);
        }
      };

      recorder.onstop = () => {
        if (state.audioChunks.length > 0 && typeof Blob !== 'undefined') {
          state.audioBlob = new Blob(state.audioChunks, { type: recorder.mimeType || 'audio/webm' });
          if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
            if (state.audioUrl && typeof URL.revokeObjectURL === 'function') {
              try { URL.revokeObjectURL(state.audioUrl); } catch (e) {}
            }
            state.audioUrl = URL.createObjectURL(state.audioBlob);
            if (typeof document !== 'undefined') {
              const zone = document.getElementById('raAudioPlayerZone');
              const audioEl = document.getElementById('raPlaybackAudio');
              if (zone && audioEl) {
                audioEl.src = state.audioUrl;
                zone.style.display = 'flex';
              }
            }
          }
        }
        if (state.mediaStream && typeof state.mediaStream.getTracks === 'function') {
          state.mediaStream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} });
        }
        state.mediaStream = null;
      };

      state.isRecording = true;
      state.recordingStartTime = Date.now();
      state.durationSec = 0;
      updateRecordButtonUI();
      setStatusMessage('Đang ghi âm và nhận diện giọng nói tiếng Anh...', 'good');

      if (typeof document !== 'undefined') {
        const timerEl = document.getElementById('raRecTimer');
        if (timerEl) timerEl.textContent = '00:00';
      }

      state.recordingTimerInterval = setInterval(() => {
        if (!state.isRecording) return;
        const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
        state.durationSec = elapsed;
        if (typeof document !== 'undefined') {
          const timerEl = document.getElementById('raRecTimer');
          if (timerEl) timerEl.textContent = formatTimer(elapsed);
        }
        if (elapsed >= 300) {
          stopRecording();
        }
      }, 500);

      recorder.start(250);
      startLiveRecognition();
      return true;
    } catch (err) {
      state.isRecording = false;
      updateRecordButtonUI();
      const errName = err && err.name ? err.name : 'Error';
      setStatusMessage('Không thể bật micro (' + errName + '). Hãy cấp quyền micro hoặc nhập trực tiếp transcript để chấm.', 'error');
      return false;
    }
  }

  function stopRecording() {
    if (state.recordingTimerInterval) {
      clearInterval(state.recordingTimerInterval);
      state.recordingTimerInterval = null;
    }
    if (state.recognitionRestartTimer) {
      clearTimeout(state.recognitionRestartTimer);
      state.recognitionRestartTimer = null;
    }
    if (state.isRecording && state.recordingStartTime) {
      state.durationSec = Math.max(state.durationSec, Math.round((Date.now() - state.recordingStartTime) / 1000));
    }
    state.isRecording = false;

    if (state.recognition) {
      try {
        state.recognition.onend = null;
        state.recognition.stop();
      } catch (e) {}
      state.recognition = null;
    }
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      try { state.mediaRecorder.stop(); } catch (e) {}
    }
    if (state.mediaStream && typeof state.mediaStream.getTracks === 'function') {
      state.mediaStream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} });
      state.mediaStream = null;
    }
    updateRecordButtonUI();
  }

  function toggleRecording() {
    if (state.isRecording) {
      stopRecording();
      setStatusMessage('Đã dừng ghi âm. Kiểm tra transcript rồi nhấn "Chấm đọc lại".', 'info');
      return false;
    }
    return startRecording();
  }

  function discardRecording() {
    stopRecording();
    state.audioChunks = [];
    state.audioBlob = null;
    if (state.audioUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      try { URL.revokeObjectURL(state.audioUrl); } catch (e) {}
    }
    state.audioUrl = null;
    state.durationSec = 0;
    clearTranscript();
    if (typeof document !== 'undefined') {
      const zone = document.getElementById('raAudioPlayerZone');
      if (zone) zone.style.display = 'none';
      const timerEl = document.getElementById('raRecTimer');
      if (timerEl) timerEl.textContent = '00:00';
    }
    setStatusMessage('Đã xóa bản ghi âm hiện tại.', 'info');
  }

  // ==================== D. PURE WORD ALIGNMENT & PRONUNCIATION SCORING ====================

  function normalizeWordToken(rawWord) {
    return String(rawWord == null ? '' : rawWord)
      .replace(/[’‘]/g, "'")
      .toLowerCase()
      .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  }

  function tokenizeEnglishWords(text) {
    const rawParts = String(text == null ? '' : text).trim().split(/\s+/).filter(Boolean);
    const tokens = [];
    for (let i = 0; i < rawParts.length; i++) {
      const norm = normalizeWordToken(rawParts[i]);
      if (!norm) continue;
      tokens.push({
        raw: rawParts[i].replace(/^["'(]+|["'),.!?;:]+$/g, '') || norm,
        norm,
        index: tokens.length
      });
    }
    return tokens;
  }

  function alignWordsAndScorePronunciation(referenceEn, spokenTranscript) {
    const allRef = tokenizeEnglishWords(referenceEn);
    const allSpk = tokenizeEnglishWords(spokenTranscript);

    let truncated = false;
    let refTokens = allRef;
    let spkTokens = allSpk;
    if (refTokens.length * spkTokens.length > 400000) {
      refTokens = allRef.slice(0, 600);
      spkTokens = allSpk.slice(0, 600);
      truncated = true;
    }

    const m = refTokens.length;
    const n = spkTokens.length;

    if (m === 0) {
      return {
        accuracyPct: 0,
        matchRatePct: 0,
        wer: 1,
        totalRefWords: 0,
        totalSpokenWords: n,
        matchedWords: [],
        missingWords: [],
        extraWords: spkTokens.map(t => t.raw),
        substitutions: [],
        ops: spkTokens.map(t => ({ type: 'insert', refWord: null, spokenWord: t.raw })),
        diffHtml: spkTokens.map(t => '<span class="ra-word-extra">(+' + escapeHtml(t.raw) + ')</span>').join(' '),
        truncated
      };
    }

    if (n === 0) {
      return {
        accuracyPct: 0,
        matchRatePct: 0,
        wer: 1,
        totalRefWords: m,
        totalSpokenWords: 0,
        matchedWords: [],
        missingWords: refTokens.map(t => t.raw),
        extraWords: [],
        substitutions: [],
        ops: refTokens.map(t => ({ type: 'delete', refWord: t.raw, spokenWord: null })),
        diffHtml: refTokens.map(t => '<span class="ra-word-miss" style="color:var(--incorrect-color);text-decoration:underline;">' + escapeHtml(t.raw) + '</span>').join(' '),
        truncated
      };
    }

    // Levenshtein DP on word arrays
    const dp = new Array(m + 1);
    for (let i = 0; i <= m; i++) {
      dp[i] = new Int32Array(n + 1);
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      const rNorm = refTokens[i - 1].norm;
      for (let j = 1; j <= n; j++) {
        const sNorm = spkTokens[j - 1].norm;
        const cost = rNorm === sNorm ? 0 : 1;
        const sub = dp[i - 1][j - 1] + cost;
        const del = dp[i - 1][j] + 1;
        const ins = dp[i][j - 1] + 1;
        dp[i][j] = Math.min(sub, del, ins);
      }
    }

    // Backtrack
    const opsRev = [];
    let i = m;
    let j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0) {
        const rTok = refTokens[i - 1];
        const sTok = spkTokens[j - 1];
        const isMatch = rTok.norm === sTok.norm;
        const diagCost = dp[i - 1][j - 1] + (isMatch ? 0 : 1);
        if (dp[i][j] === diagCost) {
          opsRev.push({
            type: isMatch ? 'match' : 'substitute',
            refWord: rTok.raw,
            spokenWord: sTok.raw
          });
          i--;
          j--;
          continue;
        }
      }
      if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        opsRev.push({
          type: 'delete',
          refWord: refTokens[i - 1].raw,
          spokenWord: null
        });
        i--;
      } else {
        opsRev.push({
          type: 'insert',
          refWord: null,
          spokenWord: spkTokens[j - 1].raw
        });
        j--;
      }
    }

    const ops = opsRev.reverse();
    const matchedWords = [];
    const missingWords = [];
    const extraWords = [];
    const substitutions = [];
    const htmlParts = [];

    for (let k = 0; k < ops.length; k++) {
      const op = ops[k];
      if (op.type === 'match') {
        matchedWords.push(op.refWord);
        htmlParts.push('<span class="ra-word-ok" style="color:var(--good);font-weight:500;">' + escapeHtml(op.refWord) + '</span>');
      } else if (op.type === 'substitute') {
        substitutions.push({ expected: op.refWord, actual: op.spokenWord });
        htmlParts.push(
          '<span class="ra-word-sub" style="background:var(--accent-wash);padding:1px 4px;border-radius:4px;">' +
            '<del style="color:var(--incorrect-color);">' + escapeHtml(op.spokenWord) + '</del> → ' +
            '<strong style="color:var(--ink);">' + escapeHtml(op.refWord) + '</strong>' +
          '</span>'
        );
      } else if (op.type === 'delete') {
        missingWords.push(op.refWord);
        htmlParts.push(
          '<span class="ra-word-miss" style="color:var(--incorrect-color);text-decoration:underline;">[thiếu: ' + escapeHtml(op.refWord) + ']</span>'
        );
      } else {
        extraWords.push(op.spokenWord);
        htmlParts.push(
          '<span class="ra-word-extra" style="color:var(--ink-3);font-style:italic;">(+' + escapeHtml(op.spokenWord) + ')</span>'
        );
      }
    }

    const edits = substitutions.length + missingWords.length + extraWords.length;
    const wer = Number((edits / Math.max(1, m)).toFixed(4));
    const matchRatePct = Math.round((matchedWords.length / Math.max(1, m)) * 100);
    const accuracyPct = Math.max(0, Math.min(100, Math.round((1 - Math.min(1, wer)) * 100)));

    return {
      accuracyPct,
      matchRatePct,
      wer,
      totalRefWords: m,
      totalSpokenWords: n,
      matchedWords,
      missingWords,
      extraWords,
      substitutions,
      ops,
      diffHtml: htmlParts.join(' '),
      truncated
    };
  }

  // ==================== E. VALIDATION, GRAMMAR & CALIBRATED LOCAL SCORING ====================

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

  function validateReadAloudTranscript(transcript, referenceEn) {
    const clean = String(transcript == null ? '' : transcript).trim();
    if (!clean) {
      return {
        valid: false,
        reason: 'EMPTY',
        message: 'Chưa có nội dung đọc tiếng Anh. Hãy bật micro đọc bài hoặc nhập transcript trước khi chấm.'
      };
    }

    const alphaChars = (clean.match(/[a-zA-ZÀ-ỹ]/g) || []).length;
    const viMatches = clean.match(VIETNAMESE_DIACRITIC_RX) || [];
    const viDiacritics = viMatches.length;
    const spaceTokens = clean.split(/\s+/).filter(Boolean);
    let viWordCount = 0;
    for (let i = 0; i < spaceTokens.length; i++) {
      if (VIETNAMESE_DIACRITIC_SINGLE_RX.test(spaceTokens[i])) viWordCount++;
    }
    const viDensity = viDiacritics / Math.max(1, alphaChars);
    const viWordRatio = spaceTokens.length > 0 ? viWordCount / spaceTokens.length : 0;

    const refTokens = tokenizeEnglishWords(referenceEn);
    const refNormSet = new Set(refTokens.map(t => t.norm));
    const rawTokens = clean.match(/[A-Za-z][A-Za-z'-]*/g) || [];
    const validWords = [];

    for (let i = 0; i < rawTokens.length; i++) {
      if (isPlausibleEnglishWord(rawTokens[i])) {
        validWords.push(rawTokens[i].toLowerCase());
      }
    }

    const uniqueValid = new Set(validWords);
    let anchorHits = 0;
    let refMatchHits = 0;
    let unaccentedViTokenHits = 0;
    for (let i = 0; i < validWords.length; i++) {
      const w = validWords[i];
      if (UNACCENTED_VI_SYLLABLES.has(w)) unaccentedViTokenHits++;
    }
    uniqueValid.forEach((w) => {
      if (COMMON_EN_ANCHORS.has(w)) anchorHits++;
      if (refNormSet.has(w)) refMatchHits++;
    });

    if (viDiacritics > 0) {
      if (
        viDensity > 0.06 ||
        viWordRatio > 0.25 ||
        (anchorHits === 0 && refMatchHits === 0 && viDiacritics >= 2) ||
        (validWords.length < 6 && viDiacritics >= 2)
      ) {
        return {
          valid: false,
          reason: 'VIETNAMESE_TEXT',
          message: 'Phát hiện văn bản tiếng Việt có dấu. Tab Đọc lại chỉ nhận diện và chấm bài đọc tiếng Anh.'
        };
      }
    }

    if (
      unaccentedViTokenHits >= 3 &&
      (
        (anchorHits === 0 && refMatchHits === 0) ||
        (unaccentedViTokenHits / Math.max(1, validWords.length) >= 0.30 && unaccentedViTokenHits > anchorHits && refMatchHits < 2)
      )
    ) {
      return {
        valid: false,
        reason: 'VIETNAMESE_TEXT',
        message: 'Nội dung giống tiếng Việt không dấu. Vui lòng đọc bài bằng tiếng Anh.'
      };
    }

    const minWords = refTokens.length > 0 ? Math.min(5, Math.max(1, refTokens.length)) : 3;
    if (validWords.length < minWords) {
      return {
        valid: false,
        reason: 'TOO_FEW_ENGLISH_WORDS',
        message: 'Nội dung đọc tiếng Anh quá ngắn (cần tối thiểu ' + minWords + ' từ tiếng Anh hợp lệ).'
      };
    }

    if (
      (anchorHits === 0 && refMatchHits === 0) ||
      (validWords.length >= 5 && uniqueValid.size < 3 && minWords >= 3) ||
      (validWords.length >= 6 && uniqueValid.size / validWords.length <= 0.30) ||
      (validWords.length >= 12 && (
        uniqueValid.size / validWords.length < 0.20 ||
        uniqueValid.size < Math.min(6, Math.ceil(validWords.length * 0.20))
      ))
    ) {
      return {
        valid: false,
        reason: 'GIBBERISH_OR_SPAM',
        message: 'Không nhận diện được câu tiếng Anh hợp lệ (phát hiện từ vô nghĩa hoặc lặp lại bất thường).'
      };
    }

    return {
      valid: true,
      validWordCount: validWords.length,
      uniqueValidCount: uniqueValid.size,
      validWords
    };
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
          return p1 + ' ' + (map[p2.toLowerCase()] || (p2.toLowerCase() + 's'));
        },
        reason: 'Chủ ngữ ngôi thứ 3 số ít cần chia động từ ở hiện tại đơn.'
      },
      {
        rx: /\b(everybody|everyone|nobody|someone|anyone|everything)\s+(are|were|have|do)\b/gi,
        fix: (m, p1, p2) => {
          const map = { are: 'is', were: 'was', have: 'has', do: 'does' };
          return p1 + ' ' + (map[p2.toLowerCase()] || p2);
        },
        reason: 'Đại từ bất định luôn đi với động từ số ít.'
      },
      {
        rx: /\bthere\s+is\s+(many|several|two|three|four|five|some|a\s+lot\s+of)\b/gi,
        fix: (m, p1) => 'there are ' + p1,
        reason: 'Dùng "there are" cho danh từ số nhiều.'
      },
      {
        rx: /\bthere\s+are\s+(a|an)\s+([a-z]+)\b/gi,
        fix: (m, p1, p2) => 'there is ' + p1 + ' ' + p2,
        reason: 'Dùng "there is" cho danh từ số ít.'
      },
      {
        rx: /\b(did|didn't|does|doesn't|do|don't)\s+(went|saw|bought|ate|came|made|took|gave|wrote|spoke|had)\b/gi,
        fix: (m, p1, p2) => {
          const base = {
            went: 'go', saw: 'see', bought: 'buy', ate: 'eat', came: 'come',
            made: 'make', took: 'take', gave: 'give', wrote: 'write', spoke: 'speak', had: 'have'
          };
          return p1 + ' ' + (base[p2.toLowerCase()] || p2);
        },
        reason: 'Sau trợ động từ do/does/did phải dùng động từ nguyên mẫu.'
      },
      {
        rx: /\b(can|could|will|would|should|must)\s+able\s+to\b/gi,
        fix: (m, p1) => p1 + ' be able to',
        reason: 'Cần dùng "be able to" sau động từ khuyết thiếu.'
      },
      {
        rx: /\bin\s+(?:the\s+)?(yesterday|tomorrow|last\s+[a-z]+|next\s+[a-z]+)\b/gi,
        fix: (m, p1) => p1,
        reason: 'Không dùng giới từ "in" trước yesterday/tomorrow/last.../next...'
      },
      {
        rx: /\b(listen|listening)\s+(music|songs|the\s+radio|podcasts?)\b/gi,
        fix: (m, p1, p2) => p1 + ' to ' + p2,
        reason: 'Cần giới từ "to" sau "listen" (listen to music).'
      },
      {
        rx: /\bdespite\s+of\b/gi,
        fix: () => 'despite',
        reason: '"Despite" không đi kèm "of".'
      },
      {
        rx: /\bvery\s+(delicious|exhausted|freezing|furious|impossible|vital|essential|excellent|amazing|terrible)\b/gi,
        fix: (m, p1) => 'truly ' + p1,
        reason: 'Không kết hợp "very" với tính từ cực hạn.'
      },
      {
        rx: /\ba\s+(apple|orange|umbrella|hour|honest|idea|example|airport|animal|office)\b/gi,
        fix: (m, p1) => 'an ' + p1,
        reason: 'Dùng mạo từ "an" trước âm nguyên âm.'
      },
      {
        rx: /\b(informations|advices|equipments|homeworks|knowledges)\b/gi,
        fix: (m, p1) => p1.slice(0, -1),
        reason: 'Danh từ không đếm được không thêm "-s".'
      }
    ];

    for (let r = 0; r < rules.length; r++) {
      const rule = rules[r];
      let match;
      rule.rx.lastIndex = 0;
      while ((match = rule.rx.exec(clean)) !== null) {
        addErr(match[0], rule.fix.apply(null, match), rule.reason);
      }
    }

    return errors;
  }

  function accuracyToBand(acc) {
    if (acc >= 95) return 8.5;
    if (acc >= 88) return 7.5;
    if (acc >= 78) return 7.0;
    if (acc >= 68) return 6.0;
    if (acc >= 55) return 5.5;
    if (acc >= 40) return 4.5;
    return 3.5;
  }

  function roundHalf(band) {
    return Math.round(Math.max(0, Math.min(9.0, Number(band))) * 2) / 2;
  }

  function scoreReadAloudLocally(passage, transcript, durationSec) {
    const pObj = typeof passage === 'string'
      ? { title: 'Read-Aloud Practice', textEn: passage }
      : (passage || state.passage || {});
    const refEn = String(pObj.textEn || '').trim();
    const cleanTranscript = String(transcript == null ? '' : transcript).trim();
    const val = validateReadAloudTranscript(cleanTranscript, refEn);
    const alignment = alignWordsAndScorePronunciation(refEn, cleanTranscript);

    if (!val.valid) {
      return {
        valid: false,
        invalid: true,
        invalidReason: val.reason,
        invalidMessage: val.message,
        overallBand: 0,
        overallScore: 0,
        accuracyPct: 0,
        wer: 1,
        wpm: 0,
        speakingDurationSec: 0,
        transcript: cleanTranscript,
        alignment,
        criteria: {
          pronunciation: { band: 0, label: 'Phát âm & Độ khớp từ', feedback: val.message },
          grammar: { band: 0, label: 'Ngữ pháp & Chính xác', feedback: val.message, errors: [] },
          fluency: { band: 0, label: 'Độ trôi chảy & Tốc độ', feedback: val.message },
          lexical: { band: 0, label: 'Độ phủ từ vựng', feedback: val.message }
        },
        errors: [],
        upgradedTips: [],
        source: 'Input Validator'
      };
    }

    const spokenCount = val.validWordCount;
    const measuredDuration = Number(durationSec) > 0;
    const dur = measuredDuration ? Math.max(2, Number(durationSec)) : Math.max(4, Math.round(spokenCount / 2.1));
    const wpm = Math.round((spokenCount / dur) * 60);
    const completionRatio = alignment.totalRefWords > 0
      ? Math.min(1.2, spokenCount / alignment.totalRefWords)
      : 1;

    // 1. Pronunciation & Word Accuracy
    const prBand = refEn
      ? accuracyToBand(alignment.accuracyPct)
      : 6.5;

    // 2. Grammar & Accuracy (explicit grammar errors + tense/inflection substitutions)
    const grammarErrors = detectGrammarErrors(cleanTranscript);
    let inflectionDiffs = 0;
    for (let s = 0; s < alignment.substitutions.length; s++) {
      const sub = alignment.substitutions[s];
      const exp = normalizeWordToken(sub.expected);
      const act = normalizeWordToken(sub.actual);
      if (exp && act && (exp.startsWith(act) || act.startsWith(exp)) && exp !== act) {
        inflectionDiffs++;
        if (grammarErrors.length < 10) {
          grammarErrors.push({
            original: sub.actual,
            correction: sub.expected,
            reason: 'Sai đuôi chia từ/hình thái từ so với văn bản gốc ("' + sub.expected + '").'
          });
        }
      }
    }
    const graRaw = 8.2 - grammarErrors.length * 0.65 - (alignment.missingWords.length > alignment.totalRefWords * 0.35 ? 1.0 : 0);
    const graBand = roundHalf(Math.max(3.0, Math.min(8.5, graRaw)));

    // 3. Fluency & Pace (WPM + completion)
    let fcRaw = 7.5;
    if (measuredDuration) {
      if (wpm < 45) fcRaw = 4.0;
      else if (wpm < 75) fcRaw = 5.5;
      else if (wpm >= 100 && wpm <= 165) fcRaw = 8.0;
      else if (wpm > 195) fcRaw = 6.0;
      else fcRaw = 6.8;
    } else {
      fcRaw = completionRatio >= 0.8 ? 7.0 : 5.5;
    }
    if (completionRatio < 0.5) fcRaw = Math.min(fcRaw, 4.5);
    const fcBand = roundHalf(Math.max(3.0, Math.min(8.5, fcRaw)));

    // 4. Lexical / Completeness
    const refContent = tokenizeEnglishWords(refEn).filter(t => t.norm.length >= 4 && !EN_STOPWORDS.has(t.norm));
    const spkSet = new Set(tokenizeEnglishWords(cleanTranscript).map(t => t.norm));
    let contentHits = 0;
    for (let c = 0; c < refContent.length; c++) {
      if (spkSet.has(refContent[c].norm)) contentHits++;
    }
    const contentRecall = refContent.length > 0 ? contentHits / refContent.length : 0.75;
    const lrBand = roundHalf(Math.max(3.0, Math.min(8.5, 3.0 + contentRecall * 5.5)));

    const overallBand = roundHalf((prBand + graBand + fcBand + lrBand) / 4);
    const overallScore = Math.round((overallBand / 9) * 100);

    const upgradedTips = [];
    if (alignment.substitutions.length > 0) {
      upgradedTips.push('Chú ý phát âm rõ các từ bị nhận nhầm: ' + alignment.substitutions.slice(0, 5).map(s => s.expected + ' (bạn đọc: ' + s.actual + ')').join(', ') + '.');
    }
    if (alignment.missingWords.length > 0) {
      upgradedTips.push('Đọc đầy đủ các từ bị bỏ sót: ' + alignment.missingWords.slice(0, 6).join(', ') + '.');
    }
    if (measuredDuration && wpm < 75) {
      upgradedTips.push('Tốc độ đọc hiện tại ' + wpm + ' WPM hơi chậm; thử duy trì nhịp 105–150 WPM để tự nhiên hơn.');
    }

    return {
      valid: true,
      invalid: false,
      overallBand,
      overallScore,
      accuracyPct: alignment.accuracyPct,
      matchRatePct: alignment.matchRatePct,
      wer: alignment.wer,
      wpm,
      speakingDurationSec: dur,
      transcript: cleanTranscript,
      alignment,
      criteria: {
        pronunciation: {
          band: prBand,
          label: 'Phát âm & Độ khớp từ',
          feedback: 'Độ chính xác khớp từ đạt ' + alignment.accuracyPct + '% (WER ' + (alignment.wer * 100).toFixed(1) + '%).' +
            (alignment.substitutions.length ? ' Cần luyện phát âm rõ hơn các từ: ' + alignment.substitutions.slice(0, 4).map(s => s.expected).join(', ') + '.' : '')
        },
        grammar: {
          band: graBand,
          label: 'Ngữ pháp & Chính xác',
          errors: grammarErrors,
          feedback: grammarErrors.length > 0
            ? 'Phát hiện ' + grammarErrors.length + ' lỗi ngữ pháp hoặc thiếu đuôi từ (-s/-ed) khi đọc.'
            : 'Giữ vững cấu trúc ngữ pháp và đuôi từ chính xác.'
        },
        fluency: {
          band: fcBand,
          label: 'Độ trôi chảy & Tốc độ',
          feedback: 'Tốc độ ước tính ' + wpm + ' WPM trong ' + dur + ' giây (hoàn thành ~' + Math.round(completionRatio * 100) + '% bài đọc).'
        },
        lexical: {
          band: lrBand,
          label: 'Độ phủ từ vựng',
          feedback: 'Đọc đúng ' + contentHits + '/' + Math.max(1, refContent.length) + ' từ khóa nội dung chính của đoạn.'
        }
      },
      errors: grammarErrors,
      upgradedTips,
      source: 'Local Read-Aloud Calibrated Scorer'
    };
  }

  // ==================== F. GROQ WHISPER + LLAMA HYBRID EVALUATION ====================

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

  function parseBandSafe(val, fallback) {
    if (val === null || val === undefined || val === '') return fallback;
    const num = Number(val);
    return Number.isFinite(num) ? num : fallback;
  }

  async function evaluateWithGroq(apiKey, passage, audioBlob, fallbackTranscript, durationSec, fetchImpl, options) {
    const fetchFn = fetchImpl || (typeof fetch === 'function' ? fetch : null);
    if (!apiKey || !fetchFn) throw new Error('NO_GROQ_OR_FETCH');
    const timeoutMs = options && Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 12000;

    let finalTranscript = String(fallbackTranscript || '').trim();
    const usedAudioBlob = Boolean(audioBlob && audioBlob.size > 512 && typeof FormData !== 'undefined');

    if (usedAudioBlob) {
      const fd = new FormData();
      fd.append('file', audioBlob, 'readaloud.webm');
      fd.append('model', 'whisper-large-v3');
      fd.append('language', 'en');
      fd.append('temperature', '0');

      const wResp = await fetchWithTimeout(fetchFn, 'https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey },
        body: fd
      }, timeoutMs);
      if (wResp.status === 401) {
        const err = new Error('GROQ_UNAUTHORIZED_401');
        err.status = 401;
        throw err;
      }
      if (wResp.ok) {
        const wData = await wResp.json();
        if (wData && wData.text && String(wData.text).trim()) {
          finalTranscript = String(wData.text).trim();
          syncTranscriptToTextarea(finalTranscript);
        }
      }
    }

    const baseline = scoreReadAloudLocally(passage, finalTranscript, durationSec);
    if (baseline.invalid) {
      return baseline;
    }

    const align = baseline.alignment || {};
    const totalRefWords = Number(align.totalRefWords) || 0;
    const matchedCount = Array.isArray(align.matchedWords) ? align.matchedWords.length : 0;

    // Guard against silent-audio Whisper hallucinations (e.g. "Thank you very much for watching.")
    if (usedAudioBlob && totalRefWords >= 5 && matchedCount === 0) {
      const msg = 'Bản ghi âm không khớp với đoạn văn bản mẫu (0% từ khớp). Hãy kiểm tra micro và đọc đúng nội dung tiếng Anh.';
      return {
        valid: false,
        invalid: true,
        invalidReason: 'UNALIGNED_AUDIO',
        invalidMessage: msg,
        overallBand: 0,
        overallScore: 0,
        accuracyPct: 0,
        wer: align.wer != null ? align.wer : 1,
        wpm: 0,
        speakingDurationSec: Number(durationSec) || 0,
        transcript: finalTranscript,
        alignment: align,
        criteria: {
          pronunciation: { band: 0, label: 'Phát âm & Độ khớp từ', feedback: msg },
          grammar: { band: 0, label: 'Ngữ pháp & Chính xác', feedback: msg, errors: [] },
          fluency: { band: 0, label: 'Độ trôi chảy & Tốc độ', feedback: msg },
          lexical: { band: 0, label: 'Độ phủ từ vựng', feedback: msg }
        },
        errors: [],
        upgradedTips: ['Đọc to, rõ ràng và bám sát từng câu của văn bản mẫu.'],
        source: 'Whisper Alignment Guard'
      };
    }

    let aiFeedback = null;
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
            temperature: 0.2,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an IELTS Speaking & Pronunciation coach. Evaluate the read-aloud transcript against the reference passage. Return strict JSON: {"pronunciationBand":0-9,"grammarBand":0-9,"fluencyBand":0-9,"lexicalBand":0-9,"pronunciationFeedback":"Vietnamese","grammarFeedback":"Vietnamese","fluencyFeedback":"Vietnamese","lexicalFeedback":"Vietnamese","errors":[{"original":"...","correction":"...","reason":"Vietnamese"}],"tips":["Vietnamese tip"]}.'
              },
              {
                role: 'user',
                content: 'Reference passage:\n' + (passage.textEn || '') +
                  '\n\nSpoken transcript:\n' + finalTranscript +
                  '\n\nDeterministic alignment metrics: accuracy=' + baseline.accuracyPct + '%, WER=' + baseline.wer +
                  ', WPM=' + baseline.wpm + ', missing=' + baseline.alignment.missingWords.slice(0, 8).join(', ') +
                  ', substitutions=' + JSON.stringify(baseline.alignment.substitutions.slice(0, 8))
              }
            ]
          })
        }, timeoutMs);

        if (resp.status === 401) {
          const err = new Error('GROQ_UNAUTHORIZED_401');
          err.status = 401;
          throw err;
        }
        if (!resp.ok) continue;
        const data = await resp.json();
        const raw = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (raw) {
          aiFeedback = JSON.parse(stripJsonFences(raw));
          break;
        }
      } catch (err) {
        if (err && err.status === 401) throw err;
      }
    }

    if (!aiFeedback) return baseline;

    // Smooth calibrated hybrid merge: Groq cannot inflate pronunciation OR overall/criteria past alignment ceilings
    const acc = baseline.accuracyPct;
    let prBand = roundHalf(parseBandSafe(aiFeedback.pronunciationBand, baseline.criteria.pronunciation.band));
    let graBand = roundHalf(parseBandSafe(aiFeedback.grammarBand, baseline.criteria.grammar.band));
    let fcBand = roundHalf(parseBandSafe(aiFeedback.fluencyBand, baseline.criteria.fluency.band));
    let lrBand = roundHalf(parseBandSafe(aiFeedback.lexicalBand, baseline.criteria.lexical.band));

    if (totalRefWords >= 5 && (matchedCount === 0 || acc === 0)) {
      prBand = Math.min(prBand, 3.0);
      graBand = Math.min(graBand, 3.5);
      fcBand = Math.min(fcBand, 3.5);
      lrBand = Math.min(lrBand, 3.0);
    } else if (acc < 40) {
      prBand = Math.min(prBand, roundHalf(baseline.criteria.pronunciation.band + 0.5));
      graBand = Math.min(graBand, roundHalf(baseline.criteria.grammar.band + 1.0));
      fcBand = Math.min(fcBand, roundHalf(baseline.criteria.fluency.band + 1.0));
      lrBand = Math.min(lrBand, roundHalf(baseline.criteria.lexical.band + 1.0));
    } else if (acc < 70) {
      prBand = Math.min(prBand, roundHalf(baseline.criteria.pronunciation.band + 0.5));
      graBand = Math.min(graBand, roundHalf(baseline.criteria.grammar.band + 1.5));
      fcBand = Math.min(fcBand, roundHalf(baseline.criteria.fluency.band + 1.5));
      lrBand = Math.min(lrBand, roundHalf(baseline.criteria.lexical.band + 1.5));
    }

    let overallBand = roundHalf((prBand + graBand + fcBand + lrBand) / 4);
    if (totalRefWords >= 5 && (matchedCount === 0 || acc === 0)) {
      overallBand = Math.min(overallBand, 3.5);
    } else if (acc < 40) {
      overallBand = Math.min(overallBand, Math.min(4.5, roundHalf(baseline.overallBand + 0.5)));
    } else if (acc < 60) {
      overallBand = Math.min(overallBand, Math.min(6.0, roundHalf(baseline.overallBand + 0.5)));
    } else if (acc < 70) {
      overallBand = Math.min(overallBand, roundHalf(baseline.overallBand + 1.0));
    }

    const mergedErrors = Array.isArray(aiFeedback.errors) && aiFeedback.errors.length
      ? aiFeedback.errors
      : baseline.errors;

    return Object.assign({}, baseline, {
      overallBand,
      overallScore: Math.round((overallBand / 9) * 100),
      criteria: {
        pronunciation: Object.assign({}, baseline.criteria.pronunciation, {
          band: prBand,
          feedback: aiFeedback.pronunciationFeedback || baseline.criteria.pronunciation.feedback
        }),
        grammar: Object.assign({}, baseline.criteria.grammar, {
          band: graBand,
          errors: mergedErrors,
          feedback: aiFeedback.grammarFeedback || baseline.criteria.grammar.feedback
        }),
        fluency: Object.assign({}, baseline.criteria.fluency, {
          band: fcBand,
          feedback: aiFeedback.fluencyFeedback || baseline.criteria.fluency.feedback
        }),
        lexical: Object.assign({}, baseline.criteria.lexical, {
          band: lrBand,
          feedback: aiFeedback.lexicalFeedback || baseline.criteria.lexical.feedback
        })
      },
      errors: mergedErrors,
      upgradedTips: Array.isArray(aiFeedback.tips) && aiFeedback.tips.length ? aiFeedback.tips : baseline.upgradedTips,
      source: 'Groq Whisper + Llama Examiner + Local Alignment'
    });
  }

  function notifyDailyStreakAfterReadAloud() {
    try {
      const g = getGlobal();
      if (typeof g.markDailyStreakTaskCompleted === 'function') {
        g.markDailyStreakTaskCompleted('readaloud');
        const trDone = Boolean(
          state.passage.fromTranslation ||
          (g.TranslationPracticeEngine &&
            typeof g.TranslationPracticeEngine.hasCompletedTranslation === 'function' &&
            g.TranslationPracticeEngine.hasCompletedTranslation(state.passage.sourceId))
        );
        if (trDone) {
          g.markDailyStreakTaskCompleted('translation_readaloud');
        }
      }
      if (typeof g.refreshDailyStreakDeadlineUI === 'function') {
        g.refreshDailyStreakDeadlineUI();
      }
      if (typeof g.notifyLearnerStudyActivity === 'function') {
        g.notifyLearnerStudyActivity('readaloud');
      }
    } catch (e) {}
  }

  async function evaluateReadAloud(options) {
    if (state.isScoring) return state.lastEvaluation;
    const opts = options || {};
    state.isScoring = true;
    renderBusyState();

    try {
      if (state.isRecording) stopRecording();

      const inputEl = typeof document !== 'undefined' ? document.getElementById('raTranscriptInput') : null;
      const transcriptText = opts.transcript != null
        ? String(opts.transcript)
        : (inputEl ? inputEl.value : state.liveTranscript);

      const apiKey = opts.apiKey || getGroqKey();
      let result;

      if (apiKey && (state.audioBlob || transcriptText.trim())) {
        try {
          result = await evaluateWithGroq(
            apiKey,
            state.passage,
            state.audioBlob,
            transcriptText,
            opts.durationSec != null ? opts.durationSec : state.durationSec,
            opts.fetchImpl,
            { timeoutMs: opts.timeoutMs }
          );
        } catch (err) {
          result = scoreReadAloudLocally(
            state.passage,
            transcriptText,
            opts.durationSec != null ? opts.durationSec : state.durationSec
          );
          if (!result.invalid) {
            result.source = 'Local Read-Aloud Calibrated Scorer (' + (err && err.status === 401 ? 'Invalid Groq Key' : 'Offline Fallback') + ')';
          }
        }
      } else {
        result = scoreReadAloudLocally(
          state.passage,
          transcriptText,
          opts.durationSec != null ? opts.durationSec : state.durationSec
        );
      }

      state.lastEvaluation = result;
      renderEvaluationResult(result);

      if (result && !result.invalid && result.overallBand >= 4.0 && result.accuracyPct >= 25) {
        const key = state.passage.sourceId || state.passage.id || 'default';
        state.completedPassages[key] = {
          accuracyPct: result.accuracyPct,
          overallBand: result.overallBand,
          timestamp: new Date().toISOString()
        };
        state.history.unshift({
          id: key,
          title: state.passage.title,
          overallBand: result.overallBand,
          accuracyPct: result.accuracyPct,
          wpm: result.wpm,
          timestamp: new Date().toISOString()
        });
        state.history = state.history.slice(0, 50);
        persistHistory();
        notifyDailyStreakAfterReadAloud();
      }

      return result;
    } finally {
      state.isScoring = false;
      renderBusyState();
    }
  }

  // ==================== G. DOM RENDERING & IDEMPOTENT MOUNTING ====================

  function renderBusyState() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('raBtnScoreSpeech');
    if (btn) {
      btn.disabled = state.isScoring;
      btn.textContent = state.isScoring ? 'Đang chấm đọc lại...' : 'Chấm phát âm & ngữ pháp';
    }
    const loader = document.getElementById('raScoringLoading');
    if (loader) {
      loader.style.display = state.isScoring ? 'block' : 'none';
    }
  }

  function renderEvaluationResult(evaluation) {
    if (typeof document === 'undefined') return;
    const zone = document.getElementById('raResultZone');
    const placeholder = document.getElementById('raResultPlaceholder');
    if (!zone || !evaluation) return;
    if (placeholder) placeholder.style.display = 'none';

    if (evaluation.invalid) {
      zone.innerHTML =
        '<div class="sc-crd" style="border-left:4px solid var(--incorrect-color) !important;">' +
          '<strong style="color:var(--incorrect-color);font-size:14px;">Chưa thể chấm bài đọc</strong>' +
          '<p style="margin:6px 0 0 0;font-size:13px;color:var(--ink);">' + escapeHtml(evaluation.invalidMessage) + '</p>' +
        '</div>';
      return;
    }

    const c = evaluation.criteria || {};
    const critRows = [
      { cls: 'pronunciation', data: c.pronunciation },
      { cls: 'grammar', data: c.grammar },
      { cls: 'fluency', data: c.fluency },
      { cls: 'lexical', data: c.lexical }
    ];

    let miniBandsHtml = '<div class="mini-bands">';
    for (let i = 0; i < critRows.length; i++) {
      const cr = critRows[i];
      const rawBand = cr.data ? Number(cr.data.band) : NaN;
      const bandVal = Number.isFinite(rawBand) ? rawBand : 0;
      miniBandsHtml +=
        '<div class="mini-band">' +
          '<b>Band ' + bandVal.toFixed(1) + '</b>' +
          '<span><i class="dot ' + cr.cls + '"></i>' + escapeHtml(cr.data && cr.data.label) + '</span>' +
        '</div>';
    }
    miniBandsHtml += '</div>';

    let errorsHtml = '';
    if (Array.isArray(evaluation.errors) && evaluation.errors.length > 0) {
      errorsHtml += '<div style="margin-top:12px;"><strong style="font-size:13px;color:var(--ink);">Lỗi ngữ pháp / chia từ</strong>';
      for (let i = 0; i < evaluation.errors.length; i++) {
        const er = evaluation.errors[i];
        errorsHtml +=
          '<div class="sc-crd" style="margin-top:6px;border-left:4px solid var(--incorrect-color) !important;">' +
            '<div style="font-size:13px;color:var(--ink);"><del style="color:var(--incorrect-color);">' + escapeHtml(er.original) + '</del> → <strong style="color:var(--good);">' + escapeHtml(er.correction) + '</strong></div>' +
            '<div style="font-size:12px;color:var(--ink-2);margin-top:2px;">' + escapeHtml(er.reason) + '</div>' +
          '</div>';
      }
      errorsHtml += '</div>';
    }

    let tipsHtml = '';
    if (Array.isArray(evaluation.upgradedTips) && evaluation.upgradedTips.length > 0) {
      tipsHtml +=
        '<div class="upg-box" style="margin-top:12px;">' +
          '<strong style="font-size:13px;color:var(--ink);">Gợi ý cải thiện phát âm & nhịp đọc</strong>' +
          '<ul style="margin:6px 0 0 16px;padding:0;font-size:13px;color:var(--ink-2);">' +
            evaluation.upgradedTips.map(t => '<li>' + escapeHtml(t) + '</li>').join('') +
          '</ul>' +
        '</div>';
    }

    const align = evaluation.alignment || {};
    zone.innerHTML =
      '<div class="pv-card">' +
        '<div class="score-line">' +
          '<div>' +
            '<div style="font-size:12px;color:var(--ink-3);">' + escapeHtml(evaluation.source) + '</div>' +
            '<div class="score-main">Band ' + Number(evaluation.overallBand).toFixed(1) +
              ' <span style="font-size:13px;color:var(--ink-3);">(' + evaluation.accuracyPct + '% khớp từ • ' + evaluation.wpm + ' WPM)</span>' +
            '</div>' +
          '</div>' +
          '<span class="ni-badge ni-badge-green">WER ' + (Number(align.wer || 0) * 100).toFixed(1) + '%</span>' +
        '</div>' +
        miniBandsHtml +
        '<div class="sc-crd" style="margin-top:12px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
            '<strong style="font-size:13px;color:var(--ink);">So khớp từng từ (Word Alignment)</strong>' +
            '<span style="font-size:12px;color:var(--ink-3);">Đúng ' + (align.matchedWords ? align.matchedWords.length : 0) + '/' + (align.totalRefWords || 0) + ' từ</span>' +
          '</div>' +
          '<div style="font-size:13px;line-height:1.7;color:var(--ink);">' + (align.diffHtml || '') + '</div>' +
        '</div>' +
        '<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">' +
          critRows.map(cr =>
            '<div class="sc-crd" style="font-size:12px;color:var(--ink-2);"><strong style="color:var(--ink);">' +
              escapeHtml(cr.data.label) + ':</strong> ' + escapeHtml(cr.data.feedback) + '</div>'
          ).join('') +
        '</div>' +
        errorsHtml +
        tipsHtml +
      '</div>';
  }

  function populateStandaloneSelector() {
    if (typeof document === 'undefined') return;
    const srcSel = document.getElementById('raSourceSelector');
    const pasSel = document.getElementById('raPassageSelector');
    if (!pasSel) return;

    const src = srcSel ? srcSel.value : 'all';
    const customBox = document.getElementById('raCustomPassageBox');
    if (customBox) {
      customBox.style.display = src === 'custom' ? 'block' : 'none';
    }

    const list = src === 'custom' ? [] : getStandalonePassages(src);
    let html = '<option value="">-- Chọn bài đọc mẫu (' + list.length + ') --</option>';
    for (let i = 0; i < list.length; i++) {
      html += '<option value="' + escapeHtml(list[i].id) + '">' + escapeHtml(list[i].title) + '</option>';
    }
    pasSel.innerHTML = html;
  }

  function openGroqModalIsolated() {
    const g = getGlobal();
    if (typeof g.openGroqApiKeyModal === 'function') {
      g.openGroqApiKeyModal();
      return;
    }
    if (typeof document === 'undefined') return;
    let modal = document.getElementById('raGroqKeyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'raGroqKeyModal';
      modal.className = 'groq-modal-overlay';
      modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:16px;';
      modal.innerHTML =
        '<div class="groq-modal pv-card" style="max-width:440px;width:100%;padding:20px;">' +
          '<h3 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:var(--ink);">Groq API Key (Chấm Whisper + AI)</h3>' +
          '<p style="margin:0 0 12px 0;font-size:13px;color:var(--ink-2);">Nhập key để phiên âm Whisper-large-v3 và nhận xét phát âm chi tiết.</p>' +
          '<input id="raGroqKeyInput" type="password" class="ni-input" placeholder="gsk_..." style="width:100%;margin-bottom:12px;" />' +
          '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
            '<button type="button" id="raGroqModalCancel" class="ni-nav-btn">Đóng</button>' +
            '<button type="button" id="raGroqModalSave" class="ni-submit-btn">Lưu Key</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
      document.getElementById('raGroqModalCancel').addEventListener('click', () => { modal.style.display = 'none'; });
      document.getElementById('raGroqModalSave').addEventListener('click', () => {
        const inp = document.getElementById('raGroqKeyInput');
        if (inp && inp.value.trim()) {
          safeStorageSet(STORAGE_GROQ_KEY, inp.value.trim());
          setStatusMessage('Đã lưu Groq API Key.', 'good');
        }
        modal.style.display = 'none';
      });
    }
    const inp = document.getElementById('raGroqKeyInput');
    if (inp) inp.value = getGroqKey();
    modal.style.display = 'flex';
  }

  function buildShellMarkup() {
    return (
      '<div id="raEngineBody" class="space-y-4">' +
        '<div class="pv-card">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">' +
            '<div>' +
              '<h2 style="margin:0;font-size:18px;font-weight:700;color:var(--ink);">Luyện đọc lại & Chấm phát âm - ngữ pháp</h2>' +
              '<p style="margin:2px 0 0 0;font-size:13px;color:var(--ink-2);">Không gian luyện đọc tách biệt hoàn toàn với Speaking. Đọc to đoạn tiếng Anh và nhận chấm điểm so khớp từng từ.</p>' +
            '</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
              '<select id="raAccentSelect" class="ni-input" style="width:auto;">' +
                '<option value="en-US">Giọng Mỹ (en-US)</option>' +
                '<option value="en-GB">Giọng Anh (en-GB)</option>' +
                '<option value="en-AU">Giọng Úc (en-AU)</option>' +
                '<option value="auto">Tự động</option>' +
              '</select>' +
              '<select id="raRateSelect" class="ni-input" style="width:auto;">' +
                '<option value="0.8">0.8x Chậm</option>' +
                '<option value="1">1.0x Chuẩn</option>' +
                '<option value="1.2">1.2x Nhanh</option>' +
              '</select>' +
              '<button type="button" id="raBtnGroqKey" class="ni-nav-btn">🔑 Groq Key</button>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;max-width:100%;min-width:0;">' +
            '<select id="raSourceSelector" class="ni-input" style="width:auto;max-width:100%;min-width:0;">' +
              '<option value="all">Tất cả bài đọc mẫu</option>' +
              '<option value="study4">Bộ đề Study4 Speaking (Part 2 &amp; 3)</option>' +
              '<option value="bank">Từ kho bài dịch</option>' +
              '<option value="reading">IELTS Readings</option>' +
              '<option value="custom">Tự dán văn bản tiếng Anh</option>' +
            '</select>' +
            '<select id="raPassageSelector" class="ni-input" style="flex:1;min-width:0;max-width:100%;"><option value="">-- Chọn bài đọc mẫu --</option></select>' +
          '</div>' +
          '<div id="raCustomPassageBox" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--rule);">' +
            '<input id="raCustomTitleInput" type="text" class="ni-input" placeholder="Tiêu đề bài đọc (tùy chọn)" style="margin-bottom:6px;" />' +
            '<textarea id="raCustomTextEn" rows="3" class="ni-input" placeholder="Paste any English passage to practice reading aloud..." style="margin-bottom:6px;"></textarea>' +
            '<button type="button" id="raBtnLoadCustom" class="ni-submit-btn">Nạp đoạn tiếng Anh này</button>' +
          '</div>' +
        '</div>' +
        '<div class="pv-grid">' +
          '<div class="pv-left">' +
            '<div class="pv-card">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">' +
                '<h3 id="raPassageTitle" style="margin:0;font-size:16px;font-weight:700;color:var(--ink);">' + escapeHtml(DEFAULT_PASSAGE.title) + '</h3>' +
                '<span id="raSourceBadge" class="ni-badge ni-badge-neutral">Kho luyện đọc</span>' +
              '</div>' +
              '<div id="raPassageTextEn" style="font-size:15px;line-height:1.7;color:var(--ink);padding:12px 14px;border-radius:12px;background:var(--accent-wash);border:1px solid var(--rule);margin-bottom:10px;">' + escapeHtml(DEFAULT_PASSAGE.textEn) + '</div>' +
              '<div id="raPassageTextVi" style="font-size:12px;color:var(--ink-2);margin-bottom:10px;">' + escapeHtml(DEFAULT_PASSAGE.textVi) + '</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
                '<button type="button" id="raBtnListenModel" class="ni-nav-btn">🔊 Nghe đọc mẫu</button>' +
              '</div>' +
            '</div>' +
            '<div class="pv-card rec-zone">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
                '<button type="button" id="raBtnRecord" class="ni-submit-btn" style="border-radius:999px;padding:10px 20px;">🎙️ Bắt đầu đọc</button>' +
                '<p id="raRecTimer" class="rec-timer" style="margin:0;">00:00</p>' +
              '</div>' +
              '<div id="raRecordingStatus" style="display:none;padding:8px 12px;border-radius:10px;font-size:13px;margin-bottom:10px;"></div>' +
              '<div id="raAudioPlayerZone" style="display:none;align-items:center;gap:8px;margin-bottom:10px;">' +
                '<audio id="raPlaybackAudio" controls style="flex:1;height:36px;"></audio>' +
                '<button type="button" id="raBtnDiscardAudio" class="ni-nav-btn">Xóa ghi âm</button>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                '<label for="raTranscriptInput" style="font-size:13px;font-weight:600;color:var(--ink);">Bản ghi lời đọc (Transcript)</label>' +
                '<span id="raWordCountBadge" class="ni-badge ni-badge-neutral">0 từ</span>' +
              '</div>' +
              '<textarea id="raTranscriptInput" rows="5" class="ni-input" placeholder="Đang sẵn sàng — nhấn Bắt đầu đọc hoặc nhập/chỉnh transcript tiếng Anh tại đây..." style="margin-bottom:10px;"></textarea>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;">' +
                '<button type="button" id="raBtnClearTranscript" class="ni-nav-btn">Xóa chữ</button>' +
                '<button type="button" id="raBtnScoreSpeech" class="ni-submit-btn">Chấm phát âm & ngữ pháp</button>' +
              '</div>' +
              '<div id="raScoringLoading" style="display:none;margin-top:8px;font-size:13px;color:var(--ink-2);">Đang phân tích phát âm và ngữ pháp...</div>' +
            '</div>' +
          '</div>' +
          '<div class="pv-right">' +
            '<div id="raResultPlaceholder" class="pv-card" style="color:var(--ink-3);font-size:13px;">Sau khi đọc xong, nhấn <strong>Chấm phát âm & ngữ pháp</strong> để xem điểm Band, tỷ lệ khớp từng từ (WER) và lỗi ngữ pháp.</div>' +
            '<div id="raResultZone"></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindEventsOnce() {
    if (typeof document === 'undefined') return;
    const bind = (id, evt, handler) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.raBound === '1') return;
      el.dataset.raBound = '1';
      el.addEventListener(evt, handler);
    };

    bind('raAccentSelect', 'change', (e) => setAccent(e.target.value));
    bind('raRateSelect', 'change', (e) => setRate(e.target.value));
    bind('raBtnGroqKey', 'click', openGroqModalIsolated);

    bind('raSourceSelector', 'change', () => populateStandaloneSelector());
    bind('raPassageSelector', 'change', (e) => {
      const id = e.target.value;
      if (!id) return;
      const srcSel = document.getElementById('raSourceSelector');
      const src = srcSel ? srcSel.value : 'all';
      const found = getStandalonePassages(src).find(p => p.id === id) || getStandalonePassages('all').find(p => p.id === id);
      if (found) loadPassage(found);
    });

    bind('raBtnLoadCustom', 'click', () => {
      const titleEl = document.getElementById('raCustomTitleInput');
      const textEl = document.getElementById('raCustomTextEn');
      loadCustomPassage(textEl ? textEl.value : '', titleEl ? titleEl.value : '');
    });

    bind('raBtnListenModel', 'click', () => speakModel());
    bind('raBtnRecord', 'click', () => toggleRecording());
    bind('raBtnDiscardAudio', 'click', () => discardRecording());
    bind('raBtnClearTranscript', 'click', () => clearTranscript());
    bind('raTranscriptInput', 'input', (e) => handleTranscriptInput(e.target.value));
    bind('raBtnScoreSpeech', 'click', () => evaluateReadAloud());
  }

  function mount(containerOverride) {
    if (typeof document === 'undefined') return false;
    const section = containerOverride || document.getElementById('tab-readaloud');
    if (!section) return false;

    if (!document.getElementById('raPassageTitle')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = buildShellMarkup();
      section.appendChild(wrapper.firstElementChild);
    }

    const accentSel = document.getElementById('raAccentSelect');
    if (accentSel) accentSel.value = state.accent;
    const rateSel = document.getElementById('raRateSelect');
    if (rateSel) rateSel.value = String(state.rate);

    populateStandaloneSelector();
    bindEventsOnce();

    if (state.passage && state.passage.textEn) {
      const titleEl = document.getElementById('raPassageTitle');
      if (titleEl) titleEl.textContent = state.passage.title;
      const textEl = document.getElementById('raPassageTextEn');
      if (textEl) textEl.textContent = state.passage.textEn;
    }

    const g = getGlobal();
    if (g.lucide && typeof g.lucide.createIcons === 'function') {
      try { g.lucide.createIcons(); } catch (e) {}
    }

    state.mounted = true;
    return true;
  }

  function init() {
    loadPersistedPrefs();
    return mount();
  }

  function getState() {
    return {
      mounted: state.mounted,
      passage: Object.assign({}, state.passage),
      accent: state.accent,
      rate: state.rate,
      isSpeakingModel: state.isSpeakingModel,
      isRecording: state.isRecording,
      durationSec: state.durationSec,
      liveTranscript: state.liveTranscript,
      isScoring: state.isScoring,
      lastEvaluation: state.lastEvaluation,
      historyCount: state.history.length
    };
  }

  function getHistory() {
    return state.history.slice();
  }

  if (typeof document !== 'undefined') {
    const autoBoot = () => {
      if (document.getElementById('tab-readaloud')) {
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
    getState,
    getHistory,
    // Passage management
    loadPassage,
    getStandalonePassages,
    loadCustomPassage,
    // TTS
    speakModel,
    stopModelSpeech,
    setAccent,
    setRate,
    // Recording & STT
    startRecording,
    stopRecording,
    toggleRecording,
    discardRecording,
    handleTranscriptInput,
    clearTranscript,
    // Word alignment & scoring
    normalizeWordToken,
    tokenizeEnglishWords,
    alignWordsAndScorePronunciation,
    validateReadAloudTranscript,
    detectGrammarErrors,
    scoreReadAloudLocally,
    evaluateWithGroq,
    evaluateReadAloud
  };
}));
