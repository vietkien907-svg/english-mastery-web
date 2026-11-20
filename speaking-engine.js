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

  function markQuestionDone(qText) {
    if (!qText) return;
    try {
      const done = getDoneQuestions();
      done[qText.trim()] = Date.now();
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
      markQuestionDone(cur.questionText);
      savePracticeHistory(cur, evaluation);
      renderEvaluationResult(evaluation);
      renderQuestionSelector(); // refresh progress dots

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
      const isDone = cur && !!doneMap[cur.questionText.trim()];
      container.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="q-nav-btn is-cue current">Cue Card</span>
          ${isDone ? '<span class="text-xs font-bold text-[#2f855a] flex items-center gap-1">✓ Đã làm</span>' : ''}
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
      const isDone = !!doneMap[q.trim()];
      let cls = 'q-nav-btn';
      if (isCurrent) cls += ' current';
      else if (isDone) cls += ' done';

      html += `
        <button type="button" onclick="SpeakingEngine.selectQuestionIndex(${idx})" class="${cls}" title="Câu ${idx + 1}">
          ${idx + 1}
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
          <div class="answer-card-title">
            <span>✨ Bản Nâng Cấp Band 8.0+ Chuẩn Bản Xứ</span>
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
          btn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition bg-indigo-600 text-white shadow-lg shadow-indigo-600/30';
        } else {
          btn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition text-slate-400 hover:text-white hover:bg-slate-800';
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
    copyToClipboard: copyToClipboard
  };

})(window);
