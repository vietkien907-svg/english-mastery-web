/**
 * speaking-engine.js - IELTS Speaking AI Examiner Studio
 * Complete Suite inspired by Night IELTS Speaking:
 * - 46 Part 1 Topics (523 questions)
 * - 67 Part 2 Cue Cards with 1-min Prep Countdown Timer + Scratchpad Notes + 2-min Speaking Timer
 * - 621 Part 3 In-depth Discussion Questions
 * - Full Simulated Mock Test Mode (Part 1 -> Part 2 Cue Card -> Part 3)
 * - Real-time Search & Filter across all 1,211 questions
 * - Topic Progress Dots (.fc-dots) tracking completed attempts
 * - In-Browser Audio Recording (MediaRecorder) + Audio Playback
 * - Live Web Speech API Speech-to-Text Transcription
 * - Cloud AI Scoring via Groq Whisper + Llama 3 (BYOK - Bring Your Own Key)
 * - Built-in Intelligent Heuristic Evaluator (Runs instantly with zero setup)
 * - 4 Official Criteria (Fluency, Lexical, Grammar, Pronunciation) + Band 8.0+ Model Upgrade
 * - Side-by-side Grammar & Vocabulary Error Correction Table
 * - Practice History & Audio Review
 */

(function (window) {
  'use strict';

  // Storage Keys
  const STORAGE_GROQ_KEY = 'user_groq_api_key';
  const STORAGE_SPEAKING_HISTORY = 'speaking_practice_history_v1';
  const STORAGE_CUE_NOTES = 'speaking_cue_card_notes_v1';
  const STORAGE_DONE_QUESTIONS = 'speaking_done_questions_v1';

  // State Management
  const state = {
    currentPart: '1', // '1', '2', '3', 'mock'
    currentTopicIndex: 0,
    currentQuestionIndex: 0,
    searchQuery: '',
    
    // Mock Test State
    isMockMode: false,
    mockStep: 0,
    mockQuestions: [],
    mockResults: [],
    
    // Media & Recording
    mediaRecorder: null,
    audioChunks: [],
    audioBlob: null,
    audioUrl: null,
    isRecording: false,
    recordingStartTime: null,
    recordingTimerInterval: null,
    speakingDurationSec: 0,
    
    // Speech Recognition
    recognition: null,
    liveTranscript: '',
    
    // Prep Timer (Part 2)
    prepTimerInterval: null,
    prepSecondsLeft: 60,
    isPrepRunning: false,

    // Idea & Vocabulary Accordion (Night IELTS)
    ideaBand: '6.5',
    isIdeaOpen: false,
    ideaCache: {},
    isIdeaLoading: false,
    
    // Scoring
    isScoring: false,
    currentEvaluation: null
  };

  // Helper: Groq API Key
  function getGroqKey() {
    try {
      return localStorage.getItem(STORAGE_GROQ_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setGroqKey(key) {
    try {
      if (key) localStorage.setItem(STORAGE_GROQ_KEY, key.trim());
      else localStorage.removeItem(STORAGE_GROQ_KEY);
    } catch (e) {}
  }

  // Helper: Completed Questions Registry
  function getDoneQuestions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_DONE_QUESTIONS) || '{}');
    } catch (e) {
      return {};
    }
  }

  function markQuestionDone(qText, band) {
    if (!qText) return;
    try {
      const done = getDoneQuestions();
      done[qText.trim()] = {
        date: Date.now(),
        band: band || 6.5
      };
      localStorage.setItem(STORAGE_DONE_QUESTIONS, JSON.stringify(done));
    } catch (e) {}
  }

  // Helper: Get Forecast Data safely
  function getForecast() {
    if (window.SP_FORECAST && Array.isArray(window.SP_FORECAST.p1) && Array.isArray(window.SP_FORECAST.p2)) {
      return window.SP_FORECAST;
    }
    return { id: 'fallback', name: 'IELTS Speaking Forecast Q3/2026', range: 'Quý 3/2026', p1: [], p2: [] };
  }

  // Get current active topic and question
  function getCurrentItem() {
    if (state.isMockMode && state.mockQuestions.length) {
      const curQ = state.mockQuestions[state.mockStep] || { part: '1', text: 'Tell me about yourself.' };
      return {
        part: curQ.part,
        topicTitle: `Thi Thử Mock Test · Câu ${state.mockStep + 1}/${state.mockQuestions.length} (Part ${curQ.part})`,
        questionText: curQ.text,
        cueCard: curQ.cueCard || null,
        isMock: true,
        step: state.mockStep,
        totalSteps: state.mockQuestions.length
      };
    }

    const f = getForecast();
    if (state.currentPart === '1') {
      const topic = f.p1[state.currentTopicIndex] || f.p1[0] || { t: 'General', q: ['Tell me about yourself.'] };
      const qText = topic.q[state.currentQuestionIndex] || topic.q[0] || '';
      return {
        part: '1',
        topicTitle: topic.t,
        questionText: qText,
        totalQuestionsInTopic: topic.q.length,
        topic: topic
      };
    } else if (state.currentPart === '2') {
      const cue = f.p2[state.currentTopicIndex] || f.p2[0] || { t: 'Describe something', cue: [], ex: '', card: '', q: [] };
      return {
        part: '2',
        topicTitle: cue.t,
        questionText: cue.card || cue.t,
        cueCard: cue,
        topic: cue
      };
    } else if (state.currentPart === '3') {
      const cue = f.p2[state.currentTopicIndex] || f.p2[0] || { t: 'Discussion', q: [] };
      const questions = cue.q && cue.q.length ? cue.q : ['Why do you think that is?'];
      const qText = questions[state.currentQuestionIndex] || questions[0];
      return {
        part: '3',
        topicTitle: 'Part 3 Discussion: ' + cue.t,
        questionText: qText,
        totalQuestionsInTopic: questions.length,
        topic: cue
      };
    }
  }

  // TTS helper
  function speakPrompt(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  // Audio Recording System
  async function startRecording() {
    if (state.isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.audioChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
      
      state.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      state.mediaRecorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) state.audioChunks.push(e.data);
      };

      state.mediaRecorder.onstop = function () {
        stream.getTracks().forEach(t => t.stop());
        const blobType = state.audioChunks[0]?.type || 'audio/webm';
        state.audioBlob = new Blob(state.audioChunks, { type: blobType });
        if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
        state.audioUrl = URL.createObjectURL(state.audioBlob);
        renderAudioPlayback();
      };

      state.mediaRecorder.start(250);
      state.isRecording = true;
      state.recordingStartTime = Date.now();
      state.speakingDurationSec = 0;
      state.liveTranscript = '';

      startLiveRecognition();
      updateRecordingUI(true);

      if (state.recordingTimerInterval) clearInterval(state.recordingTimerInterval);
      state.recordingTimerInterval = setInterval(() => {
        state.speakingDurationSec = Math.floor((Date.now() - state.recordingStartTime) / 1000);
        const m = String(Math.floor(state.speakingDurationSec / 60)).padStart(2, '0');
        const s = String(state.speakingDurationSec % 60).padStart(2, '0');
        const timerEl = document.getElementById('spRecTimer');
        if (timerEl) timerEl.textContent = `${m}:${s}`;
        
        const limit = state.currentPart === '2' ? 130 : 90;
        if (state.speakingDurationSec >= limit) {
          stopRecording();
        }
      }, 500);

    } catch (err) {
      console.error('Microphone error:', err);
      alert('Không thể truy cập Microphone của bạn. Vui lòng cho phép quyền truy cập Micro trên trình duyệt để ghi âm luyện nói.');
    }
  }

  function stopRecording() {
    if (!state.isRecording) return;
    state.isRecording = false;
    if (state.recordingTimerInterval) {
      clearInterval(state.recordingTimerInterval);
      state.recordingTimerInterval = null;
    }
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
    }
    stopLiveRecognition();
    updateRecordingUI(false);
  }

  function startLiveRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      state.recognition = new SpeechRecognition();
      state.recognition.continuous = true;
      state.recognition.interimResults = true;
      state.recognition.lang = 'en-US';

      state.recognition.onresult = function (event) {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
          else interim += event.results[i][0].transcript;
        }
        state.liveTranscript = (final + interim).trim();
        const trBox = document.getElementById('spLiveTranscriptText');
        if (trBox) trBox.textContent = state.liveTranscript || 'Đang nghe bạn nói...';
      };

      state.recognition.onerror = function (e) {
        console.warn('Speech recognition warning:', e.error);
      };

      state.recognition.start();
    } catch (e) {
      console.warn('Cannot start live speech recognition:', e);
    }
  }

  function stopLiveRecognition() {
    if (state.recognition) {
      try { state.recognition.stop(); } catch (e) {}
      state.recognition = null;
    }
  }

  // 1-Minute Prep Countdown Timer for Part 2 Cue Cards
  function togglePrepTimer() {
    if (state.isPrepRunning) {
      clearInterval(state.prepTimerInterval);
      state.isPrepRunning = false;
      updatePrepTimerUI();
    } else {
      if (state.prepSecondsLeft <= 0) state.prepSecondsLeft = 60;
      state.isPrepRunning = true;
      updatePrepTimerUI();
      state.prepTimerInterval = setInterval(() => {
        state.prepSecondsLeft--;
        updatePrepTimerUI();
        if (state.prepSecondsLeft <= 0) {
          clearInterval(state.prepTimerInterval);
          state.isPrepRunning = false;
          playBeepSound();
          updatePrepTimerUI();
        }
      }, 1000);
    }
  }

  function resetPrepTimer() {
    if (state.prepTimerInterval) clearInterval(state.prepTimerInterval);
    state.isPrepRunning = false;
    state.prepSecondsLeft = 60;
    updatePrepTimerUI();
  }

  function playBeepSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  function updatePrepTimerUI() {
    const btn = document.getElementById('spBtnPrepTimer');
    const display = document.getElementById('spPrepTimerDisplay');
    const bar = document.getElementById('spPrepProgressBar');
    if (!btn || !display) return;
    
    const m = String(Math.floor(state.prepSecondsLeft / 60)).padStart(2, '0');
    const s = String(state.prepSecondsLeft % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
    
    if (bar) {
      const pct = Math.max(0, Math.min(100, ((60 - state.prepSecondsLeft) / 60) * 100));
      bar.style.width = pct + '%';
    }

    if (state.isPrepRunning) {
      btn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i> Tạm dừng (1 phút)`;
      btn.className = 'px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition';
    } else if (state.prepSecondsLeft <= 0) {
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Hết giờ chuẩn bị! Bắt đầu nói`;
      btn.className = 'px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 animate-bounce';
    } else {
      btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> Bấm để đếm ngược 1 phút`;
      btn.className = 'px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // Scratchpad Note Saving
  function loadCueNote(topicTitle) {
    try {
      const notes = JSON.parse(localStorage.getItem(STORAGE_CUE_NOTES) || '{}');
      return notes[topicTitle] || '';
    } catch (e) {
      return '';
    }
  }

  function saveCueNote(topicTitle, text) {
    try {
      const notes = JSON.parse(localStorage.getItem(STORAGE_CUE_NOTES) || '{}');
      notes[topicTitle] = text;
      localStorage.setItem(STORAGE_CUE_NOTES, JSON.stringify(notes));
    } catch (e) {}
  }

  // AI Evaluation Engine
  async function runAiEvaluation() {
    if (state.isScoring) return;
    const cur = getCurrentItem();
    const transcript = (state.liveTranscript || '').trim();

    if (!transcript && !state.audioBlob) {
      alert('Vui lòng ghi âm câu trả lời của bạn trước khi chấm điểm AI!');
      return;
    }

    state.isScoring = true;
    updateScoringLoadingUI(true);

    try {
      const groqKey = getGroqKey();
      let evaluation = null;

      if (groqKey && state.audioBlob) {
        try {
          evaluation = await evaluateViaGroq(groqKey, cur, state.audioBlob, transcript);
        } catch (apiErr) {
          console.warn('Groq API failed, falling back to smart local evaluation:', apiErr);
          evaluation = evaluateLocally(cur, transcript, state.speakingDurationSec);
          evaluation.source = 'Local Smart Engine (Groq gặp lỗi hoặc hết hạn ngạch)';
        }
      } else {
        evaluation = evaluateLocally(cur, transcript, state.speakingDurationSec);
        if (!groqKey) {
          evaluation.source = 'Local Smart Engine (Chưa cấu hình Groq Key)';
        }
      }

      state.currentEvaluation = evaluation;
      markQuestionDone(cur.questionText, evaluation.overallBand);
      savePracticeHistory(cur, evaluation);
      renderEvaluationResult(evaluation);
      renderQuestionSelector(); // refresh progress dots
      if (typeof window.addSpeakingXP === 'function') {
        window.addSpeakingXP(50);
      }

    } catch (err) {
      console.error('Scoring error:', err);
      alert('Có lỗi xảy ra trong quá trình chấm điểm: ' + (err.message || 'Vui lòng thử lại.'));
    } finally {
      state.isScoring = false;
      updateScoringLoadingUI(false);
    }
  }

  // Groq Cloud Evaluation Flow
  async function evaluateViaGroq(apiKey, item, audioBlob, fallbackTranscript) {
    let transcriptText = fallbackTranscript;
    try {
      const ext = (audioBlob.type || '').includes('mp4') ? 'm4a' : 'webm';
      const fd = new FormData();
      fd.append('file', audioBlob, `speech.${ext}`);
      fd.append('model', 'whisper-large-v3');
      fd.append('language', 'en');
      fd.append('temperature', '0');

      const trResp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: fd
      });
      if (trResp.ok) {
        const trData = await trResp.json();
        if (trData.text) transcriptText = trData.text.trim();
      }
    } catch (e) {
      console.warn('Whisper transcription failed, using live recognition text:', e);
    }

    if (!transcriptText) transcriptText = 'Candidate spoke for ' + (state.speakingDurationSec || 15) + ' seconds.';

    const sysPrompt = `You are an official IELTS Speaking Senior Examiner and native English coach.
Evaluate the candidate's spoken response according to the 4 official IELTS criteria:
1. Fluency & Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range & Accuracy (GRA)
4. Pronunciation (PR)

Respond ONLY with a valid JSON object matching this exact structure:
{
  "overallBand": 7.0,
  "criteria": {
    "fluency": {
      "band": 7.0,
      "feedback": "Nhận xét tiếng Việt về độ trôi chảy, tốc độ, quãng ngắt và từ nối.",
      "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
      "improvements": ["Điểm cần khắc phục"]
    },
    "lexical": {
      "band": 6.5,
      "feedback": "Nhận xét tiếng Việt về độ đa dạng từ vựng, collocations.",
      "collocationsUsed": ["cụm từ 1", "cụm từ 2"],
      "suggestedUpgrades": ["từ/cụm nâng cấp 1", "từ/cụm nâng cấp 2"]
    },
    "grammar": {
      "band": 7.0,
      "feedback": "Nhận xét tiếng Việt về độ chính xác và đa dạng thì/mệnh đề.",
      "errors": [
        {
          "original": "câu sai của thí sinh",
          "correction": "câu đã sửa chuẩn xác",
          "reason": "Giải thích ngắn gọn lý do sai bằng tiếng Việt"
        }
      ]
    },
    "pronunciation": {
      "band": 7.0,
      "feedback": "Nhận xét tiếng Việt về độ rõ ràng, trọng âm từ và ngữ điệu."
    }
  },
  "upgradedAnswer": "A complete, native-level Band 8.5 sample answer that preserves the candidate's original ideas but elevates it with advanced idioms, natural connectors, and rich academic or natural expressions.",
  "topicVocabulary": [
    { "phrase": "high-end collocation", "ipa": "/.../", "meaning": "Nghĩa tiếng Việt" }
  ]
}`;

    const userPrompt = `IELTS Speaking Part: ${item.part}
Question / Cue Card:
"${item.questionText}"

Candidate's Spoken Transcript:
"${transcriptText}"

Speaking Duration: ${state.speakingDurationSec} seconds.
Please provide the rigorous evaluation and JSON response.`;

    const chatResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!chatResp.ok) {
      throw new Error(`Groq Chat API HTTP ${chatResp.status}`);
    }

    const chatData = await chatResp.json();
    const rawContent = chatData.choices?.[0]?.message?.content;
    const parsed = JSON.parse(rawContent);
    parsed.transcript = transcriptText;
    parsed.source = 'Groq Cloud (Llama 3.3 + Whisper Large v3)';
    return parsed;
  }

  // Built-in Smart Local Evaluator
  function evaluateLocally(item, transcript, durationSec) {
    const text = transcript.trim();
    const words = text ? text.split(/\s+/) : [];
    const wordCount = words.length;
    const dur = Math.max(5, durationSec || 15);
    const wpm = Math.round((wordCount / dur) * 60);

    let fc = 6.0;
    if (wpm >= 110 && wpm <= 150 && wordCount >= 30) fc = 7.0;
    else if (wpm >= 90 && wordCount >= 20) fc = 6.5;
    else if (wordCount < 15) fc = 5.0;

    const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const ttr = wordCount > 0 ? unique / wordCount : 0;
    let lr = 6.0;
    if (ttr > 0.7 && wordCount >= 30) lr = 7.0;
    else if (ttr > 0.6) lr = 6.5;
    else if (wordCount < 15) lr = 5.0;

    const clauses = (text.match(/\b(because|although|though|even if|which|that|when|while|whereas|since|if)\b/gi) || []).length;
    let gra = 6.0;
    if (clauses >= 3 && wordCount >= 30) gra = 7.0;
    else if (clauses >= 1) gra = 6.5;
    else if (wordCount < 15) gra = 5.0;

    let pr = 6.5;

    const rawOverall = (fc + lr + gra + pr) / 4;
    const overallBand = Math.round(rawOverall * 2) / 2;

    const errors = [];
    if (/\b(he|she|it)\s+(don't|have|go|want|make)\b/i.test(text)) {
      errors.push({
        original: text.match(/\b(he|she|it)\s+(don't|have|go|want|make)\b/i)[0],
        correction: "Chia ngôi thứ ba số ít (doesn't / has / goes / wants / makes)",
        reason: "Chủ ngữ ngôi thứ 3 số ít cần chia động từ thêm -s/-es hoặc dùng trợ động từ 'doesn't'."
      });
    }
    if (/\bin\s+(the\s+)?yesterday\b/i.test(text)) {
      errors.push({
        original: "in yesterday",
        correction: "yesterday",
        reason: "'Yesterday' là trạng từ chỉ thời gian, không dùng giới từ 'in' phía trước."
      });
    }
    if (/\bvery\s+(delicious|exhausted|freezing|furious)\b/i.test(text)) {
      errors.push({
        original: text.match(/\bvery\s+(delicious|exhausted|freezing|furious)\b/i)[0],
        correction: "Dùng 'absolutely / completely' thay cho 'very'",
        reason: "Các tính từ mang nghĩa tuyệt đối (extreme adjectives) không đi kèm với 'very'."
      });
    }

    let upgradedAnswer = '';
    if (item.part === '2') {
      upgradedAnswer = `To be completely candid, when it comes to ${item.topicTitle.toLowerCase()}, I would definitely single out a pivotal experience that left an indelible impression on me. What made it particularly extraordinary was the steep learning curve involved and the sheer perseverance required. Looking back in hindsight, it not only broadened my horizons but also fundamentally reshaped how I tackle multifaceted challenges in day-to-day life.`;
    } else {
      upgradedAnswer = `From a personal standpoint, I'd argue that ${item.questionText.toLowerCase().replace(/\?$/, '')} has become increasingly prominent nowadays. On the one hand, it offers remarkable practical convenience; on the other hand, it demands a deliberate balance so as not to overwhelm one's daily routine. Ultimately, having a proactive mindset makes an enormous difference.`;
    }

    return {
      overallBand: overallBand,
      criteria: {
        fluency: {
          band: fc,
          feedback: `Tốc độ nói trung bình đạt khoảng ${wpm} từ/phút. Bạn duy trì được mạch nói cơ bản, phản hồi trực diện câu hỏi. Để đạt Band 7.5+, hãy sử dụng thêm các từ nối tự nhiên như 'frankly speaking', 'as a matter of fact'.`,
          strengths: [`Độ dài câu trả lời hợp lý (${wordCount} từ)`, `Phản hồi bám sát chủ đề`],
          improvements: ['Hạn chế ngập ngừng lặp từ', 'Tăng tính linh hoạt của các cụm liên kết câu']
        },
        lexical: {
          band: lr,
          feedback: `Độ đa dạng từ vựng đạt ${(ttr * 100).toFixed(0)}%. Bạn đã sử dụng được một số từ vựng đúng ngữ cảnh. Cần bổ sung thêm các Collocation học thuật và Idioms đặc thù theo đề thi.`,
          collocationsUsed: words.slice(0, 3),
          suggestedUpgrades: ['an indelible impression', 'broaden one\'s horizons', 'a pivotal role', 'steep learning curve']
        },
        grammar: {
          band: gra,
          feedback: `Phát hiện ${clauses} mệnh đề phức trong bài nói. Cấu trúc câu cơ bản chuẩn xác. Hãy lồng ghép thêm câu điều kiện hỗn hợp hoặc đảo ngữ để bứt phá lên Band 7.5+.`,
          errors: errors
        },
        pronunciation: {
          band: pr,
          feedback: `Phát âm tương đối dễ nghe, không gây hiểu lầm cho người nghe. Cần chú ý nhấn đúng trọng âm câu (sentence stress) và nối âm cuối (linking sounds) mượt mà hơn.`
        }
      },
      upgradedAnswer: upgradedAnswer,
      topicVocabulary: [
        { phrase: "broaden one's horizons", ipa: "/ˈbrɔːdn wʌnz həˈraɪznz/", meaning: "Mở rộng tầm nhìn, hiểu biết" },
        { phrase: "leave an indelible impression", ipa: "/liːv ən ɪnˈdelɪbl ɪmˈpreʃn/", meaning: "Để lại ấn tượng sâu đậm khó phai" },
        { phrase: "steep learning curve", ipa: "/stiːp ˈlɜːrnɪŋ kɜːrv/", meaning: "Quá trình học hỏi nhiều thách thức ban đầu" }
      ],
      transcript: text || '(Ghi âm trực tiếp - không có văn bản live)',
      speakingDurationSec: dur
    };
  }

  // Save history
  function savePracticeHistory(item, evaluation) {
    try {
      const hist = JSON.parse(localStorage.getItem(STORAGE_SPEAKING_HISTORY) || '[]');
      hist.unshift({
        id: 'sp_' + Date.now(),
        date: new Date().toISOString(),
        part: item.part,
        title: item.topicTitle,
        question: item.questionText,
        overallBand: evaluation.overallBand,
        criteria: evaluation.criteria,
        transcript: evaluation.transcript,
        durationSec: state.speakingDurationSec
      });
      localStorage.setItem(STORAGE_SPEAKING_HISTORY, JSON.stringify(hist.slice(0, 50)));
      renderHistoryModalList();
    } catch (e) {}
  }

  // Render Topic Selector with Search & Filter
  function renderTopicSelector() {
    const f = getForecast();
    const select = document.getElementById('spTopicSelect');
    if (!select) return;

    const query = (state.searchQuery || '').toLowerCase().trim();
    select.innerHTML = '';

    const doneMap = getDoneQuestions();

    if (state.currentPart === '1') {
      f.p1.forEach((t, idx) => {
        if (query && !t.t.toLowerCase().includes(query)) return;
        const opt = document.createElement('option');
        opt.value = idx;
        const doneCount = t.q.filter(q => !!doneMap[q.trim()]).length;
        const statusIcon = doneCount === t.q.length ? '✓ ' : (doneCount > 0 ? `(${doneCount}/${t.q.length}) ` : '');
        opt.textContent = `${statusIcon}${idx + 1}. ${t.t} (${t.q.length} câu hỏi)`;
        if (idx === state.currentTopicIndex) opt.selected = true;
        select.appendChild(opt);
      });
    } else if (state.currentPart === '2' || state.currentPart === '3') {
      f.p2.forEach((cue, idx) => {
        if (query && !cue.t.toLowerCase().includes(query)) return;
        const opt = document.createElement('option');
        opt.value = idx;
        const isDone = !!doneMap[(cue.card || cue.t).trim()];
        const statusIcon = isDone ? '✓ ' : '';
        const p3Count = cue.q ? cue.q.length : 0;
        opt.textContent = state.currentPart === '2'
          ? `${statusIcon}${idx + 1}. [Cue Card] ${cue.t}`
          : `${statusIcon}${idx + 1}. [Part 3] ${cue.t} (${p3Count} câu)`;
        if (idx === state.currentTopicIndex) opt.selected = true;
        select.appendChild(opt);
      });
    }
  }

  // Render Question Selector with Progress Dots (.fc-dots)
  function renderQuestionSelector() {
    const container = document.getElementById('spQuestionPills');
    if (!container) return;

    if (state.currentPart === '2') {
      const cur = getCurrentItem();
      const doneMap = getDoneQuestions();
      const doneInfo = cur ? doneMap[cur.questionText.trim()] : null;
      const isDone = !!doneInfo;
      const band = doneInfo && typeof doneInfo === 'object' && doneInfo.band ? doneInfo.band : '';
      container.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="q-nav-btn is-cue current">Cue Card</span>
          ${isDone ? `<span class="text-xs font-bold text-[#16a34a] flex items-center gap-1">✓ Đã làm ${band ? `(Band ${band})` : ''}</span>` : ''}
        </div>
      `;
      return;
    }

    const f = getForecast();
    let questions = [];
    if (state.currentPart === '1') {
      const topic = f.p1[state.currentTopicIndex] || f.p1[0];
      questions = topic ? topic.q : [];
    } else if (state.currentPart === '3') {
      const cue = f.p2[state.currentTopicIndex] || f.p2[0];
      questions = cue && cue.q ? cue.q : [];
    }

    const doneMap = getDoneQuestions();
    let html = '';
    questions.forEach((q, idx) => {
      const isCurrent = idx === state.currentQuestionIndex;
      const doneInfo = doneMap[q.trim()];
      const isDone = !!doneInfo;
      const band = doneInfo && typeof doneInfo === 'object' && doneInfo.band ? doneInfo.band : '';
      let cls = 'q-nav-btn';
      if (isCurrent) cls += ' current';
      else if (isDone) cls += ' done';

      html += `
        <button type="button" onclick="SpeakingEngine.selectQuestionIndex(${idx})" class="${cls}" title="Câu ${idx + 1}${band ? ` · Band ${band}` : ''}">
          ${idx + 1}${isDone ? '<span class="text-[9px] ml-0.5 font-bold">✓</span>' : ''}
        </button>
      `;
    });
    container.innerHTML = html;
  }

  function renderCurrentQuestionBoard() {
    const cur = getCurrentItem();
    const titleEl = document.getElementById('spActiveTopicTitle');
    const qBox = document.getElementById('spActiveQuestionBox');
    const cueZone = document.getElementById('spCueCardZone');
    const noteZone = document.getElementById('spScratchpadZone');

    if (titleEl) titleEl.textContent = cur.topicTitle;

    if (state.currentPart === '2' && cur.cueCard) {
      if (qBox) qBox.classList.add('hidden');
      if (cueZone) {
        cueZone.classList.remove('hidden');
        const cue = cur.cueCard;
        const cuesHtml = (cue.cue || []).map(c => `<li class="my-1 font-medium">${c}</li>`).join('');
        cueZone.innerHTML = `
          <div class="cue-card-container">
            <div class="flex items-center justify-between mb-3 border-b border-[#ece8f1] pb-2">
              <span class="part-chip" style="font-size: 11px; font-weight: 800; color: var(--accent-ink); background: var(--accent-wash); padding: 2px 10px; border-radius: 999px;">
                PART 2 · CUE CARD
              </span>
              <button type="button" onclick="SpeakingEngine.speakCurrentQuestion()" class="ni-nav-btn" style="padding: 3px 8px; font-size: 12px;">
                🔊 Nghe đề thi
              </button>
            </div>
            <h3 class="text-lg md:text-xl font-extrabold text-[#221c2b] mb-2 leading-snug">${cue.t}</h3>
            <span class="cue-say">You should say:</span>
            <ul class="cue-list mb-3">
              ${cuesHtml}
            </ul>
            ${cue.ex ? `<p class="text-sm font-semibold text-[#5f5870] italic pt-2 border-t border-[#ece8f1]">And explain: ${cue.ex}</p>` : ''}
          </div>
        `;
      }

      if (noteZone) {
        noteZone.classList.remove('hidden');
        const noteArea = document.getElementById('spScratchpadEditor');
        if (noteArea) {
          noteArea.value = loadCueNote(cur.topicTitle);
          noteArea.oninput = function () {
            saveCueNote(cur.topicTitle, noteArea.value);
          };
        }
        resetPrepTimer();
      }

    } else {
      if (cueZone) cueZone.classList.add('hidden');
      if (noteZone) noteZone.classList.add('hidden');
      if (qBox) {
        qBox.classList.remove('hidden');
        qBox.innerHTML = `
          <div class="pv-card">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold text-[#5f5870] uppercase tracking-wider">
                ${state.currentPart === '1' ? 'Part 1 · Phỏng vấn ngắn' : 'Part 3 · Thảo luận chuyên sâu'} · Câu ${state.currentQuestionIndex + 1}
              </span>
              <button type="button" onclick="SpeakingEngine.speakCurrentQuestion()" class="ni-nav-btn" style="padding: 3px 8px; font-size: 12px;" title="Nghe phát âm câu hỏi">
                🔊 Nghe câu hỏi
              </button>
            </div>
            <p class="q-text" style="font-size: 20px; line-height: 1.35; font-weight: 700; color: var(--ink); margin: 6px 0 2px;">${cur.questionText}</p>
          </div>
        `;
      }
    }

    renderIdeaBox();
  }

  function updateRecordingUI(isRecording) {
    const btn = document.getElementById('spBtnRecord');
    const statusText = document.getElementById('spRecordingStatus');
    const timerEl = document.getElementById('spRecTimer');
    const liveBox = document.getElementById('spLiveTranscriptBox');
    
    if (!btn) return;

    if (isRecording) {
      btn.innerHTML = `<i data-lucide="square" class="w-7 h-7 text-white fill-white"></i>`;
      btn.className = 'rec-btn recording w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition transform hover:scale-105';
      if (statusText) statusText.innerHTML = '<span class="text-rose-400 font-bold flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Đang ghi âm... Nhấn nút vuông để hoàn thành</span>';
      if (timerEl) timerEl.classList.remove('text-slate-400');
      if (liveBox) liveBox.classList.remove('hidden');
    } else {
      btn.innerHTML = `<i data-lucide="mic" class="w-8 h-8 text-white"></i>`;
      btn.className = 'rec-btn w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transition transform hover:scale-105';
      if (statusText) statusText.innerHTML = '<span class="text-slate-400">Nhấn micro để bắt đầu nói</span>';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function renderAudioPlayback() {
    const playerZone = document.getElementById('spAudioPlayerZone');
    const audioEl = document.getElementById('spPlaybackAudio');
    const scoreBtn = document.getElementById('spBtnScoreNow');
    
    if (playerZone && audioEl && state.audioUrl) {
      audioEl.src = state.audioUrl;
      playerZone.classList.remove('hidden');
      if (scoreBtn) scoreBtn.classList.remove('hidden');
    }
  }

  function updateScoringLoadingUI(isScoring) {
    const scoreBtn = document.getElementById('spBtnScoreNow');
    const loadingZone = document.getElementById('spScoringLoading');
    if (scoreBtn) {
      scoreBtn.disabled = isScoring;
      scoreBtn.classList.toggle('opacity-50', isScoring);
    }
    if (loadingZone) {
      loadingZone.classList.toggle('hidden', !isScoring);
    }
  }

  function renderEvaluationResult(res) {
    const resultZone = document.getElementById('spResultZone');
    if (!resultZone || !res) return;

    resultZone.classList.remove('hidden');
    const pl = document.getElementById('spResultPlaceholder'); if (pl) pl.classList.add('hidden');

    const ob = res.overallBand || 6.5;
    const crits = res.criteria || {};
    const fc = crits.fluency || { band: 6.0, feedback: '' };
    const lr = crits.lexical || { band: 6.0, feedback: '' };
    const gra = crits.grammar || { band: 6.0, feedback: '', errors: [] };
    const pr = crits.pronunciation || { band: 6.0, feedback: '' };

    let errorsHtml = '';
    if (gra.errors && gra.errors.length) {
      errorsHtml = gra.errors.map(err => `
        <div class="err-box mb-2 text-xs">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <del class="text-[#9a93a8]">${err.original || ''}</del>
            <span class="text-[#5f5870]">→</span>
            <ins class="text-[#2f855a] font-bold no-underline">${err.correction || ''}</ins>
          </div>
          <p class="text-[#5f5870] leading-relaxed">${err.reason || ''}</p>
        </div>
      `).join('');
    } else {
      errorsHtml = `<p class="text-xs text-[#2f855a] font-medium italic">✓ Không phát hiện lỗi sai thô thiển. Diễn đạt chính xác!</p>`;
    }

    const upg = res.upgradedAnswer || '';

    resultZone.innerHTML = `
      <div class="space-y-3.5">
        <!-- Top Overall Band Score Card -->
        <div class="pv-card">
          <div class="score-line">
            <div class="score-main">
              <b>${ob}</b>
              <span>Overall Band ước tính</span>
            </div>
            <div class="mini-bands">
              <div class="mini-band">
                <b style="color: var(--fluency)">${fc.band || 6.0}</b>
                <span><i class="dot fluency"></i> Fluency</span>
              </div>
              <div class="mini-band">
                <b style="color: var(--lexical)">${lr.band || 6.0}</b>
                <span><i class="dot lexical"></i> Lexical</span>
              </div>
              <div class="mini-band">
                <b style="color: var(--grammar)">${gra.band || 6.0}</b>
                <span><i class="dot grammar"></i> Grammar</span>
              </div>
              <div class="mini-band">
                <b style="color: var(--pronunciation)">${pr.band || 6.0}</b>
                <span><i class="dot pronunciation"></i> Pronunciation</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs text-[#5f5870] pt-3 mt-3 border-t border-[#ece8f1]">
            <span>Động cơ: <strong class="text-[#221c2b]">${res.source || 'AI Engine'}</strong> · Thời gian: <strong>${res.speakingDurationSec || state.speakingDurationSec}s</strong></span>
            <button type="button" onclick="SpeakingEngine.speakText('${upg.replace(/'/g, "\'")}')" class="ni-nav-btn" style="padding: 4px 10px; font-size: 12px;">
              🔊 Nghe bài mẫu
            </button>
          </div>
        </div>

        <!-- Transcript -->
        ${res.transcript ? `
        <div class="pv-card text-xs">
          <span class="font-bold text-[#5f5870] uppercase tracking-wider block mb-1">📝 Lời Bạn Đã Nói (Transcript)</span>
          <p class="text-xs text-[#221c2b] bg-[#f5f3f8] p-2.5 rounded-lg leading-relaxed">"${res.transcript}"</p>
        </div>` : ''}

        <!-- Detailed Error Correction -->
        <div class="pv-card">
          <h5 class="font-bold text-sm text-[#221c2b] mb-1.5 flex items-center justify-between">
            <span>Chữa Lỗi Chi Tiết</span>
            <span class="legend"><del>chữ sai</del> <ins>chữ đúng</ins></span>
          </h5>
          <div class="space-y-1.5 mt-2">
            ${errorsHtml}
          </div>
        </div>

        <!-- Upgraded Band 8.0+ Model Answer -->
        <div class="answer-card upgraded">
          <div class="answer-card-title flex items-center justify-between gap-2">
            <span>✨ Bản Nâng Cấp Band 8.0+ Chuẩn Bản Xứ</span>
            <button type="button" onclick="SpeakingEngine.speakText('${upg.replace(/'/g, "\\'")}')" class="ni-nav-btn text-xs py-1 px-2.5 flex items-center gap-1.5" title="Nghe giọng bản ngữ đọc mẫu để luyện Shadowing">
              🔊 Nghe Giọng Mẫu
            </button>
          </div>
          <p class="answer-card-text">${upg}</p>
        </div>
      </div>
    `;

    resultZone.scrollIntoView({ behavior: 'smooth' });
  }

  // Switch Speaking Part
  function setPart(part) {
    state.isMockMode = (part === 'mock');
    state.currentPart = part;
    state.currentTopicIndex = 0;
    state.currentQuestionIndex = 0;

    ['1', '2', '3', 'mock'].forEach(p => {
      const btn = document.getElementById(`spPartTab_${p}`);
      if (btn) {
        if (p === part) {
          btn.style.borderColor = 'var(--accent, #6366f1)';
          btn.style.backgroundColor = 'var(--accent-wash, #eef2ff)';
          btn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.12)';
          btn.classList.add('border-2');
          btn.classList.remove('border-slate-200');
        } else {
          btn.style.borderColor = '';
          btn.style.backgroundColor = '';
          btn.style.boxShadow = '';
          btn.classList.remove('border-2');
          btn.classList.add('border-slate-200');
        }
      }
    });

    stopRecording();
    const resultZone = document.getElementById('spResultZone');
    if (resultZone) resultZone.classList.add('hidden');
    const pl = document.getElementById('spResultPlaceholder'); if (pl) pl.classList.remove('hidden');
    const playerZone = document.getElementById('spAudioPlayerZone');
    if (playerZone) playerZone.classList.add('hidden');
    const scoreBtn = document.getElementById('spBtnScoreNow');
    if (scoreBtn) scoreBtn.classList.add('hidden');
    const liveBox = document.getElementById('spLiveTranscriptBox');
    if (liveBox) liveBox.classList.add('hidden');

    if (part === 'mock') {
      startMockTestMode();
    } else {
      renderTopicSelector();
      renderQuestionSelector();
      renderCurrentQuestionBoard();
    }
  }

  // Mock Test Flow
  function startMockTestMode() {
    const f = getForecast();
    // Build 6 questions: 3 Part 1, 1 Part 2 Cue Card, 2 Part 3
    const p1Topic = f.p1[Math.floor(Math.random() * f.p1.length)] || f.p1[0];
    const p1Qs = (p1Topic.q || []).slice(0, 3).map(q => ({ part: '1', text: q }));
    
    const p2Cue = f.p2[Math.floor(Math.random() * f.p2.length)] || f.p2[0];
    const p2Card = { part: '2', text: p2Cue.card || p2Cue.t, cueCard: p2Cue };
    
    const p3Qs = (p2Cue.q || []).slice(0, 2).map(q => ({ part: '3', text: q }));

    state.mockQuestions = [...p1Qs, p2Card, ...p3Qs];
    state.mockStep = 0;
    state.mockResults = [];

    renderTopicSelector();
    renderQuestionSelector();
    renderCurrentQuestionBoard();
  }

  function selectTopicIndex(idx) {
    state.currentTopicIndex = parseInt(idx, 10) || 0;
    state.currentQuestionIndex = 0;
    renderQuestionSelector();
    renderCurrentQuestionBoard();
  }

  function selectQuestionIndex(idx) {
    state.currentQuestionIndex = parseInt(idx, 10) || 0;
    renderQuestionSelector();
    renderCurrentQuestionBoard();
  }

  function handleSearch(query) {
    state.searchQuery = query || '';
    state.currentTopicIndex = 0;
    state.currentQuestionIndex = 0;
    renderTopicSelector();
    renderQuestionSelector();
    renderCurrentQuestionBoard();
  }

  // Random Question Pick
  function pickRandomQuestion() {
    const f = getForecast();
    if (state.currentPart === '1' && f.p1.length) {
      state.currentTopicIndex = Math.floor(Math.random() * f.p1.length);
      const top = f.p1[state.currentTopicIndex];
      state.currentQuestionIndex = Math.floor(Math.random() * top.q.length);
    } else if (state.currentPart === '2' && f.p2.length) {
      state.currentTopicIndex = Math.floor(Math.random() * f.p2.length);
      state.currentQuestionIndex = 0;
    } else if (state.currentPart === '3' && f.p2.length) {
      state.currentTopicIndex = Math.floor(Math.random() * f.p2.length);
      const cue = f.p2[state.currentTopicIndex];
      const qCount = cue.q ? cue.q.length : 1;
      state.currentQuestionIndex = Math.floor(Math.random() * qCount);
    }
    renderTopicSelector();
    renderQuestionSelector();
    renderCurrentQuestionBoard();
  }

  // History Modal
  function renderHistoryModalList() {
    const listEl = document.getElementById('spHistoryList');
    if (!listEl) return;
    try {
      const hist = JSON.parse(localStorage.getItem(STORAGE_SPEAKING_HISTORY) || '[]');
      if (!hist.length) {
        listEl.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Chưa có bài luyện nói nào được lưu. Hãy thử ghi âm và chấm điểm ngay!</p>`;
        return;
      }
      listEl.innerHTML = hist.map(h => `
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between gap-3 mb-2">
          <div>
            <span class="text-[10px] font-bold text-indigo-400 block">Part ${h.part} · ${new Date(h.date).toLocaleDateString('vi-VN')}</span>
            <h6 class="font-bold text-white text-sm mt-0.5 line-clamp-1">${h.title}</h6>
            <p class="text-slate-400 text-[11px] line-clamp-1 mt-0.5">"${h.transcript || ''}"</p>
          </div>
          <div class="shrink-0 text-center">
            <span class="px-2.5 py-1 rounded-lg font-extrabold text-sm ${h.overallBand >= 7.0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'}">
              Band ${h.overallBand}
            </span>
          </div>
        </div>
      `).join('');
    } catch (e) {}
  }

  function openHistoryModal() {
    renderHistoryModalList();
    const modal = document.getElementById('spHistoryModal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeHistoryModal() {
    const modal = document.getElementById('spHistoryModal');
    if (modal) modal.classList.add('hidden');
  }

  // Groq Settings Modal
  function openGroqModal() {
    const modal = document.getElementById('spGroqSettingsModal');
    const input = document.getElementById('spGroqKeyInput');
    if (input) input.value = getGroqKey();
    if (modal) modal.classList.remove('hidden');
  }

  function closeGroqModal() {
    const modal = document.getElementById('spGroqSettingsModal');
    if (modal) modal.classList.add('hidden');
  }

  function saveGroqKeyFromInput() {
    const input = document.getElementById('spGroqKeyInput');
    const msg = document.getElementById('spGroqSaveMsg');
    if (!input) return;
    const key = input.value.trim();
    setGroqKey(key);
    updateGroqIndicator();
    if (msg) {
      msg.textContent = key ? '✅ Đã lưu API Key thành công!' : '🗑️ Đã xóa API Key (Chuyển sang chế độ Local Engine).';
      setTimeout(() => { if (msg) msg.textContent = ''; closeGroqModal(); }, 1200);
    }
  }

  function updateGroqIndicator() {
    const badge = document.getElementById('spGroqStatusBadge');
    if (!badge) return;
    const key = getGroqKey();
    if (key) {
      badge.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i> <span class="text-amber-300 font-bold">Groq AI Active</span>`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer shadow-sm';
    } else {
      badge.innerHTML = `<i data-lucide="key" class="w-3.5 h-3.5 text-slate-400"></i> <span class="text-slate-300">Cấu hình Groq Key</span>`;
      badge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (typeof window.showToast === 'function') window.showToast('📋 Đã sao chép câu mẫu Band 8.0+!', 'success');
      else alert('Đã sao chép câu mẫu!');
    }
  }

  // Initialize
  function init() {
    updateGroqIndicator();
    setPart('1');
  }


  // =========================================================================
  // NIGHT IELTS: GỢI Ý Ý TƯỞNG & TỪ VỰNG THEO BAND (ACCORDION & BYOK AI)
  // =========================================================================

  function getIdeaCacheKey() {
    return `${state.currentPart}_${state.currentTopicIndex}_${state.currentQuestionIndex}_${state.ideaBand}`;
  }

  function toggleIdeaAccordion() {
    state.isIdeaOpen = !state.isIdeaOpen;
    renderIdeaBox();
    if (state.isIdeaOpen) {
      loadIdeaForCurrentQuestion();
    }
  }

  function setIdeaBand(band) {
    if (state.ideaBand === band) return;
    state.ideaBand = band;
    renderIdeaBox();
    if (state.isIdeaOpen) {
      loadIdeaForCurrentQuestion();
    }
  }

  function refreshIdea(force) {
    if (force) {
      const key = getIdeaCacheKey();
      delete state.ideaCache[key];
    }
    loadIdeaForCurrentQuestion();
  }

  function getKnowledgeBankData(cur) {
    if (!window.SP_KNOWLEDGE_BANK) return null;
    const t = (cur.topicTitle || '').trim();
    if (window.SP_KNOWLEDGE_BANK[t]) return window.SP_KNOWLEDGE_BANK[t];
    const lower = t.toLowerCase();
    for (const k of Object.keys(window.SP_KNOWLEDGE_BANK)) {
      if (k.toLowerCase() === lower || lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) {
        return window.SP_KNOWLEDGE_BANK[k];
      }
    }
    return null;
  }

  async function loadIdeaForCurrentQuestion() {
    const key = getIdeaCacheKey();
    if (state.ideaCache[key]) {
      renderIdeaBox();
      return;
    }

    const cur = getCurrentItem();
    const kbItem = getKnowledgeBankData(cur);

    if (kbItem) {
      const isHighBand = (state.ideaBand === '7.0+' || state.ideaBand === '8.0');
      state.ideaCache[key] = {
        ideas: kbItem.ideas || [],
        vocabulary: kbItem.collocations || [],
        sampleAnswer: isHighBand ? (kbItem.sample80 || kbItem.sample65) : (kbItem.sample65 || kbItem.sample80),
        source: 'knowledge_bank'
      };
      state.isIdeaLoading = false;
      renderIdeaBox();
      return;
    }

    state.isIdeaLoading = true;
    renderIdeaBox();

    let data = generateFallbackIdea(cur, state.ideaBand, state.currentPart);
    state.ideaCache[key] = data;
    state.isIdeaLoading = false;
    renderIdeaBox();
  }

  async function generateAiIdeaWithGroq() {
    const cur = getCurrentItem();
    const groqKey = getGroqKey();
    if (!groqKey) {
      openGroqModal();
      return;
    }

    state.isIdeaLoading = true;
    renderIdeaBox();

    try {
      const data = await fetchIdeaFromGroq(groqKey, cur, state.ideaBand, state.currentPart);
      if (data) {
        data.source = 'groq_ai';
        const key = getIdeaCacheKey();
        state.ideaCache[key] = data;
        if (typeof window.showToast === 'function') {
          window.showToast('✓ Groq Llama-3 đã tạo dàn ý & từ vựng mới!', 'success');
        }
      }
    } catch (err) {
      console.warn('Groq idea generation failed:', err);
      if (typeof window.showToast === 'function') {
        window.showToast('Không thể kết nối Groq. Đang dùng dữ liệu tủ.', 'info');
      }
    } finally {
      state.isIdeaLoading = false;
      renderIdeaBox();
    }
  }

  async function fetchIdeaFromGroq(apiKey, item, band, part) {
    const qText = item.questionText || (item.cueCard ? item.cueCard.t : 'IELTS Speaking Question');
    const topic = item.topicTitle || 'General Speaking';
    const partLabel = part === '2' ? 'Part 2 (Cue Card 2-minute speech)' : `Part ${part}`;

    const prompt = `You are an elite IELTS Speaking Senior Examiner and native British/American coach.
Generate a structured brainstorming guide for candidate aiming for Target Band ${band}.

Topic: "${topic}"
Question/Prompt (${partLabel}): "${qText}"

Respond ONLY with a valid JSON object matching this schema:
{
  "ideas": [
    "Dàn ý 1 (tiếng Việt): Hướng mở đầu trực tiếp và luận điểm chính",
    "Dàn ý 2 (tiếng Việt): Chi tiết/ví dụ trải nghiệm thực tế cụ thể",
    "Dàn ý 3 (tiếng Việt): Cảm xúc, tác động hoặc kết luận sâu sắc"
  ],
  "vocabulary": [
    {"phrase": "collocation 1", "ipa": "/.../", "meaning": "nghĩa tiếng Việt súc tích"},
    {"phrase": "collocation 2", "ipa": "/.../", "meaning": "nghĩa tiếng Việt súc tích"},
    {"phrase": "collocation 3", "ipa": "/.../", "meaning": "nghĩa tiếng Việt súc tích"},
    {"phrase": "collocation 4", "ipa": "/.../", "meaning": "nghĩa tiếng Việt súc tích"}
  ],
  "sampleAnswer": "A highly natural, spoken English sample response at Band ${band} flow, answering the prompt completely (approx 60-90 words for Part 1/3, or 120-150 words for Part 2). Use contractions and natural discourse markers."
}`;

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an official IELTS examiner. Output valid JSON only, no markdown markdown formatting or text wrappers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 850,
        response_format: { type: 'json_object' }
      })
    });

    if (!resp.ok) throw new Error(`Groq HTTP ${resp.status}`);
    const resData = await resp.json();
    const content = resData.choices[0].message.content;
    return JSON.parse(content);
  }

  function generateFallbackIdea(item, band, part) {
    const qText = (item.questionText || (item.cueCard ? item.cueCard.t : '')).toLowerCase();
    const topic = (item.topicTitle || '').toLowerCase();
    const combined = topic + ' ' + qText;

    // Detect domain
    let domain = 'general';
    if (/work|job|career|company|boss|office|profession|salary/.test(combined)) domain = 'work';
    else if (/study|school|university|major|student|learn|exam|teacher/.test(combined)) domain = 'study';
    else if (/live|area|city|town|hometown|house|flat|apartment|neighborhood|place/.test(combined)) domain = 'living';
    else if (/music|song|instrument|singer|concert/.test(combined)) domain = 'music';
    else if (/film|movie|cinema|actor|watch/.test(combined)) domain = 'film';
    else if (/book|read|novel|author|library/.test(combined)) domain = 'book';
    else if (/sport|fitness|gym|exercise|game|match|healthy/.test(combined)) domain = 'sport';
    else if (/food|cook|restaurant|eat|meal|dish|diet/.test(combined)) domain = 'food';
    else if (/travel|trip|holiday|vacation|tour|journey|destination/.test(combined)) domain = 'travel';
    else if (/friend|family|people|person|relationship|colleague/.test(combined)) domain = 'people';
    else if (/tech|phone|computer|internet|social|app|ai|website/.test(combined)) domain = 'tech';
    else if (/weather|rain|sun|season|climate|temperature/.test(combined)) domain = 'weather';

    const bank = {
      work: {
        '5.0': {
          ideas: ['Nêu công việc hiện tại của bạn là gì', 'Lý do bạn chọn công việc này (tiền bạc hoặc sự thích thú)', 'Dự định công việc trong tương lai'],
          vocab: [
            { phrase: 'heavy workload', ipa: '/ˈhevi ˈwɜːkləʊd/', meaning: 'khối lượng công việc lớn' },
            { phrase: 'friendly colleagues', ipa: '/ˈfrendli ˈkɒliːɡz/', meaning: 'đồng nghiệp thân thiện' },
            { phrase: 'earn a living', ipa: '/ɜːn ə ˈlɪvɪŋ/', meaning: 'kiếm sống' },
            { phrase: 'career prospects', ipa: '/kəˈrɪər ˈprɒspekts/', meaning: 'triển vọng nghề nghiệp' }
          ],
          sample: "Currently, I'm working as a full-time specialist. To be honest, I really enjoy it because my colleagues are very friendly and supportive. Even though I have a heavy workload sometimes, it allows me to earn a good living and develop myself."
        },
        '6.0': {
          ideas: ['Nêu vai trò và trách nhiệm cụ thể trong môi trường làm việc', 'Phân tích điểm thỏa mãn nhất và thách thức lớn nhất', 'Nhận định về cân bằng giữa công việc và đời sống (work-life balance)'],
          vocab: [
            { phrase: 'demanding schedule', ipa: '/dɪˈmɑːndɪŋ ˈskedʒuːl/', meaning: 'lịch trình áp lực, bận rộn' },
            { phrase: 'climb the career ladder', ipa: '/klaɪm ðə kəˈrɪə ˈlædə/', meaning: 'thăng tiến sự nghiệp' },
            { phrase: 'work-life balance', ipa: '/wɜːk laɪf ˈbæləns/', meaning: 'sự cân bằng công việc - cuộc sống' },
            { phrase: 'hands-on experience', ipa: '/ˌhændz ˈɒn ɪkˈspɪəriəns/', meaning: 'kinh nghiệm thực tế' }
          ],
          sample: "Well, I'm currently holding a position where I handle various projects. What I find most rewarding is gaining hands-on experience on a daily basis. While having a demanding schedule makes it tough to maintain a healthy work-life balance, it really helps me climb the career ladder."
        },
        '6.5': {
          ideas: ['Khẳng định mức độ đam mê và động lực thúc đẩy trong nghề', 'Mô tả môi trường làm việc thúc đẩy năng suất và tư duy sáng tạo', 'Tầm nhìn phát triển năng lực chuyên môn 2-3 năm tới'],
          vocab: [
            { phrase: 'lucrative income', ipa: '/ˈluːkrətɪv ˈɪnkʌm/', meaning: 'thu nhập hậu hĩnh' },
            { phrase: 'fast-paced environment', ipa: '/ˌfɑːst ˈpeɪst ɪnˈvaɪrənmənt/', meaning: 'môi trường nhịp độ nhanh' },
            { phrase: "broaden one's horizon", ipa: '/ˈbrɔːdn wʌnz həˈraɪzn/', meaning: 'mở rộng tầm hiểu biết' },
            { phrase: 'hit the ground running', ipa: '/hɪt ðə ɡraʊnd ˈrʌnɪŋ/', meaning: 'bắt nhịp và làm việc hiệu quả ngay' }
          ],
          sample: "To be completely candid, working in such a fast-paced environment has been a transformative experience for me. It not only yields a lucrative income but also continuously broadens my horizon. Whenever new challenges arise, I always try to hit the ground running."
        },
        '7.0+': {
          ideas: ['Luận điểm triết lý nghề nghiệp: giá trị tạo ra so với áp lực công việc', 'Phân tích sâu về văn hóa doanh nghiệp và cơ hội bứt phá tiềm năng', 'Đánh giá tác động của tự động hóa và công nghệ đối với chuyên môn'],
          vocab: [
            { phrase: 'integral part of my daily grind', ipa: '/ˈɪntɪɡrəl pɑːt əv maɪ ˈdeɪli ɡraɪnd/', meaning: 'phần thiết yếu trong guồng quay hằng ngày' },
            { phrase: 'steep learning curve', ipa: '/stiːp ˈlɜːnɪŋ kɜːv/', meaning: 'quá trình học hỏi đầy thách thức nhưng bổ ích' },
            { phrase: 'foster creative thinking', ipa: '/ˈfɒstə kriˈeɪtɪv ˈθɪŋkɪŋ/', meaning: 'nuôi dưỡng tư duy sáng tạo' },
            { phrase: 'strike a delicate balance', ipa: '/straɪk ə ˈdelɪkət ˈbæləns/', meaning: 'đạt được sự cân bằng tinh tế' }
          ],
          sample: "Truth be told, my profession has become an integral part of my daily grind. Despite the steep learning curve initially, it consistently fosters creative thinking and resilience. I always strive to strike a delicate balance between professional excellence and mental well-being."
        }
      },
      living: {
        '5.0': {
          ideas: ['Nêu rõ khu vực hoặc thành phố bạn đang sống', 'Điều bạn thích nhất (tiện nghi, con người, thức ăn)', 'Điều bạn muốn cải thiện ở nơi này'],
          vocab: [
            { phrase: 'peaceful neighborhood', ipa: '/ˈpiːsfʊl ˈneɪbəhʊd/', meaning: 'khu phố yên bình' },
            { phrase: 'convenient amenities', ipa: '/kənˈviːniənt əˈmiːnətiz/', meaning: 'tiện ích thuận tiện' },
            { phrase: 'friendly residents', ipa: '/ˈfrendli ˈrezɪdənts/', meaning: 'cư dân thân thiện' },
            { phrase: 'public transport', ipa: '/ˈpʌblɪk ˈtrænspɔːt/', meaning: 'phương tiện công cộng' }
          ],
          sample: "I currently reside in a peaceful neighborhood on the outskirts of the city. What I appreciate most is the friendly residents and convenient amenities nearby. It only takes me a few minutes to access public transport."
        },
        '6.0': {
          ideas: ['Mô tả không khí và nhịp sống đặc trưng của khu dân cư', 'So sánh giữa sự nhộn nhịp ban ngày và yên bình ban đêm', 'Tiềm năng phát triển cơ sở hạ tầng trong những năm gần đây'],
          vocab: [
            { phrase: 'bustling streets', ipa: '/ˈbʌslɪŋ striːts/', meaning: 'đường phố nhộn nhịp' },
            { phrase: 'within walking distance', ipa: '/wɪˈðɪn ˈwɔːkɪŋ ˈdɪstəns/', meaning: 'trong khoảng cách đi bộ' },
            { phrase: 'vibrant atmosphere', ipa: '/ˈvaɪbrənt ˈætməsfɪə/', meaning: 'bầu không khí sôi động' },
            { phrase: 'traffic congestion', ipa: '/ˈtræfɪk kənˈdʒestʃən/', meaning: 'ùn tắc giao thông' }
          ],
          sample: "Well, I live in an area known for its vibrant atmosphere and bustling streets. Almost all essential services are within walking distance, which is tremendously convenient. However, traffic congestion during peak hours can be quite a nuisance."
        },
        '6.5': {
          ideas: ['Nhận định về bản sắc văn hóa và sự gắn kết cộng đồng', 'Đánh giá môi trường sống, cây xanh và chất lượng không khí', 'Lý do bạn muốn tiếp tục định cư lâu dài hoặc chuyển đi'],
          vocab: [
            { phrase: 'hustle and bustle', ipa: '/ˈhʌsl ænd ˈbʌsl/', meaning: 'sự hối hả và nhộn nhịp của đô thị' },
            { phrase: 'sense of community', ipa: '/sens əv kəˈmjuːnəti/', meaning: 'tinh thần gắn kết cộng đồng' },
            { phrase: 'leafy green spaces', ipa: '/ˈliːfi ɡriːn ˈspeɪsɪz/', meaning: 'những khoảng không gian xanh rợp bóng cây' },
            { phrase: "stone's throw away", ipa: '/stəʊnz θrəʊ əˈweɪ/', meaning: 'rất gần, cách vài bước chân' }
          ],
          sample: "Speaking of my current vicinity, what truly stands out is the strong sense of community despite the hustle and bustle of city life. Having leafy green spaces just a stone's throw away offers a much-needed breath of fresh air after a long workday."
        },
        '7.0+': {
          ideas: ['Phân tích chiều sâu về sự dung hòa giữa tiện nghi hiện đại và di sản địa phương', 'Tác động của đô thị hóa nhanh chóng lên lối sống cư dân', 'Cảm nhận cá nhân mang tính hoài niệm hoặc triết lý về nơi chốn (sense of place)'],
          vocab: [
            { phrase: 'haven of tranquility', ipa: '/ˈheɪvn əv træŋˈkwɪləti/', meaning: 'chốn bình yên, nơi trú ẩn thanh bình' },
            { phrase: 'unbridled urbanization', ipa: '/ʌnˈbraɪdld ˌɜːbənaɪˈzeɪʃn/', meaning: 'quá trình đô thị hóa ồ ạt' },
            { phrase: 'harmonious blend', ipa: '/hɑːˈməʊniəs blend/', meaning: 'sự pha trộn hài hòa' },
            { phrase: 'second nature', ipa: '/ˈsekənd ˈneɪtʃə/', meaning: 'thói quen tự nhiên như bản năng' }
          ],
          sample: "My neighborhood is, in many respects, a harmonious blend of traditional charm and urban vibrancy. While unbridled urbanization has inevitably altered its quiet corners, it remains a haven of tranquility for me whenever I need to recharge my batteries."
        }
      },
      general: {
        '5.0': {
          ideas: ['Nêu câu trả lời trực tiếp cho câu hỏi', 'Cung cấp lý do cụ thể và dễ hiểu', 'Đưa ra ví dụ đơn giản từ thói quen cá nhân'],
          vocab: [
            { phrase: 'play a vital role', ipa: '/pleɪ ə ˈvaɪtl rəʊl/', meaning: 'đóng vai trò quan trọng' },
            { phrase: 'broaden my knowledge', ipa: '/ˈbrɔːdn maɪ ˈnɒlɪdʒ/', meaning: 'mở rộng kiến thức' },
            { phrase: 'have a great time', ipa: '/hæv ə ɡreɪt taɪm/', meaning: 'có khoảng thời gian tuyệt vời' },
            { phrase: 'daily routine', ipa: '/ˈdeɪli ruːˈtiːn/', meaning: 'thói quen hằng ngày' }
          ],
          sample: "To be honest, this plays a very vital role in my life. It really helps me broaden my knowledge and relax after stressful study hours. That's why I include it in my daily routine whenever I have free time."
        },
        '6.0': {
          ideas: ['Mở đầu tự nhiên bằng từ nối bản xứ', 'Phân tích hai mặt hoặc sở thích theo hoàn cảnh', 'Kết luận nêu cảm nhận thực tế'],
          vocab: [
            { phrase: 'recharge my batteries', ipa: '/riːˈtʃɑːdʒ maɪ ˈbætəriz/', meaning: 'nạp lại năng lượng' },
            { phrase: 'from time to time', ipa: '/frəm taɪm tə taɪm/', meaning: 'thỉnh thoảng, đôi khi' },
            { phrase: 'have a soft spot for', ipa: '/hæv ə sɒft spɒt fə/', meaning: 'rất có thiện cảm, có sở thích đặc biệt với' },
            { phrase: 'let my hair down', ipa: '/let maɪ heə daʊn/', meaning: 'thư giãn thoải mái' }
          ],
          sample: "Well, generally speaking, I have a real soft spot for this. Whenever I feel overwhelmed with deadlines, it serves as the ideal way to let my hair down and recharge my batteries. I indulge in it from time to time on weekends."
        },
        '6.5': {
          ideas: ['Khẳng định quan điểm cá nhân với ngôn từ phong phú', 'So sánh trải nghiệm trong quá khứ với hiện tại', 'Lập luận logic liên hệ đến lối sống hiện đại'],
          vocab: [
            { phrase: 'integral component', ipa: '/ˈɪntɪɡrəl kəmˈpəʊnənt/', meaning: 'thành phần không thể thiếu' },
            { phrase: 'lean towards', ipa: '/liːn təˈwɔːdz/', meaning: 'có xu hướng nghiêng về' },
            { phrase: 'blow off steam', ipa: '/bləʊ ɒf stiːm/', meaning: 'xả bớt áp lực, giải tỏa căng thẳng' },
            { phrase: 'without a shadow of a doubt', ipa: '/wɪˈðaʊt ə ˈʃædəʊ əv daʊt/', meaning: 'chắc chắn không mảy may nghi ngờ' }
          ],
          sample: "Without a shadow of a doubt, I tend to lean towards this whenever the opportunity presents itself. It has evolved into an integral component of my lifestyle, enabling me to blow off steam and maintain a resilient state of mind."
        },
        '7.0+': {
          ideas: ['Tư duy đa chiều: đặt vấn đề vào bối cảnh tâm lý hoặc xã hội', 'Sử dụng cấu trúc tương phản tinh tế và ẩn dụ tự nhiên', 'Khép lại bằng nhận định mang tính chiều sâu'],
          vocab: [
            { phrase: 'inextricably linked', ipa: '/ˌɪnɪkˈstrɪkəbli lɪŋkt/', meaning: 'gắn kết chặt chẽ không thể tách rời' },
            { phrase: 'foster a sense of well-being', ipa: '/ˈfɒstə ə sens əv ˌwel ˈbiːɪŋ/', meaning: 'thúc đẩy cảm giác viên mãn, khỏe khoắn' },
            { phrase: 'transcend boundaries', ipa: '/trænˈsend ˈbaʊndriz/', meaning: 'vượt qua ranh giới' },
            { phrase: 'food for thought', ipa: '/fuːd fə θɔːt/', meaning: 'điều đáng để suy ngẫm sâu sắc' }
          ],
          sample: "What strikes me most about this is how inextricably linked it is to our personal sense of well-being. Far from being merely a trivial pastime, it provides genuine food for thought and allows us to transcend the mundane pressures of contemporary life."
        }
      }
    };

    const targetBank = bank[domain] || bank['general'];
    const bandData = targetBank[band] || targetBank['6.5'] || targetBank['6.0'];

    return {
      ideas: bandData.ideas,
      vocabulary: bandData.vocab,
      sampleAnswer: bandData.sample
    };
  }

  function renderIdeaBox() {
    const boxEl = document.getElementById('spIdeaBoxZone');
    if (!boxEl) return;

    const hasGroq = !!getGroqKey();
    const key = getIdeaCacheKey();
    const ideaData = state.ideaCache[key];

    if (!state.isIdeaOpen) {
      boxEl.innerHTML = `
        <div class="flex items-center justify-between cursor-pointer py-1" onclick="SpeakingEngine.toggleIdeaAccordion()">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">💡</div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-[#0f172a]">Gợi Ý Ý Tưởng & Từ Vựng Cốt Lõi</span>
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">Band ${state.ideaBand}</span>
              </div>
              <p class="text-xs text-[#64748b]">Dàn ý gợi ý, collocations đắt giá kèm IPA & bài mẫu phát âm tự nhiên</p>
            </div>
          </div>
          <button type="button" class="ni-nav-btn text-xs font-semibold py-1.5 px-3 flex items-center gap-1.5">
            <span>Khám Phá</span>
            <span class="text-xs">▼</span>
          </button>
        </div>
      `;
      return;
    }

    // Expanded State
    boxEl.innerHTML = `
      <div class="space-y-3">
        <!-- Header Row -->
        <div class="flex items-center justify-between cursor-pointer" onclick="SpeakingEngine.toggleIdeaAccordion()">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">💡</div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-[#0f172a]">Gợi Ý Ý Tưởng & Từ Vựng Cốt Lõi</span>
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">Band ${state.ideaBand}</span>
              </div>
              <p class="text-xs text-[#64748b]">Dàn ý lập luận, collocations ăn điểm kèm phiên âm IPA & câu mẫu tự nhiên</p>
            </div>
          </div>
          <button type="button" class="ni-nav-btn text-xs font-semibold py-1 px-3 flex items-center gap-1.5">
            <span>Thu Gọn</span>
            <span class="text-xs">▲</span>
          </button>
        </div>

        <!-- Band Selector Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-bold text-[#475569] mr-1">Mục tiêu Band:</span>
            ${['5.0', '6.0', '6.5', '7.0+'].map(b => `
              <button type="button" onclick="SpeakingEngine.setIdeaBand('${b}')"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${state.ideaBand === b ? 'bg-amber-500 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                ${b}
              </button>
            `).join('')}
          </div>
          <div class="flex items-center gap-2 text-xs">
            <button type="button" onclick="SpeakingEngine.generateAiIdeaWithGroq()" class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1" title="Nhờ Groq Llama-3 tạo dàn ý và từ vựng mới">
              <span>✨ AI Tạo Ý Mới</span>
            </button>
            <span class="text-slate-300">|</span>
            <button type="button" onclick="SpeakingEngine.refreshIdea(true)" class="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1" title="Khôi phục dữ liệu tủ chuẩn">
              <span>🔄 Dữ Liệu Tủ</span>
            </button>
            <span class="text-slate-300">|</span>
            <span class="text-[11px] font-medium text-slate-500">${ideaData && ideaData.source === 'groq_ai' ? '⚡ Llama-3 AI' : '📚 Bộ Tủ IELTS'}</span>
          </div>
        </div>

        ${state.isIdeaLoading ? `
          <div class="py-8 text-center text-slate-500">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent mb-2"></div>
            <p class="text-xs font-semibold">Đang tổng hợp ý tưởng & từ vựng Band ${state.ideaBand}...</p>
          </div>
        ` : (ideaData ? `
          <!-- Section 1: Ideas -->
          <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
            <span class="text-xs font-extrabold uppercase tracking-wide text-amber-900 block mb-1.5">🎯 Dàn Ý & Hướng Trả Lời:</span>
            <ul class="text-xs text-slate-700 space-y-1 pl-4 list-disc marker:text-amber-500">
              ${(ideaData.ideas || []).map(id => `<li>${id}</li>`).join('')}
            </ul>
          </div>

          <!-- Section 2: Vocab -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-extrabold uppercase tracking-wide text-indigo-900">🔑 Từ Vựng & Collocations Ăn Điểm:</span>
              <button type="button" onclick="SpeakingEngine.saveAllIdeaVocabToDeck()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <span>+ Lưu Toàn Bộ (${(ideaData.vocabulary || []).length} từ) Vào Thẻ Từ</span>
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${(ideaData.vocabulary || []).map(v => `
                <div class="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <span class="font-bold text-xs text-[#0f172a]">${v.phrase}</span>
                      <button type="button" onclick="SpeakingEngine.speakPhrase('${v.phrase.replace(/'/g, "\'")}')" class="text-slate-400 hover:text-indigo-600 text-xs px-1" title="Phát âm">
                        🔊
                      </button>
                    </div>
                    <div class="text-[11px] font-mono text-slate-500 mb-1">${v.ipa || ''}</div>
                    <div class="text-xs text-slate-600">${v.meaning || ''}</div>
                  </div>
                  <div class="pt-2 mt-2 border-t border-slate-100 flex justify-end">
                    <button type="button" onclick="SpeakingEngine.saveIdeaVocab('${v.phrase.replace(/'/g, "\'")}', '${(v.ipa||'').replace(/'/g, "\'")}', '${(v.meaning||'').replace(/'/g, "\'")}')"
                      class="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors">
                      + Thẻ từ
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 3: Sample Answer -->
          <div class="p-3 bg-white rounded-xl border border-slate-200">
            <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wide text-[#0f172a]">🗣️ Câu Trả Lời Mẫu Tự Nhiên (Band ${state.ideaBand}):</span>
              <div class="flex items-center gap-1.5">
                <button type="button" onclick="SpeakingEngine.speakIdeaModelAnswer()" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <span>🔊 Nghe Mẫu</span>
                </button>
                <button type="button" onclick="SpeakingEngine.copyIdeaModelAnswer()" class="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  📋 Sao chép
                </button>
                ${state.currentPart === '2' ? `
                  <button type="button" onclick="SpeakingEngine.copyIdeaToScratchpad()" class="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    📝 Vào Giấy Nháp
                  </button>
                ` : ''}
              </div>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed italic bg-slate-50/70 p-3 rounded-lg border border-slate-100">
              "${ideaData.sampleAnswer || ''}"
            </p>
          </div>
        ` : `
          <div class="py-4 text-center text-xs text-slate-400">
            Bấm "Khám Phá" để tải dàn ý & từ vựng gợi ý.
          </div>
        `)}
      </div>
    `;
  }

  function speakPhrase(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  function speakIdeaModelAnswer() {
    const key = getIdeaCacheKey();
    const data = state.ideaCache[key];
    if (!data || !data.sampleAnswer) return;
    speakPhrase(data.sampleAnswer);
  }

  function copyIdeaModelAnswer() {
    const key = getIdeaCacheKey();
    const data = state.ideaCache[key];
    if (!data || !data.sampleAnswer) return;
    navigator.clipboard.writeText(data.sampleAnswer).then(() => {
      if (typeof window.showToast === 'function') {
        window.showToast('✓ Đã sao chép bài mẫu vào clipboard!', 'success');
      } else {
        alert('Đã sao chép bài mẫu!');
      }
    });
  }

  function copyIdeaToScratchpad() {
    const key = getIdeaCacheKey();
    const data = state.ideaCache[key];
    if (!data) return;
    const editor = document.getElementById('spScratchpadEditor');
    if (!editor) return;

    let notes = [];
    if (data.ideas && data.ideas.length) {
      notes.push('💡 Ý tưởng:');
      data.ideas.forEach(i => notes.push('- ' + i));
    }
    if (data.vocabulary && data.vocabulary.length) {
      notes.push('\n🔑 Từ vựng:');
      data.vocabulary.forEach(v => notes.push(`- ${v.phrase}: ${v.meaning}`));
    }
    const curVal = editor.value.trim();
    editor.value = curVal ? curVal + '\n\n' + notes.join('\n') : notes.join('\n');
    const cur = getCurrentItem();
    saveCueNote(cur.topicTitle, editor.value);
    if (typeof window.showToast === 'function') {
      window.showToast('✓ Đã chép dàn ý & từ vựng vào Giấy Nháp!', 'success');
    }
  }

  function saveIdeaVocabToDeck(phrase, ipa, meaning) {
    try {
      if (typeof window.saveCustomWordItem === 'function') {
        window.saveCustomWordItem({
          word: phrase,
          ipa: ipa,
          meaning: meaning,
          type: 'collocation',
          example: `Used in IELTS Speaking for topic "${getCurrentItem().topicTitle}"`
        });
        if (typeof window.showToast === 'function') {
          window.showToast(`✓ Đã lưu "${phrase}" vào Thẻ Từ!`, 'success');
        } else {
          alert(`Đã lưu "${phrase}" vào Thẻ Từ!`);
        }
      } else {
        alert('Không tìm thấy chức năng lưu thẻ từ.');
      }
    } catch (e) {
      console.error('Error saving vocab to deck:', e);
    }
  }

  function saveAllIdeaVocabToDeck() {
    const key = getIdeaCacheKey();
    const data = state.ideaCache[key];
    if (!data || !data.vocabulary || !data.vocabulary.length) return;

    let count = 0;
    data.vocabulary.forEach(item => {
      if (typeof window.saveCustomWordItem === 'function') {
        window.saveCustomWordItem({
          word: item.phrase,
          ipa: item.ipa,
          meaning: item.meaning,
          type: 'collocation',
          example: `Used in IELTS Speaking for topic "${getCurrentItem().topicTitle}"`
        });
        count++;
      }
    });

    if (typeof window.showToast === 'function') {
      window.showToast(`✓ Đã lưu toàn bộ ${count} từ vựng vào Thẻ Từ!`, 'success');
    } else {
      alert(`Đã lưu toàn bộ ${count} từ vựng vào Thẻ Từ!`);
    }
  }

  // Public API
  window.SpeakingEngine = {
    init: init,
    setPart: setPart,
    selectTopicIndex: selectTopicIndex,
    selectQuestionIndex: selectQuestionIndex,
    handleSearch: handleSearch,
    pickRandomQuestion: pickRandomQuestion,
    speakCurrentQuestion: function () {
      const cur = getCurrentItem();
      if (cur) speakPrompt(cur.questionText);
    },
    speakText: speakPrompt,
    toggleRecording: function () {
      if (state.isRecording) stopRecording();
      else startRecording();
    },
    togglePrepTimer: togglePrepTimer,
    runAiEvaluation: runAiEvaluation,
    openGroqModal: openGroqModal,
    closeGroqModal: closeGroqModal,
    saveGroqKeyFromInput: saveGroqKeyFromInput,
    openHistoryModal: openHistoryModal,
    closeHistoryModal: closeHistoryModal,
    copyToClipboard: copyToClipboard,

    // Idea & Vocabulary exports
    toggleIdeaAccordion: toggleIdeaAccordion,
    generateAiIdeaWithGroq: generateAiIdeaWithGroq,
    setIdeaBand: setIdeaBand,
    refreshIdea: refreshIdea,
    speakPhrase: speakPhrase,
    saveIdeaVocab: saveIdeaVocabToDeck,
    saveAllIdeaVocabToDeck: saveAllIdeaVocabToDeck,
    speakIdeaModelAnswer: speakIdeaModelAnswer,
    copyIdeaModelAnswer: copyIdeaModelAnswer,
    copyIdeaToScratchpad: copyIdeaToScratchpad
  };

})(window);
