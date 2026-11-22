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

    // Source Switcher: 'speakout' (Speakout B1+ Unit 1-8) or 'forecast' (IELTS Forecast)
    currentSource: 'speakout',
    selectedCueCardIndex: {},

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


  function getEmbeddedFallbackForecast() {
    return {
      id: 'speakout_b1plus',
      name: 'Giáo Trình Speakout B1+ (Unit 1–8)',
      range: 'Toàn Bộ 8 Unit · Bài A, B, C, D · 2000 Idioms',
      p1: [
        { t: 'Unit 1: Me & Mine (Bản Thân, Sở Hữu & Đồ Vật)', q: ['Can you tell me about yourself?', 'What are some possessions that are important to you?', 'Do you prefer keeping things or giving them away?', 'How do you organize your personal belongings?'] },
        { t: 'Unit 2: Behaviour (Thói Quen, Hành Vi & Giao Tiếp Ứng Xử)', q: ['Describe a time when you had to say no to someone.', 'Describe a situation when something really annoyed you.', 'How do people in your country usually express politeness?', 'What kind of behavior annoys you the most in public places?'] },
        { t: 'Unit 3: Working Life (Làm Việc Từ Xa, Gig Economy & Sự Nghiệp)', q: ['Describe a type of gig work that you think is interesting or useful.', 'Describe a way you organize your time when working or studying from home.', 'Describe a daily routine that helps you work or study effectively at home.', 'Describe a piece of technology that helps you work or study from home.'] },
        { t: 'Unit 4: Truth & Lies (Sự Thật, Tin Đồn & Sự Tin Cậy)', q: ['Describe a hoax that you heard about.', 'Describe an idea for a documentary that you would like to make.', 'Do you think it is ever acceptable to tell a white lie?', 'How can people identify fake news on social media?'] },
        { t: 'Unit 5: Consumer (Quảng Cáo, Thói Quen Mua Sắm & Khiếu Nại)', q: ['Do advertisements influence what you buy? Why/ Why not?', 'Where do you usually see advertisements?', 'Do you prefer advertisements on TV or on social media? Why?', 'Do you enjoy shopping? Why/ Why not?', 'Are you a careful shopper? Why/ Why not?', 'Do you prefer shopping online or shopping in physical stores? Why?'] },
        { t: 'Unit 6: Places (Đô Thị, Giao Thông & Những Trải Nghiệm Lớn)', q: ['Cities should protect historic buildings. Do you agree or disagree? Why (not)?', 'Living in wealthy areas does not always give people a better quality of life. Do you agree or disagree?', 'Living in a high-rise building is better than living in a house. Do you agree or disagree?', 'A challenging journey is more memorable than an easy one. Do you agree or disagree?'] },
        { t: 'Unit 7: Connect (Giao Tiếp, Hiểu Lầm & Mạng Xã Hội)', q: ['How do you usually stay in touch with your friends?', 'Have you ever had a misunderstanding with someone online?', 'Do you prefer voice calls, video calls, or text messaging?', 'How has social media changed the way people form relationships?'] },
        { t: 'Unit 8: Wisdom (Lời Khuyên, Người Thông Thái & Bài Học Cuộc Đời)', q: ['Who is the wisest person you know in your family or circle?', 'What is the best piece of advice you have ever received?', 'Do you think older people are always wiser than younger people?', 'How do people learn life lessons from difficult situations?'] }
      ],
      p2: [
        { t: 'Unit 1: Me & Mine (Bản Thân & Đồ Vật)', card: 'Describe an important possession that you own and cherish', cue: ['What the item is', 'When and how you got it', 'What you use it for', 'And explain why it is so valuable or meaningful to you.'], ex: 'Why it is so meaningful to you' },
        { t: 'Unit 2: Behaviour (Thói Quen & Hành Vi)', card: 'Describe a time when you had to say no to someone', cue: ['Who you said no to', 'What the person asked you to do', 'Why you decided to refuse the request', 'How you said no to that person', 'And explain how you felt after saying no and what you learned from the experience.'], ex: 'How you felt after saying no and what you learned' },
        { t: 'Unit 3: Working Life (Làm Việc & Gig Economy)', card: 'Describe a type of gig work that you think is interesting or useful', cue: ['What kind of gig work it is', 'What people usually do in this job', 'What skills or qualities are needed', 'And explain why you think this type of gig work is interesting or useful.'], ex: 'Why you think this type of gig work is interesting or useful' },
        { t: 'Unit 4: Truth & Lies (Sự Thật & Tin Đồn)', card: 'Describe a hoax that you heard about', cue: ['What the hoax was about', 'Where and when you heard about it', 'Who believed it was true', 'And explain how you found out that it was a hoax.'], ex: 'How you found out that it was a hoax' },
        { t: 'Unit 5: Consumer (Quảng Cáo & Mua Sắm)', card: 'Describe a bad experience you had with an online purchase', cue: ['What you ordered', 'Which website or app you used', 'What went wrong', 'How the problem was solved', 'And explain what you learned from the experience.'], ex: 'What you learned from the experience' },
        { t: 'Unit 6: Places (Đô Thị & Trải Nghiệm Lớn)', card: 'Describe a challenging journey or experience you have had', cue: ['What the journey or experience was', 'When and where it happened', 'Who was involved', 'What difficulties or unexpected things happened', 'And explain how this experience changed you or what you learned from it.'], ex: 'How this experience changed you or what you learned from it' },
        { t: 'Unit 7: Connect (Giao Tiếp & Mạng Xã Hội)', card: 'Describe a memorable conversation you had with a friend or stranger', cue: ['Who you spoke with', 'Where and when it took place', 'What you discussed', 'And explain why this conversation was so memorable or insightful.'], ex: 'Why this conversation was memorable or insightful' },
        { t: 'Unit 8: Wisdom (Bài Học Cuộc Đời)', card: 'Describe a wise person who gave you influential advice', cue: ['Who this person was', 'What relationship you have with them', 'What advice they gave you', 'And explain how this advice influenced your life decisions.'], ex: 'How this advice influenced your life decisions' }
      ]
    };
  }

  // Helper: Get Forecast Data safely
  function getForecast() {
    if (state.currentSource === 'speakout') {
      const speakoutData = window.SPEAKOUT_SPEAKING_DATA;
      if (speakoutData && Array.isArray(speakoutData.units) && speakoutData.units.length > 0) {
        const units = speakoutData.units;
        const p1 = units.map((u, i) => ({
          t: u.title,
          q: Array.isArray(u.p1) ? u.p1 : [],
          unitData: u
        }));
        const p2 = units.map((u, i) => {
          const uId = u.id || ('u' + (i + 1));
          const activeCueIndex = (state.selectedCueCardIndex && state.selectedCueCardIndex[uId]) || 0;
          const curCue = (u.cueCards && u.cueCards[activeCueIndex]) || (u.cueCards && u.cueCards[0]) || { t: u.title, cue: [] };
          return {
            t: u.title,
            card: curCue.t || u.title,
            cue: curCue.cue || [],
            ex: curCue.ex || '',
            q: Array.isArray(u.p3) ? u.p3 : [],
            cueCards: u.cueCards || [],
            unitData: u
          };
        });
        return {
          id: 'speakout_b1plus',
          name: 'Giáo Trình Speakout B1+ (Unit 1–8)',
          range: 'Toàn Bộ 8 Unit · Bài A, B, C, D · 2000 Idioms',
          p1: p1,
          p2: p2
        };
      }
    }

    if (state.currentSource === 'forecast' || !window.SPEAKOUT_SPEAKING_DATA) {
      if (window.SP_FORECAST && Array.isArray(window.SP_FORECAST.p1) && window.SP_FORECAST.p1.length > 0) {
        return window.SP_FORECAST;
      }
    }

    if (window.SPEAKOUT_SPEAKING_DATA && Array.isArray(window.SPEAKOUT_SPEAKING_DATA.units) && window.SPEAKOUT_SPEAKING_DATA.units.length > 0) {
      const units = window.SPEAKOUT_SPEAKING_DATA.units;
      const p1 = units.map((u, i) => ({ t: u.title, q: Array.isArray(u.p1) ? u.p1 : [], unitData: u }));
      const p2 = units.map((u, i) => {
        const uId = u.id || ('u' + (i + 1));
        const activeCueIndex = (state.selectedCueCardIndex && state.selectedCueCardIndex[uId]) || 0;
        const curCue = (u.cueCards && u.cueCards[activeCueIndex]) || (u.cueCards && u.cueCards[0]) || { t: u.title, cue: [] };
        return { t: u.title, card: curCue.t || u.title, cue: curCue.cue || [], ex: curCue.ex || '', q: Array.isArray(u.p3) ? u.p3 : [], cueCards: u.cueCards || [], unitData: u };
      });
      return {
        id: 'speakout_b1plus',
        name: 'Giáo Trình Speakout B1+ (Unit 1–8)',
        range: 'Toàn Bộ 8 Unit · Bài A, B, C, D · 2000 Idioms',
        p1: p1,
        p2: p2
      };
    }

    if (window.SP_FORECAST && Array.isArray(window.SP_FORECAST.p1) && window.SP_FORECAST.p1.length > 0) {
      return window.SP_FORECAST;
    }

    return getEmbeddedFallbackForecast();
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
  function pickEnVoice() {
    try {
      if (!('speechSynthesis' in window)) return null;
      const vs = window.speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
      if (!vs.length) return null;
      return vs.find(v => /google us english|samantha|natural|jenny|guy|zira|david|aria/i.test(v.name)) || vs[0] || null;
    } catch (e) {
      return null;
    }
  }

  // Pre-warm voices on load
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.getVoices();
    } catch (e) {}
  }

  function speakPrompt(text) {
    if (!text || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, ' ').trim());
      const v = pickEnVoice();
      if (v) u.voice = v;
      u.lang = (v && v.lang) || 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('speakPrompt error:', e);
    }
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
    const transcriptInput = document.getElementById('spLiveTranscriptText');
    const transcript = (transcriptInput ? transcriptInput.value : state.liveTranscript || '').trim();

    if (!transcript && !state.audioBlob) {
      alert('Vui lòng ghi âm câu trả lời hoặc gõ / dán văn bản câu trả lời vào ô trước khi chấm điểm AI!');
      return;
    }

    state.isScoring = true;
    updateScoringLoadingUI(true);

    try {
      const groqKey = getGroqKey();
      let evaluation = null;

      if (groqKey) {
        try {
          evaluation = await evaluateViaGroq(groqKey, cur, state.audioBlob, transcript);
        } catch (apiErr) {
          console.warn('Groq API failed, falling back to smart local evaluation:', apiErr);
          evaluation = evaluateLocally(cur, transcript, state.speakingDurationSec);
          evaluation.source = 'Local Smart Engine (Groq gặp lỗi hoặc hết hạn ngạch)';
        }
      } else {
        evaluation = evaluateLocally(cur, transcript, state.speakingDurationSec);
        evaluation.source = 'Local Smart Engine (Chưa cấu hình Groq Key)';
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
    if (audioBlob) {
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
          if (trData.text) {
            transcriptText = trData.text.trim();
            const trBox = document.getElementById('spLiveTranscriptText');
            if (trBox) {
              trBox.value = transcriptText;
              handleTranscriptInput(transcriptText);
            }
          }
        }
      } catch (e) {
        console.warn('Whisper transcription failed, using fallback transcript:', e);
      }
    }

    if (!transcriptText) transcriptText = 'Candidate spoke for ' + (state.speakingDurationSec || 15) + ' seconds.';

    const sysPrompt = `You are a Senior Official IELTS Speaking Examiner accredited by the British Council and IDP, and an elite native English pronunciation coach.

Evaluate the candidate's spoken response strictly according to the Official IELTS Speaking Band Descriptors (Public Version):
1. Fluency & Coherence (FC):
   - Speech rate, continuity, hesitation (content vs language search), repetition, self-correction.
   - Use of cohesive devices, discourse markers, connectors, logical idea development.
2. Lexical Resource (LR):
   - Variety, precision, flexibility of vocabulary.
   - Use of collocations, idioms, less common / topic-specific terms, awareness of style and collocation.
   - Penalize overused basic words ("good", "bad", "like", "very", "think").
3. Grammatical Range & Accuracy (GRA):
   - Balance of simple and complex sentence structures (relative clauses, conditionals, passive, inversion, cleft sentences).
   - Frequency of error-free sentences, systemic vs non-systemic errors (tense consistency, agreement, prepositions, articles).
4. Pronunciation & Delivery (PR):
   - Intelligibility, sentence stress, rhythm, chunking, and phonological clarity based on the spoken text and speech rate.

STRICT PART-SPECIFIC RULES & LENGTH PENALTIES:
- Part 1 (Short Interview): Expect 2–4 well-developed sentences (approx. 25–50 words). If candidate gives a monosyllabic or 1-sentence answer without development, CAP Overall Band at 4.5–5.0.
- Part 2 (Long Turn / Cue Card): Candidate must address all prompts in the Cue Card and produce sustained speech for 1.5–2 minutes (approx. 130–220 words). If response is under 80 words, CAP Fluency at 4.5 and Overall at 5.0.
- Part 3 (Two-way In-depth Discussion): Expect abstract, balanced reasoning, cause-effect logic, and formal discourse markers. Casual or purely personal anecdotes must be penalized on Coherence.
- Off-topic Penalty: If the response fails to address the question prompt, severely penalize Fluency & Coherence (Band 4.0).

OUTPUT REQUIREMENTS:
Respond ONLY with a valid, clean JSON object matching this exact structure:
{
  "overallBand": 6.5,
  "criteria": {
    "fluency": {
      "band": 6.5,
      "feedback": "Nhận xét tiếng Việt chi tiết về tốc độ nói, độ trôi chảy, cách phát triển ý và các liên từ đã dùng.",
      "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
      "improvements": ["Điểm cần khắc phục"]
    },
    "lexical": {
      "band": 6.0,
      "feedback": "Nhận xét tiếng Việt chi tiết về độ đa dạng từ vựng, các từ lặp và mức độ học thuật.",
      "collocationsUsed": ["collocation 1", "collocation 2"],
      "suggestedUpgrades": [
        {
          "original": "từ/cụm từ cơ bản trong bài",
          "upgrade": "cụm từ Band 8.0+ tương đương",
          "reason": "Giải thích vì sao cụm từ nâng cấp này tự nhiên và đắt giá hơn"
        }
      ]
    },
    "grammar": {
      "band": 6.5,
      "feedback": "Nhận xét tiếng Việt chi tiết về cấu trúc câu đơn/phức, thì động từ và độ chính xác.",
      "errors": [
        {
          "original": "trích dẫn chính xác câu hoặc cụm sai của thí sinh",
          "correction": "câu đã được sửa chuẩn ngữ pháp",
          "reason": "Giải thích lỗi sai ngữ pháp bằng tiếng Việt một cách dễ hiểu"
        }
      ]
    },
    "pronunciation": {
      "band": 6.5,
      "feedback": "Nhận xét tiếng Việt về tốc độ phát âm (WPM), ngữ điệu, trọng âm câu và độ mượt mà khi nối âm."
    }
  },
  "upgradedAnswer": "Một bài nói mẫu hoàn chỉnh đạt Band 8.5 viết lại DỰA TRÊN ĐÚNG 100% Ý TƯỞNG VÀ NỘI DUNG GỐC của thí sinh (giữ nguyên câu chuyện, cảm xúc và thông tin), nâng tầm bằng từ vựng học thuật, liên từ tự nhiên và cấu trúc câu phức đắt giá.",
  "topicVocabulary": [
    { "phrase": "high-level collocation", "ipa": "/.../", "meaning": "Nghĩa tiếng Việt" }
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
    // Built-in Smart Local Evaluator (Strictly Calibrated to IELTS Band Descriptors)
  function evaluateLocally(item, transcript, durationSec) {
    const text = transcript.trim();
    const words = text ? text.split(/\s+/) : [];
    const wordCount = words.length;
    const dur = Math.max(5, durationSec || (wordCount > 0 ? Math.round(wordCount / 2.1) : 15));
    const wpm = Math.round((wordCount / dur) * 60);
    const part = item.part || '1';

    // 1. Fluency & Coherence (FC)
    let fc = 6.0;
    let fcFeedback = '';
    const fcStrengths = [];
    const fcImprovements = [];

    // Part-specific length checks
    if (part === '1') {
      if (wordCount < 15) {
        fc = 4.5;
        fcFeedback = `Câu trả lời quá ngắn (${wordCount} từ). Trong Part 1, bạn cần phát triển tối thiểu 2–4 câu (khoảng 25–45 từ) gồm câu trả lời trực tiếp + lý do / ví dụ cụ thể.`;
        fcImprovements.push('Mở rộng câu trả lời bằng cấu trúc [Direct Answer + Explanation + Example]');
      } else if (wordCount < 25) {
        fc = 5.5;
        fcFeedback = `Độ dài đạt ${wordCount} từ. Tốc độ nói xấp xỉ ${wpm} từ/phút. Cần liên kết ý mượt mà hơn và tránh ngắt quãng.`;
        fcStrengths.push('Trả lời trực diện trọng tâm');
        fcImprovements.push('Sử dụng thêm liên từ tự nhiên như "to be honest", "as a matter of fact"');
      } else {
        fc = (wpm >= 105 && wpm <= 150) ? 7.0 : 6.5;
        fcFeedback = `Độ dài rất tốt (${wordCount} từ), duy trì mạch nói ổn định ở mức ${wpm} từ/phút. Các ý phát triển có sự liên kết tự nhiên.`;
        fcStrengths.push(`Tốc độ nói lý tưởng (${wpm} từ/phút)`, `Độ dài đầy đủ (${wordCount} từ)`);
        fcImprovements.push('Đa dạng hóa các discourse markers để bứt phá lên Band 8.0+');
      }
    } else if (part === '2') {
      if (wordCount < 60) {
        fc = 4.0;
        fcFeedback = `Bài nói quá ngắn (${wordCount} từ), chưa đáp ứng yêu cầu thuyết trình liên tục 1.5–2 phút của Part 2 (cần tối thiểu 130–200 từ).`;
        fcImprovements.push('Phải triển khai đầy đủ cả 4 gợi ý trong Cue Card để nói đủ 2 phút');
      } else if (wordCount < 110) {
        fc = 5.0;
        fcFeedback = `Bài nói dài ${wordCount} từ. Bạn đã bao quát được ý chính nhưng chưa đào sâu chi tiết cảm xúc và bài học kinh nghiệm.`;
        fcStrengths.push('Bám sát chủ đề Cue Card');
        fcImprovements.push('Mở rộng thêm chi tiết cụ thể và ví dụ minh họa sinh động');
      } else {
        fc = (wpm >= 110 && wpm <= 150) ? 7.0 : 6.5;
        fcFeedback = `Độ dài bài thuyết trình xuất sắc (${wordCount} từ trong ${dur}s), cấu trúc mở - thân - kết rõ ràng, mạch lạc.`;
        fcStrengths.push('Duy trì độc thoại liên tục mạch lạc', `Độ dài bài nói chuẩn mực (${wordCount} từ)`);
      }
    } else { // Part 3
      if (wordCount < 25) {
        fc = 4.5;
        fcFeedback = `Câu trả lời Part 3 quá ngắn (${wordCount} từ). Part 3 đòi hỏi tư duy phản biện đa chiều, phân tích nguyên nhân - hệ quả của vấn đề xã hội.`;
        fcImprovements.push('Lập luận theo phương pháp đa chiều: "On the one hand... On the other hand..."');
      } else if (wordCount < 45) {
        fc = 6.0;
        fcFeedback = `Độ dài ${wordCount} từ. Phản hồi hợp lý nhưng cần thêm luận cứ mang tính khái quát xã hội thay vì chỉ nhìn nhận góc độ cá nhân.`;
        fcStrengths.push('Đưa ra quan điểm rõ ràng');
        fcImprovements.push('Đưa thêm ví dụ thực tế trong đời sống để lập luận thuyết phục hơn');
      } else {
        fc = (wpm >= 110 && wpm <= 150) ? 7.0 : 6.5;
        fcFeedback = `Lập luận logic, tư duy phản biện sắc sảo, liên kết các mệnh đề chặt chẽ (${wordCount} từ).`;
        fcStrengths.push('Lập luận đa chiều sâu sắc', 'Liên kết ý thuyết phục');
      }
    }

    // 2. Lexical Resource (LR)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const ttr = wordCount > 0 ? uniqueWords / wordCount : 0;
    let lr = 6.0;
    if (ttr > 0.72 && wordCount >= 30) lr = 7.0;
    else if (ttr > 0.6) lr = 6.5;
    else if (wordCount < 20) lr = 5.0;

    // Detect repeated basic words & suggest upgrades
    const suggestedUpgrades = [];
    const lowerText = text.toLowerCase();
    
    if (/\bvery\s+good\b/.test(lowerText) || /\bgood\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "good / very good", upgrade: "exceptional / commendable / of superior quality", reason: "Thay thế tính từ đơn giản bằng từ học thuật thể hiện sự tinh tế" });
    }
    if (/\bi\s+think\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "I think", upgrade: "From my standpoint / I am strongly inclined to believe", reason: "Tránh lặp cụm từ quen thuộc, tăng tính học thuật và trang trọng" });
    }
    if (/\ba\s+lot\s+of\b/.test(lowerText) || /\bmany\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "a lot of / many", upgrade: "a myriad of / a substantial quantity of / a multitude of", reason: "Dùng từ định lượng học thuật cho bài thi Speaking" });
    }
    if (/\bhappy\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "happy", upgrade: "elated / walking on air / utterly exhilarated", reason: "Idiom và tính từ biểu cảm mạnh giúp đạt điểm Lexical Band 7.5+" });
    }
    if (/\bimportant\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "important", upgrade: "of paramount importance / pivotal / integral", reason: "Nâng cấp cụm collocation mang tính học thuật cao" });
    }
    if (/\bdifficult\b/.test(lowerText) || /\bhard\b/.test(lowerText)) {
      suggestedUpgrades.push({ original: "difficult / hard", upgrade: "exceedingly challenging / posed formidable hurdles", reason: "Diễn đạt sắc thái thử thách một cách tinh tế" });
    }

    if (suggestedUpgrades.length === 0) {
      suggestedUpgrades.push(
        { original: "like", upgrade: "have a keen affinity for / be captivated by", reason: "Nâng cấp động từ chỉ sở thích" },
        { original: "because", upgrade: "given that / on the grounds that", reason: "Liên từ nguyên nhân học thuật" }
      );
    }

    // 3. Grammatical Range & Accuracy (GRA)
    const clauses = (text.match(/\b(because|although|though|even if|which|that|when|while|whereas|since|if|as soon as|in order that)\b/gi) || []).length;
    let gra = 6.0;
    if (clauses >= 3 && wordCount >= 30) gra = 7.0;
    else if (clauses >= 1) gra = 6.5;
    else if (wordCount < 20) gra = 5.0;

    // Advanced Grammar Error Detection
    const errors = [];
    if (/\b(he|she|it)\s+(don't|have|go|want|make|need|say|like)\b/i.test(text)) {
      const match = text.match(/\b(he|she|it)\s+(don't|have|go|want|make|need|say|like)\b/i)[0];
      errors.push({
        original: match,
        correction: match.replace(/don't/i, "doesn't").replace(/have/i, "has").replace(/go/i, "goes").replace(/want/i, "wants").replace(/make/i, "makes").replace(/need/i, "needs").replace(/say/i, "says").replace(/like/i, "likes"),
        reason: "Hòa hợp chủ vị: Chủ ngữ ngôi thứ ba số ít (he/she/it) phải dùng động từ chia số ít (-s/-es) hoặc trợ động từ 'doesn't'."
      });
    }
    if (/\b(everybody|everyone|nobody|someone)\s+(are|were|have)\b/i.test(text)) {
      const match = text.match(/\b(everybody|everyone|nobody|someone)\s+(are|were|have)\b/i)[0];
      errors.push({
        original: match,
        correction: match.replace(/are/i, "is").replace(/were/i, "was").replace(/have/i, "has"),
        reason: "Đại từ bất định (everyone, everybody,...) luôn được tính là số ít và đi kèm động từ số ít (is, was, has)."
      });
    }
    if (/\bin\s+(the\s+)?(yesterday|tomorrow)\b/i.test(text)) {
      errors.push({
        original: "in yesterday / in tomorrow",
        correction: "yesterday / tomorrow",
        reason: "Trạng từ chỉ thời gian 'yesterday', 'tomorrow' không đi kèm giới từ 'in'."
      });
    }
    if (/\b(listen|listening)\s+([a-z]+)/i.test(text) && !/\b(listen|listening)\s+to\b/i.test(text) && /\b(listen|listening)\s+(music|songs|radio|podcast)/i.test(text)) {
      errors.push({
        original: "listen music",
        correction: "listen to music",
        reason: "Động từ 'listen' là nội động từ, bắt buộc phải có giới từ 'to' trước tân ngữ (listen to something)."
      });
    }
    if (/\bvery\s+(delicious|exhausted|freezing|furious|impossible|vital|essential)\b/i.test(text)) {
      const match = text.match(/\bvery\s+(delicious|exhausted|freezing|furious|impossible|vital|essential)\b/i)[0];
      errors.push({
        original: match,
        correction: match.replace(/very/i, "absolutely / completely"),
        reason: "Tính từ tuyệt đối (Extreme Adjectives) không đi với 'very'. Hãy dùng 'absolutely' hoặc 'completely'."
      });
    }
    if (/\b(can\s+able\s+to|could\s+able\s+to)\b/i.test(text)) {
      errors.push({
        original: "can able to",
        correction: "am able to / can",
        reason: "Lỗi thừa modal verb: Không dùng 'can able to'. Chỉ dùng 'can' hoặc 'be able to'."
      });
    }
    if (/\b(did\s+went|did\s+saw|did\s+bought)\b/i.test(text)) {
      const match = text.match(/\b(did\s+went|did\s+saw|did\s+bought)\b/i)[0];
      errors.push({
        original: match,
        correction: match.replace(/went/i, "go").replace(/saw/i, "see").replace(/bought/i, "buy"),
        reason: "Sau trợ động từ 'did/didn't', động từ chính phải giữ ở dạng nguyên thể không to (bare infinitive)."
      });
    }

    // 4. Pronunciation & Delivery (PR)
    let pr = 6.5;
    if (wpm < 85 || wpm > 175) pr = 5.5;
    else if (wpm >= 115 && wpm <= 145) pr = 7.0;

    // Cap Overall Band if answer was under-length
    let rawOverall = (fc + lr + gra + pr) / 4;
    if (part === '1' && wordCount < 15) rawOverall = Math.min(rawOverall, 5.0);
    if (part === '2' && wordCount < 60) rawOverall = Math.min(rawOverall, 4.5);
    if (part === '2' && wordCount < 100) rawOverall = Math.min(rawOverall, 5.5);
    if (part === '3' && wordCount < 25) rawOverall = Math.min(rawOverall, 5.0);
    const overallBand = Math.round(rawOverall * 2) / 2;

    // Native Rewrite preserving candidate's ideas
    let upgradedAnswer = '';
    const safeTopic = (item.topicTitle || 'this topic').toLowerCase();
    const cleanQ = (item.questionText || '').replace(/\?$/, '');

    if (part === '2') {
      upgradedAnswer = `To be completely candid, when reflect upon ${safeTopic}, the very first experience that springs vividly to mind is ${text.slice(0, 80).replace(/^[a-z]/, c => c.toUpperCase())}... What made this experience singularly memorable was not merely the steep learning curve involved, but also the profound resilience it instilled in me. Looking back in hindsight, having to navigate through unexpected complications fundamentally reshaped my perspective and equipped me with invaluable problem-solving skills for the long haul.`;
    } else if (part === '3') {
      upgradedAnswer = `From an analytical standpoint, regarding the question of whether ${cleanQ.toLowerCase()}, I am strongly inclined to believe that there is no singular black-or-white answer. On the one hand, ${text.slice(0, 60)}... On the other hand, from a broader societal perspective, striking a delicate equilibrium remains of paramount importance. Ultimately, adopting a proactive and adaptable mindset makes an immense difference in tackling such multifaceted challenges.`;
    } else {
      upgradedAnswer = `Well, frankly speaking, when it comes to ${cleanQ.toLowerCase()}, I would definitely argue that ${text.slice(0, 50).toLowerCase()}... More specifically, it has played an indispensable role in shaping my personal routine. In addition, I find that allocating deliberate attention to this area not only broadens my horizon but also yields tremendous practical benefits in the long run.`;
    }

    return {
      overallBand: overallBand,
      criteria: {
        fluency: {
          band: fc,
          feedback: fcFeedback,
          strengths: fcStrengths.length ? fcStrengths : ['Duy trì được nhịp độ nói tương đối ổn định'],
          improvements: fcImprovements.length ? fcImprovements : ['Sử dụng thêm các liên từ kết nối tự nhiên để bài nói mượt mà hơn']
        },
        lexical: {
          band: lr,
          feedback: `Độ đa dạng từ vựng đạt ${(ttr * 100).toFixed(0)}%. Bạn đã sử dụng được một số từ vựng đúng ngữ cảnh. Hãy bổ sung thêm các Collocation học thuật và Idioms đặc thù theo đề thi.`,
          collocationsUsed: words.slice(0, 3),
          suggestedUpgrades: suggestedUpgrades
        },
        grammar: {
          band: gra,
          feedback: `Phát hiện ${clauses} mệnh đề phức trong bài nói. Cấu trúc câu cơ bản chuẩn xác. Hãy lồng ghép thêm câu điều kiện hỗn hợp hoặc đảo ngữ để bứt phá lên Band 7.5+.`,
          errors: errors
        },
        pronunciation: {
          band: pr,
          feedback: `Tốc độ nói trung bình đạt ${wpm} từ/phút (chuẩn IELTS: 110–140 WPM). Phát âm tương đối rõ ràng. Cần chú ý nhấn đúng trọng âm câu (sentence stress) và nối âm cuối (linking sounds) mượt mà hơn.`
        }
      },
      upgradedAnswer: upgradedAnswer,
      topicVocabulary: [
        { phrase: "of paramount importance", ipa: "/əv ˈpærəmaʊnt ɪmˈpɔːtns/", meaning: "Có tầm quan trọng tối cao, cốt lõi" },
        { phrase: "leave an indelible impression", ipa: "/liːv ən ɪnˈdelɪbl ɪmˈpreʃn/", meaning: "Để lại ấn tượng sâu đậm khó phai" },
        { phrase: "strike a delicate balance", ipa: "/straɪk ə ˈdelɪkət ˈbæləns/", meaning: "Tạo sự cân bằng tinh tế giữa các yếu tố" },
        { phrase: "steep learning curve", ipa: "/stiːp ˈlɜːrnɪŋ kɜːrv/", meaning: "Quá trình học hỏi nhiều thử thách ban đầu" }
      ],
      transcript: text || '(Ghi âm trực tiếp - không có văn bản live)',
      speakingDurationSec: dur,
      source: 'Local Smart Heuristic (Chưa có Groq Key)'
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
      const cueCardsList = (cur && cur.topic && cur.topic.cueCards) || [];
      const uId = (cur && cur.topic && cur.topic.unitData && cur.topic.unitData.id) || ('u' + (state.currentTopicIndex + 1));
      const activeCueIdx = (state.selectedCueCardIndex && state.selectedCueCardIndex[uId]) || 0;

      if (cueCardsList.length > 1) {
        let pillsHtml = '<div class="flex items-center gap-1.5 flex-wrap">';
        cueCardsList.forEach((c, cIdx) => {
          const isCurrent = cIdx === activeCueIdx;
          const doneInfo = doneMap[(c.t || '').trim()];
          const isDone = !!doneInfo;
          const band = doneInfo && typeof doneInfo === 'object' && doneInfo.band ? doneInfo.band : '';
          let cls = 'q-nav-btn is-cue px-2 py-1 text-xs font-bold';
          if (isCurrent) cls += ' current';
          else if (isDone) cls += ' done';
          pillsHtml += `
            <button type="button" onclick="SpeakingEngine.selectCueCard('${uId}', ${cIdx})" class="${cls}" title="${c.t}${band ? ` · Band ${band}` : ''}">
              ${c.code || (cIdx + 1)}
            </button>
          `;
        });
        pillsHtml += '</div>';
        container.innerHTML = pillsHtml;
        return;
      }

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

        const cueCardsList = cur.topic && cur.topic.cueCards ? cur.topic.cueCards : null;
        let cuePickerHtml = '';
        if (cueCardsList && cueCardsList.length > 1) {
          const uId = cur.topic.unitData ? cur.topic.unitData.id : 'default';
          const activeCueIdx = (state.selectedCueCardIndex && state.selectedCueCardIndex[uId]) || 0;
          cuePickerHtml = `
            <div class="flex items-center gap-1.5 flex-wrap mb-3 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
              <span class="text-xs font-bold text-slate-500 mr-1 pl-1">Chọn bài Cue Card:</span>
              ${cueCardsList.map((c, cIdx) => `
                <button type="button" onclick="SpeakingEngine.selectCueCard('${uId}', ${cIdx})"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${cIdx === activeCueIdx ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
                  ${c.label || ('Đề ' + (c.code || (cIdx + 1)))}
                </button>
              `).join('')}
            </div>
          `;
        }

        cueZone.innerHTML = `
          ${cuePickerHtml}
          <div class="cue-card-container">
            <div class="flex items-center justify-between mb-3 border-b border-[#ece8f1] pb-2">
              <span class="part-chip" style="font-size: 11px; font-weight: 800; color: var(--accent-ink); background: var(--accent-wash); padding: 2px 10px; border-radius: 999px;">
                PART 2 · CUE CARD ${cue.code ? '(' + cue.code + ')' : ''}
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
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white fill-white" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>`;
      btn.className = 'rec-btn recording w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition transform hover:scale-105 cursor-pointer';
      if (statusText) statusText.innerHTML = '<span class="text-rose-600 font-bold flex items-center justify-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Đang ghi âm... Nhấn nút vuông để dừng</span>';
      if (timerEl) timerEl.classList.remove('text-slate-400');
      if (liveBox) liveBox.classList.remove('hidden');
    } else {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;
      btn.className = 'rec-btn w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transition transform hover:scale-105 cursor-pointer';
      if (statusText) statusText.innerHTML = '<span class="text-slate-600 font-medium">Bấm micro để bắt đầu ghi âm câu trả lời</span>';
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
    const fc = crits.fluency || { band: 6.0, feedback: '', strengths: [], improvements: [] };
    const lr = crits.lexical || { band: 6.0, feedback: '', suggestedUpgrades: [] };
    const gra = crits.grammar || { band: 6.0, feedback: '', errors: [] };
    const pr = crits.pronunciation || { band: 6.0, feedback: '' };

    // Format errors table
    let errorsHtml = '';
    if (gra.errors && gra.errors.length) {
      errorsHtml = gra.errors.map((err, i) => `
        <div class="err-box p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 mb-2.5 text-xs space-y-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-1.5 py-0.5 rounded font-bold bg-rose-200/70 text-rose-800 text-[10px]">Lỗi ${i + 1}</span>
            <del class="text-rose-600 font-semibold line-through">"${err.original || ''}"</del>
            <span class="text-slate-400 font-bold">→</span>
            <ins class="text-emerald-700 font-bold no-underline bg-emerald-100/70 px-1.5 py-0.5 rounded">"${err.correction || ''}"</ins>
          </div>
          <p class="text-slate-600 leading-relaxed font-medium"><strong class="text-slate-800">Giải thích:</strong> ${err.reason || err.rule || 'Cần chỉnh sửa cho đúng ngữ pháp chuẩn.'}</p>
        </div>
      `).join('');
    } else {
      errorsHtml = `<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
        <span class="text-base">✓</span> <span>Không phát hiện lỗi ngữ pháp nghiêm trọng. Diễn đạt tương đối chính xác và tự nhiên!</span>
      </div>`;
    }

    // Format Vocabulary Upgrade Table
    let vocabUpgradesHtml = '';
    const upgradesList = lr.suggestedUpgrades || [];
    if (upgradesList.length) {
      vocabUpgradesHtml = `
        <div class="pv-card p-3.5 space-y-2">
          <h5 class="font-bold text-xs uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
            <span>🚀 Nâng Cấp Từ Vựng & Collocation Band 8.0+</span>
          </h5>
          <div class="grid grid-cols-1 gap-2 pt-1">
            ${upgradesList.map(u => {
              if (typeof u === 'string') {
                return `<div class="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 font-semibold">• ${u}</div>`;
              }
              return `
                <div class="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80 text-xs space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-slate-500 font-medium">Từ cơ bản: <code class="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono">${u.original || ''}</code></span>
                    <span class="text-slate-400">→</span>
                    <span class="text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-sm">✨ ${u.upgrade || ''}</span>
                  </div>
                  ${u.reason ? `<p class="text-[11px] text-slate-500 italic mt-0.5">${u.reason}</p>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    const isLocalEngine = (res.source || '').includes('Local');
    const upg = res.upgradedAnswer || '';

    resultZone.innerHTML = `
      <div class="space-y-3.5">
        <!-- Top Overall Band Score Card -->
        <div class="pv-card p-4">
          <div class="score-line">
            <div class="score-main">
              <b class="text-3xl text-indigo-600">${ob}</b>
              <span class="text-xs font-semibold text-slate-500">Overall Band ước tính</span>
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

          <div class="flex items-center justify-between text-xs text-slate-500 pt-3 mt-3 border-t border-slate-200/80">
            <span class="flex items-center gap-1.5">
              <span>Động cơ:</span>
              <strong class="${isLocalEngine ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}">${res.source || 'AI Engine'}</strong>
              <span>· Thời gian: <strong>${res.speakingDurationSec || state.speakingDurationSec}s</strong></span>
            </span>
            <button type="button" onclick="SpeakingEngine.speakText('${upg.replace(/'/g, "\\'")}')" class="ni-nav-btn text-xs py-1 px-2.5 flex items-center gap-1" title="Nghe bài mẫu giọng bản xứ">
              🔊 Nghe bài mẫu
            </button>
          </div>

          ${isLocalEngine ? `
          <div class="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-2">
            <span>💡 Bạn đang dùng bộ chấm Local. Gắn <strong>Groq API Key</strong> miễn phí để mở khóa Llama 3.3 70B chấm sâu chuẩn giám khảo IDP!</span>
            <button type="button" onclick="SpeakingEngine.openGroqModal()" class="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] shrink-0 hover:bg-amber-700 transition">
              Cài Key Ngay
            </button>
          </div>
          ` : ''}
        </div>

        <!-- 4 Criteria Detailed Assessment Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- FC Card -->
          <div class="pv-card p-3 space-y-1.5 text-xs border-l-4" style="border-left-color: var(--fluency);">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">🗣️ Fluency & Coherence</span>
              <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-100" style="color: var(--fluency);">Band ${fc.band || 6.0}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">${fc.feedback || ''}</p>
            ${(fc.strengths && fc.strengths.length) ? `
              <div class="text-[11px] text-emerald-700 pt-1">
                <strong>✓ Điểm cộng:</strong> ${fc.strengths.join(', ')}
              </div>` : ''}
            ${(fc.improvements && fc.improvements.length) ? `
              <div class="text-[11px] text-rose-700">
                <strong>⚠ Cần khắc phục:</strong> ${fc.improvements.join(', ')}
              </div>` : ''}
          </div>

          <!-- LR Card -->
          <div class="pv-card p-3 space-y-1.5 text-xs border-l-4" style="border-left-color: var(--lexical);">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">📚 Lexical Resource</span>
              <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-100" style="color: var(--lexical);">Band ${lr.band || 6.0}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">${lr.feedback || ''}</p>
          </div>

          <!-- GRA Card -->
          <div class="pv-card p-3 space-y-1.5 text-xs border-l-4" style="border-left-color: var(--grammar);">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">✍️ Grammatical Range</span>
              <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-100" style="color: var(--grammar);">Band ${gra.band || 6.0}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">${gra.feedback || ''}</p>
          </div>

          <!-- PR Card -->
          <div class="pv-card p-3 space-y-1.5 text-xs border-l-4" style="border-left-color: var(--pronunciation);">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">🎯 Pronunciation & Delivery</span>
              <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-100" style="color: var(--pronunciation);">Band ${pr.band || 6.0}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">${pr.feedback || ''}</p>
          </div>
        </div>

        <!-- Transcript -->
        ${res.transcript ? `
        <div class="pv-card p-3.5 text-xs space-y-1">
          <span class="font-bold text-slate-500 uppercase tracking-wider block">📝 Lời Bạn Đã Nói (Transcript)</span>
          <p class="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-mono text-[12px]">"${res.transcript}"</p>
        </div>` : ''}

        <!-- Detailed Error Correction Table -->
        <div class="pv-card p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <h5 class="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span>🔍 Chữa Lỗi Ngữ Pháp & Dùng Từ Chi Tiết</span>
            </h5>
            <span class="text-[11px] text-slate-400 font-medium"><del class="text-rose-500">chữ sai</del> → <ins class="text-emerald-600 font-bold no-underline">chữ đúng</ins></span>
          </div>
          <div class="space-y-1.5 pt-1">
            ${errorsHtml}
          </div>
        </div>

        <!-- Vocabulary Upgrades -->
        ${vocabUpgradesHtml}

        <!-- Upgraded Band 8.5+ Model Answer -->
        <div class="pv-card p-4 space-y-2 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-200/90 shadow-sm">
          <div class="flex items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
            <span class="font-extrabold text-xs uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <span>✨ Bản Nâng Cấp Band 8.5+ Chuẩn Bản Xứ</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">100% Giữ Ý Gốc</span>
            </span>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="SpeakingEngine.copyText('${upg.replace(/'/g, "\\'")}')" class="ni-nav-btn text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer hover:bg-indigo-50" title="Sao chép bài mẫu">
                📋 Sao Chép
              </button>
              <button type="button" onclick="SpeakingEngine.speakText('${upg.replace(/'/g, "\\'")}')" class="py-1 px-2.5 rounded-xl text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1 cursor-pointer shadow-sm" title="Nghe giọng bản ngữ đọc mẫu để luyện Shadowing">
                🔊 Nghe Giọng Mẫu
              </button>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal pt-1">${upg}</p>
        </div>

        <!-- Topic Collocations -->
        ${(res.topicVocabulary && res.topicVocabulary.length) ? `
        <div class="pv-card p-3.5 space-y-2">
          <span class="font-bold text-xs uppercase tracking-wider text-slate-600 block">📚 Collocations Hay Cho Đề Thi Này</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            ${res.topicVocabulary.map(v => `
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                <div>
                  <span class="font-bold text-indigo-700 block">${v.phrase || ''}</span>
                  <span class="text-[11px] font-mono text-slate-400 block">${v.ipa || ''}</span>
                  <span class="text-slate-600 text-[11px] mt-0.5 block">${v.meaning || ''}</span>
                </div>
                <button type="button" onclick="SpeakingEngine.speakText('${(v.phrase || '').replace(/'/g, "\\'")}')" class="text-left text-[11px] text-indigo-600 hover:underline mt-1 font-semibold">
                  🔊 Nghe phát âm
                </button>
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>
    `;

    if (resultZone && typeof resultZone.scrollIntoView === 'function') {
      try { resultZone.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
    }
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
    // liveBox remains open for user text entry

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
  // Pick random question (supports same-source or cross-source mix)
  function pickRandomQuestion(crossSource = false) {
    if (crossSource) {
      const sources = ['speakout', 'forecast'];
      const chosen = sources[Math.floor(Math.random() * sources.length)];
      if (state.currentSource !== chosen) {
        state.currentSource = chosen;
        const btnSp = document.getElementById('spSourceTab_speakout');
        const btnFc = document.getElementById('spSourceTab_forecast');
        if (btnSp && btnFc) {
          if (chosen === 'speakout') {
            btnSp.className = 'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white text-indigo-700 shadow-sm border-2 border-indigo-500';
            btnFc.className = 'py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-slate-200';
          } else {
            btnFc.className = 'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white text-indigo-700 shadow-sm border-2 border-indigo-500';
            btnSp.className = 'py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-slate-200';
          }
        }
      }
    }

    const f = getForecast();
    if (state.currentPart === '1' && f.p1.length) {
      state.currentTopicIndex = Math.floor(Math.random() * f.p1.length);
      const top = f.p1[state.currentTopicIndex];
      state.currentQuestionIndex = Math.floor(Math.random() * top.q.length);
    } else if (state.currentPart === '2' && f.p2.length) {
      state.currentTopicIndex = Math.floor(Math.random() * f.p2.length);
      const cue = f.p2[state.currentTopicIndex];
      if (cue && cue.cueCards && cue.cueCards.length > 1) {
        const uId = (cue.unitData && cue.unitData.id) || ('u' + (state.currentTopicIndex + 1));
        state.selectedCueCardIndex[uId] = Math.floor(Math.random() * cue.cueCards.length);
      }
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


  // Auto-rehydration logic
  function rehydrate(force) {
    try {
      const select = document.getElementById('spTopicSelect');
      const needRehydrate = force || !select || select.options.length === 0;
      if (needRehydrate) {
        renderTopicSelector();
        renderQuestionSelector();
        renderCurrentQuestionBoard();
        updateGroqIndicator();
      }
    } catch (e) {
      console.warn('[SpeakingEngine] rehydrate error:', e);
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
    if (cur.topic && cur.topic.unitData) {
      const u = cur.topic.unitData;
      const combinedVocab = [...(u.vocabulary || []), ...(u.idioms || [])];
      return {
        ideas: u.ideas || [],
        collocations: combinedVocab,
        sample65: u.sample65 || '',
        sample80: u.sample80 || ''
      };
    }

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
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="font-bold text-xs text-[#0f172a]">${v.phrase}</span>
                        ${v.meaning && v.meaning.includes('[2000 Idioms]') ? '<span class="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">2000 Idioms</span>' : ''}
                      </div>
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
    speakPrompt(text);
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


  function setSource(source) {
    state.currentSource = source || 'speakout';
    state.currentTopicIndex = 0;
    state.currentQuestionIndex = 0;

    const btnSpeakout = document.getElementById('spSourceTab_speakout');
    const btnForecast = document.getElementById('spSourceTab_forecast');

    if (btnSpeakout && btnForecast) {
      if (state.currentSource === 'speakout') {
        btnSpeakout.className = 'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white text-indigo-700 shadow-sm border-2 border-indigo-500';
        btnForecast.className = 'py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-slate-200';
      } else {
        btnForecast.className = 'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white text-indigo-700 shadow-sm border-2 border-indigo-500';
        btnSpeakout.className = 'py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-800 hover:bg-white/80 border border-slate-200';
      }
    }

    setPart(state.currentPart || '1');
  }

  function selectCueCard(uId, cIdx) {
    if (!state.selectedCueCardIndex) state.selectedCueCardIndex = {};
    state.selectedCueCardIndex[uId] = cIdx;
    renderCurrentQuestionBoard();
    if (state.isIdeaOpen) {
      loadIdeaForCurrentQuestion();
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
    pickRandomCrossSource: function () { pickRandomQuestion(true); },
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
    setSource: setSource,
    selectCueCard: selectCueCard,
    generateAiIdeaWithGroq: generateAiIdeaWithGroq,
    setIdeaBand: setIdeaBand,
    refreshIdea: refreshIdea,
    speakPhrase: speakPhrase,
    saveIdeaVocab: saveIdeaVocabToDeck,
    saveAllIdeaVocabToDeck: saveAllIdeaVocabToDeck,
    speakIdeaModelAnswer: speakIdeaModelAnswer,
    copyIdeaModelAnswer: copyIdeaModelAnswer,
    copyIdeaToScratchpad: copyIdeaToScratchpad,
    handleTranscriptInput: handleTranscriptInput,
    clearTranscript: clearTranscript,
    discardRecording: discardRecording,
    rehydrate: rehydrate,
    copyText: copyText
  };


  function handleTranscriptInput(val) {
    state.liveTranscript = val;
    const words = (val || '').trim() ? (val || '').trim().split(/\s+/).length : 0;
    const badge = document.getElementById('spWordCountBadge');
    if (badge) badge.textContent = words + ' từ';
  }

  function clearTranscript() {
    state.liveTranscript = '';
    const input = document.getElementById('spLiveTranscriptText');
    if (input) input.value = '';
    const badge = document.getElementById('spWordCountBadge');
    if (badge) badge.textContent = '0 từ';
  }

  function discardRecording() {
    stopRecording();
    state.audioChunks = [];
    state.audioBlob = null;
    state.audioUrl = null;
    state.speakingDurationSec = 0;
    const playerZone = document.getElementById('spAudioPlayerZone');
    if (playerZone) playerZone.classList.add('hidden');
    const audioEl = document.getElementById('spPlaybackAudio');
    if (audioEl) audioEl.src = '';
  }


  function copyText(str) {
    if (!str) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(() => {
        alert('Đã sao chép vào bộ nhớ tạm!');
      }).catch(() => {
        fallbackCopy(str);
      });
    } else {
      fallbackCopy(str);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); alert('Đã sao chép vào bộ nhớ tạm!'); } catch(e) {}
    document.body.removeChild(ta);
  }

  // Auto-initialize Speaking Engine on load with safety retries
  function autoInit() {
    try {
      init();
    } catch (e) {
      console.warn('SpeakingEngine autoInit error:', e);
    }
  }

  function ensureInitialized() {
    const select = document.getElementById('spTopicSelect');
    if (!select || select.options.length === 0) {
      try {
        init();
      } catch (e) {
        console.warn('ensureInitialized error:', e);
      }
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      setTimeout(autoInit, 10);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(ensureInitialized, 50);
        setTimeout(ensureInitialized, 250);
        setTimeout(ensureInitialized, 750);
        setTimeout(ensureInitialized, 1500);
      });
    }
    // Periodic watcher to guarantee data is hydrated
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const sel = document.getElementById('spTopicSelect');
      if (sel && sel.options.length === 0) {
        ensureInitialized();
      }
      if (attempts >= 20) clearInterval(interval);
    }, 200);
  }

})(window);
