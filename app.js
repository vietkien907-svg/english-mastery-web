// English Mastery Hub - Client Controller v2.0
// Supports online FastAPI backend synchronization & complete offline PWA operation

const API_BASE = window.location.origin;
const STORAGE_KEY_AUTH = "EMH_AUTH_TOKEN_V2";
const STORAGE_KEY_OFFLINE_QUEUE = "EMH_OFFLINE_QUEUE_V2";

let appState = {
  activeTab: "today",
  authToken: localStorage.getItem(STORAGE_KEY_AUTH) || "",
  currentUser: null,
  studyMode: "unit", // "unit", "shuffle_1_4", "shuffle_4_8"
  currentUnitIndex: 0,
  currentDayIndex: 0,
  currentCardIndex: 0,
  activeShuffledCards: [],
  shuffledRange: [1, 4],
  isFlipped: false,
  todayQueue: [],
  interleavedConfig: null,
  activeInterleavedDeck: null,
  interleavedDeckKey: "",
  grammarTopics: [],
  activeGrammarWeek: 1,
  activeReadingIndex: 0,
  offlineQueue: JSON.parse(localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE) || "[]"),
  authMode: "login" // login or register
};

// ================= INITIALIZATION =================
window.addEventListener("DOMContentLoaded", async () => {
  // 1. Khởi tạo và nạp tiến độ Lộ trình đầu tiên (đảm bảo giữ nguyên tiến độ 100% khi F5)
  initDailyMissionEngine();
  setupUnitSelectors();
  await checkAuthStatus();
  await loadTodayQueue();
  await loadGrammarTopics();
  setupReadingSelector();
  setupTouchAndKeyboard();
  initDailyDeadlineSystem();
  initCrossDeviceAutoSync();
  initListeningModule();
  initVietnamTodayModule();
  loadTelegramSettings();
  initBilingualCinemaModule();
  updateSessionRoutineUI();
  initMultiAccountAndLeaderboard();
  updateDailyMissionUI();
  tickDeadlineCountdown();
  lucide.createIcons();
});

// Helper for authenticated API calls with offline fallback
async function apiCall(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (appState.authToken) {
    headers["Authorization"] = `Bearer ${appState.authToken}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    if (res.status === 401) {
      // Session expired
      appState.authToken = "";
      localStorage.removeItem(STORAGE_KEY_AUTH);
      updateAuthUI();
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Lỗi yêu cầu: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err);
    return null; // Return null to trigger local offline logic
  }
}

// ============================================================================
// HỆ THỐNG QUẢN LÝ TỪ QUÊN & TỪ BỎ QUA ĐỂ ĐƯA VÀO ÔN TẬP TÍCH LŨY
// ============================================================================
const FORGOTTEN_WORDS_KEY = "EMH_FORGOTTEN_WORDS_V1";
const SKIPPED_WORDS_KEY = "EMH_SKIPPED_WORDS_V1";

function getForgottenWords() {
  try {
    const raw = localStorage.getItem(FORGOTTEN_WORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveForgottenWord(wordItem) {
  if (!wordItem || !wordItem.word) return;
  const list = getForgottenWords();
  const lower = wordItem.word.trim().toLowerCase();
  const existingIdx = list.findIndex(w => (w.word || "").toLowerCase() === lower);

  const entry = {
    word: wordItem.word,
    pos: wordItem.pos || "word",
    pron: wordItem.pron || `/${lower}/`,
    meaning_vi: wordItem.meaning_vi || "",
    meaning_en: wordItem.meaning_en || "",
    example: wordItem.example || "",
    cardOrigin: "forgotten",
    cardOriginText: "❌ Từ đã chọn Quên (Ưu tiên ôn tập)",
    timestamp: Date.now(),
    lapseCount: (existingIdx >= 0 ? (list[existingIdx].lapseCount || 1) + 1 : 1)
  };

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...entry };
  } else {
    list.unshift(entry);
  }

  try {
    localStorage.setItem(FORGOTTEN_WORDS_KEY, JSON.stringify(list));
  } catch (e) {}
}

function removeForgottenWord(wordStr) {
  if (!wordStr) return;
  const list = getForgottenWords();
  const lower = wordStr.trim().toLowerCase();
  const filtered = list.filter(w => (w.word || "").toLowerCase() !== lower);
  try {
    localStorage.setItem(FORGOTTEN_WORDS_KEY, JSON.stringify(filtered));
  } catch (e) {}
}

function getSkippedWords() {
  try {
    const raw = localStorage.getItem(SKIPPED_WORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveSkippedWord(wordItem) {
  if (!wordItem || !wordItem.word) return;
  const list = getSkippedWords();
  const lower = wordItem.word.trim().toLowerCase();
  const existingIdx = list.findIndex(w => (w.word || "").toLowerCase() === lower);

  const entry = {
    word: wordItem.word,
    pos: wordItem.pos || "word",
    pron: wordItem.pron || `/${lower}/`,
    meaning_vi: wordItem.meaning_vi || "",
    meaning_en: wordItem.meaning_en || "",
    example: wordItem.example || "",
    cardOrigin: "skipped",
    cardOriginText: "⏭️ Từ đã bấm Bỏ qua (Cần ôn bù)",
    timestamp: Date.now()
  };

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...entry };
  } else {
    list.unshift(entry);
  }

  try {
    localStorage.setItem(SKIPPED_WORDS_KEY, JSON.stringify(list));
  } catch (e) {}
}

function removeSkippedWord(wordStr) {
  if (!wordStr) return;
  const list = getSkippedWords();
  const lower = wordStr.trim().toLowerCase();
  const filtered = list.filter(w => (w.word || "").toLowerCase() !== lower);
  try {
    localStorage.setItem(SKIPPED_WORDS_KEY, JSON.stringify(filtered));
  } catch (e) {}
}

function skipCurrentCard() {
  const words = getCurrentDayWords();
  if (!words || words.length === 0) return;
  const curWord = words[appState.currentCardIndex];
  if (!curWord) return;

  saveSkippedWord(curWord);
  showToast(`⏭️ Đã chuyển từ "${curWord.word}" vào danh sách Ôn Tập Tích Lũy!`, "info");
  nextCard();
}


// ================= STREAK & DAILY CHECK-IN =================
function updateDailyStreak(serverStreak, serverLastDate) {
  const today = new Date().toISOString().slice(0, 10);
  let streak = parseInt(localStorage.getItem("EMH_STREAK") || "1", 10);
  let lastDate = localStorage.getItem("EMH_LAST_DATE") || "";

  if (serverStreak !== undefined && serverStreak !== null) {
    streak = serverStreak;
    lastDate = serverLastDate || today;
  } else if (lastDate !== today) {
    if (lastDate) {
      const dLast = new Date(lastDate);
      const dToday = new Date(today);
      const diffDays = Math.round((dToday - dLast) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak = streak + 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }
  }

  localStorage.setItem("EMH_STREAK", streak.toString());
  localStorage.setItem("EMH_LAST_DATE", today);

  const streakEl = document.getElementById("streakCount");
  if (streakEl) streakEl.innerText = `${streak} ngày`;

  const profileStreakEl = document.getElementById("statStreakDisplay");
  if (profileStreakEl) profileStreakEl.innerText = `${streak} ngày 🔥`;

  const streakSubtext = document.getElementById("streakSubtext");
  if (streakSubtext) streakSubtext.innerText = `Đã điểm danh ngày hôm nay (${today}). Tiếp tục duy trì!`;

  return streak;
}

async function triggerDailyCheckin() {
  let streak = updateDailyStreak();

  if (appState.authToken) {
    const res = await apiCall("/api/auth/checkin", "POST");
    if (res && res.streak) {
      streak = res.streak;
      updateDailyStreak(res.streak, res.last_active_date);
    }
  }

  showToast(`🔥 Điểm danh ngày mới thành công! Chuỗi học liên tục: ${streak} ngày!`, "success");
}

// ================= AUTHENTICATION & USER PROFILE =================
async function checkAuthStatus() {
  if (appState.authToken) {
    const user = await apiCall("/api/auth/me");
    if (user) {
      appState.currentUser = user;
      updateDailyStreak(user.streak_count, user.last_active_date);
    } else {
      updateDailyStreak();
    }
  } else {
    updateDailyStreak();
  }
  updateAuthUI();
  flushOfflineQueue();
}

function updateAuthUI() {
  const nameEl = document.getElementById("userAuthName");
  const badgeEl = document.getElementById("targetExamBadge");
  const streakEl = document.getElementById("streakCount");
  const statusEl = document.getElementById("userStatusText");
  const profileStreakEl = document.getElementById("statStreakDisplay");

  const streakVal = localStorage.getItem("EMH_STREAK") || (appState.currentUser?.streak_count || 1);
  if (streakEl) streakEl.innerText = `${streakVal} ngày`;
  if (profileStreakEl) profileStreakEl.innerText = `${streakVal} ngày 🔥`;

  if (appState.currentUser) {
    if (nameEl) nameEl.innerText = appState.currentUser.full_name || appState.currentUser.email.split("@")[0];
    if (badgeEl) badgeEl.innerText = appState.currentUser.target_exam || "IELTS";
    if (statusEl) statusEl.innerText = `Đã đồng bộ tài khoản: ${appState.currentUser.email}`;
  } else {
    if (nameEl) nameEl.innerText = "Đăng nhập";
    if (statusEl) statusEl.innerText = "Chế độ ngoại tuyến • Đăng nhập để đồng bộ";
  }
}

function openAuthModal() {
  if (appState.currentUser) {
    switchTab("profile");
    return;
  }
  document.getElementById("authModal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function toggleAuthMode() {
  appState.authMode = appState.authMode === "login" ? "register" : "login";
  const title = document.getElementById("authModalTitle");
  const submitBtn = document.getElementById("authSubmitBtn");
  const toggleBtn = document.getElementById("authToggleBtn");
  const nameField = document.getElementById("authNameField");

  if (appState.authMode === "register") {
    title.innerText = "Đăng Ký Tài Khoản";
    submitBtn.innerText = "Đăng ký";
    toggleBtn.innerText = "Đã có tài khoản? Nhấn để Đăng nhập";
    nameField.classList.remove("hidden");
  } else {
    title.innerText = "Đăng Nhập Đồng Bộ";
    submitBtn.innerText = "Đăng nhập";
    toggleBtn.innerText = "Chưa có tài khoản? Nhấn để Đăng ký";
    nameField.classList.add("hidden");
  }
}

async function handleAuthSubmit() {
  const email = document.getElementById("authEmailInput").value.trim();
  const password = document.getElementById("authPasswordInput").value.trim();
  const name = document.getElementById("authNameInput").value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập email và mật khẩu.");
    return;
  }

  const endpoint = appState.authMode === "register" ? "/api/auth/register" : "/api/auth/login";
  const payload = { email, password, full_name: name, target_exam: "IELTS" };

  const res = await apiCall(endpoint, "POST", payload);
  if (res && res.token) {
    appState.authToken = res.token;
    localStorage.setItem(STORAGE_KEY_AUTH, res.token);
    appState.currentUser = res.user;
    updateDailyStreak(res.user?.streak, res.user?.last_active_date);
    updateAuthUI();
    closeAuthModal();
    await loadTodayQueue();
    showToast(`Đăng nhập thành công! Chuỗi ngày học: ${res.user?.streak || 1} ngày 🔥`, "success");
  } else {
    showToast("Đăng nhập không thành công. Vui lòng kiểm tra lại!", "error");
  }
}

async function logoutUser() {
  await apiCall("/api/auth/logout", "POST");
  appState.authToken = "";
  appState.currentUser = null;
  localStorage.removeItem(STORAGE_KEY_AUTH);
  updateAuthUI();
  switchTab("today");
  alert("Đã đăng xuất thành công.");
}

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
  if (tabId === "reading") tabId = "reader";
  appState.activeTab = tabId;

  // Sync nav buttons
  ["today", "flashcard", "listening", "cinema", "video", "review", "reader", "grammar", "profile"].forEach(id => {
    const sec = document.getElementById(`tab-${id}`);
    if (sec) sec.classList.toggle("hidden", id !== tabId);

    const navBtn = document.getElementById(`nav-btn-${id}`) || (id === "reader" ? document.getElementById("nav-btn-reading") : null);
    if (navBtn) {
      if (id === tabId) {
        navBtn.classList.add("bg-indigo-600", "text-white");
        navBtn.classList.remove("text-slate-300", "hover:text-white", "hover:bg-slate-800");
      } else {
        navBtn.classList.remove("bg-indigo-600", "text-white");
        navBtn.classList.add("text-slate-300", "hover:text-white", "hover:bg-slate-800");
      }
    }

    const mobBtn = document.getElementById(`mob-btn-${id}`) || (id === "reader" ? document.getElementById("mob-btn-reading") : null);
    if (mobBtn) {
      mobBtn.classList.toggle("text-indigo-400", id === tabId);
      mobBtn.classList.toggle("text-slate-400", id !== tabId);
    }
  });

  if (tabId === "profile") {
    loadProfileAnalytics();
  } else if (tabId === "cinema") {
    if (typeof initBilingualCinemaModule === "function") initBilingualCinemaModule();
  } else if (tabId === "video") {
    if (typeof renderVietnamTodaySelector === "function") renderVietnamTodaySelector();
  } else if (tabId === "review") {
    generateDailyQuiz();
  } else if (tabId === "flashcard") {
    const curDay = missionRegistry.currentDay || 1;
    const info = getDailyAssignedVocab(curDay);
    const titleEl = document.getElementById("currentUnitTitle");
    if (titleEl && (!appState.studyMode || appState.studyMode === "daily_locked")) {
      titleEl.innerText = info.unitTitle;
    }
    const dayBadge = document.getElementById("currentDayBadge");
    if (dayBadge && (!appState.studyMode || appState.studyMode === "daily_locked")) {
      dayBadge.innerText = `Ngày ${curDay}`;
    }
    renderFlashcard();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  lucide.createIcons();
}

// ================= TODAY STUDY SESSION =================
async function loadTodayQueue() {
  const data = await apiCall("/api/study/today");
  if (data) {
    document.getElementById("metricDueCount").innerText = data.due_count;
    document.getElementById("metricNewCount").innerText = data.new_count;
    document.getElementById("metricEstTime").innerText = `~${data.estimated_minutes}p`;
    appState.todayQueue = data.items || [];
  }
}

// ================= SHUFFLE & TOAST UTILITIES =================
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getWordsForUnitRange(fromUnit, toUnit) {
  const units = window.APP_DATA?.units || [];
  const words = [];
  units.forEach(u => {
    const m = u.unitTitle?.match(/Unit\s*(\d+)/i);
    if (m) {
      const num = parseInt(m[1]);
      if (num >= fromUnit && num <= toUnit) {
        if (u.days) {
          u.days.forEach(d => {
            if (d.words) words.push(...d.words);
          });
        }
      }
    }
  });
  return words;
}

function showToast(message, type = "info") {
  let toast = document.getElementById("emhToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "emhToast";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-md border transition-all duration-300 pointer-events-none opacity-100 translate-y-0 " + 
    (type === "success" 
      ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200" 
      : "bg-indigo-950/90 border-indigo-500/50 text-indigo-200");
  
  setTimeout(() => {
    toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-md border transition-all duration-300 pointer-events-none opacity-0 translate-y-4";
  }, 2300);
}

// ================= 4-UNIT CLUSTER DEFINITIONS =================
const SHUFFLE_4_UNIT_BLOCKS = [
  { from: 1, to: 4, id: "shuffle_1_4", label: "Unit 1 – 4" },
  { from: 5, to: 8, id: "shuffle_5_8", label: "Unit 5 – 8" },
  { from: 4, to: 8, id: "shuffle_4_8", label: "Unit 4 – 8" },
  { from: 9, to: 12, id: "shuffle_9_12", label: "Unit 9 – 12" },
  { from: 13, to: 16, id: "shuffle_13_16", label: "Unit 13 – 16" },
  { from: 17, to: 20, id: "shuffle_17_20", label: "Unit 17 – 20" },
  { from: 21, to: 24, id: "shuffle_21_24", label: "Unit 21 – 24" },
  { from: 25, to: 28, id: "shuffle_25_28", label: "Unit 25 – 28" },
  { from: 29, to: 32, id: "shuffle_29_32", label: "Unit 29 – 32" },
  { from: 33, to: 35, id: "shuffle_33_35", label: "Unit 33 – 35" }
];

function renderShufflePills() {
  const container = document.getElementById("modePillsWrapper");
  if (!container) return;

  let html = `
    <button id="modeBtn_unit" onclick="switchStudyMode('unit')" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow transition flex items-center gap-1 shrink-0">
      <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Từng Unit
    </button>
  `;

  SHUFFLE_4_UNIT_BLOCKS.forEach(b => {
    html += `
      <button id="modeBtn_${b.id}" onclick="switchStudyMode('${b.id}')" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 shrink-0">
        <i data-lucide="shuffle" class="w-3.5 h-3.5 text-indigo-400"></i> ${b.label}
      </button>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function setupQuizScopeSelector() {
  const quizSelect = document.getElementById("quizScopeSelect");
  if (!quizSelect) return;

  let html = `
    <option value="today">⚡ Cần ôn hôm nay (SRS)</option>
    <option value="current_unit">📚 Theo Unit đang chọn</option>
    <optgroup label="🔀 Đề ôn xáo trộn cụm 4 Unit">
  `;

  SHUFFLE_4_UNIT_BLOCKS.forEach(b => {
    const count = getWordsForUnitRange(b.from, b.to).length;
    html += `<option value="${b.id}">🔀 Đề ôn xáo trộn: ${b.label} (${count} từ)</option>`;
  });
  html += `</optgroup>`;

  quizSelect.innerHTML = html;
}

// ================= AUTOMATIC DAILY MISSION, PERSISTENCE & ROADMAP ENGINE =================
const MISSION_REGISTRY_KEY = "EMH_MISSION_REGISTRY_V4";

let missionRegistry = {
  currentDay: 1,
  history: {}
};

const TOTAL_ROADMAP_DAYS = 90; // Lộ trình 3 tháng (90 ngày) - Phân bổ kho 100 bài đọc (3 bài/ngày)

function getTotalMissionDays() {
  return TOTAL_ROADMAP_DAYS;
}

function loadMissionRegistry() {
  try {
    let raw = localStorage.getItem(MISSION_REGISTRY_KEY);
    if (!raw) {
      raw = localStorage.getItem("EMH_MISSION_REGISTRY_BACKUP") || localStorage.getItem("EMH_MISSION_REGISTRY_V3") || localStorage.getItem("EMH_DAILY_MISSION_V3");
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const savedDay = parseInt(parsed.currentDay || parsed.dayNumber) || 1;
        missionRegistry = {
          currentDay: Math.max(1, Math.min(TOTAL_ROADMAP_DAYS, savedDay)),
          history: parsed.history || {}
        };
        // Migrate old format if necessary
        if (!parsed.history && (parsed.vocabDoneCount !== undefined || parsed.readingDone !== undefined)) {
          missionRegistry.history[String(savedDay)] = {
            vocabDone: (parsed.vocabDoneCount >= 20),
            vocabCount: parsed.vocabDoneCount || 0,
            readingDone: !!parsed.readingDone,
            grammarDone: !!parsed.grammarDone,
            studiedIndices: []
          };
        }
      }
    }
  } catch (e) {
    console.warn("Could not load mission registry:", e);
  }

  const curDStr = String(missionRegistry.currentDay);
  if (!missionRegistry.history[curDStr]) {
    missionRegistry.history[curDStr] = {
      vocabDone: false,
      vocabCount: 0,
      readingDone: false,
      grammarDone: false,
      studiedIndices: []
    };
  }
}

function saveMissionRegistry() {
  try {
    const dataStr = JSON.stringify(missionRegistry);
    localStorage.setItem(MISSION_REGISTRY_KEY, dataStr);
    localStorage.setItem("EMH_MISSION_REGISTRY_BACKUP", dataStr);
  } catch (e) {
    console.warn("Could not save mission registry:", e);
  }
  updateDailyMissionUI();
  updateDailyGoalChecklist();
  if (typeof tickDeadlineCountdown === "function") {
    tickDeadlineCountdown();
  }
  if (typeof triggerBackgroundCloudSync === "function") {
    triggerBackgroundCloudSync();
  }
}

function getDayMissionStatus(dayNum) {
  const dStr = String(dayNum);
  const data = missionRegistry.history[dStr] || {
    vocabDone: false,
    vocabCount: 0,
    readingDone: false,
    readingDoneCount: 0,
    completedReadings: [],
    grammarDone: false,
    grammarDoneCount: 0,
    completedGrammarTopics: [],
    videoDone: false,
    completedVideos: []
  };
  const isVocab = !!data.vocabDone || (data.vocabCount >= 20);
  const readingCount = (data.completedReadings && Array.isArray(data.completedReadings))
    ? data.completedReadings.length
    : (data.readingDoneCount || (data.readingDone ? 3 : 0));
  const isReading = !!data.readingDone || (readingCount >= 3);

  // Ngữ pháp: 2 chuyên đề mỗi ngày
  const grammarCount = (data.completedGrammarTopics && Array.isArray(data.completedGrammarTopics))
    ? data.completedGrammarTopics.length
    : (data.grammarDoneCount || (data.grammarDone ? 2 : 0));
  const isGrammar = !!data.grammarDone || (grammarCount >= 2);

  // Luyện Nghe Đề Thi: Mục tiêu 2 bài chuẩn form mỗi ngày (HP3, VSTEP, Cambridge)
  const listeningCount = (data.completedListeningTests && Array.isArray(data.completedListeningTests))
    ? data.completedListeningTests.length
    : (data.listeningDoneCount || (data.listeningDone ? 2 : 0));
  const isListening = !!data.listeningDone || (listeningCount >= 2);

  // Video Vietnam Today / Phim: Hạn chót 22:00
  const watchedVideos = getWatchedVietnamTodayVideos();
  const isVideo = !!data.videoDone || (data.completedVideos && data.completedVideos.length > 0) || watchedVideos.size > 0;

  let count = 0;
  if (isVocab) count++;
  if (isReading) count++;
  if (isGrammar) count++;
  if (isListening) count++;
  if (isVideo) count++;

  return {
    vocabDone: isVocab,
    vocabCount: data.vocabCount || 0,
    readingDone: isReading,
    readingDoneCount: readingCount,
    completedReadings: data.completedReadings || [],
    grammarDone: isGrammar,
    grammarDoneCount: grammarCount,
    completedGrammarTopics: data.completedGrammarTopics || [],
    listeningDone: isListening,
    listeningDoneCount: Math.min(2, listeningCount),
    completedListeningTests: data.completedListeningTests || [],
    videoDone: isVideo,
    completedVideos: data.completedVideos || (isVideo ? Array.from(watchedVideos) : []),
    completedCount: count,
    isAllDone: (isVocab && isReading && isGrammar && isListening)
  };
}

function setDayMissionStatus(dayNum, updates) {
  const dStr = String(dayNum);
  const current = missionRegistry.history[dStr] || {
    vocabDone: false,
    vocabCount: 0,
    readingDone: false,
    readingDoneCount: 0,
    completedReadings: [],
    grammarDone: false
  };
  missionRegistry.history[dStr] = { ...current, ...updates };
  saveMissionRegistry();
}

function toggleMissionDone(type) {
  const curDay = missionRegistry.currentDay;
  const curStatus = getDayMissionStatus(curDay);
  if (type === "vocab") {
    const nextDone = !curStatus.vocabDone;
    setDayMissionStatus(curDay, {
      vocabDone: nextDone,
      vocabCount: nextDone ? 20 : 0
    });
    if (nextDone) {
      showToast(`✅ Đã đánh dấu hoàn thành 20 từ vựng Ngày ${curDay}`, "success");
    } else {
      showToast(`ℹ️ Đã bỏ đánh dấu 20 từ vựng Ngày ${curDay}`, "info");
    }
  } else if (type === "reading") {
    const nextDone = !curStatus.readingDone;
    setDayMissionStatus(curDay, { readingDone: nextDone });
    if (nextDone) {
      showToast(`✅ Đã đánh dấu hoàn thành Bài đọc Ngày ${curDay}`, "success");
    } else {
      showToast(`ℹ️ Đã bỏ đánh dấu Bài đọc Ngày ${curDay}`, "info");
    }
  } else if (type === "grammar") {
    const nextDone = !curStatus.grammarDone;
    setDayMissionStatus(curDay, { grammarDone: nextDone });
    if (nextDone) {
      showToast(`✅ Đã đánh dấu hoàn thành Ngữ pháp Ngày ${curDay}`, "success");
    } else {
      showToast(`ℹ️ Đã bỏ đánh dấu Ngữ pháp Ngày ${curDay}`, "info");
    }
  }
}

let _cachedDailyVocabPlan = null;

function buildDailyVocabPlan() {
  if (_cachedDailyVocabPlan && _cachedDailyVocabPlan.length > 0) {
    return _cachedDailyVocabPlan;
  }
  const units = window.APP_DATA?.units || [];
  const seenWords = new Set();
  const orderedWords = [];

  units.forEach((u, uIdx) => {
    const unitTitle = u.unitTitle || `Unit ${uIdx + 1}`;
    (u.days || []).forEach(d => {
      (d.words || []).forEach(w => {
        const raw = (w.word || "").trim().toLowerCase();
        if (raw && !seenWords.has(raw)) {
          seenWords.add(raw);
          orderedWords.push({
            ...w,
            unitIndex: uIdx,
            unitTitle: unitTitle
          });
        }
      });
    });
  });

  const totalWords = orderedWords.length;
  if (totalWords === 0) return [];

  const daysPlan = [];
  const totalDays = TOTAL_ROADMAP_DAYS || 90;
  const wordsPerDay = Math.floor(totalWords / totalDays);
  const remainder = totalWords % totalDays;

  let curIdx = 0;
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const count = wordsPerDay + (dayNum <= remainder ? 1 : 0);
    const daySlice = orderedWords.slice(curIdx, curIdx + count);
    curIdx += count;

    const primaryUnitIdx = daySlice[0]?.unitIndex ?? 0;
    const primaryUnitTitle = daySlice[0]?.unitTitle ?? `Unit ${primaryUnitIdx + 1}`;

    daysPlan.push({
      dayNumber: dayNum,
      unitIndex: primaryUnitIdx,
      dayIndex: 0,
      unitTitle: primaryUnitTitle,
      dayTitle: `Ngày ${dayNum} • ${primaryUnitTitle}`,
      words: daySlice
    });
  }

  _cachedDailyVocabPlan = daysPlan;
  return daysPlan;
}

function getDailyAssignedVocab(dayNum) {
  const plan = buildDailyVocabPlan();
  const validDay = Math.max(1, Math.min(TOTAL_ROADMAP_DAYS || 90, parseInt(dayNum) || 1));
  if (plan.length >= validDay) {
    return plan[validDay - 1];
  }
  return {
    dayNumber: validDay,
    unitIndex: 0,
    dayIndex: 0,
    unitTitle: "Unit 1",
    dayTitle: `Ngày ${validDay}`,
    words: []
  };
}

// TỔNG HỢP TOÀN BỘ TỪ ÔN TẬP TÍCH LŨY (SỔ TAY + BÀI ĐỌC + TỪ QUÊN + TỪ BỎ QUA + LỘ TRÌNH)
function getWordsUpToDay(maxDayNum) {
  return getCumulativeReviewDeck(maxDayNum);
}

function getCumulativeReviewDeck(maxDayNum) {
  const words = [];
  const seen = new Set();
  const limitDay = Math.max(1, parseInt(maxDayNum) || missionRegistry?.currentDay || 1);

  // 1. NHÓM 1: CÁC TỪ TỪNG CHỌN "QUÊN" TRÊN FLASHCARD (Ưu tiên cao nhất)
  const forgottenWords = getForgottenWords();
  forgottenWords.forEach(w => {
    const lw = (w.word || "").toLowerCase();
    if (lw && !seen.has(lw)) {
      seen.add(lw);
      words.push({
        ...w,
        cardOrigin: "forgotten",
        cardOriginText: "❌ Từ đã chọn Quên (Ưu tiên ôn tập)"
      });
    }
  });

  // 2. NHÓM 2: CÁC TỪ TỪNG BẤM "BỎ QUA" TRÊN FLASHCARD
  const skippedWords = getSkippedWords();
  skippedWords.forEach(w => {
    const lw = (w.word || "").toLowerCase();
    if (lw && !seen.has(lw)) {
      seen.add(lw);
      words.push({
        ...w,
        cardOrigin: "skipped",
        cardOriginText: "⏭️ Từ đã bấm Bỏ qua (Cần ôn bù)"
      });
    }
  });

  // 3. NHÓM 3: TOÀN BỘ TỪ TRONG SỔ TAY CÁ NHÂN (TỪ BÀI ĐỌC, LÀM SAI BÀI ĐỌC, VIETNAM TODAY, CUSTOM)
  const customList = getSavedCustomWords();
  customList.forEach(w => {
    const lw = (w.word || "").toLowerCase();
    if (lw && !seen.has(lw)) {
      seen.add(lw);
      const isReadingMistake = (w.source === "reading_mistake" || w.cardOrigin === "reading_mistake");
      const isReading = (w.source === "reading" || w.cardOrigin === "reading");
      const isVideo = (w.source === "Vietnam Today VTV4" || w.cardOrigin === "vietnam_today");

      let originText = "📘 Sổ tay từ vựng";
      let originKey = "custom";
      if (isReadingMistake) {
        originText = "⚠️ Ôn từ làm sai bài đọc";
        originKey = "reading_mistake";
      } else if (isReading) {
        originText = "📖 Từ mới tra từ bài đọc";
        originKey = "reading";
      } else if (isVideo) {
        originText = "📺 Từ vựng bản tin Vietnam Today";
        originKey = "vietnam_today";
      }

      words.push({
        ...w,
        cardOrigin: originKey,
        cardOriginText: originText
      });
    }
  });

  // 4. NHÓM 4: TOÀN BỘ TỪ VỰNG TÍCH LŨY TỪ NGÀY 1 ĐẾN NGÀY HIỆN TẠI (TỪNG UNIT THEO LỘ TRÌNH)
  for (let d = 1; d <= limitDay; d++) {
    const dayData = getDailyAssignedVocab(d);
    if (dayData && Array.isArray(dayData.words)) {
      dayData.words.forEach(w => {
        const lw = (w.word || "").toLowerCase();
        if (lw && !seen.has(lw)) {
          seen.add(lw);
          words.push({
            ...w,
            sourceDay: d,
            cardOrigin: "past_day",
            cardOriginText: `Lặp lại Ngày ${d} • ${dayData.unitTitle || ""}`
          });
        }
      });
    }
  }

  return words;
}

// HỆ THỐNG PHÂN 1 BÀI ĐỌC VSTEP CHUẨN ĐỦ DÀI MỖI NGÀY (ACE OF ENGLISH)
function getDailyAssignedReadings(dayNum) {
  const list = window.APP_DATA?.readings || [];
  if (list.length === 0) return [];
  const d = Math.max(1, parseInt(dayNum) || 1);
  const total = list.length;
  const idx = (d - 1) % total;
  return [
    { slotNumber: 1, index: idx, ...list[idx] }
  ];
}

function getDailyAssignedReading(dayNum) {
  const readings = getDailyAssignedReadings(dayNum);
  return readings[0] || { id: 0, index: 0, title: "Bài đọc 1" };
}

// HỆ THỐNG PHÂN 2 CHUYÊN ĐỀ MỖI NGÀY ĐỂ KỊP TIẾN ĐỘ THI
function getDailyAssignedGrammarTopics(dayNum) {
  const list = appState.grammarTopics || (window.APP_DATA?.grammar || []);
  if (list.length === 0) return [];
  const d = Math.max(1, parseInt(dayNum) || 1);
  const total = list.length;
  // Phân 2 chuyên đề/ngày: 25 chuyên đề sẽ hoàn thành trọn vẹn trong 13 ngày
  const idx1 = ((d - 1) * 2) % total;
  const idx2 = ((d - 1) * 2 + 1) % total;
  const item1 = list[idx1] || {};
  const item2 = list[idx2] || {};
  return [
    {
      slot: 1,
      index: idx1,
      week_number: item1.week_number || (idx1 + 1),
      ...item1,
      title: item1.title || item1.topic_title || `Chuyên đề ${idx1 + 1}`,
      topic_title: item1.title || item1.topic_title || `Chuyên đề ${idx1 + 1}`
    },
    {
      slot: 2,
      index: idx2,
      week_number: item2.week_number || (idx2 + 1),
      ...item2,
      title: item2.title || item2.topic_title || `Chuyên đề ${idx2 + 1}`,
      topic_title: item2.title || item2.topic_title || `Chuyên đề ${idx2 + 1}`
    }
  ];
}

function getDailyAssignedGrammar(dayNum) {
  const topics = getDailyAssignedGrammarTopics(dayNum);
  return topics[0] || { id: 0, index: 0, title: "Chuyên đề 1: Thì Động Từ", topic_title: "Chuyên đề 1: Thì Động Từ", summary: "Học ngữ pháp trọng tâm" };
}

function initDailyMissionEngine() {
  loadMissionRegistry();
  setupReviewSelectors();
  updateDailyMissionUI();
  // Khởi động mặc định vào chế độ khóa học theo Deadline hôm nay
  const info = getDailyAssignedVocab(missionRegistry.currentDay);
  appState.studyMode = "daily_locked";
  appState.currentUnitIndex = info.unitIndex;
  appState.currentDayIndex = info.dayIndex;
}

function jumpToMissionDay(dayNum) {
  const total = getTotalMissionDays();
  const d = Math.max(1, Math.min(total, parseInt(dayNum) || 1));
  missionRegistry.currentDay = d;
  saveMissionRegistry();

  // Reset deck cache so new unit/day words load fresh
  appState.activeInterleavedDeck = null;
  appState.interleavedDeckKey = "";
  appState.studyMode = "daily_locked";

  const info = getDailyAssignedVocab(d);
  appState.currentUnitIndex = info.unitIndex;
  appState.currentDayIndex = info.dayIndex;
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  const titleEl = document.getElementById("currentUnitTitle");
  if (titleEl) titleEl.innerText = info.unitTitle;
  const dayBadge = document.getElementById("currentDayBadge");
  if (dayBadge) dayBadge.innerText = `Ngày ${d}`;

  renderFlashcard();
  updateDailyMissionUI();
  updateDailyGoalChecklist();
  if (typeof tickDeadlineCountdown === "function") {
    tickDeadlineCountdown();
  }
  showToast(`🚀 Lộ trình: Đang ở Ngày ${d} / ${total} • ${info.unitTitle}`, "info");
}

function changeMissionDay(delta) {
  jumpToMissionDay(missionRegistry.currentDay + delta);
}

function advanceToNextDay() {
  const total = getTotalMissionDays();
  const nextDay = missionRegistry.currentDay + 1;
  if (nextDay > total) {
    showToast("🎉 Chúc mừng bạn đã hoàn thành toàn bộ 90 ngày lộ trình!", "success");
    return;
  }
  jumpToMissionDay(nextDay);
  showToast(`🚀 Đã chuyển sang Ngày ${nextDay} (Học vượt lộ trình - Dữ liệu được ghi nhận)`, "success");
}

function startTodayVocabMission() {
  const curDay = missionRegistry.currentDay;
  const info = getDailyAssignedVocab(curDay);
  appState.studyMode = "daily_locked";
  appState.currentUnitIndex = info.unitIndex;
  appState.currentDayIndex = info.dayIndex;
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  // Track studied cards in this session
  if (!appState.dayVocabStudied) appState.dayVocabStudied = {};
  if (!appState.dayVocabStudied[curDay]) appState.dayVocabStudied[curDay] = new Set();
  appState.dayVocabStudied[curDay].add(0);

  const totalWords = Math.min(20, (info.words || []).length);
  const curStatus = getDayMissionStatus(curDay);

  const lockedBanner = document.getElementById("dailyMissionLockedBanner");
  if (lockedBanner) {
    lockedBanner.classList.remove("hidden");
    lockedBanner.innerHTML = `
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <i data-lucide="layers" class="w-4 h-4 text-indigo-400"></i>
          <span class="font-bold text-indigo-300">Nhiệm Vụ 20 Từ Vựng Ngày ${curDay}</span>
          <span id="bannerVocabCount" class="text-amber-300 text-xs font-semibold">(${curStatus.vocabDone ? '✓ Đã hoàn thành 20/20' : `Đã học: 1/${totalWords}`})</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="advanceToNextDay()" class="px-2.5 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold border border-indigo-500/40 transition flex items-center gap-1">
            Học vượt ngày kế <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="switchTab('today')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition">
            Về Dashboard
          </button>
        </div>
      </div>
    `;
  }
  const freeArea = document.getElementById("freeReviewSelectorArea");
  if (freeArea) freeArea.classList.add("hidden");

  const titleEl = document.getElementById("currentUnitTitle");
  if (titleEl) titleEl.innerText = `${info.unitTitle}`;
  const dayBadge = document.getElementById("currentDayBadge");
  if (dayBadge) dayBadge.innerText = `Ngày ${curDay}`;

  switchTab("flashcard");
  renderFlashcard();
  updateDailyMissionUI();
}

function onVocabCardViewed() {
  if (appState.studyMode === "daily_locked" || !appState.studyMode || appState.studyMode === "roadmap") {
    const curDay = missionRegistry.currentDay;
    const words = getCurrentDayWords();
    const totalWords = Math.min(20, words.length);
    if (!appState.dayVocabStudied) appState.dayVocabStudied = {};
    if (!appState.dayVocabStudied[curDay]) {
      const saved = missionRegistry.history[String(curDay)]?.studiedIndices || [];
      appState.dayVocabStudied[curDay] = new Set(saved);
    }
    appState.dayVocabStudied[curDay].add(appState.currentCardIndex);

    const studiedCount = appState.dayVocabStudied[curDay].size;
    const bannerCount = document.getElementById("bannerVocabCount");
    const curStatus = getDayMissionStatus(curDay);
    const indicesArr = Array.from(appState.dayVocabStudied[curDay]);

    if (studiedCount >= totalWords || curStatus.vocabDone) {
      setDayMissionStatus(curDay, {
        vocabDone: true,
        vocabCount: Math.max(studiedCount, totalWords),
        studiedIndices: indicesArr
      });
      if (bannerCount) bannerCount.innerText = `(✓ Đã hoàn thành ${totalWords}/${totalWords})`;
      if (!curStatus.vocabDone) {
        showToast(`🎉 Xuất sắc! Bạn đã học đủ ${totalWords} từ vựng của Ngày ${curDay}! Đã tự động đánh dấu hoàn thành!`, "success");
      }
    } else {
      setDayMissionStatus(curDay, {
        vocabCount: studiedCount,
        studiedIndices: indicesArr
      });
      if (bannerCount) bannerCount.innerText = `(Đã học: ${studiedCount}/${totalWords})`;
    }
  }
}

function startGradualReview() {
  const curDay = missionRegistry.currentDay;
  const allWords = getWordsUpToDay(curDay);
  if (allWords.length === 0) {
    showToast("Chưa có từ vựng nào để ôn tập!", "warning");
    return;
  }

  appState.studyMode = "gradual_review";
  appState.gradualReviewWords = allWords;
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  const lockedBanner = document.getElementById("dailyMissionLockedBanner");
  if (lockedBanner) {
    lockedBanner.classList.remove("hidden");
    lockedBanner.innerHTML = `
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span class="font-bold text-cyan-300">🔄 Đang Ôn Tập Dần Dần Tích Lũy</span>
          <span class="text-slate-200 text-xs font-semibold">(${allWords.length} từ: Sổ tay + Bài đọc + Từ Quên + Từ Bỏ qua + Lộ trình Ngày 1-${curDay})</span>
        </div>
        <button onclick="startTodayVocabMission()" class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1 shadow">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Quay lại Deadline Ngày ${curDay}
        </button>
      </div>
    `;
  }
  const freeArea = document.getElementById("freeReviewSelectorArea");
  if (freeArea) freeArea.classList.add("hidden");

  const titleEl = document.getElementById("currentUnitTitle");
  if (titleEl) titleEl.innerText = `Ôn Tập Tích Lũy (Ngày 1 - ${curDay})`;
  const dayBadge = document.getElementById("currentDayBadge");
  if (dayBadge) dayBadge.innerText = `${allWords.length} Từ vựng`;

  switchTab("flashcard");
  renderFlashcard();
  showToast(`🔄 Đang nạp ${allWords.length} từ vựng từ Ngày 1 đến Ngày ${curDay} vào bộ nhớ ôn tập!`, "info");
}

function startGradualReviewQuiz() {
  const curDay = missionRegistry.currentDay;
  const allWords = getWordsUpToDay(curDay);
  if (allWords.length === 0) {
    showToast("Chưa có từ vựng nào để làm trắc nghiệm!", "warning");
    return;
  }
  
  activeCustomQuizWords = allWords;
  switchTab("quiz");
  startQuiz();
  showToast(`🎯 Đang mở trắc nghiệm tích lũy với ${Math.min(20, allWords.length)} câu hỏi ngẫu nhiên!`, "info");
}

function startTodayReadingMission(passageIdx) {
  if (passageIdx !== undefined && passageIdx !== null) {
    switchTab("reader");
    renderReadingPassage(passageIdx);
    const p = window.APP_DATA?.readings?.[passageIdx];
    showToast(`📖 Đang mở Bài đọc: ${p?.title || ''}`, "info");
  } else {
    const list = getDailyAssignedReadings(missionRegistry.currentDay);
    const firstReading = list[0];
    switchTab("reader");
    if (firstReading) {
      renderReadingPassage(firstReading.index);
      showToast(`📖 Đang mở Bài 1 / 3 Ngày ${missionRegistry.currentDay}: ${firstReading.title}`, "info");
    }
  }
}

function startTodayGrammarMission(slot = 1) {
  const curDay = missionRegistry.currentDay || 1;
  const topics = getDailyAssignedGrammarTopics(curDay);
  const target = (slot === 2 && topics[1]) ? topics[1] : (topics[0] || {});
  const weekNum = target.week_number || (target.index + 1);
  switchTab("grammar");
  renderGrammarDetail(weekNum);
  showToast(`✍️ Đang mở Chuyên đề ${slot}/2 Ngày ${curDay}: ${target.topic_title || target.title}`, "info");
}

function completeReadingMission() {
  setDayMissionStatus(missionRegistry.currentDay, { readingDone: true });
  showToast("✅ Đã ghi nhận hoàn thành bài đọc hôm nay!", "success");
}

function completeGrammarMission() {
  setDayMissionStatus(missionRegistry.currentDay, { grammarDone: true });
  showToast("✅ Đã ghi nhận hoàn thành chuyên đề ngữ pháp hôm nay!", "success");
}

function updateDailyMissionUI() {
  const totalDays = getTotalMissionDays();
  const curDay = missionRegistry.currentDay;
  const curStatus = getDayMissionStatus(curDay);

  const badge = document.getElementById("dailyMissionBadge");
  if (badge) badge.innerText = `Ngày ${curDay} / ${totalDays}`;

  // Populate or sync day select dropdown
  const daySel = document.getElementById("missionDaySelect");
  if (daySel) {
    if (daySel.options.length !== totalDays) {
      let optHtml = "";
      for (let i = 1; i <= totalDays; i++) {
        const st = getDayMissionStatus(i);
        const icon = st.isAllDone ? "✓ " : (st.completedCount > 0 ? "⏳ " : "");
        optHtml += `<option value="${i}">${icon}Ngày ${i} ${st.isAllDone ? '(Đã xong 3/3)' : (st.completedCount > 0 ? '(' + st.completedCount + '/3)' : '')}</option>`;
      }
      daySel.innerHTML = optHtml;
    }
    daySel.value = String(curDay);
  }

  // 1. Notice Area at Top of Missions
  const noticeArea = document.getElementById("todayStatusNoticeArea");
  if (noticeArea) {
    if (curStatus.isAllDone) {
      noticeArea.innerHTML = `
        <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border-2 border-emerald-500/80 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-emerald-950/50">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-emerald-500/25 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/50">
              <i data-lucide="check-check" class="w-6 h-6 text-emerald-400"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold text-[11px] border border-emerald-400/50 flex items-center gap-1">
                  <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-400"></i> HOÀN THÀNH 100%
                </span>
                <span class="text-xs text-emerald-400 font-semibold">Lộ trình Ngày ${curDay} / ${totalDays}</span>
              </div>
              <h3 class="font-black text-white text-base sm:text-lg mt-0.5">
                🎉 Tuyệt vời! Bạn đã hoàn thành toàn bộ 3 nhiệm vụ hôm nay!
              </h3>
              <p class="text-xs text-slate-300 mt-0.5">
                Toàn bộ tiến độ Từ vựng, Bài đọc và Ngữ pháp đã được lưu trữ vĩnh viễn. Bạn có thể bấm <strong class="text-amber-300 font-bold">🚀 Học Vượt</strong> sang Ngày ${curDay + 1} hoặc <strong class="text-cyan-300 font-bold">🔄 Ôn Tập Dần Dần</strong>!
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="advanceToNextDay()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/40 transition">
              <i data-lucide="zap" class="w-4 h-4 fill-amber-300 text-amber-300"></i> Học Vượt Ngày ${curDay + 1}
            </button>
          </div>
        </div>
      `;
    } else if (curStatus.completedCount > 0) {
      noticeArea.innerHTML = `
        <div class="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span class="text-xs font-bold text-amber-300">
              Tiến độ Ngày ${curDay} hôm nay: Đã xong ${curStatus.completedCount} / 3 nhiệm vụ (${Math.round((curStatus.completedCount / 3) * 100)}%)
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs font-medium">
            <span class="${curStatus.vocabDone ? 'text-emerald-400 font-bold' : 'text-slate-400'}">
              ${curStatus.vocabDone ? '✓ Từ vựng (Đã xong)' : '○ Từ vựng'}
            </span>
            <span class="text-slate-600">•</span>
            <span class="${curStatus.readingDone ? 'text-emerald-400 font-bold' : 'text-slate-400'}">
              ${curStatus.readingDone ? '✓ Bài đọc (Đã xong)' : '○ Bài đọc'}
            </span>
            <span class="text-slate-600">•</span>
            <span class="${curStatus.grammarDone ? 'text-emerald-400 font-bold' : 'text-slate-400'}">
              ${curStatus.grammarDone ? '✓ Ngữ pháp (Đã xong)' : '○ Ngữ pháp'}
            </span>
          </div>
        </div>
      `;
    } else {
      noticeArea.innerHTML = `
        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-cyan-400"></i>
            <span>Nhiệm vụ Ngày ${curDay}: Hãy hoàn thành <strong>20 Từ vựng</strong>, <strong>1 Bài đọc</strong> và <strong>1 Bài ngữ pháp</strong> để tự động tick hoàn thành!</span>
          </div>
          <span class="text-[11px] text-amber-400 font-semibold">0 / 3 Hoàn thành</span>
        </div>
      `;
    }
  }

  const infoVocab = getDailyAssignedVocab(curDay);
  const infoReading = getDailyAssignedReading(curDay);
  const infoGrammar = getDailyAssignedGrammar(curDay);

  // 2. Vocab Task Card
  const cardV = document.getElementById("taskCardVocab");
  const bannerV = document.getElementById("taskCardVocabBanner");
  const titleV = document.getElementById("taskTitleVocab");
  const descV = document.getElementById("taskDescVocab");
  const badgeV = document.getElementById("taskStatusBadgeVocab");
  const btnV = document.getElementById("btnStartVocabText");
  const btnWrapV = document.getElementById("btnStartVocabMission");

  if (titleV) titleV.innerText = `20 Từ Vựng Ngày ${curDay} - ${infoVocab.unitTitle}`;
  if (curStatus.vocabDone) {
    if (cardV) cardV.className = "p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-slate-900 border-2 border-emerald-500/70 space-y-3 flex flex-col justify-between transition shadow-lg shadow-emerald-950/30 glow-card-emerald";
    if (bannerV) bannerV.innerHTML = `<div class="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-between border border-emerald-500/40 mb-2"><span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i> ĐÃ HOÀN THÀNH HÔM NAY</span><span class="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded text-white font-bold">20/20 Từ</span></div>`;
    if (descV) descV.innerHTML = `<span class="text-xs text-emerald-300/90 font-medium">✓ Bạn đã học và ghi nhớ trọn vẹn 20 từ của ngày hôm nay. Tiến độ được bảo lưu vĩnh viễn!</span>`;
    if (badgeV) {
      badgeV.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 border border-emerald-500/40";
      badgeV.innerHTML = "<i data-lucide='check' class='w-3.5 h-3.5 text-emerald-400'></i> Đã xong (20/20)";
    }
    if (btnWrapV) btnWrapV.className = "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-1.5 shadow-sm";
    if (btnV) btnV.innerHTML = "<i data-lucide='check-circle-2' class='w-3.5 h-3.5 text-emerald-400'></i> <span>✓ Đã Xong (Bấm để ôn lại)</span>";
  } else {
    if (cardV) cardV.className = "p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between transition hover:border-indigo-500/40 shadow-sm";
    if (bannerV) bannerV.innerHTML = "";
    if (descV) descV.innerHTML = `Lật thẻ học hết 20 từ vựng hôm nay. Hệ thống sẽ <strong>tự động tick hoàn thành</strong> khi bạn học xong thẻ thứ 20!`;
    if (badgeV) {
      badgeV.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-semibold border border-amber-500/20";
      badgeV.innerText = `Tiến độ: ${curStatus.vocabCount}/20`;
    }
    if (btnWrapV) btnWrapV.className = "w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30";
    if (btnV) btnV.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i> <span>Bắt đầu học 20 từ Ngày ${curDay}</span>`;
  }
  // 3. Reading Task Card (3 Bài Đọc Mỗi Ngày)
  const cardR = document.getElementById("taskCardReading");
  const bannerR = document.getElementById("taskCardReadingBanner");
  const titleR = document.getElementById("taskTitleReading");
  const descR = document.getElementById("taskDescReading");
  const badgeR = document.getElementById("taskStatusBadgeReading");
  const btnR = document.getElementById("btnStartReadingText");
  const btnWrapR = document.getElementById("btnStartReadingMission");

  const assignedReadings = getDailyAssignedReadings(curDay);
  const doneReadingsCount = curStatus.readingDoneCount || (curStatus.readingDone ? 3 : 0);
  const completedList = curStatus.completedReadings || [];

  if (titleR) {
    titleR.innerText = `3 Bài Đọc Ngày ${curDay} (${doneReadingsCount}/3 bài xong)`;
  }

  const readingsListContainer = document.getElementById("dailyAssignedReadingsList");
  if (readingsListContainer) {
    readingsListContainer.innerHTML = assignedReadings.map((r, slotIdx) => {
      const isDone = completedList.includes(r.index) || curStatus.readingDone;
      return `
        <div class="p-2 rounded-lg ${isDone ? 'bg-emerald-950/40 border border-emerald-500/40' : 'bg-slate-800/80 border border-slate-700/60'} flex items-center justify-between gap-2 text-xs transition">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-5 h-5 rounded-full ${isDone ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-cyan-500/20 text-cyan-300'} flex items-center justify-center shrink-0 text-[10px]">
              ${isDone ? '✓' : (slotIdx + 1)}
            </span>
            <div class="min-w-0">
              <p class="font-bold text-slate-200 truncate ${isDone ? 'text-emerald-200 line-through decoration-emerald-500/60' : ''}">${r.title}</p>
              <p class="text-[10px] text-slate-400">7 câu (4 Đục lỗ + 3 Đọc hiểu) • Level ${r.level || 'B1'}</p>
            </div>
          </div>
          <button onclick="event.stopPropagation(); startTodayReadingMission(${r.index})" class="px-2.5 py-1 rounded-md ${isDone ? 'bg-slate-700/70 hover:bg-slate-700 text-emerald-300' : 'bg-cyan-600 hover:bg-cyan-500 text-white'} text-[11px] font-bold shrink-0 transition">
            ${isDone ? 'Ôn lại' : 'Làm bài'}
          </button>
        </div>
      `;
    }).join("");
  }

  if (curStatus.readingDone) {
    if (cardR) cardR.className = "p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-slate-900 border-2 border-emerald-500/70 space-y-3 flex flex-col justify-between transition shadow-lg shadow-emerald-950/30 glow-card-emerald";
    if (bannerR) bannerR.innerHTML = `<div class="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-between border border-emerald-500/40 mb-2"><span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i> ĐÃ HOÀN THÀNH HÔM NAY</span><span class="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded text-white font-bold">3/3 Bài Đọc (100%)</span></div>`;
    if (descR) descR.innerHTML = `<span class="text-xs text-emerald-300/90 font-medium">✓ Bạn đã hoàn thành trọn vẹn cả 3 bài đọc chỉ định hôm nay!</span>`;
    if (badgeR) {
      badgeR.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 border border-emerald-500/40";
      badgeR.innerHTML = "<i data-lucide='check' class='w-3.5 h-3.5 text-emerald-400'></i> Đã xong (3/3 Bài)";
    }
    if (btnWrapR) btnWrapR.className = "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-1.5 shadow-sm";
    if (btnR) btnR.innerHTML = "<i data-lucide='check-circle-2' class='w-3.5 h-3.5 text-emerald-400'></i> <span>✓ Đã Xong 3 Bài (Bấm để ôn lại)</span>";
  } else {
    if (cardR) cardR.className = "p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between transition hover:border-cyan-500/40 shadow-sm";
    if (bannerR) bannerR.innerHTML = "";
    if (descR) descR.innerHTML = `Mỗi ngày hoàn thành 3 bài đọc chỉ định (mỗi bài gồm 4 câu đục lỗ + 3 câu đọc hiểu). Hệ thống sẽ <strong>tự động tick hoàn thành</strong> khi bạn trả lời xong cả 3 bài!`;
    if (badgeR) {
      badgeR.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-semibold border border-amber-500/20";
      badgeR.innerText = `Tiến độ: ${doneReadingsCount}/3 bài`;
    }
    if (btnWrapR) btnWrapR.className = "w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/30";
    if (btnR) btnR.innerHTML = `<i data-lucide="book-open" class="w-3.5 h-3.5"></i> <span>Vào làm 3 bài đọc Ngày ${curDay}</span>`;
  }

  // 4. Grammar Task Card
  const cardG = document.getElementById("taskCardGrammar");
  const bannerG = document.getElementById("taskCardGrammarBanner");
  const titleG = document.getElementById("taskTitleGrammar");
  const descG = document.getElementById("taskDescGrammar");
  const badgeG = document.getElementById("taskStatusBadgeGrammar");
  const btnG = document.getElementById("btnStartGrammarText");
  const btnWrapG = document.getElementById("btnStartGrammarMission");

  if (titleG) titleG.innerText = infoGrammar.topic_title || "Chuyên đề hôm nay";
  if (curStatus.grammarDone) {
    if (cardG) cardG.className = "p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-slate-900 border-2 border-emerald-500/70 space-y-3 flex flex-col justify-between transition shadow-lg shadow-emerald-950/30 glow-card-emerald";
    if (bannerG) bannerG.innerHTML = `<div class="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-between border border-emerald-500/40 mb-2"><span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i> ĐÃ HOÀN THÀNH HÔM NAY</span><span class="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded text-white font-bold">100% Đạt</span></div>`;
    if (descG) descG.innerHTML = `<span class="text-xs text-emerald-300/90 font-medium">✓ Bạn đã làm xong các bài tập chuyên đề ngữ pháp hôm nay!</span>`;
    if (badgeG) {
      badgeG.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 border border-emerald-500/40";
      badgeG.innerHTML = "<i data-lucide='check' class='w-3.5 h-3.5 text-emerald-400'></i> Đã hoàn thành";
    }
    if (btnWrapG) btnWrapG.className = "w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-emerald-300 border border-emerald-500/40 transition flex items-center justify-center gap-1.5 shadow-sm";
    if (btnG) btnG.innerHTML = "<i data-lucide='check-circle-2' class='w-3.5 h-3.5 text-emerald-400'></i> <span>✓ Đã Hoàn Thành (Bấm để ôn lại)</span>";
  } else {
    if (cardG) cardG.className = "p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between transition hover:border-purple-500/40 shadow-sm";
    if (bannerG) bannerG.innerHTML = "";
    if (descG) descG.innerHTML = `Làm bài tập điền từ hoặc trắc nghiệm. Hệ thống sẽ <strong>tự động tick hoàn thành</strong> khi bạn làm xong!`;
    if (badgeG) {
      badgeG.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700";
      badgeG.innerText = "Chưa làm";
    }
    if (btnWrapG) btnWrapG.className = "w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30";
    if (btnG) btnG.innerHTML = `<i data-lucide="edit-3" class="w-3.5 h-3.5"></i> <span>Làm bài tập Ngữ pháp Ngày ${curDay}</span>`;
  }

  // 5. Ratio & Progress Bar
  const doneCount = curStatus.completedCount;
  const ratioEl = document.getElementById("missionProgressRatio");
  if (ratioEl) {
    if (doneCount === 3) {
      ratioEl.innerText = "3 / 3 ✓";
      ratioEl.className = "text-xl font-black text-emerald-400 flex items-center gap-1";
    } else {
      ratioEl.innerText = `${doneCount} / 3`;
      ratioEl.className = "text-xl font-black text-amber-400";
    }
  }
  const barEl = document.getElementById("missionProgressBar");
  if (barEl) {
    barEl.style.width = `${(doneCount / 3) * 100}%`;
    if (doneCount === 3) {
      barEl.className = "h-full bg-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-emerald-500/50";
    } else if (doneCount > 0) {
      barEl.className = "h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm";
    } else {
      barEl.className = "h-full bg-slate-700/50 rounded-full transition-all duration-300";
    }
  }

  // 6. Header Goals Checklist
  updateDailyGoalChecklist();

  if (window.lucide) lucide.createIcons();
}

function openRoadmapModal() {
  const modal = document.getElementById("dayRoadmapModal");
  if (modal) {
    renderRoadmapGrid();
    modal.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  }
}

function closeRoadmapModal() {
  const modal = document.getElementById("dayRoadmapModal");
  if (modal) modal.classList.add("hidden");
}

function renderRoadmapGrid() {
  const grid = document.getElementById("roadmapGridContainer");
  if (!grid) return;

  const total = getTotalMissionDays();
  const curDay = missionRegistry.currentDay;

  let html = "";
  for (let i = 1; i <= total; i++) {
    const st = getDayMissionStatus(i);
    const isCur = (i === curDay);
    const info = getDailyAssignedVocab(i);

    let borderClass = "border-slate-800 bg-slate-900/60 text-slate-400";
    let badgeText = "Chưa học";
    let badgeBg = "bg-slate-800 text-slate-500";

    if (st.isAllDone) {
      borderClass = isCur 
        ? "border-emerald-400 ring-2 ring-emerald-400/70 bg-emerald-950/40 text-emerald-200" 
        : "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 glow-card-emerald";
      badgeText = isCur ? "✓ Hôm nay (Xong 3/3)" : "✓ Xong (3/3)";
      badgeBg = "bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40";
    } else if (st.completedCount > 0) {
      borderClass = isCur
        ? "border-amber-400 ring-2 ring-amber-400/70 bg-amber-950/40 text-amber-200"
        : "border-amber-500/60 bg-amber-950/30 text-amber-300 glow-card-amber";
      badgeText = isCur ? `Hôm nay (${st.completedCount}/3)` : `Đang làm (${st.completedCount}/3)`;
      badgeBg = "bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40";
    } else if (isCur) {
      borderClass = "border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-950/30 text-white";
      badgeText = "Hôm nay (Chưa làm)";
      badgeBg = "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30";
    }

    html += `
      <div onclick="jumpToMissionDay(${i}); closeRoadmapModal();" class="p-3 rounded-xl border ${borderClass} hover:border-cyan-400 cursor-pointer transition flex flex-col justify-between space-y-1.5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs ${isCur ? 'text-cyan-300 font-extrabold' : 'text-slate-200'}">Ngày ${i}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full ${badgeBg} font-semibold">${badgeText}</span>
        </div>
        <p class="text-[10px] text-slate-400 line-clamp-1">${info.unitTitle}</p>
        <div class="text-[9px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/60">
          <span class="${st.vocabDone ? 'text-emerald-400 font-bold' : ''}">${st.vocabDone ? '✓ Từ' : '○ Từ'}</span>
          <span class="${st.readingDone ? 'text-emerald-400 font-bold' : ''}">${st.readingDone ? '✓ Đọc' : '○ Đọc'}</span>
          <span class="${st.grammarDone ? 'text-emerald-400 font-bold' : ''}">${st.grammarDone ? '✓ Ngữ pháp' : '○ Ngữ pháp'}</span>
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

// ================= PHÒNG ÔN TẬP TỰ DO (CHỌN UNIT & XÁO TRỘN) =================
function setupReviewSelectors() {
  const units = window.APP_DATA?.units || [];
  const uSel = document.getElementById("reviewUnitSelect");
  if (!uSel) return;

  let html = `<option value="">-- Chọn Unit muốn ôn tập --</option>`;
  units.forEach((u, idx) => {
    html += `<option value="${idx}">${u.unitTitle} (${u.totalWords} từ)</option>`;
  });
  uSel.innerHTML = html;
  uSel.value = "0";
  onReviewUnitChange("0");
  renderReviewShufflePills();
}

function onReviewUnitChange(val) {
  const uIdx = parseInt(val) || 0;
  const unit = window.APP_DATA?.units?.[uIdx];
  const dSel = document.getElementById("reviewDaySelect");
  if (dSel && unit && unit.days) {
    dSel.innerHTML = unit.days.map((d, idx) => `<option value="${idx}">${d.dayTitle}</option>`).join("");
  }
}

function onReviewDayChange(val) {}

function renderReviewShufflePills() {
  const container = document.getElementById("reviewClusterPills");
  if (!container) return;

  let html = "";
  SHUFFLE_4_UNIT_BLOCKS.forEach(b => {
    html += `
      <button onclick="startReviewCluster('${b.id}', ${b.from}, ${b.to})" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1 shrink-0 border border-slate-700">
        <i data-lucide="shuffle" class="w-3.5 h-3.5 text-indigo-400"></i> ${b.label}
      </button>
    `;
  });
  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function startReviewCluster(id, fromU, toU) {
  appState.studyMode = "free_review";
  appState.shuffledRange = [fromU, toU];
  const rawWords = getWordsForUnitRange(fromU, toU);
  appState.activeShuffledCards = shuffleArray(rawWords);
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  const lockedBanner = document.getElementById("dailyMissionLockedBanner");
  if (lockedBanner) lockedBanner.classList.add("hidden");
  const freeArea = document.getElementById("freeReviewSelectorArea");
  if (freeArea) freeArea.classList.remove("hidden");

  const titleEl = document.getElementById("currentUnitTitle");
  if (titleEl) titleEl.innerText = `Ôn tập xáo trộn: Unit ${fromU} – ${toU}`;
  const dayBadge = document.getElementById("currentDayBadge");
  if (dayBadge) dayBadge.innerText = `${rawWords.length} từ`;

  switchTab("flashcard");
  renderFlashcard();
  showToast(`🔀 Đã bắt đầu ôn tập xáo trộn Cụm Unit ${fromU} – ${toU}!`, "info");
}

function startFreeFlashcardReview() {
  const uSel = document.getElementById("reviewUnitSelect");
  const dSel = document.getElementById("reviewDaySelect");
  const uIdx = parseInt(uSel?.value || 0);
  const dVal = dSel?.value || "0";

  appState.studyMode = "free_review";
  appState.currentUnitIndex = uIdx;
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  const unit = window.APP_DATA?.units?.[uIdx];
  if (dVal === "all") {
    const allWords = unit?.days?.flatMap(d => d.words) || [];
    appState.activeShuffledCards = shuffleArray(allWords);
    appState.currentDayIndex = "all";
  } else {
    appState.currentDayIndex = parseInt(dVal);
    appState.activeShuffledCards = [];
  }

  const lockedBanner = document.getElementById("dailyMissionLockedBanner");
  if (lockedBanner) lockedBanner.classList.add("hidden");
  const freeArea = document.getElementById("freeReviewSelectorArea");
  if (freeArea) freeArea.classList.remove("hidden");

  const titleEl = document.getElementById("currentUnitTitle");
  if (titleEl) titleEl.innerText = unit?.unitTitle || "Ôn tập Unit";
  const dayBadge = document.getElementById("currentDayBadge");
  if (dayBadge) dayBadge.innerText = dVal === "all" ? "Toàn bộ Unit" : `Ngày ${parseInt(dVal) + 1}`;

  switchTab("flashcard");
  renderFlashcard();
  showToast(`📚 Đã nạp từ vựng Unit để ôn tập tự do!`, "info");
}

// ================= UNIT & FLASHCARD SYSTEM =================
function setupUnitSelectors() {
  renderShufflePills();
  setupQuizScopeSelector();

  const units = window.APP_DATA?.units || [];
  const unitSelect = document.getElementById("unitSelect");
  if (!unitSelect) return;

  let html = `<optgroup label="🔀 Các cụm 4 Unit xáo trộn">`;
  SHUFFLE_4_UNIT_BLOCKS.forEach(b => {
    const count = getWordsForUnitRange(b.from, b.to).length;
    html += `<option value="${b.id}">🔀 Xáo trộn ${b.label} (${count} từ)</option>`;
  });
  html += `</optgroup><optgroup label="📚 Học theo từng Unit riêng lẻ">`;

  units.forEach((u, idx) => {
    html += `<option value="${idx}">${u.unitTitle} (${u.totalWords} từ)</option>`;
  });
  html += `</optgroup>`;

  unitSelect.innerHTML = html;
  // Default to Unit 1 (index 0)
  unitSelect.value = "0";
  onUnitChange("0");
}

function updateModeButtonsUI(mode) {
  const btnUnit = document.getElementById("modeBtn_unit");
  const activeClasses = ["bg-indigo-600", "text-white", "shadow"];
  const inactiveClasses = ["text-slate-300", "hover:text-white", "hover:bg-slate-800"];

  if (btnUnit) {
    btnUnit.classList.remove(...activeClasses);
    btnUnit.classList.remove("bg-indigo-600", "text-white");
    btnUnit.classList.add(...inactiveClasses);
  }

  SHUFFLE_4_UNIT_BLOCKS.forEach(b => {
    const btn = document.getElementById(`modeBtn_${b.id}`);
    if (btn) {
      btn.classList.remove(...activeClasses);
      btn.classList.remove("bg-indigo-600", "text-white");
      btn.classList.add(...inactiveClasses);
    }
  });

  if (mode && mode.startsWith("shuffle_")) {
    const activeBtn = document.getElementById(`modeBtn_${mode}`);
    if (activeBtn) {
      activeBtn.classList.remove(...inactiveClasses);
      activeBtn.classList.add(...activeClasses);
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  } else if (btnUnit) {
    btnUnit.classList.remove(...inactiveClasses);
    btnUnit.classList.add(...activeClasses);
  }

  if (window.lucide) lucide.createIcons();
}

function switchStudyMode(mode) {
  const unitSelect = document.getElementById("unitSelect");
  if (mode && mode.startsWith("shuffle_")) {
    if (unitSelect) unitSelect.value = mode;
    onUnitChange(mode);
  } else {
    if (unitSelect) {
      if (typeof unitSelect.value === "string" && unitSelect.value.startsWith("shuffle_")) {
        unitSelect.value = "0";
      }
      onUnitChange(unitSelect.value);
    }
  }
}

function onUnitChange(val) {
  const daySelect = document.getElementById("daySelect");

  const m = typeof val === "string" && val.match(/^shuffle_(\d+)_(\d+)$/);
  if (m) {
    const fromU = parseInt(m[1]);
    const toU = parseInt(m[2]);
    appState.studyMode = val;
    appState.shuffledRange = [fromU, toU];
    updateModeButtonsUI(val);

    const rawWords = getWordsForUnitRange(fromU, toU);
    appState.activeShuffledCards = shuffleArray(rawWords);

    const total = appState.activeShuffledCards.length;
    const batchSize = 20;
    const numBatches = Math.ceil(total / batchSize);

    let dayOptions = `<option value="all">Tất cả ${total} từ (Xáo trộn)</option>`;
    for (let b = 0; b < numBatches; b++) {
      const count = Math.min(batchSize, total - b * batchSize);
      dayOptions += `<option value="batch_${b}">Đợt ${b + 1} (${count} từ ngẫu nhiên)</option>`;
    }
    if (daySelect) daySelect.innerHTML = dayOptions;

    onDayChange("all");
    showToast(`Đã xáo trộn Cụm Unit ${fromU} – ${toU} (${total} từ)`, "success");
    return;
  }

  // Regular single unit mode
  appState.studyMode = "unit";
  updateModeButtonsUI("unit");
  appState.currentUnitIndex = parseInt(val) || 0;
  const unit = window.APP_DATA?.units?.[appState.currentUnitIndex];

  if (unit && unit.days && daySelect) {
    daySelect.innerHTML = unit.days.map((d, idx) => `
      <option value="${idx}">${d.dayTitle}</option>
    `).join("");
  }

  onDayChange(0);
}

function onDayChange(dayVal) {
  appState.currentDayIndex = dayVal;
  appState.currentCardIndex = 0;
  appState.isFlipped = false;

  const unitTitleEl = document.getElementById("currentUnitTitle");
  const badgeEl = document.getElementById("currentDayBadge");

  if (appState.studyMode.startsWith("shuffle_")) {
    const [fromU, toU] = appState.shuffledRange;
    if (unitTitleEl) unitTitleEl.innerText = `Xáo trộn: Unit ${fromU} – ${toU}`;
    
    if (badgeEl) {
      if (dayVal === "all") {
        badgeEl.innerText = "Toàn bộ";
      } else {
        const bNum = parseInt(String(dayVal).replace("batch_", "")) + 1;
        badgeEl.innerText = `Đợt ${bNum}`;
      }
    }
  } else {
    const unit = window.APP_DATA?.units?.[appState.currentUnitIndex];
    if (unitTitleEl) unitTitleEl.innerText = unit?.unitTitle || "Unit";
    const dNum = parseInt(dayVal) || 0;
    if (badgeEl) badgeEl.innerText = `Ngày ${dNum + 1}`;
  }

  renderFlashcard();
}

function updateDayProgressBadge() {
  const curWords = getCurrentDayWords();
  const daySelect = document.getElementById("daySelect");
  if (daySelect && appState.studyMode === "unit") {
    const curIdx = appState.currentDayIndex;
    const selectedOpt = daySelect.options[daySelect.selectedIndex];
    const unit = window.APP_DATA?.units?.[appState.currentUnitIndex];
    if (unit && unit.days && unit.days[curIdx]) {
      const day = unit.days[curIdx];
      if (selectedOpt) {
        selectedOpt.textContent = `${day.dayTitle} (${curWords.length} từ)`;
      }
    }
  }
  const badgeEl = document.getElementById("currentDayBadge");
  if (badgeEl && appState.studyMode === "unit") {
    const dNum = parseInt(appState.currentDayIndex) || 0;
    badgeEl.innerText = `Ngày ${dNum + 1} (${curWords.length} từ)`;
  }
}

function getCurrentDayWords() {
  if (appState.studyMode === "custom") {
    return appState.customNotebook || [];
  }
  if (appState.studyMode === "gradual_review" && appState.gradualReviewWords) {
    return appState.gradualReviewWords;
  }
  if (appState.studyMode && appState.studyMode.startsWith("shuffle_")) {
    const total = appState.activeShuffledCards;
    if (appState.currentDayIndex === "all") {
      return total;
    }
    if (typeof appState.currentDayIndex === "string" && appState.currentDayIndex.startsWith("batch_")) {
      const bIdx = parseInt(appState.currentDayIndex.replace("batch_", "")) || 0;
      const batchSize = 20;
      return total.slice(bIdx * batchSize, (bIdx + 1) * batchSize);
    }
    return total;
  }

  // Chế độ lộ trình hàng ngày (Default hoặc daily_locked)
  if (appState.studyMode === "daily_locked" || !appState.studyMode || appState.studyMode === "roadmap") {
    const curDay = missionRegistry.currentDay || 1;
    const dayVocabInfo = getDailyAssignedVocab(curDay);
    const baseWords = dayVocabInfo.words || [];

    if (appState.interleavedConfig && appState.interleavedConfig.enabled && baseWords.length > 0) {
      return getInterleavedDeckForDay(curDay, baseWords);
    }
    return baseWords;
  }

  // Chế độ ôn tập tự do theo Unit lựa chọn từ dropdown
  const unit = window.APP_DATA?.units?.[appState.currentUnitIndex];
  const dIdx = parseInt(appState.currentDayIndex) || 0;
  const day = unit?.days?.[dIdx];
  const baseWords = day?.words || [];

  if (appState.interleavedConfig && appState.interleavedConfig.enabled && baseWords.length > 0) {
    return getInterleavedDeckForDay(dIdx, baseWords);
  }

  return baseWords;
}

function reshuffleCurrentDeck() {
  if (appState.studyMode && appState.studyMode.startsWith("shuffle_")) {
    const [fromU, toU] = appState.shuffledRange;
    const rawWords = getWordsForUnitRange(fromU, toU);
    appState.activeShuffledCards = shuffleArray(rawWords);
  } else {
    const unit = window.APP_DATA?.units?.[appState.currentUnitIndex];
    const dIdx = parseInt(appState.currentDayIndex) || 0;
    if (unit && unit.days && unit.days[dIdx]) {
      unit.days[dIdx].words = shuffleArray(unit.days[dIdx].words);
    }
  }

  appState.currentCardIndex = 0;
  appState.isFlipped = false;
  renderFlashcard();
  showToast("🎲 Đã đảo ngẫu nhiên toàn bộ thứ tự các thẻ từ!", "success");
}

// Helper: Normalize & Format Part of Speech (Loại Từ)
function formatPosLabel(pos) {
  if (!pos) return { vi: "Từ vựng", en: "Word", short: "word", badgeClass: "bg-slate-700/60 text-slate-300 border-slate-600" };
  const p = pos.toLowerCase().trim();
  if (p === "n" || p.startsWith("n ") || p === "noun") {
    return { vi: "Danh từ", en: "Noun", short: "n.", badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40" };
  }
  if (p === "v" || p.startsWith("v ") || p === "verb") {
    return { vi: "Động từ", en: "Verb", short: "v.", badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40" };
  }
  if (p === "a" || p === "adj" || p.startsWith("adj") || p === "adjective") {
    return { vi: "Tính từ", en: "Adjective", short: "adj.", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
  }
  if (p === "adv" || p === "adverb") {
    return { vi: "Trạng từ", en: "Adverb", short: "adv.", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
  }
  if (p === "phr v" || p.includes("phrasal")) {
    return { vi: "Cụm động từ", en: "Phrasal Verb", short: "phr v.", badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
  }
  if (p === "collocation") {
    return { vi: "Cụm từ cố định", en: "Collocation", short: "colloc.", badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
  }
  if (p === "idiom") {
    return { vi: "Thành ngữ", en: "Idiom", short: "idiom", badgeClass: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40" };
  }
  if (p === "np" || p === "phr" || p.includes("phrase")) {
    return { vi: "Cụm từ", en: "Phrase", short: "phr.", badgeClass: "bg-teal-500/20 text-teal-300 border-teal-500/40" };
  }
  return { vi: pos, en: pos, short: pos, badgeClass: "bg-slate-700/60 text-slate-300 border-slate-600" };
}

function formatPronHtml(pron) {
  if (!pron) return '<span class="text-slate-400">/.../</span>';
  let p = pron.trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;

  let inner = p.slice(1, -1);
  // Highlight primary stress ˈ with bold glowing amber mark
  inner = inner.replace(/ˈ/g, '<span class="text-amber-400 font-black text-lg align-baseline px-0.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" title="Nhấn âm chính (Stress)">ˈ</span>');
  // Highlight secondary stress ˌ with cyan mark
  inner = inner.replace(/ˌ/g, '<span class="text-cyan-300 font-bold text-sm align-baseline px-0.5" title="Nhấn âm phụ">ˌ</span>');

  return `<span class="align-middle font-mono tracking-wider">/${inner}/</span>`;
}

function renderFlashcard() {
  const words = getCurrentDayWords();
  const cardElem = document.getElementById("flashcardElement");

  if (!words || words.length === 0) {
    document.getElementById("cardWord").innerText = "Chưa có từ vựng";
    document.getElementById("cardPron").innerText = "-";
    if (document.getElementById("cardMeaningVi")) document.getElementById("cardMeaningVi").innerText = "Hãy chọn ngày khác.";
    if (document.getElementById("cardMeaningEn")) document.getElementById("cardMeaningEn").innerText = "Please select another day.";
    if (document.getElementById("cardDefinition")) document.getElementById("cardDefinition").innerText = "Hãy chọn ngày khác.";
    return;
  }

  if (appState.currentCardIndex >= words.length) {
    appState.currentCardIndex = 0;
  }

  const curWord = words[appState.currentCardIndex];
  appState.isFlipped = false;
  if (cardElem) cardElem.classList.remove("flipped");

  document.getElementById("cardWord").innerText = curWord.word;
  const pronEl = document.getElementById("cardPron");
  if (pronEl) {
    pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30 mr-1.5 align-middle">🇺🇸 US</span>${formatPronHtml(curWord.pron)}`;
  }
  const cambridgeLink = document.getElementById("cardCambridgeLink");
  if (cambridgeLink) {
    cambridgeLink.href = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(curWord.word)}`;
  }
  const posInfo = formatPosLabel(curWord.pos);
  const posBadge = document.getElementById("cardPosBadge");
  if (posBadge) {
    posBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${posInfo.badgeClass}`;
    posBadge.innerHTML = `<span>🏷️</span> <span>${posInfo.vi} (${posInfo.en})</span>`;
  }
  const oldPos = document.getElementById("cardPos");
  if (oldPos) oldPos.innerText = `(${posInfo.short}) • ${curWord.level || "B1"}`;

  const levelBadge = document.getElementById("cardLevelBadge");
  if (levelBadge) {
    levelBadge.innerText = `Level ${curWord.level || "B1"}`;
  }

  const typeTag = document.getElementById("cardTypeTag");
  if (typeTag) {
    if (curWord.cardOrigin === "forgotten") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/25 text-red-300 border-2 border-red-500/60 shadow-lg shadow-red-950/50 flex items-center gap-1.5 animate-pulse";
      typeTag.innerHTML = `<span>❌</span><span>${curWord.cardOriginText || 'Từ đã chọn Quên'}</span>`;
    } else if (curWord.cardOrigin === "skipped") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 border-2 border-amber-500/60 shadow-lg shadow-amber-950/50 flex items-center gap-1.5";
      typeTag.innerHTML = `<span>⏭️</span><span>${curWord.cardOriginText || 'Từ đã bấm Bỏ qua'}</span>`;
    } else if (curWord.cardOrigin === "reading_mistake") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/25 text-rose-300 border-2 border-rose-500/60 shadow-lg shadow-rose-950/40 flex items-center gap-1.5";
      typeTag.innerHTML = `<span>⚠️</span><span>${curWord.cardOriginText || 'Làm sai bài đọc'}</span>`;
    } else if (curWord.cardOrigin === "reading") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1";
      typeTag.innerHTML = `<span>📖</span><span>${curWord.cardOriginText || 'Từ bài đọc'}</span>`;
    } else if (curWord.cardOrigin === "vietnam_today") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm flex items-center gap-1";
      typeTag.innerHTML = `<span>📺</span><span>${curWord.cardOriginText || 'Từ vựng Vietnam Today'}</span>`;
    } else if (curWord.cardOrigin === "custom") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm flex items-center gap-1";
      typeTag.innerHTML = `<span>📘</span><span>${curWord.cardOriginText || 'Sổ tay từ vựng'}</span>`;
    } else if (curWord.cardOrigin === "past_day") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 border-2 border-amber-500/60 shadow-lg shadow-amber-950/40 flex items-center gap-1.5 animate-pulse";
      typeTag.innerHTML = `<span>🔄</span><span>${curWord.cardOriginText || 'Lặp lại từ ngày trước'}</span>`;
    } else if (curWord.cardOrigin === "srs") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm flex items-center gap-1";
      typeTag.innerHTML = `<span>🧠</span><span>${curWord.cardOriginText || 'Cần củng cố'}</span>`;
    } else {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
      typeTag.innerText = curWord.type || "Vocabulary";
    }
  }

  document.getElementById("cardBackWord").innerText = curWord.word;
  const backPos = document.getElementById("cardBackPos");
  if (backPos) {
    backPos.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ml-2 ${posInfo.badgeClass}`;
    backPos.innerHTML = `<span>🏷️</span> <span>${posInfo.vi} (${posInfo.en})</span>`;
  }
  const backLevel = document.getElementById("cardBackLevel");
  if (backLevel) {
    backLevel.innerText = `Level ${curWord.level || "B1"}`;
  }

  const viElem = document.getElementById("cardMeaningVi");
  const enElem = document.getElementById("cardMeaningEn");
  const defElem = document.getElementById("cardDefinition");

  const viText = curWord.meaning_vi || "Đang mở rộng nghĩa...";
  const enText = curWord.meaning_en || "Expanding English definition...";

  if (viElem) viElem.innerText = viText;
  if (enElem) enElem.innerText = enText;
  if (defElem) defElem.innerText = `${viText} • ${enText}`;

  document.getElementById("cardExample").innerText = curWord.example ? `"${curWord.example}"` : `Example with ${curWord.word}.`;

  let counterText = `Thẻ ${appState.currentCardIndex + 1} / ${words.length}`;
  if (appState.interleavedConfig && appState.interleavedConfig.enabled) {
    const todayCount = words.filter(w => w.cardOrigin === "today" || !w.cardOrigin).length;
    const reviewCount = words.length - todayCount;
    if (reviewCount > 0) {
      counterText += ` (${todayCount} từ ngày + ${reviewCount} từ chèn)`;
    }
  }
  document.getElementById("cardCounter").innerText = counterText;
  const pct = Math.round(((appState.currentCardIndex + 1) / words.length) * 100);
  const fcBar = document.getElementById("flashcardProgressBar");
  if (fcBar) {
    fcBar.style.width = `${pct}%`;
    fcBar.className = (pct === 100)
      ? "h-full bg-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-emerald-500/50"
      : "h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-indigo-500/50";
  }

  const progressInfo = document.getElementById("unitProgressInfo");
  if (progressInfo) {
    if (appState.studyMode === "daily_locked") {
      const curStatus = getDayMissionStatus(missionRegistry.currentDay);
      if (curStatus.vocabDone) {
        progressInfo.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> Đã hoàn thành 20/20 từ Ngày ${missionRegistry.currentDay}!</span>`;
      } else {
        progressInfo.innerText = `Tiến độ nhiệm vụ: ${curStatus.vocabCount} / 20 từ đã học`;
      }
    } else {
      progressInfo.innerText = `Chế độ ôn tập: Thẻ ${appState.currentCardIndex + 1} / ${words.length}`;
    }
  }
}

function flipCard() {
  const cardElem = document.getElementById("flashcardElement");
  appState.isFlipped = !appState.isFlipped;
  if (cardElem) cardElem.classList.toggle("flipped", appState.isFlipped);
}

function prevCard() {
  const words = getCurrentDayWords();
  if (words.length <= 1) return;
  appState.currentCardIndex = (appState.currentCardIndex - 1 + words.length) % words.length;
  onVocabCardViewed();
  renderFlashcard();
}

function nextCard() {
  const words = getCurrentDayWords();
  if (words.length <= 1) return;
  appState.currentCardIndex = (appState.currentCardIndex + 1) % words.length;
  onVocabCardViewed();
  renderFlashcard();
}

async function rateSRS(score) {
  const words = getCurrentDayWords();
  if (!words || words.length === 0) return;
  const curWord = words[appState.currentCardIndex];
  if (!curWord) return;

  // Nếu chọn [1] Quên -> Tự động lưu vào danh sách từ quên để ưu tiên ôn tập tích lũy
  if (score === 1) {
    saveForgottenWord(curWord);
  } else if (score >= 4) {
    // Nếu chọn Nhớ hoặc Rất dễ -> Cho tốt nghiệp khỏi danh sách Quên / Bỏ qua
    removeForgottenWord(curWord.word);
    removeSkippedWord(curWord.word);
  }

  // 1. TỰ ĐỘNG CHUYỂN THẺ NGAY LẬP TỨC (0ms latency, không cần bấm thêm nút nào)
  nextCard();

  // 2. Tự động ghi nhận tiến độ học của ngày
  if (appState.studyMode === "daily_locked") {
    const curDay = missionRegistry.currentDay;
    const curStatus = getDayMissionStatus(curDay);
    const studiedCount = appState.dayVocabStudied?.[curDay]?.size || Math.min(20, appState.currentCardIndex + 1);
    const isDone = studiedCount >= Math.min(20, words.length);
    setDayMissionStatus(curDay, {
      vocabCount: studiedCount,
      vocabDone: isDone || curStatus.vocabDone
    });
  }

  // 3. Gửi sự kiện đánh giá độ nhớ (SRS) chạy ngầm không làm gián đoạn lật thẻ
  const clientEventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const payload = {
    item_id: curWord.id || `word_${curWord.word}`,
    test_type: "recognition",
    rating: score,
    used_hint: false,
    response_time_ms: 1200,
    client_event_id: clientEventId,
    device_id: navigator.userAgent.substring(0, 30)
  };

  if (appState.authToken) {
    apiCall("/api/study/rate", "POST", payload).then(res => {
      if (res && res.streak !== undefined) {
        const el = document.getElementById("streakCount");
        if (el) el.innerText = `${res.streak} ngày`;
      }
    }).catch(err => {
      appState.offlineQueue.push({ ...payload, created_at_client: new Date().toISOString() });
      try { localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(appState.offlineQueue)); } catch(e){}
    });
  }
}

async function flushOfflineQueue() {
  if (appState.offlineQueue.length === 0 || !appState.authToken) return;

  const res = await apiCall("/api/sync/events", "POST", {
    device_id: navigator.userAgent.substring(0, 30),
    events: appState.offlineQueue
  });

  if (res && res.success) {
    appState.offlineQueue = [];
    localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
    console.log("Đã đồng bộ hàng đợi ngoại tuyến thành công!");
  }
}

// ================= 25 CHUYÊN ĐỀ NGỮ PHÁP TỔNG ÔN CÔ TRANG ANH =================
async function loadGrammarTopics() {
  const topics = await apiCall("/api/grammar/topics") || (window.APP_DATA?.grammar || []);
  appState.grammarTopics = topics;
  filterGrammarTopics("");
  renderGrammarDetail(1);
}

function filterGrammarTopics(query) {
  const q = (query || "").toLowerCase().trim();
  const topics = appState.grammarTopics || (window.APP_DATA?.grammar || []);
  const nav = document.getElementById("grammarTopicsNav");
  if (!nav) return;

  const filtered = topics.filter((t, idx) => {
    if (!q) return true;
    const title = (t.title || "").toLowerCase();
    const summary = (t.summary || "").toLowerCase();
    const num = String(t.week_number || (idx + 1));
    return title.includes(q) || summary.includes(q) || num.includes(q);
  });

  if (filtered.length === 0) {
    nav.innerHTML = `<p class="text-xs text-slate-500 italic p-2">Không tìm thấy chuyên đề phù hợp.</p>`;
    return;
  }

  nav.innerHTML = filtered.map((t, idx) => {
    const wNum = t.week_number || (idx + 1);
    const isActive = (wNum === appState.activeGrammarWeek);
    const cleanTitle = (t.title || "").replace(/Chuyên đề\s*\d+:\s*/, "");
    return `
      <button onclick="renderGrammarDetail(${wNum})" id="grammar-btn-${wNum}" class="w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}">
        <span class="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px] font-bold shrink-0">${wNum}</span>
        <span class="truncate">${cleanTitle}</span>
      </button>
    `;
  }).join("");

  if (window.lucide) lucide.createIcons();
}

function formatGrammarText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-indigo-300 not-italic font-semibold">$1</em>');
}

async function renderGrammarDetail(weekNum) {
  appState.activeGrammarWeek = weekNum;
  const detail = await apiCall(`/api/grammar/topics/${weekNum}`) || window.APP_DATA?.grammar?.[weekNum - 1];
  if (!detail) return;

  // Update active state in nav
  const topics = appState.grammarTopics || (window.APP_DATA?.grammar || []);
  topics.forEach((t, i) => {
    const w = t.week_number || (i + 1);
    const btn = document.getElementById(`grammar-btn-${w}`);
    if (btn) {
      btn.className = (w === weekNum)
        ? "w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition bg-indigo-600 text-white shadow"
        : "w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition text-slate-300 hover:bg-slate-800";
    }
  });

  document.getElementById("grammarTopicTitle").innerText = detail.title;
  document.getElementById("grammarTopicSummary").innerText = detail.summary || "";

  // 1. Lý thuyết chuyên sâu & Bảng công thức
  const body = document.getElementById("grammarContentBody");
  const sections = detail.sections || [];
  body.innerHTML = sections.map((s, sIdx) => `
    <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
      <h3 class="font-bold text-indigo-300 text-sm sm:text-base flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-extrabold">${sIdx + 1}</span>
        <span>${s.subtitle}</span>
      </h3>
      <div class="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-indigo-500/40">
        ${formatGrammarText(s.content)}
      </div>
    </div>
  `).join("");

  // 2. Bài tập điền từ ngắn vào chỗ trống
  const fbList = document.getElementById("grammarFillBlanksList");
  const fillBlanks = detail.fill_blanks || window.APP_DATA?.grammar?.[weekNum - 1]?.fill_blanks || [];
  if (fbList) {
    if (fillBlanks.length === 0) {
      fbList.innerHTML = `<p class="text-xs text-slate-400 italic">Đang cập nhật thêm bài tập điền từ cho chuyên đề này.</p>`;
    } else {
      fbList.innerHTML = fillBlanks.map((fb, idx) => `
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm" id="gfb-card-${idx}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">${idx + 1}</span>
              Câu hỏi điền từ ngắn
            </span>
            <button onclick="toggleFillBlankHint(${idx})" class="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition font-semibold">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> 💡 Xem gợi ý
            </button>
          </div>
          <p class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">${fb.sentence.replace(/_______/g, `<span class="px-2.5 py-0.5 rounded bg-slate-800 border-b-2 border-emerald-400 font-mono text-emerald-300 text-xs font-bold">[ &nbsp;...&nbsp; ]</span>`)}</p>
          <div id="gfb-hint-${idx}" class="hidden p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            <strong>Gợi ý:</strong> ${fb.hint || "Hãy xem kỹ thì và dạng của động từ trong ngoặc."}
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input type="text" id="gfb-input-${idx}" placeholder="Gõ từ ngắn cần điền vào đây..." class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition" onkeydown="if(event.key==='Enter') checkGrammarFillBlank(${idx})">
            <button onclick="checkGrammarFillBlank(${idx})" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5">
              <span>Kiểm tra</span>
            </button>
          </div>
          <div id="gfb-feedback-${idx}" class="hidden p-3 rounded-xl text-xs sm:text-sm font-medium"></div>
        </div>
      `).join("");
    }
  }

  // 3. Bài tập trắc nghiệm áp dụng
  const qList = document.getElementById("grammarQuizList");
  const quiz = detail.quiz || [];
  if (qList) {
    if (quiz.length === 0) {
      qList.innerHTML = `<p class="text-xs text-slate-400 italic">Đang cập nhật bài tập trắc nghiệm cho chuyên đề này.</p>`;
    } else {
      qList.innerHTML = quiz.map((q, idx) => `
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
          <p class="font-semibold text-xs sm:text-sm text-slate-100">${idx + 1}. ${q.q || q.question}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            ${(q.options || []).map((opt, oIdx) => `
              <button onclick="checkGrammarQuiz(${idx}, ${oIdx})" id="gq-${idx}-opt-${oIdx}" class="text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700/50 transition">
                ${opt.startsWith(String.fromCharCode(65 + oIdx)) ? opt : `${String.fromCharCode(65 + oIdx)}. ${opt}`}
              </button>
            `).join("")}
          </div>
          <div id="gq-feedback-${idx}" class="hidden p-3 rounded-xl bg-slate-800 text-xs text-slate-300 mt-2"></div>
        </div>
      `).join("");
    }
  }

  if (window.lucide) lucide.createIcons();
}

function toggleFillBlankHint(idx) {
  const hintEl = document.getElementById(`gfb-hint-${idx}`);
  if (hintEl) hintEl.classList.toggle("hidden");
}

function checkGrammarFillBlank(idx) {
  const detail = window.APP_DATA?.grammar?.[appState.activeGrammarWeek - 1];
  const fb = detail?.fill_blanks?.[idx];
  if (!fb) return;

  const input = document.getElementById(`gfb-input-${idx}`);
  const feedback = document.getElementById(`gfb-feedback-${idx}`);
  if (!input || !feedback) return;

  const val = input.value.trim().toLowerCase();
  if (!val) {
    showToast("Vui lòng nhập đáp án vào ô trống!", "warning");
    return;
  }

  const answer = (fb.answer || "").trim().toLowerCase();
  const alts = (fb.alternatives || []).map(a => a.trim().toLowerCase());
  const allCorrect = [answer, ...alts];

  const normalize = (s) => s.replace(/['’]/g, "'").replace(/\s+/g, " ").trim();
  const isMatch = allCorrect.some(c => normalize(c) === normalize(val));

  if (!appState.grammarDoneExercises) appState.grammarDoneExercises = new Set();
  appState.grammarDoneExercises.add(`g_${appState.activeGrammarWeek}_fb_${idx}`);
  if (appState.grammarDoneExercises.size >= 2) {
    const curStatus = getDayMissionStatus(missionRegistry.currentDay);
    if (!curStatus.grammarDone) {
      setDayMissionStatus(missionRegistry.currentDay, { grammarDone: true });
      showToast(`🎉 Chúc mừng! Bạn đã hoàn thành các bài tập ngữ pháp hôm nay! Đã tự động đánh dấu hoàn thành!`, "success");
      updateDailyMissionUI();
    }
  }

  if (isMatch) {
    input.classList.remove("border-slate-700", "border-red-500");
    input.classList.add("border-emerald-500", "bg-emerald-950/30", "text-emerald-300");
    feedback.className = "p-3 rounded-xl text-xs sm:text-sm font-medium bg-emerald-950/50 border border-emerald-500/40 text-emerald-300";
    feedback.innerHTML = `<strong>✓ Xuất sắc! Đáp án chính xác:</strong> <span class="font-bold underline">${fb.answer}</span>.<br><span class="text-slate-300 text-xs mt-1 block">${fb.explain || ""}</span>`;
  } else {
    input.classList.remove("border-slate-700", "border-emerald-500");
    input.classList.add("border-red-500", "bg-red-950/30", "text-red-300");
    feedback.className = "p-3 rounded-xl text-xs sm:text-sm font-medium bg-red-950/50 border border-red-500/40 text-red-300";
    feedback.innerHTML = `<strong>✗ Chưa chính xác.</strong> Đáp án đúng là: <span class="font-bold text-amber-300">${fb.answer}</span>.<br><span class="text-slate-300 text-xs mt-1 block">${fb.explain || ""}</span>`;
  }
  feedback.classList.remove("hidden");
}

async function checkGrammarQuiz(qIdx, optIdx) {
  const detail = window.APP_DATA?.grammar?.[appState.activeGrammarWeek - 1];
  const localQ = detail?.quiz?.[qIdx];

  const feedback = document.getElementById(`gq-feedback-${qIdx}`);
  const btn = document.getElementById(`gq-${qIdx}-opt-${optIdx}`);

  if (!appState.grammarDoneExercises) appState.grammarDoneExercises = new Set();
  appState.grammarDoneExercises.add(`g_${appState.activeGrammarWeek}_qz_${qIdx}`);

  // Ghi nhận hoàn thành chuyên đề ngữ pháp theo mục tiêu 2 chuyên đề/ngày
  const curDay = missionRegistry.currentDay || 1;
  const curStatus = getDayMissionStatus(curDay);
  const doneTopics = new Set(curStatus.completedGrammarTopics || []);
  doneTopics.add(appState.activeGrammarWeek);
  const doneList = Array.from(doneTopics);
  const isAllGrammarDone = (doneList.length >= 2) || curStatus.grammarDone;

  setDayMissionStatus(curDay, {
    grammarDoneCount: Math.min(2, doneList.length),
    completedGrammarTopics: doneList,
    grammarDone: isAllGrammarDone
  });

  if (isAllGrammarDone) {
    showToast(`🎉 Chúc mừng! Bạn đã hoàn thành 2 chuyên đề ngữ pháp mục tiêu hôm nay! Đã tự động đánh dấu hoàn thành!`, "success");
  } else {
    showToast(`✓ Đã hoàn thành 1/2 chuyên đề ngữ pháp (${doneList.length}/2). Tiếp tục làm chuyên đề còn lại nhé!`, "info");
  }
  updateDailyMissionUI();
  updateDailyGoalChecklist();

  const res = await apiCall("/api/grammar/quiz-submit", "POST", {
    week_number: appState.activeGrammarWeek,
    answers: [optIdx]
  });

  if (res && res.feedback && res.feedback[0]) {
    const f = res.feedback[0];
    if (f.is_correct) {
      btn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
      feedback.innerHTML = `<span class="text-emerald-400 font-bold">✓ Chính xác!</span> ${f.explain}`;
    } else {
      btn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
      feedback.innerHTML = `<span class="text-red-400 font-bold">✗ Chưa đúng!</span> ${f.explain}`;
    }
    feedback.classList.remove("hidden");
  } else if (localQ) {
    const ansVal = localQ.answer;
    const ansIdx = (typeof ansVal === "string") ? ({"A":0,"B":1,"C":2,"D":3}[ansVal.trim().toUpperCase()] ?? 0) : (ansVal || 0);
    const isCorrect = (optIdx === ansIdx);
    if (isCorrect) {
      btn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
      feedback.innerHTML = `<span class="text-emerald-400 font-bold">✓ Chính xác!</span> ${localQ.explain || ""}`;
    } else {
      btn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
      feedback.innerHTML = `<span class="text-red-400 font-bold">✗ Chưa đúng!</span> ${localQ.explain || ""}`;
    }
    feedback.classList.remove("hidden");
  }
}

// ================= KHO BÀI ĐỌC LUYỆN THI & CLICK-TO-LOOKUP =================
let currentFilteredReadings = [];

function setupReadingSelector() {
  filterReadingByExam("all");
}

function filterReadingByExam(category) {
  appState.activeExamFilter = category || "all";
  const filterBtns = document.querySelectorAll(".exam-filter-btn");
  filterBtns.forEach(btn => {
    btn.classList.remove("active", "bg-indigo-600", "text-white", "shadow");
    btn.classList.add("bg-slate-800", "text-slate-300");
  });
  const activeBtn = document.getElementById(`examBtn_${category}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-800", "text-slate-300");
    activeBtn.classList.add("active", "bg-indigo-600", "text-white", "shadow");
  }
  applyReadingFilters();
}


appState.activeReadingMonthFilter = "all";
appState.activeReadingLevelFilter = "all";

function filterReadingByMonth(month) {
  appState.activeReadingMonthFilter = month || "all";
  const monthBtns = document.querySelectorAll(".month-filter-btn");
  monthBtns.forEach(btn => {
    btn.classList.remove("active", "bg-indigo-600", "text-white", "shadow");
    btn.classList.add("bg-slate-800", "text-slate-300");
  });
  const activeBtn = document.getElementById(`monthBtn_${month}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-800", "text-slate-300");
    activeBtn.classList.add("active", "bg-indigo-600", "text-white", "shadow");
  }
  applyReadingFilters();
}

function filterReadingByLevel(level) {
  appState.activeReadingLevelFilter = level || "all";
  const levelBtns = document.querySelectorAll(".level-filter-btn");
  levelBtns.forEach(btn => {
    btn.classList.remove("active", "bg-cyan-600", "text-white", "shadow");
    btn.classList.add("bg-slate-800", "text-slate-300");
  });
  const activeBtn = document.getElementById(`levelBtn_${level}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-800", "text-slate-300");
    activeBtn.classList.add("active", "bg-cyan-600", "text-white", "shadow");
  }
  applyReadingFilters();
}

function applyReadingFilters() {
  const readings = window.APP_DATA?.readings || [];
  const examCat = appState.activeExamFilter || "all";
  const levelFilter = appState.activeReadingLevelFilter || "all";
  const monthFilter = appState.activeReadingMonthFilter || "all";

  let list = readings.map((r, origIdx) => ({ ...r, origIdx }));

  // 1. Filter by Month (1: Days 1-30, 2: Days 31-60, 3: Days 61-90)
  if (monthFilter !== "all") {
    const mNum = parseInt(monthFilter);
    list = list.filter(r => r.month === mNum);
  }

  // 2. Filter by Level
  if (levelFilter !== "all") {
    list = list.filter(r => (r.level || "B1").toUpperCase() === levelFilter.toUpperCase());
  }

  // 3. Filter by Exam / Category
  if (examCat === "CLOZE") {
    list = list.filter(r => (r.category || "").toUpperCase() === "CLOZE" || (r.title || "").includes("Đục Lỗ") || r.type === "cloze" || r.type === "cloze_and_comprehension");
  } else if (examCat !== "all") {
    list = list.filter(r => (r.category || "").toLowerCase().includes(examCat.toLowerCase()) || (r.title || "").toLowerCase().includes(examCat.toLowerCase()));
  }

  currentFilteredReadings = list;

  const select = document.getElementById("readingSelect");
  if (select) {
    select.innerHTML = currentFilteredReadings.map(r => `
      <option value="${r.origIdx}">[Tháng ${r.month || 1}] [${r.level || 'B1'}] ${r.title.replace(/^Bài \d+:\s*/, "")} (7 câu)</option>
    `).join("");
  }

  const badgeEl = document.getElementById("readingCategoryTagBadge");
  if (badgeEl) {
    const mText = monthFilter === "all" ? "3 Tháng (90 Ngày)" : `Tháng ${monthFilter}`;
    const lText = levelFilter === "all" ? "Tất cả level" : `Level ${levelFilter}`;
    badgeEl.innerText = `${currentFilteredReadings.length} / ${readings.length} Bài (${mText} • ${lText})`;
  }

  if (currentFilteredReadings.length > 0) {
    renderReadingPassage(currentFilteredReadings[0].origIdx);
  }
}


let activePopupWord = "";
let activeContextSentence = "";
let activePopupWordItem = null;

function renderReadingPassage(passageIdx) {
  appState.activeReadingIndex = parseInt(passageIdx) || 0;
  const passage = window.APP_DATA?.readings?.[appState.activeReadingIndex];
  if (!passage) return;

  const select = document.getElementById("readingSelect");
  if (select) select.value = String(appState.activeReadingIndex);

  document.getElementById("readingArticleTitle").innerText = passage.title;
  const examBadge = document.getElementById("readingExamBadge");
  if (examBadge) {
    examBadge.innerText = `[${(passage.category || 'Bài đọc').toUpperCase()}]`;
  }
  document.getElementById("readingUnitTag").innerText = passage.source_reference || `Bài Báo #${appState.activeReadingIndex + 1}`;
  document.getElementById("readingLevelTag").innerText = `Level ${passage.level || "B2"}`;

  // Đọc bài - hoàn thành khi trả lời hết câu hỏi

  const targetWords = (passage.target_words || []).map(w => w.toLowerCase().trim());
  const container = document.getElementById("readingContent");
  container.innerHTML = "";

  const paragraphs = (passage.content || "").split(/\n\n+/);
  paragraphs.forEach(paraText => {
    const pEl = document.createElement("p");
    pEl.className = "mb-4 last:mb-0 leading-relaxed";

    // Split paraText by cloze tokens like [1] ______ or [1]
    const segments = paraText.split(/(\[\d+\](?:\s*_{2,})?)/g);
    segments.forEach(segment => {
      const clozeMatch = segment.match(/^\[(\d+)\](?:\s*_{2,})?$/);
      if (clozeMatch) {
        const slotNum = parseInt(clozeMatch[1]);
        const clozeBtn = document.createElement("button");
        clozeBtn.id = `cloze-slot-${slotNum}`;
        clozeBtn.className = "cloze-slot-pill mx-1 px-3 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/50 hover:bg-indigo-600/50 shadow-sm inline-flex items-center gap-1 transition cursor-pointer text-sm align-middle";
        clozeBtn.innerHTML = `<span>[${slotNum}]</span> <span class="cloze-text underline decoration-indigo-400 italic font-mono">______</span>`;
        clozeBtn.onclick = () => focusReadingQuestion(slotNum - 1);
        pEl.appendChild(clozeBtn);
      } else {
        // Tokenize words for popup translation
        const tokens = segment.split(/(\b[A-Za-z'-]+\b)/);
        tokens.forEach(token => {
          if (/^[A-Za-z'-]+$/.test(token)) {
            const cleanLower = token.toLowerCase();
            const isTarget = targetWords.some(tw => tw === cleanLower || tw.split(/\s+/).includes(cleanLower));

            const span = document.createElement("span");
            span.textContent = token;

            if (isTarget) {
              span.className = "target-word-pill font-bold text-amber-300 bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/30 cursor-pointer hover:bg-amber-500/40 transition shadow-sm inline-block";
              span.title = `Từ trọng tâm: ${token}`;
            } else {
              span.className = "clickable-word cursor-pointer hover:text-amber-300 hover:underline decoration-amber-400 decoration-dotted transition inline-block";
              span.title = `Chạm để tra từ: ${token}`;
            }

            span.addEventListener("click", () => {
              const sentences = paraText.split(/(?<=[.?!])\s+/);
              const foundSent = sentences.find(s => s.toLowerCase().includes(cleanLower)) || paraText;
              showWordPopup(token, foundSent);
            });

            pEl.appendChild(span);
          } else {
            pEl.appendChild(document.createTextNode(token));
          }
        });
      }
    });

    container.appendChild(pEl);
  });

  const qList = document.getElementById("readingQuestionsList");
  const questions = passage.questions || [];
  if (qList) {
    if (questions.length === 0) {
      qList.innerHTML = `<p class="text-xs text-slate-400 italic p-3">Bài đọc này tập trung vào tra cứu từ vựng và ngữ cảnh.</p>`;
    } else {
      qList.innerHTML = questions.map((q, idx) => {
        const qText = q.question || q.q || `Câu hỏi đọc hiểu ${idx + 1}`;
        const correctVal = q.answer;
        const correctIdx = (typeof correctVal === "string") ? ({"A":0,"B":1,"C":2,"D":3}[correctVal.trim().toUpperCase()] ?? 0) : (correctVal || 0);

        const qTypeTag = (idx < 4)
          ? `<span class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">🕳️ Dạng Đục Lỗ [${idx + 1}]</span>`
          : `<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">📖 Dạng Đọc Hiểu & Trả Lời</span>`;

        return `
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 transition-all duration-300" id="rq-card-${idx}">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-bold text-xs text-slate-400">Câu ${idx + 1} / ${questions.length}</span>
              ${qTypeTag}
            </div>
            <p class="font-semibold text-sm text-slate-100">${qText.replace(/\n/g, '<br>')}</p>
            <div class="space-y-1.5 pt-1">
              ${(q.options || []).map((opt, oIdx) => `
                <button onclick="checkReadingQuestion(${idx}, ${oIdx}, ${correctIdx})" id="rq-${idx}-opt-${oIdx}" class="w-full text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700/50 transition">
                  ${opt.startsWith(String.fromCharCode(65 + oIdx)) ? opt : `${String.fromCharCode(65 + oIdx)}. ${opt}`}
                </button>
              `).join("")}
            </div>
            <p id="rq-feedback-${idx}" class="hidden text-xs font-semibold pt-1"></p>
          </div>
        `;
      }).join("");
    }
  }

  if (window.lucide) lucide.createIcons();
}

function focusReadingQuestion(qIdx) {
  const card = document.getElementById(`rq-card-${qIdx}`) || document.getElementById("readingQuestionsList");
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('ring-2', 'ring-indigo-400', 'bg-indigo-950/40');
    setTimeout(() => {
      card.classList.remove('ring-2', 'ring-indigo-400', 'bg-indigo-950/40');
    }, 2000);
  }
}


// ============================================================================
// READING VOCABULARY LOOKUP & MISTAKE-TO-FLASHCARD ENGINE
// ============================================================================
function cleanWordText(raw) {
  if (!raw) return "";
  let clean = raw.replace(/^[A-D]\.\s*/i, "").trim();
  clean = clean.replace(/[.,!?;:()[\]{}'"]+/g, "").trim();
  return clean;
}

function lookupReadingWordInfo(rawWord, contextSentence = "") {
  const clean = cleanWordText(rawWord);
  const lower = clean.toLowerCase();

  // A. Check READING_WORDS_LEXICON
  if (typeof READING_WORDS_LEXICON !== "undefined" && READING_WORDS_LEXICON[lower]) {
    const entry = READING_WORDS_LEXICON[lower];
    return {
      word: clean,
      pos: entry.pos || "Từ vựng (Word)",
      ipa: entry.ipa || `/${lower}/`,
      meaning_vi: entry.meaning_vi || clean,
      example: entry.example || contextSentence || `Example sentence with ${clean}.`
    };
  }

  // B. Check Curriculum Units (2,129 words)
  if (window.APP_DATA && window.APP_DATA.units) {
    for (const u of window.APP_DATA.units) {
      for (const d of u.days || []) {
        for (const w of d.words || []) {
          if (w.word && w.word.toLowerCase() === lower) {
            let posFmt = w.pos || "Từ vựng";
            if (posFmt.includes("n")) posFmt = "Danh từ (Noun)";
            else if (posFmt.includes("v")) posFmt = "Động từ (Verb)";
            else if (posFmt.includes("adj")) posFmt = "Tính từ (Adjective)";
            else if (posFmt.includes("adv")) posFmt = "Phó từ (Adverb)";

            return {
              word: w.word,
              pos: posFmt,
              ipa: w.pron || `/${lower}/`,
              meaning_vi: w.meaning_vi || clean,
              example: w.example || contextSentence || `Example with ${clean}.`
            };
          }
        }
      }
    }
  }

  // C. Check word stemming (e.g. removing -ing, -ed, -s, -es, -ly)
  const stems = [
    lower.replace(/ing$/, ""),
    lower.replace(/ed$/, ""),
    lower.replace(/s$/, ""),
    lower.replace(/es$/, ""),
    lower.replace(/ly$/, "")
  ];
  for (const st of stems) {
    if (st && st.length > 2) {
      if (typeof READING_WORDS_LEXICON !== "undefined" && READING_WORDS_LEXICON[st]) {
        const entry = READING_WORDS_LEXICON[st];
        return {
          word: clean,
          pos: entry.pos || "Từ vựng (Word)",
          ipa: entry.ipa || `/${lower}/`,
          meaning_vi: entry.meaning_vi,
          example: entry.example || contextSentence || `Example context with ${clean}.`
        };
      }
    }
  }

  // D. Check Vietnam Today, Cinema & News dictionaries
  if (typeof VIETNAM_TODAY_VIDEOS !== "undefined") {
    for (const vid of VIETNAM_TODAY_VIDEOS) {
      for (const v of vid.vocabulary || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning,
            example: v.example || contextSentence
          };
        }
      }
    }
  }
  if (typeof BILINGUAL_MOVIES !== "undefined") {
    for (const m of BILINGUAL_MOVIES) {
      for (const v of m.vocabulary || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning_vi || v.meaning,
            example: v.example || contextSentence
          };
        }
      }
    }
  }
  if (typeof BILINGUAL_NEWS_ARTICLES !== "undefined") {
    for (const a of BILINGUAL_NEWS_ARTICLES) {
      for (const v of a.target_vocab || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning_vi,
            example: v.example || contextSentence
          };
        }
      }
    }
  }

  // E. Fallback smart defaults (Never return raw English as Vietnamese meaning)
  return {
    word: clean,
    pos: "Từ vựng (Word)",
    ipa: `/${lower}/`,
    meaning_vi: `Từ vựng: "${clean}"`,
    example: contextSentence || `Example context with ${clean}.`
  };
}

function addReadingMistakeToFlashcard(word, pos, ipa, meaning_vi, example, qIdx, type) {
  const clean = cleanWordText(word);
  const item = {
    word: clean,
    pos: pos || "Từ vựng",
    pron: ipa || `/${clean.toLowerCase()}/`,
    meaning_vi: meaning_vi || clean,
    example: example || `Context from reading: ${clean}`,
    source: "reading_mistake",
    cardOrigin: "reading_mistake",
    cardOriginText: "⚠️ Ôn tập từ làm sai bài đọc",
    type: "word"
  };

  saveCustomWordItem(item);

  // Update button visual
  const btn = document.getElementById(`btn-save-${type}-${qIdx}`);
  if (btn) {
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>✓ Đã lưu</span>`;
    btn.className = "px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-950/40 shrink-0";
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  showToast(`🎉 Đã thêm từ "${clean}" vào bộ Flashcard ôn tập!`, "success");
  if (typeof triggerBackgroundCloudSync === "function") {
    triggerBackgroundCloudSync();
  }
}

function checkReadingQuestion(qIdx, selectedIdx, correctIdx) {
  const selectedBtn = document.getElementById(`rq-${qIdx}-opt-${selectedIdx}`);
  const feedback = document.getElementById(`rq-feedback-${qIdx}`);
  const passage = window.APP_DATA?.readings?.[appState.activeReadingIndex];
  const qData = passage?.questions?.[qIdx];
  // Track answered questions for this passage
  if (!appState.readingAnsweredMap) appState.readingAnsweredMap = {};
  const pIdx = appState.activeReadingIndex;
  if (!appState.readingAnsweredMap[pIdx]) appState.readingAnsweredMap[pIdx] = new Set();
  appState.readingAnsweredMap[pIdx].add(qIdx);

  const totalQuestions = passage?.questions?.length || 7;
  const answeredCount = appState.readingAnsweredMap[pIdx].size;

  // CHỈ TICK HOÀN THÀNH KHI ĐÃ TRẢ LỜI ĐỦ CÁC CÂU HỎI CỦA BÀI
  if (totalQuestions > 0 && answeredCount >= totalQuestions) {
    const curDay = missionRegistry.currentDay;
    const curStatus = getDayMissionStatus(curDay);
    const assignedReadings = getDailyAssignedReadings(curDay);
    const assignedIndices = assignedReadings.map(r => r.index);

    let completedList = [...(curStatus.completedReadings || [])];
    if (!completedList.includes(pIdx)) {
      completedList.push(pIdx);
    }

    const doneAssignedCount = assignedIndices.filter(idx => completedList.includes(idx)).length;
    const isReadingCompleted = (doneAssignedCount >= 1 || completedList.length >= 1);

    setDayMissionStatus(curDay, {
      completedReadings: completedList,
      readingDoneCount: Math.min(1, Math.max(doneAssignedCount, completedList.length)),
      readingDone: isReadingCompleted || curStatus.readingDone
    });

    if (isReadingCompleted) {
      showToast(`🎉 Xuất sắc! Bạn đã hoàn thành bài đọc VSTEP chuẩn quốc tế Ngày ${curDay}! Đã tự động đánh dấu hoàn thành 100%!`, "success");
    } else {
      showToast(`✓ Đã trả lời xong câu hỏi bài đọc!`, "info");
    }
    updateDailyMissionUI();
  }

  const isCorrect = (selectedIdx === correctIdx);
  const correctBtn = document.getElementById(`rq-${qIdx}-opt-${correctIdx}`);

  // Tự động phát âm đáp án được chọn để luyện nghe chuẩn
  if (selectedBtn) {
    const rawOptText = selectedBtn.innerText.replace(/^[A-D]\.\s*/i, "").trim();
    if (typeof speakWord === "function") speakWord(rawOptText);
  }

  if (isCorrect) {
    selectedBtn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
    feedback.innerHTML = `✓ Chính xác! ${qData?.explain || ""}`;
    feedback.className = "text-xs font-semibold text-emerald-400 pt-1";

    const slotEl = document.getElementById(`cloze-slot-${qIdx + 1}`);
    if (slotEl && qData && qData.options && qData.options[selectedIdx]) {
      const optWord = cleanWordText(qData.options[selectedIdx]);
      slotEl.innerHTML = `<span>[${qIdx + 1}]</span> <strong class="text-emerald-300 underline">${optWord}</strong> <span class="text-emerald-400">✓</span>`;
      slotEl.className = "cloze-slot-pill mx-1 px-3 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500 shadow-sm inline-flex items-center gap-1 transition text-sm align-middle animate-pulse";
    }
  } else {
    selectedBtn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
    if (correctBtn) {
      correctBtn.classList.add("border-emerald-500", "bg-emerald-950/20", "text-emerald-300", "ring-1", "ring-emerald-500/50");
    }

    const wrongRaw = qData?.options?.[selectedIdx] || "";
    const correctRaw = qData?.options?.[correctIdx] || "";
    const wrongInfo = lookupReadingWordInfo(wrongRaw, passage?.content);
    const correctInfo = lookupReadingWordInfo(correctRaw, passage?.content);

    feedback.innerHTML = `
      <div class="mt-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/25 to-slate-950 border-2 border-rose-500/40 space-y-3.5 shadow-2xl">
        <div class="flex items-center justify-between text-xs font-bold text-rose-300 border-b border-slate-800 pb-2">
          <span class="flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i>
            <span>Phân tích từ vựng khi chọn sai (Bấm loa nghe & Thêm vào Flashcard để ôn tập)</span>
          </span>
        </div>

        <!-- 1. The Chosen (Wrong) Word Card -->
        <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-2">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold font-mono">❌ Từ bạn chọn</span>
                <span class="text-base font-black text-rose-200 font-mono tracking-wide">${wrongInfo.word}</span>
                <button onclick="speakWord('${wrongInfo.word}')" class="p-1 rounded-lg bg-rose-500/20 text-rose-300 hover:text-white hover:bg-rose-600 transition" title="Nghe phát âm">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
              </div>
              <div class="text-xs text-rose-300/80 font-mono mt-0.5">${wrongInfo.ipa} • <span class="text-slate-300 font-semibold">${wrongInfo.pos}</span></div>
            </div>
            <button id="btn-save-wrong-${qIdx}" onclick="addReadingMistakeToFlashcard('${wrongInfo.word}', '${wrongInfo.pos}', '${wrongInfo.ipa}', '${wrongInfo.meaning_vi}', '${wrongInfo.example}', ${qIdx}, 'wrong')" class="px-2.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/40 transition flex items-center gap-1 active:scale-95 shadow-sm">
              <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
              <span>+ Lưu Flashcard</span>
            </button>
          </div>
          <div class="text-xs text-slate-100 font-medium">🇻🇳 <strong>Nghĩa:</strong> ${wrongInfo.meaning_vi}</div>
          ${wrongInfo.example ? `<div class="text-[11px] text-slate-400 italic">Ví dụ: "${wrongInfo.example}"</div>` : ''}
        </div>

        <!-- 2. The Correct Word Card -->
        <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">✅ Đáp án chính xác</span>
                <span class="text-base font-black text-emerald-300 font-mono tracking-wide">${correctInfo.word}</span>
                <button onclick="speakWord('${correctInfo.word}')" class="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:text-white hover:bg-emerald-600 transition" title="Nghe phát âm">
                  <i data-lucide="volume-2" class="w-4 h-4"></i>
                </button>
              </div>
              <div class="text-xs text-emerald-300/80 font-mono mt-0.5">${correctInfo.ipa} • <span class="text-slate-300 font-semibold">${correctInfo.pos}</span></div>
            </div>
            <button id="btn-save-correct-${qIdx}" onclick="addReadingMistakeToFlashcard('${correctInfo.word}', '${correctInfo.pos}', '${correctInfo.ipa}', '${correctInfo.meaning_vi}', '${correctInfo.example}', ${qIdx}, 'correct')" class="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1 active:scale-95 shadow-sm">
              <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
              <span>+ Lưu Flashcard</span>
            </button>
          </div>
          <div class="text-xs text-slate-100 font-medium">🇻🇳 <strong>Nghĩa:</strong> ${correctInfo.meaning_vi}</div>
          ${correctInfo.example ? `<div class="text-[11px] text-slate-400 italic">Ví dụ: "${correctInfo.example}"</div>` : ''}
        </div>

        <!-- 3. Context Explanation -->
        <div class="p-2.5 rounded-xl bg-slate-800/90 text-xs text-slate-200 border border-slate-700/60 leading-relaxed">
          <strong class="text-amber-300">💡 Giải thích ngữ cảnh:</strong> ${qData?.explain || ""}
        </div>
      </div>
    `;
    feedback.className = "block pt-1";
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  feedback.classList.remove("hidden");
}

async function showWordPopup(wordText, context) {
  const cleanWord = wordText.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
  if (!cleanWord) return;

  activePopupWord = cleanWord;
  activeContextSentence = context || "";
  activePopupAudioUrl = "";

  document.getElementById("popupWord").innerText = cleanWord;
  const pronEl = document.getElementById("popupPron");
  if (pronEl) {
    pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span><span>/.../</span>`;
  }
  document.getElementById("popupPos").innerText = "word";
  document.getElementById("popupMeaningVi").innerText = "Đang tra cứu từ điển US...";
  document.getElementById("popupMeaningEn").innerText = "Searching Cambridge & international database...";
  
  const cambridgeLink = document.getElementById("popupCambridgeLink");
  if (cambridgeLink) {
    cambridgeLink.href = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(cleanWord)}`;
  }

  const ctxBox = document.getElementById("popupContextBox");
  const ctxText = document.getElementById("popupContextText");
  if (ctxText && context) {
    const regex = new RegExp(`\\b(${cleanWord})\\b`, "gi");
    ctxText.innerHTML = `"${context.replace(regex, `<strong class="text-amber-300">$1</strong>`)}"`;
    if (ctxBox) ctxBox.classList.remove("hidden");
  } else if (ctxBox) {
    ctxBox.classList.add("hidden");
  }

  document.getElementById("wordPopupModal").classList.remove("hidden");

  // Call API for authentic US IPA and human US MP3 audio
  try {
    const res = await apiCall(`/api/reading/lookup-word?word=${encodeURIComponent(cleanWord)}`);
    if (res) {
      activePopupAudioUrl = res.audio_us || "";
      activePopupWordItem = {
        word: res.word || cleanWord,
        pos: res.pos || "word",
        pron: res.pron || `/${cleanWord}/`,
        meaning_vi: res.meaning_vi || cleanWord,
        meaning_en: res.meaning_en || `Definition of ${cleanWord}`,
        example: context || res.example || `Example sentence with ${cleanWord}.`
      };

      document.getElementById("popupWord").innerText = res.word || cleanWord;
      if (pronEl) {
        pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span>${formatPronHtml(res.pron || cleanWord)}`;
      }
      document.getElementById("popupPos").innerText = res.pos || "word";
      document.getElementById("popupMeaningVi").innerText = res.meaning_vi || cleanWord;
      document.getElementById("popupMeaningEn").innerText = res.meaning_en || `Definition of ${cleanWord}.`;
      return;
    }
  } catch (e) {
    console.warn("API lookup fallback to local:", e);
  }

  // Fallback to local rich dictionaries & lexicon
  const localInfo = lookupReadingWordInfo(cleanWord, context);
  if (localInfo && localInfo.meaning_vi && localInfo.meaning_vi.toLowerCase() !== cleanWord.toLowerCase() && !localInfo.meaning_vi.includes("Từ vựng trong bài đọc")) {
    activePopupWordItem = {
      word: localInfo.word || cleanWord,
      pos: localInfo.pos || "Từ vựng",
      pron: localInfo.ipa || `/${cleanWord}/`,
      meaning_vi: localInfo.meaning_vi,
      meaning_en: `Context definition for "${cleanWord}"`,
      example: localInfo.example || context || `Example with ${cleanWord}.`
    };
    document.getElementById("popupWord").innerText = activePopupWordItem.word;
    if (pronEl) {
      pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span>${formatPronHtml(activePopupWordItem.pron || cleanWord)}`;
    }
    document.getElementById("popupPos").innerText = activePopupWordItem.pos || "word";
    document.getElementById("popupMeaningVi").innerText = activePopupWordItem.meaning_vi;
    document.getElementById("popupMeaningEn").innerText = activePopupWordItem.meaning_en;
    return;
  }

  // Instant Client-side Realtime Translation Engine
  if (typeof translateWordClient === "function") {
    const trans = await translateWordClient(cleanWord, context);
    if (trans && trans.meaning_vi && trans.meaning_vi.toLowerCase() !== cleanWord.toLowerCase()) {
      activePopupWordItem = {
        word: trans.word || cleanWord,
        pos: trans.pos || "Từ vựng",
        pron: trans.ipa || `/${cleanWord}/`,
        meaning_vi: trans.meaning_vi,
        meaning_en: `English definition of "${cleanWord}"`,
        example: trans.example || context || `Example with "${cleanWord}".`
      };
      document.getElementById("popupWord").innerText = activePopupWordItem.word;
      if (pronEl) {
        pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span>${formatPronHtml(activePopupWordItem.pron || cleanWord)}`;
      }
      document.getElementById("popupPos").innerText = activePopupWordItem.pos || "word";
      document.getElementById("popupMeaningVi").innerText = activePopupWordItem.meaning_vi;
      document.getElementById("popupMeaningEn").innerText = `Context: "${cleanWord}"`;
      return;
    }
  }

  let found = null;
  if (window.APP_DATA && window.APP_DATA.units) {
    for (const u of window.APP_DATA.units) {
      for (const d of u.days || []) {
        const match = d.words?.find(w => w.word && w.word.toLowerCase() === cleanWord.toLowerCase());
        if (match) { found = match; break; }
      }
      if (found) break;
    }
  }

  if (found) {
    activePopupWordItem = {
      word: found.word,
      pos: found.pos || "word",
      pron: found.pron || `/${cleanWord}/`,
      meaning_vi: found.meaning_vi || "Từ vựng trọng tâm bài đọc",
      meaning_en: found.meaning_en || "English definition available.",
      example: found.example || context
    };
    document.getElementById("popupWord").innerText = found.word;
    if (pronEl) {
      pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span>${formatPronHtml(found.pron || cleanWord)}`;
    }
    document.getElementById("popupPos").innerText = found.pos || "word";
    document.getElementById("popupMeaningVi").innerText = found.meaning_vi || "Từ vựng trọng tâm bài đọc";
    document.getElementById("popupMeaningEn").innerText = found.meaning_en || "English definition available.";
  } else {
    document.getElementById("popupMeaningVi").innerText = `Từ vựng trong bài đọc: "${cleanWord}" (Bấm liên kết Cambridge để xem phiên âm & định nghĩa chuẩn)`;
    document.getElementById("popupMeaningEn").innerText = `Context: ${context || cleanWord}`;
  }
}

let activePopupAudioUrl = "";

function speakPopupWord() {
  if (activePopupAudioUrl) {
    try {
      const audio = new Audio(activePopupAudioUrl);
      audio.play().catch(() => speakText(activePopupWord));
      return;
    } catch (e) {}
  }
  speakText(activePopupWord);
}

function closeWordPopup() {
  document.getElementById("wordPopupModal").classList.add("hidden");
}

async function addPopupWordToCurrentDay() {
  if (!activePopupWordItem) return;

  const curWords = getCurrentDayWords();
  const curUnit = window.APP_DATA?.units?.[appState.currentUnitIndex];
  const curDayNumber = appState.currentDayIndex + 1;

  // Check duplicate
  const exists = curWords.some(w => w.word.toLowerCase() === activePopupWordItem.word.toLowerCase());
  if (exists) {
    showToast(`Từ "${activePopupWordItem.word}" đã có sẵn trong ngày học này rồi!`, "warning");
    closeWordPopup();
    return;
  }

  const payload = {
    word: activePopupWordItem.word,
    pos: activePopupWordItem.pos || "word",
    pron: activePopupWordItem.pron || `/${activePopupWordItem.word}/`,
    meaning_vi: activePopupWordItem.meaning_vi,
    meaning_en: activePopupWordItem.meaning_en,
    example: activePopupWordItem.example || activeContextSentence,
    unit_title: curUnit?.unitTitle || "Bài học cá nhân",
    day_number: curDayNumber
  };

  // 1. Save to persistent custom storage
  const newItem = saveCustomWordItem({
    ...payload,
    type: "word",
    level: "B1+",
    source: "reading"
  });
  curWords.push(newItem);
  appState.activeInterleavedDeck = null;

  // 2. Persist to server if available
  if (appState.authToken) {
    apiCall("/api/study/add-to-day", "POST", payload).catch(err => console.warn(err));
  }

  // 3. Re-render flashcard deck & update badge
  renderFlashcard();
  updateDayProgressBadge();
  closeWordPopup();

  showToast(`🎉 Đã thêm từ "${newItem.word}" vào Ngày ${curDayNumber} thành công! Bạn có thể lật thẻ ôn ngay!`, "success");
}

async function saveCurrentPopupWord(saveType) {
  // Save to persistent local storage immediately
  saveCustomWordItem({
    word: activePopupWord,
    pos: activePopupWordItem?.pos || "word",
    pron: activePopupWordItem?.pron || `/${activePopupWord}/`,
    meaning_vi: activePopupWordItem?.meaning_vi || activePopupWord,
    meaning_en: activePopupWordItem?.meaning_en || `Definition of ${activePopupWord}`,
    example: activeContextSentence || activePopupWordItem?.example || `Example with ${activePopupWord}.`,
    source: "reading"
  });

  const res = await apiCall("/api/reading/save-word", "POST", {
    word_or_phrase: activePopupWord,
    context_sentence: activeContextSentence,
    passage_id: appState.activeReadingIndex + 1,
    save_type: saveType
  });

  closeWordPopup();
  showToast(res?.message || `📖 Đã lưu "${activePopupWord}" vào sổ tay & sẵn sàng chèn ôn tập!`, "success");
  if (appState.interleavedConfig && appState.interleavedConfig.enabled) {
    appState.activeInterleavedDeck = null;
    renderFlashcard();
  }
}

function speakPopupWord() {
  if (activePopupAudioUrl) {
    speakText(activePopupWord, activePopupAudioUrl);
  } else if (activePopupWord) {
    speakText(activePopupWord);
  }
}

function readAloudPassage() {
  const passage = window.APP_DATA?.readings?.[appState.activeReadingIndex];
  if (passage) speakText(passage.content);
}

// ================= CUSTOM WORD CREATION MODAL =================
function openAddWordModal() {
  document.getElementById("newWordInput").value = "";
  document.getElementById("newWordPos").value = "word";
  document.getElementById("newWordPron").value = "";
  document.getElementById("newWordMeaningVi").value = "";
  document.getElementById("newWordMeaningEn").value = "";
  document.getElementById("newWordExample").value = "";
  document.getElementById("addWordModal").classList.remove("hidden");
  document.getElementById("newWordInput").focus();
}

function closeAddWordModal() {
  document.getElementById("addWordModal").classList.add("hidden");
}

async function autoLookupNewWord() {
  const word = document.getElementById("newWordInput").value.trim();
  if (!word) {
    showToast("Vui lòng nhập từ tiếng Anh trước khi tra!", "warning");
    return;
  }

  showToast(`Đang tự động tra nghĩa cho "${word}"...`, "info");
  try {
    const res = await apiCall(`/api/reading/lookup-word?word=${encodeURIComponent(word)}`);
    if (res) {
      if (res.pos) document.getElementById("newWordPos").value = res.pos;
      if (res.pron) document.getElementById("newWordPron").value = res.pron;
      if (res.meaning_vi) document.getElementById("newWordMeaningVi").value = res.meaning_vi;
      if (res.meaning_en) document.getElementById("newWordMeaningEn").value = res.meaning_en;
      if (res.example) document.getElementById("newWordExample").value = res.example;
      showToast(`Đã tự động điền nghĩa và phát âm cho "${word}"!`, "success");
    }
  } catch (e) {
    showToast("Không tìm thấy tự động, vui lòng tự nhập nghĩa!", "warning");
  }
}

async function submitNewWordToDay() {
  const word = document.getElementById("newWordInput").value.trim();
  const meaningVi = document.getElementById("newWordMeaningVi").value.trim();
  const meaningEn = document.getElementById("newWordMeaningEn").value.trim();
  const pos = document.getElementById("newWordPos").value.trim() || "word";
  const pron = document.getElementById("newWordPron").value.trim() || `/${word}/`;
  const example = document.getElementById("newWordExample").value.trim();

  if (!word || !meaningVi) {
    showToast("Vui lòng nhập đầy đủ từ tiếng Anh và nghĩa tiếng Việt!", "warning");
    return;
  }

  const curWords = getCurrentDayWords();
  const curUnit = window.APP_DATA?.units?.[appState.currentUnitIndex];
  const curDayNumber = appState.currentDayIndex + 1;

  const payload = {
    word,
    pos,
    pron,
    meaning_vi: meaningVi,
    meaning_en: meaningEn || `Definition of ${word}`,
    example: example || `Example sentence with ${word}.`,
    unit_title: curUnit?.unitTitle || "Bài học cá nhân",
    day_number: curDayNumber
  };

  // Save to persistent custom storage
  const newItem = saveCustomWordItem({
    ...payload,
    type: "word",
    level: "B1+",
    source: "manual"
  });
  curWords.push(newItem);
  appState.activeInterleavedDeck = null;

  // Sync with server if logged in
  if (appState.authToken) {
    apiCall("/api/study/add-to-day", "POST", payload).catch(err => console.warn(err));
  }

  renderFlashcard();
  updateDayProgressBadge();
  closeAddWordModal();

  showToast(`🎉 Đã thêm thành công từ "${word}" vào Ngày ${curDayNumber}! Bạn có thể luyện thẻ ngay!`, "success");
}

// ================= DAILY REVIEW QUIZ =================
function generateDailyQuiz() {
  const scopeEl = document.getElementById("quizScopeSelect");
  const scope = scopeEl ? scopeEl.value : "just_studied";

  let words = [];
  if (scope === "just_studied") {
    words = getCurrentDayWords();
    if (!words || words.length === 0) {
      const curU = window.APP_DATA?.units?.[appState.currentUnitIndex];
      words = curU ? curU.days.flatMap(d => d.words) : [];
    }
  } else if (scope === "current_unit") {
    const curU = window.APP_DATA?.units?.[appState.currentUnitIndex];
    words = curU ? curU.days.flatMap(d => d.words) : [];
  } else if (scope === "today") {
    if (appState.todayQueue && appState.todayQueue.length > 0) {
      words = appState.todayQueue;
    } else {
      words = getCurrentDayWords();
    }
  } else if (scope === "shuffle_all") {
    words = window.APP_DATA?.units ? window.APP_DATA.units.flatMap(u => u.days.flatMap(d => d.words)) : [];
  } else {
    const m = typeof scope === "string" && scope.match(/^shuffle_(\d+)_(\d+)$/);
    if (m) {
      words = getWordsForUnitRange(parseInt(m[1]), parseInt(m[2]));
    } else {
      words = getCurrentDayWords();
    }
  }

  const container = document.getElementById("quizContainer");
  const resultBox = document.getElementById("quizResultBox");
  if (resultBox) resultBox.classList.add("hidden");

  if (!words || words.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400 glass-panel rounded-2xl">Chưa có từ vựng phù hợp để tạo đề ôn tập. Hãy chọn bài học khác!</div>`;
    return;
  }

  dailyQuizScore = 0;
  answeredQuestions = new Set();

  // Quantity limit
  const countEl = document.getElementById("quizCountSelect");
  const countVal = countEl ? countEl.value : "all";
  const maxQ = countVal === "all" ? words.length : Math.min(parseInt(countVal), words.length);

  // Deep shuffle words
  const quizPool = shuffleArray([...words]).slice(0, maxQ);
  const allGlobalWords = (window.APP_DATA?.units || []).flatMap(u => u.days.flatMap(d => d.words));

  let questionsHtml = `
    <div class="flex items-center justify-between px-2 text-xs text-slate-400">
      <span>Đang ôn luyện <strong class="text-indigo-400">${quizPool.length} từ vựng</strong> (Đã xáo trộn ngẫu nhiên)</span>
      <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">100% Đầy đủ từ</span>
    </div>
  `;

  quizPool.forEach((item, qIdx) => {
    // Random question type: 0: EN -> VI, 1: VI -> EN, 2: Context fill-in
    const hasExample = item.example && item.example.toLowerCase().includes(item.word.toLowerCase());
    const qType = hasExample ? (qIdx % 3) : (qIdx % 2);

    let questionTitle = "";
    let questionSubtitle = "";
    let options = [];
    let correctOptionIdx = 0;

    if (qType === 0) {
      // Type 0: Cho từ tiếng Anh -> Tìm nghĩa tiếng Việt
      questionTitle = `Nghĩa tiếng Việt của từ / cụm từ <span class="text-amber-300 font-bold">"${item.word}"</span> là gì?`;
      questionSubtitle = item.pron ? `Phát âm: ${formatPronHtml(item.pron)} • (${item.pos || "word"})` : `(${item.pos || "word"})`;
      
      const distractors = allGlobalWords
        .filter(w => w.word !== item.word && w.meaning_vi)
        .map(w => w.meaning_vi)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const correctMeaning = item.meaning_vi || item.meaning_en;
      options = [correctMeaning, ...distractors].sort(() => 0.5 - Math.random());
      correctOptionIdx = options.indexOf(correctMeaning);
    } else if (qType === 1) {
      // Type 1: Cho nghĩa tiếng Việt -> Chọn từ tiếng Anh
      const cleanMeaning = (item.meaning_vi || item.meaning_en).split("(")[0].trim();
      questionTitle = `Từ hoặc cụm từ tiếng Anh nào có nghĩa là: <span class="text-emerald-300 font-bold">"${cleanMeaning}"</span>?`;
      questionSubtitle = `Định nghĩa EN: <em class="text-slate-300 not-italic font-medium">${item.meaning_en || "Vocabulary review"}</em>`;

      const distractors = allGlobalWords
        .filter(w => w.word !== item.word)
        .map(w => w.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [item.word, ...distractors].sort(() => 0.5 - Math.random());
      correctOptionIdx = options.indexOf(item.word);
    } else {
      // Type 2: Context sentence cloze
      const regex = new RegExp(item.word, "gi");
      const masked = item.example.replace(regex, `<span class="px-2 py-0.5 rounded bg-slate-800 border-b-2 border-indigo-400 font-mono text-indigo-300 font-bold">[ ... ]</span>`);
      questionTitle = `Chọn từ thích hợp để hoàn thiện câu sau:`;
      questionSubtitle = `"${masked}"`;

      const distractors = allGlobalWords
        .filter(w => w.word !== item.word)
        .map(w => w.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [item.word, ...distractors].sort(() => 0.5 - Math.random());
      correctOptionIdx = options.indexOf(item.word);
    }

    questionsHtml += `
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-sm" id="quiz-card-${qIdx}">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">${qIdx + 1}</span>
            Câu hỏi ${qIdx + 1} / ${quizPool.length}
          </span>
          <div class="flex items-center gap-2">
            <button onclick="speakText('${item.word}')" class="text-slate-400 hover:text-white transition p-1" title="Nghe phát âm">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </button>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">${item.type || "Từ vựng"}</span>
          </div>
        </div>
        <div>
          <p class="text-sm sm:text-base font-semibold text-white leading-relaxed">${questionTitle}</p>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">${questionSubtitle}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          ${options.map((opt, oIdx) => `
            <button onclick="checkQuizAnswer(${qIdx}, ${oIdx}, ${correctOptionIdx}, '${item.id}')" id="q-${qIdx}-opt-${oIdx}" class="text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs sm:text-sm text-slate-200 border border-slate-700/60 transition flex items-start gap-2">
              <span class="font-bold text-indigo-400">${String.fromCharCode(65 + oIdx)}.</span>
              <span class="flex-1">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div id="q-${qIdx}-feedback" class="hidden text-xs sm:text-sm font-medium p-3 rounded-xl"></div>
      </div>
    `;
  });

  container.innerHTML = questionsHtml;
  lucide.createIcons();
}

let dailyQuizScore = 0;
let answeredQuestions = new Set();

function checkQuizAnswer(qIdx, selectedIdx, correctIdx, wordId) {
  if (answeredQuestions.has(qIdx)) return;
  answeredQuestions.add(qIdx);

  const selectedBtn = document.getElementById(`q-${qIdx}-opt-${selectedIdx}`);
  const correctBtn = document.getElementById(`q-${qIdx}-opt-${correctIdx}`);
  const feedback = document.getElementById(`q-${qIdx}-feedback`);

  if (selectedIdx === correctIdx) {
    selectedBtn.classList.remove("bg-slate-800", "border-slate-700/60");
    selectedBtn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
    feedback.innerHTML = `<span class="text-emerald-400 font-bold">✓ Chính xác! Rất tuyệt vời.</span>`;
    feedback.className = "text-xs sm:text-sm font-semibold p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300";
    dailyQuizScore++;
  } else {
    selectedBtn.classList.remove("bg-slate-800", "border-slate-700/60");
    selectedBtn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
    correctBtn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
    feedback.innerHTML = `<span class="text-red-400 font-bold">✗ Chưa đúng!</span> Đáp án chính xác đã được tô xanh viền nổi bật.`;
    feedback.className = "text-xs sm:text-sm font-semibold p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300";
  }
  feedback.classList.remove("hidden");

  const totalQuestions = document.querySelectorAll("[id^='quiz-card-']").length;
  if (answeredQuestions.size >= totalQuestions) {
    const resultBox = document.getElementById("quizResultBox");
    const scoreText = document.getElementById("quizScoreText");
    if (resultBox && scoreText) {
      const pct = Math.round((dailyQuizScore / totalQuestions) * 100);
      scoreText.innerHTML = `
        <div class="text-3xl font-extrabold text-amber-400 mb-1">${dailyQuizScore} / ${totalQuestions} điểm (${pct}%)</div>
        <div class="text-xs text-slate-300">${pct >= 80 ? '🎉 Xuất sắc! Bạn đã nắm vững toàn bộ các từ vừa học!' : '💪 Bạn đã hoàn thành đợt ôn tập. Hãy bấm xáo trộn để luyện thêm lần nữa!'}</div>
        <div class="pt-3">
          <button onclick="generateDailyQuiz()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30">
            🎲 Xáo trộn lại toàn bộ để ôn đợt mới
          </button>
        </div>
      `;
      resultBox.classList.remove("hidden");
    }

    // Trigger daily checkin upon quiz completion
    triggerDailyCheckin();
  }
}

// ================= PROFILE & ANALYTICS =================
async function loadProfileAnalytics() {
  const streakVal = localStorage.getItem("EMH_STREAK") || (appState.currentUser?.streak_count || 1);
  const profileStreakEl = document.getElementById("statStreakDisplay");
  if (profileStreakEl) profileStreakEl.innerText = `${streakVal} ngày 🔥`;

  const stats = await apiCall("/api/stats/summary");
  if (stats) {
    document.getElementById("statTotalStarted").innerText = stats.cards.total_started;
    document.getElementById("statMature").innerText = stats.cards.mature;
    document.getElementById("statLearning").innerText = stats.cards.learning;
    document.getElementById("metricRetention").innerText = `${stats.retention_rate_pct}%`;
  }

  const sessions = await apiCall("/api/auth/sessions") || [];
  const list = document.getElementById("sessionsList");
  if (list) {
    list.innerHTML = sessions.map(s => `
      <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-white">${s.device_name}</div>
          <div class="text-slate-400 text-[11px] mt-0.5">Hoạt động: ${new Date(s.last_active).toLocaleString('vi-VN')}</div>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">Đang kết nối</span>
      </div>
    `).join("");
  }
}

async function exportPersonalData() {
  const data = await apiCall("/api/auth/export-data");
  if (!data) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `english_mastery_user_data_${new Date().toISOString().slice(0, 10)}.json`);
  a.click();
}

// ================= SPEECH & TOUCH =================
function speakCurrentWord() {
  const words = getCurrentDayWords();
  if (words && words[appState.currentCardIndex]) {
    speakText(words[appState.currentCardIndex].word);
  }
}

// BỘ PHÁT ÂM TIẾNG ANH CHUẨN US ĐA TẦNG (TỪ ĐIỂN QUỐC TẾ + WEB SPEECH API)
function speakWord(text, audioUrl) {
  if (!text) return;
  speakText(text, audioUrl);
}

function speakText(text, audioUrl) {
  if (!text) return;
  const clean = text.trim().replace(/^[^a-zA-Z\s'-]+|[^a-zA-Z\s'-]+$/g, "");
  if (!clean) return;

  // 1. Nếu có audioUrl trực tiếp
  if (audioUrl) {
    try {
      const snd = new Audio(audioUrl);
      snd.play().catch(() => playNativeDictAudio(clean));
      return;
    } catch (e) {}
  }

  // 2. Phát âm bằng Audio Stream chuẩn US từ hệ thống Từ Điển
  playNativeDictAudio(clean);
}

function playNativeDictAudio(word) {
  const firstWord = word.trim().split(/\s+/)[0] || word;
  const usAudioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(firstWord)}&type=2`;
  const audio = new Audio(usAudioUrl);
  audio.play().catch(() => {
    // 3. Fallback mượt mà sang Web Speech Synthesis
    speakWithSynthesis(word);
  });
}

function speakWithSynthesis(text) {
  if (!("speechSynthesis" in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices() || [];
    const usVoice = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("US") || v.name.includes("David") || v.name.includes("Zira")));
    if (usVoice) u.voice = usVoice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}

function setupTouchAndKeyboard() {
  window.addEventListener("keydown", (e) => {
    // Không can thiệp khi đang nhập liệu trong ô input / textarea
    if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;

    if (appState.activeTab !== "flashcard") return;

    // PHÍM BẤM CTRL (HOẶC PHÍM S): TỰ ĐỘNG PHÁT ÂM ĐỌC TỪ FLASHCARD
    if (e.key === "Control" || e.code === "ControlLeft" || e.code === "ControlRight") {
      speakCurrentWord();
      return;
    }

    if (e.code === "Space") {
      e.preventDefault();
      flipCard();
    } else if (e.code === "ArrowRight") {
      nextCard();
    } else if (e.code === "ArrowLeft") {
      prevCard();
    } else if (["Digit1", "Numpad1"].includes(e.code)) {
      rateSRS(1); // [1] Quên -> Tự chuyển
    } else if (["Digit2", "Numpad2"].includes(e.code)) {
      rateSRS(2); // [2] Khó -> Tự chuyển
    } else if (["Digit3", "Numpad3"].includes(e.code)) {
      rateSRS(3); // [3] Trung bình -> Tự chuyển
    } else if (["Digit4", "Numpad4"].includes(e.code)) {
      rateSRS(4); // [4] Nhớ -> Tự chuyển
    } else if (["Digit5", "Numpad5"].includes(e.code)) {
      rateSRS(5); // [5] Rất dễ -> Tự chuyển
    } else if (e.code === "KeyB") {
      skipCurrentCard(); // Phím B: Bỏ qua (đưa vào ôn tập tích lũy)
    } else if (e.code === "KeyS") {
      speakCurrentWord();
    }
  });
}

// ================= DAILY DEADLINE & MOBILE NOTIFICATION ENGINE =================
const DEADLINE_STORAGE_KEY = "english_mastery_deadline_settings";
let deadlineSettings = {
  deadlineTime: "21:30",
  remindMorning: true,
  remindEvening: true,
  remindDeadline: true,
  soundAlert: true
};

function initDailyDeadlineSystem() {
  try {
    const saved = localStorage.getItem(DEADLINE_STORAGE_KEY);
    if (saved) {
      deadlineSettings = { ...deadlineSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not load deadline settings", e);
  }

  updateDeadlineTimeUI();
  updateNotificationStatusBadge();

  // Start continuous 1-second countdown and notification scheduler
  setInterval(tickDeadlineCountdown, 1000);
  tickDeadlineCountdown();
}

function updateDeadlineTimeUI() {
  const textEl = document.getElementById("deadlineTargetTimeText");
  if (textEl) {
    textEl.innerHTML = `Hạn chót: <strong class="text-amber-300 font-mono">${deadlineSettings.deadlineTime}</strong>`;
  }
}

function updateNotificationStatusBadge() {
  const badge = document.getElementById("notificationStatusBadge");
  if (!badge) return;

  if (!("Notification" in window)) {
    badge.innerHTML = `<i data-lucide="bell-off" class="w-3 h-3 text-slate-400"></i> <span>Trình duyệt không hỗ trợ Push</span>`;
    badge.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700";
    return;
  }

  if (Notification.permission === "granted") {
    badge.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> <span>✅ Đã bật chuông nhắc điện thoại</span>`;
    badge.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer";
  } else if (Notification.permission === "denied") {
    badge.innerHTML = `<i data-lucide="alert-triangle" class="w-3 h-3 text-red-400"></i> <span>⚠️ Quyền thông báo bị chặn (Mở cài đặt để bật)</span>`;
    badge.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold cursor-pointer";
  } else {
    badge.innerHTML = `<i data-lucide="bell-ring" class="w-3 h-3 text-amber-300 animate-bounce"></i> <span>🔔 Bấm để bật chuông nhắc điện thoại</span>`;
    badge.className = "text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition cursor-pointer";
  }
  if (window.lucide) lucide.createIcons();
}

let lastNotificationDay = "";
let sentNotificationsToday = new Set();

function tickDeadlineCountdown() {
  const now = new Date();
  const todayDateStr = now.toISOString().split("T")[0];
  if (lastNotificationDay !== todayDateStr) {
    lastNotificationDay = todayDateStr;
    sentNotificationsToday.clear();
  }

  const [targetH, targetM] = (deadlineSettings.deadlineTime || "21:30").split(":").map(Number);
  const deadlineDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetH, targetM, 0);
  const midnightDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const countdownEl = document.getElementById("deadlineCountdownDisplay");
  const subtextEl = document.getElementById("deadlineStatusSubtext");
  if (!countdownEl && !subtextEl) return;

  const curDay = missionRegistry.currentDay || 1;
  const curMissionStatus = getDayMissionStatus(curDay);

  // Tìm ngày hoàn thành cao nhất để xác định chế độ học vượt
  let maxCompletedDay = 0;
  for (let d = 1; d <= (TOTAL_ROADMAP_DAYS || 90); d++) {
    const st = getDayMissionStatus(d);
    if (st.isAllDone) maxCompletedDay = d;
  }

  const pad = (n) => String(n).padStart(2, "0");

  // TRƯỜNG HỢP 1: Ngày hiện tại đã làm xong toàn bộ 3 nhiệm vụ
  if (curMissionStatus.isAllDone) {
    if (countdownEl) {
      countdownEl.innerText = "✓ ĐÃ HOÀN THÀNH HÔM NAY!";
      countdownEl.className = "text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = `🎉 Xuất sắc! Toàn bộ 3 nhiệm vụ Ngày ${curDay} đã xong. Chuỗi Streak 🔥 được bảo vệ an toàn! Bấm Học Vượt để làm tiếp.`;
    }
    return;
  }

  // TRƯỜNG HỢP 2: Người dùng đang Học Vượt (curDay > ngày đã hoàn thành)
  if (curDay > 1 && maxCompletedDay >= 1 && curDay > maxCompletedDay) {
    if (countdownEl) {
      countdownEl.innerHTML = `🚀 ĐANG HỌC VƯỢT NGÀY ${curDay}`;
      countdownEl.className = "text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerHTML = `✓ <strong>Tiến độ được ghi nhận 100%:</strong> Bạn đang học vượt lộ trình. Toàn bộ từ vựng, bài đọc và ngữ pháp Ngày ${curDay} đều được lưu vĩnh viễn (không tính quá hạn)!`;
    }
    return;
  }

  // TRƯỜNG HỢP 3: Chưa đến giờ deadline (đếm ngược bình thường)
  const diffMs = deadlineDate.getTime() - now.getTime();
  if (diffMs > 0) {
    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    if (countdownEl) {
      countdownEl.innerText = `⏳ Còn ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
      countdownEl.className = "text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = `Hạn chót ${deadlineSettings.deadlineTime} hôm nay. Hoàn thành để bảo toàn Streak!`;
    }

    // Thông báo nhắc nhở trước 60 phút
    if (deadlineSettings.remindDeadline && totalSecs <= 3600 && totalSecs > 3540 && !sentNotificationsToday.has("deadline_60m")) {
      sentNotificationsToday.add("deadline_60m");
      sendMobileNotification(
        "🚨 CẢNH BÁO: Còn 60 phút đến Deadline học tập!",
        `Chỉ còn 1 giờ nữa là đến hạn chót ${deadlineSettings.deadlineTime}. Hãy mở app để hoàn thành từ vựng và bảo vệ chuỗi Streak của bạn!`
      );
    }
    return;
  }

  // TRƯỜNG HỢP 4: Học ban đêm (quá 21:30 nhưng chưa đến 24:00 đêm)
  // Tuyệt đối không báo quá hạn, hiển thị đếm ngược đến 24:00 và cam kết bảo vệ streak
  const diffMidnightMs = midnightDate.getTime() - now.getTime();
  if (diffMidnightMs > 0) {
    const totalSecs = Math.floor(diffMidnightMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (countdownEl) {
      countdownEl.innerText = `⏳ Còn ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s đến 24:00`;
      countdownEl.className = "text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = `✓ Cố định hoàn thành hôm nay: Hệ thống ghi nhận 100% dữ liệu bài tập và bảo vệ Streak đến 23:59 đêm nay!`;
    }
    return;
  }

  // Fallback
  if (countdownEl) {
    countdownEl.innerText = `✓ Hệ thống tự động ghi nhận`;
    countdownEl.className = "text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight";
  }

  // Morning reminder check (08:00 AM)
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  if (deadlineSettings.remindMorning && currentHour === 8 && currentMin < 5 && !sentNotificationsToday.has("morning")) {
    sentNotificationsToday.add("morning");
    sendMobileNotification(
      "☀️ Chào buổi sáng! Mục tiêu tiếng Anh hôm nay",
      "Hôm nay có 20 từ vựng và 1 bài đọc đang chờ bạn. Bắt đầu ngay để có ngày học hiệu quả!"
    );
  }

  // Evening reminder check (19:30 PM)
  if (deadlineSettings.remindEvening && currentHour === 19 && currentMin >= 30 && currentMin < 35 && !sentNotificationsToday.has("evening")) {
    sentNotificationsToday.add("evening");
    sendMobileNotification(
      "📚 Nhắc nhở buổi tối: Luyện tập Flashcard & Ngữ pháp",
      `Bạn còn thời gian trước hạn chót ${deadlineSettings.deadlineTime}. Hãy dành 15 phút ôn tập ngắt quãng nhé!`
    );
  }

  updateDailyGoalChecklist();
}

function updateDailyGoalChecklist() {
  const curDay = missionRegistry.currentDay || 1;
  const curStatus = getDayMissionStatus(curDay);

  const wItem = document.getElementById("goalItemWords");
  const rItem = document.getElementById("goalItemReading");
  const gItem = document.getElementById("goalItemGrammar");
  const lItem = document.getElementById("goalItemListening");
  const vItem = document.getElementById("goalItemVideo");

  if (wItem) {
    wItem.innerHTML = curStatus.vocabDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">20 Từ vựng Ngày ${curDay} (ĐÃ XONG ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-amber-400"></i> <span>20 Từ vựng Ngày ${curDay} (${curStatus.vocabCount}/20)</span>`;
  }
  if (rItem) {
    rItem.innerHTML = curStatus.readingDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">1 Bài đọc VSTEP (ĐÃ XONG ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i> <span>1 Bài đọc VSTEP chuẩn (${curStatus.readingDoneCount || 0}/1)</span>`;
  }
  if (gItem) {
    gItem.innerHTML = curStatus.grammarDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">2 Chuyên đề ngữ pháp (ĐÃ XONG 2/2 ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i> <span>2 Chuyên đề ngữ pháp (${curStatus.grammarDoneCount || 0}/2)</span>`;
  }
  if (lItem) {
    lItem.innerHTML = curStatus.listeningDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">2 Bài nghe chuẩn form (ĐÃ XONG 2/2 ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i> <span>2 Bài nghe chuẩn form (${curStatus.listeningDoneCount || 0}/2)</span>`;
  }
  if (vItem) {
    vItem.innerHTML = curStatus.videoDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">Video / Phim Song Ngữ (ĐÃ XONG 22:00 ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-amber-400"></i> <span>1 Video / Phim Song Ngữ (Hạn chót 22:00)</span>`;
  }

  // Update Mission 4 (Video card) in overview grid
  const vStatus = document.getElementById("taskStatusVideo");
  const vBtn = document.getElementById("btnStartVideoText");
  if (vStatus) {
    vStatus.innerText = curStatus.videoDone ? "✓ Đã xem" : "Chưa xem";
    vStatus.className = curStatus.videoDone ? "text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold" : "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold";
  }
  if (vBtn && curStatus.videoDone) {
    vBtn.innerText = "Xem lại & Ôn từ vựng";
  }

  // Update Mission 3 (Grammar card) in overview grid
  const gTitle = document.getElementById("taskTitleGrammar");
  const gStatus = document.getElementById("taskStatusGrammar");
  const gTopics = getDailyAssignedGrammarTopics(curDay);
  if (gTitle && gTopics.length >= 2) {
    gTitle.innerText = `Chuyên đề: ${gTopics[0].title.split(':')[0]} & ${gTopics[1].title.split(':')[0]}`;
  }
  if (gStatus) {
    gStatus.innerText = curStatus.grammarDone ? "✓ Hoàn thành (2/2)" : `${curStatus.grammarDoneCount || 0}/2 chuyên đề`;
    gStatus.className = curStatus.grammarDone ? "text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold" : "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold";
  }

  if (window.lucide) lucide.createIcons();
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    showToast("Trình duyệt này không hỗ trợ thông báo Web Push!", "warning");
    return;
  }

  try {
    const perm = await Notification.requestPermission();
    updateNotificationStatusBadge();
    if (perm === "granted") {
      showToast("🎉 Đã bật chuông thông báo nhắc nhở hàng ngày thành công!", "success");
      sendMobileNotification(
        "🎉 Chúc mừng! Thông báo đã được kích hoạt",
        `Hệ thống sẽ nhắc bạn học mỗi ngày và báo động trước hạn chót ${deadlineSettings.deadlineTime}!`
      );
    } else {
      showToast("Bạn đã từ chối nhận thông báo. Hãy cho phép trong cài đặt trình duyệt.", "warning");
    }
  } catch (e) {
    console.error(e);
  }
}

function sendMobileNotification(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [200, 100, 200],
          data: { url: "/index.html" },
          tag: "english-mastery-deadline"
        });
      });
    } else {
      new Notification(title, {
        body,
        icon: "/icon-192.png",
        tag: "english-mastery-deadline"
      });
    }
  } catch (err) {
    console.warn("Notification error:", err);
  }

  // Subtle audio chime
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {}
}

function testSendDailyNotification() {
  if (!("Notification" in window)) {
    showToast("Trình duyệt không hỗ trợ Web Notification!", "warning");
    return;
  }

  if (Notification.permission !== "granted") {
    requestNotificationPermission();
    return;
  }

  sendMobileNotification(
    "⏰ [TEST] Nhắc Nhở Deadline Hôm Nay",
    `Hạn chót là ${deadlineSettings.deadlineTime}! Bạn còn 20 từ vựng và 1 bài đọc IELTS cần hoàn thành. Hãy mở app luyện tập ngay!`
  );
  showToast("🔔 Đã gửi thông báo thử nghiệm tới thiết bị của bạn!", "success");
}

function openDeadlineSettingsModal() {
  const m = document.getElementById("deadlineSettingsModal");
  if (!m) return;
  document.getElementById("settingDeadlineTime").value = deadlineSettings.deadlineTime || "21:30";
  document.getElementById("settingRemindMorning").checked = !!deadlineSettings.remindMorning;
  document.getElementById("settingRemindEvening").checked = !!deadlineSettings.remindEvening;
  document.getElementById("settingRemindDeadline").checked = !!deadlineSettings.remindDeadline;
  loadTelegramConfig();
  m.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeDeadlineSettingsModal() {
  const m = document.getElementById("deadlineSettingsModal");
  if (m) m.classList.add("hidden");
}

const TELEGRAM_STORAGE_KEY = "EMH_TELEGRAM_CONFIG_V1";
let telegramConfig = {
  bot_token: "",
  chat_id: "",
  is_active: true
};

async function loadTelegramConfig() {
  try {
    const local = localStorage.getItem(TELEGRAM_STORAGE_KEY);
    if (local) {
      telegramConfig = JSON.parse(local);
    }
  } catch (e) {}

  try {
    const res = await fetch("/api/telegram/config").then(r => r.json());
    if (res && res.bot_token) {
      telegramConfig.bot_token = res.bot_token;
      telegramConfig.chat_id = res.chat_id;
      telegramConfig.is_active = res.is_active !== false;
    }
  } catch (e) {}

  const tokenInput = document.getElementById("telegramBotTokenInput");
  const chatInput = document.getElementById("telegramChatIdInput");
  if (tokenInput) tokenInput.value = telegramConfig.bot_token || "";
  if (chatInput) chatInput.value = telegramConfig.chat_id || "";
}

async function testTelegramFromUI() {
  const token = document.getElementById("telegramBotTokenInput")?.value?.trim();
  const chatId = document.getElementById("telegramChatIdInput")?.value?.trim();

  if (!token || !chatId) {
    showToast("Vui lòng nhập Bot Token và Chat ID!", "warning");
    return;
  }

  showToast("Đang gửi tin nhắn thử tới Telegram...", "info");
  try {
    const resp = await fetch("/api/telegram/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bot_token: token,
        chat_id: chatId
      })
    });
    const data = await resp.json();
    if (resp.ok) {
      showToast("🎉 Tin nhắn thử đã rung chuông trên Telegram!", "success");
      telegramConfig.bot_token = token;
      telegramConfig.chat_id = chatId;
      localStorage.setItem(TELEGRAM_STORAGE_KEY, JSON.stringify(telegramConfig));
    } else {
      showToast(`Lỗi: ${data.detail || "Không thể gửi tin nhắn"}`, "danger");
    }
  } catch (err) {
    showToast("Lỗi kết nối Telegram: " + err.message, "danger");
  }
}

function saveDeadlineSettings() {
  const timeVal = document.getElementById("settingDeadlineTime").value || "21:30";
  deadlineSettings.deadlineTime = timeVal;
  deadlineSettings.remindMorning = document.getElementById("settingRemindMorning").checked;
  deadlineSettings.remindEvening = document.getElementById("settingRemindEvening").checked;
  deadlineSettings.remindDeadline = document.getElementById("settingRemindDeadline").checked;

  try {
    localStorage.setItem(DEADLINE_STORAGE_KEY, JSON.stringify(deadlineSettings));
  } catch (e) {}

  const tgToken = document.getElementById("telegramBotTokenInput")?.value?.trim() || "";
  const tgChatId = document.getElementById("telegramChatIdInput")?.value?.trim() || "";
  if (tgToken && tgChatId) {
    telegramConfig.bot_token = tgToken;
    telegramConfig.chat_id = tgChatId;
    try {
      localStorage.setItem(TELEGRAM_STORAGE_KEY, JSON.stringify(telegramConfig));
    } catch (e) {}

    fetch("/api/telegram/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bot_token: tgToken,
        chat_id: tgChatId,
        remind_morning: deadlineSettings.remindMorning,
        remind_evening: deadlineSettings.remindEvening,
        remind_deadline: deadlineSettings.remindDeadline,
        deadline_time: deadlineSettings.deadlineTime,
        is_active: true
      })
    }).catch(e => console.warn("Telegram save error:", e));
  }

  updateDeadlineTimeUI();
  closeDeadlineSettingsModal();
  showToast(`✅ Đã lưu hạn chót ${deadlineSettings.deadlineTime} và cài đặt nhắc nhở!`, "success");

  // Sync to backend if logged in
  if (appState.authToken) {
    apiCall("/api/auth/profile", "PUT", {
      deadline_time: deadlineSettings.deadlineTime
    }).catch(err => console.warn(err));
  }
}


// ============================================================================
// INTERLEAVED REVIEW & CUSTOM READING WORDS ENGINE
// Chế độ chèn vào từ vựng các ngày lặp lại random toàn bộ từ đã học, SRS & từ bài đọc
// ============================================================================
const CUSTOM_SAVED_WORDS_KEY = "EMH_CUSTOM_SAVED_WORDS_V2";
const INTERLEAVED_CONFIG_KEY = "EMH_INTERLEAVED_CONFIG_V2";

const defaultInterleavedConfig = {
  enabled: true,
  includePastDays: true,
  includeSRS: true,
  includeReadingCustom: true,
  insertCount: 6,
  insertMode: "interleave" // "interleave" or "random_mix"
};

function getInterleavedConfig() {
  try {
    const raw = localStorage.getItem(INTERLEAVED_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old config if enabled was previously unset or explicitly false by old default
      if (parsed.hasUserToggled === undefined) {
        parsed.enabled = true;
      }
      return { ...defaultInterleavedConfig, ...parsed };
    }
  } catch (e) {}
  return { ...defaultInterleavedConfig, enabled: true };
}

function saveInterleavedConfig(cfg) {
  try {
    localStorage.setItem(INTERLEAVED_CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) {}
  appState.interleavedConfig = cfg;
  appState.activeInterleavedDeck = null;
}

function getSavedCustomWords() {
  try {
    const raw = localStorage.getItem(CUSTOM_SAVED_WORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveCustomWordItem(item) {
  if (!item || !item.word) return null;
  const list = getSavedCustomWords();
  const cleanWord = item.word.trim();
  const idx = list.findIndex(w => w.word.toLowerCase() === cleanWord.toLowerCase());
  const entry = {
    id: item.id || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    word: cleanWord,
    pos: item.pos || "word",
    pron: item.pron || `/${cleanWord}/`,
    meaning_vi: item.meaning_vi || cleanWord,
    meaning_en: item.meaning_en || `Definition of ${cleanWord}`,
    example: item.example || `Example sentence with ${cleanWord}.`,
    source: item.source || "reading",
    created_at: item.created_at || new Date().toISOString()
  };

  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry };
  } else {
    list.unshift(entry);
  }

  try {
    localStorage.setItem(CUSTOM_SAVED_WORDS_KEY, JSON.stringify(list));
  } catch (e) {}

  appState.activeInterleavedDeck = null;
  return entry;
}

function removeCustomWordItem(word) {
  let list = getSavedCustomWords();
  list = list.filter(w => w.word.toLowerCase() !== word.toLowerCase());
  try {
    localStorage.setItem(CUSTOM_SAVED_WORDS_KEY, JSON.stringify(list));
  } catch (e) {}
  appState.activeInterleavedDeck = null;
  renderCustomWordsList();
  if (appState.interleavedConfig && appState.interleavedConfig.enabled) {
    renderFlashcard();
  }
  showToast(`Đã xóa từ "${word}" khỏi sổ tay bài đọc!`, "info");
}

function getInterleavedDeckForDay(dIdx, baseWords) {
  if (!baseWords || baseWords.length === 0) return [];
  const cfg = appState.interleavedConfig || getInterleavedConfig();
  const curDayNum = (typeof dIdx === "number" && dIdx >= 1 && dIdx <= (TOTAL_ROADMAP_DAYS || 90))
    ? dIdx
    : (missionRegistry.currentDay || 1);
  const leadWord = baseWords[0]?.word || "";
  const cacheKey = `d${curDayNum}_${leadWord}_${baseWords.length}_${cfg.insertCount}_${cfg.insertMode}_${cfg.includePastDays}_${cfg.includeSRS}_${cfg.includeReadingCustom}`;
  
  if (appState.activeInterleavedDeck && appState.interleavedDeckKey === cacheKey) {
    return appState.activeInterleavedDeck;
  }

  // Helper to categorize item type (Word / Collocation / Phrasal Verb)
  function categorizeItem(w) {
    const rawWord = (w.word || "").trim();
    const parts = rawWord.split(/\s+/);
    const particles = new Set(['up', 'out', 'in', 'on', 'off', 'down', 'away', 'back', 'over', 'into', 'around', 'through', 'about', 'across']);

    if (w.type === "collocation" || parts.length >= 3) {
      return { cardType: "collocation", typeBadge: "🔗 Collocation", typeColor: "bg-purple-500/20 text-purple-300" };
    }
    if (parts.length === 2 && particles.has(parts[1].toLowerCase())) {
      return { cardType: "phrasal_verb", typeBadge: "⚡ Phrasal Verb", typeColor: "bg-amber-500/20 text-amber-300" };
    }
    return { cardType: "word", typeBadge: "📘 Từ vựng", typeColor: "bg-cyan-500/20 text-cyan-300" };
  }

  // 1. Base words from today
  const todayTagged = baseWords.map(w => {
    const cat = categorizeItem(w);
    return {
      ...w,
      cardOrigin: "today",
      cardOriginText: `Bài học Ngày ${curDayNum}`,
      sourceDay: curDayNum,
      ...cat
    };
  });
  const todayWordSet = new Set(baseWords.map(w => (w.word || "").toLowerCase()));

  // 2. Candidate Pools with Spaced Repetition Priority
  const consecutivePool = []; // Ngày N-1 (liên tiếp hôm qua)
  const spacedIntervalPool = []; // Mốc ngắt quãng: N-2, N-3, N-7, N-14, N-30
  const readingMistakesPool = []; // Từ làm sai bài đọc vừa lưu
  const generalPastPool = []; // Các ngày trước khác
  const seenPool = new Set(todayWordSet);

  // A. LẤY TỪ CỦA CÁC NGÀY TRƯỚC (Ưu tiên ngày liên tiếp N-1 & các mốc ngắt quãng)
  if (cfg.includePastDays && curDayNum > 1) {
    const yesterday = curDayNum - 1;
    const spacedDays = new Set([
      curDayNum - 2,
      curDayNum - 3,
      curDayNum - 7,
      curDayNum - 14,
      curDayNum - 30
    ].filter(d => d >= 1));

    // Lấy toàn bộ từ các ngày trước đó
    for (let d = curDayNum - 1; d >= 1; d--) {
      const dayData = getDailyAssignedVocab(d);
      if (dayData && Array.isArray(dayData.words)) {
        dayData.words.forEach(w => {
          const lw = (w.word || "").toLowerCase();
          if (lw && !seenPool.has(lw)) {
            seenPool.add(lw);
            const cat = categorizeItem(w);

            if (d === yesterday) {
              // CỦNG CỐ LIÊN TIẾP NGÀY HÔM SAU
              consecutivePool.push({
                ...w,
                sourceDay: d,
                cardOrigin: "consecutive_yesterday",
                cardOriginText: `🔁 Củng cố liên tiếp (Hôm qua - Ngày ${d})`,
                ...cat
              });
            } else if (spacedDays.has(d)) {
              // LẶP LẠI NGẮT QUÃNG THEO CHU KỲ (Spaced Intervals)
              spacedIntervalPool.push({
                ...w,
                sourceDay: d,
                cardOrigin: "spaced_interval",
                cardOriginText: `⏳ Lặp lại ngắt quãng (Ngày ${d})`,
                ...cat
              });
            } else {
              generalPastPool.push({
                ...w,
                sourceDay: d,
                cardOrigin: "past_day",
                cardOriginText: `Ôn tập Ngày ${d}`,
                ...cat
              });
            }
          }
        });
      }
    }
  }

  // B. TỪ LÀM SAI BÀI ĐỌC & SỔ TAY CUSTOM WORDS
  if (cfg.includeReadingCustom) {
    const customList = getSavedCustomWords();
    customList.forEach(w => {
      const lw = (w.word || "").toLowerCase();
      if (lw && !seenPool.has(lw)) {
        seenPool.add(lw);
        const isMistake = w.source === "reading_mistake" || w.cardOrigin === "reading_mistake";
        const cat = categorizeItem(w);
        readingMistakesPool.push({
          ...w,
          cardOrigin: isMistake ? "reading_mistake" : "reading",
          cardOriginText: isMistake ? "⚠️ Ôn từ làm sai bài đọc" : "Từ bài đọc mới lưu",
          ...cat
        });
      }
    });
  }

  // C. LỰA CHỌN TỪ CHÈN THEO TỶ LỆ KHOA HỌC:
  // - 40% từ ngày liên tiếp N-1 (Củng cố trí nhớ ngắn hạn tức thì)
  // - 30% từ các mốc ngắt quãng (N-3, N-7, N-14) có đủ Collocation & Phrasal Verbs
  // - 20% từ làm sai bài đọc
  // - 10% các ngày trước khác
  let insertCount = parseInt(cfg.insertCount) || 10;
  if (cfg.insertCount === "all") insertCount = 20;

  const chosenReviews = [];
  const countYesterday = Math.min(consecutivePool.length, Math.ceil(insertCount * 0.45));
  const countSpaced = Math.min(spacedIntervalPool.length, Math.ceil(insertCount * 0.35));
  const countMistakes = Math.min(readingMistakesPool.length, Math.ceil(insertCount * 0.20));

  chosenReviews.push(...shuffleArray(consecutivePool).slice(0, countYesterday));
  chosenReviews.push(...shuffleArray(spacedIntervalPool).slice(0, countSpaced));
  chosenReviews.push(...shuffleArray(readingMistakesPool).slice(0, countMistakes));

  // Nếu còn thiếu thì bổ sung từ generalPastPool
  if (chosenReviews.length < insertCount && generalPastPool.length > 0) {
    const needed = insertCount - chosenReviews.length;
    chosenReviews.push(...shuffleArray(generalPastPool).slice(0, needed));
  }

  // 4. ƯU TIÊN TUYỆT ĐỐI TỪ VỰNG CỦA NGÀY HÔM ĐÓ LÊN ĐẦU TIÊN
  // Người học tiếp thu toàn bộ từ vựng mới của ngày hôm nay trước (Thẻ 1 -> Thẻ 20),
  // sau đó mới đến các thẻ lặp lại ngắt quãng, từ hôm qua, từ làm sai bài đọc để củng cố.
  let finalDeck = [];
  if (chosenReviews.length === 0) {
    finalDeck = todayTagged;
  } else {
    // 100% Từ vựng ngày hôm nay được đặt trang trọng lên đầu
    finalDeck = [...todayTagged, ...chosenReviews];
  }

  appState.activeInterleavedDeck = finalDeck;
  appState.interleavedDeckKey = cacheKey;
  return finalDeck;
}

function toggleInterleavedStudyMode(enabled) {
  const cfg = getInterleavedConfig();
  cfg.enabled = !!enabled;
  cfg.hasUserToggled = true;
  saveInterleavedConfig(cfg);
  appState.currentCardIndex = 0;
  updateInterleavedUI();
  renderFlashcard();
  if (cfg.enabled) {
    showToast("🔀 Đã BẬT chế độ chèn từ lặp lại! Thẻ học hiện tại đã được chèn thêm từ ôn tập & bài đọc!", "success");
  } else {
    showToast("Đã TẮT chế độ chèn từ lặp lại. Quay về 20 từ gốc của bài học.", "info");
  }
}

function reshuffleInterleavedDeck() {
  appState.activeInterleavedDeck = null;
  appState.currentCardIndex = 0;
  renderFlashcard();
  showToast("🔀 Đã trộn lại ngẫu nhiên bộ thẻ bài học và từ ôn tập!", "info");
}

function updateInterleavedUI() {
  const cfg = appState.interleavedConfig || getInterleavedConfig();
  const toggle = document.getElementById("toggleInterleavedMode");
  const badge = document.getElementById("interleavedStatusBadge");
  const btnShuffle = document.getElementById("btnReshuffleInterleaved");
  
  if (toggle) toggle.checked = !!cfg.enabled;
  if (badge) {
    if (cfg.enabled) {
      badge.className = "text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 animate-pulse";
      badge.innerText = `Đang BẬT (+${cfg.insertCount} từ ôn)`;
    } else {
      badge.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700";
      badge.innerText = "Đang tắt";
    }
  }
  if (btnShuffle) {
    if (cfg.enabled) btnShuffle.classList.remove("hidden");
    else btnShuffle.classList.add("hidden");
  }
}

function openInterleavedConfigModal() {
  const cfg = appState.interleavedConfig || getInterleavedConfig();
  const modal = document.getElementById("interleavedConfigModal");
  if (!modal) return;

  const cbPast = document.getElementById("cfgIncludePastDays");
  const cbSRS = document.getElementById("cfgIncludeSRS");
  const cbReading = document.getElementById("cfgIncludeReadingCustom");
  const selCount = document.getElementById("cfgInsertCount");
  const selMode = document.getElementById("cfgInsertMode");

  if (cbPast) cbPast.checked = !!cfg.includePastDays;
  if (cbSRS) cbSRS.checked = !!cfg.includeSRS;
  if (cbReading) cbReading.checked = !!cfg.includeReadingCustom;
  if (selCount) selCount.value = cfg.insertCount.toString();
  if (selMode) selMode.value = cfg.insertMode || "interleave";

  // Update counts
  const curDay = missionRegistry.currentDay || 1;
  const pastCount = getWordsUpToDay(curDay).length;
  const srsCount = (appState.todayQueue || []).length;
  const readingCount = getSavedCustomWords().length;

  const elPast = document.getElementById("cfgCountPastDays");
  const elSRS = document.getElementById("cfgCountSRS");
  const elReading = document.getElementById("cfgCountReading");

  if (elPast) elPast.innerText = `${pastCount} từ`;
  if (elSRS) elSRS.innerText = `${srsCount} từ`;
  if (elReading) elReading.innerText = `${readingCount} từ`;

  modal.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeInterleavedConfigModal() {
  const modal = document.getElementById("interleavedConfigModal");
  if (modal) modal.classList.add("hidden");
}

function submitInterleavedConfig() {
  const cbPast = document.getElementById("cfgIncludePastDays");
  const cbSRS = document.getElementById("cfgIncludeSRS");
  const cbReading = document.getElementById("cfgIncludeReadingCustom");
  const selCount = document.getElementById("cfgInsertCount");
  const selMode = document.getElementById("cfgInsertMode");

  const cfg = {
    enabled: appState.interleavedConfig?.enabled || false,
    includePastDays: cbPast ? cbPast.checked : true,
    includeSRS: cbSRS ? cbSRS.checked : true,
    includeReadingCustom: cbReading ? cbReading.checked : true,
    insertCount: selCount ? selCount.value : "10",
    insertMode: selMode ? selMode.value : "interleave"
  };

  saveInterleavedConfig(cfg);
  updateInterleavedUI();
  closeInterleavedConfigModal();
  renderFlashcard();
  showToast("✅ Đã lưu cấu hình chèn từ lặp lại thành công!", "success");
}

function openCustomWordsManagerModal() {
  const modal = document.getElementById("customWordsManagerModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderCustomWordsList();
  if (window.lucide) lucide.createIcons();
}

function closeCustomWordsManagerModal() {
  const modal = document.getElementById("customWordsManagerModal");
  if (modal) modal.classList.add("hidden");
}

function renderCustomWordsList(filterQuery = "") {
  const container = document.getElementById("customWordsListContainer");
  const totalBadge = document.getElementById("customWordsTotalBadge");
  if (!container) return;

  const words = getSavedCustomWords();
  if (totalBadge) totalBadge.innerText = `${words.length} từ đã lưu`;

  const q = filterQuery.trim().toLowerCase();
  const filtered = q ? words.filter(w => w.word.toLowerCase().includes(q) || (w.meaning_vi && w.meaning_vi.toLowerCase().includes(q))) : words;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 glass-panel rounded-xl">
        <i data-lucide="book-open" class="w-8 h-8 mx-auto text-slate-500 mb-2"></i>
        <p class="text-xs">Chưa có từ nào được lưu từ bài đọc hoặc tra từ.</p>
        <p class="text-[11px] text-slate-500 mt-1">Khi đọc bài, hãy click vào từ hoặc bôi đen và bấm "Lưu sổ tay" hoặc "Thêm vào Ngày học" để lưu vào đây.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  let html = "";
  filtered.forEach(w => {
    html += `
      <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
        <div class="space-y-1 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-white text-sm">${w.word}</span>
            <span class="text-xs font-mono text-cyan-300">${w.pron || `/${w.word}/`}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">(${w.pos || "word"})</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              ${w.source === 'reading' ? '📖 Bài đọc' : '✏️ Nhập tay'}
            </span>
          </div>
          <p class="text-xs text-amber-300 font-medium">${w.meaning_vi || ""}</p>
          ${w.example ? `<p class="text-[11px] text-slate-400 italic">"${w.example}"</p>` : ""}
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="speakText('${w.word.replace(/'/g, "\\'")}')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition" title="Nghe phát âm">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>
          <a href="https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(w.word)}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition" title="Xem Cambridge US">
            <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
          <button onclick="removeCustomWordItem('${w.word.replace(/'/g, "\\'")}')" class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 transition" title="Xóa khỏi sổ tay">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function filterCustomWordsList(val) {
  renderCustomWordsList(val);
}

// Attach to DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  appState.interleavedConfig = getInterleavedConfig();
  updateInterleavedUI();
  // Self-healing migration for saved custom words
  try {
    const customList = getSavedCustomWords();
    let hasUpdated = false;
    customList.forEach(item => {
      if (!item.meaning_vi || item.meaning_vi.toLowerCase() === item.word.toLowerCase() || item.meaning_vi.includes("Đang tra cứu")) {
        // Try to match in curriculum units
        if (window.APP_DATA && window.APP_DATA.units) {
          for (const u of window.APP_DATA.units) {
            for (const d of u.days) {
              const matched = d.words.find(w => w.word.toLowerCase() === item.word.toLowerCase());
              if (matched && matched.meaning_vi) {
                item.meaning_vi = matched.meaning_vi;
                item.pos = matched.pos || item.pos || "n";
                hasUpdated = true;
                break;
              }
            }
            if (hasUpdated) break;
          }
        }
      }
    });
    if (hasUpdated) {
      localStorage.setItem(CUSTOM_SAVED_WORDS_KEY, JSON.stringify(customList));
    }
  } catch (e) {}

});


// ============================================================================
// CROSS-DEVICE CLOUD SYNC & AUTO-SYNC ENGINE (TỰ ĐỘNG ĐỒNG BỘ & ĐỒNG BỘ THỦ CÔNG)
// ============================================================================
const STORAGE_KEY_PAIR_SYNC = "EMH_PAIR_SYNC_KEY_V1";
let syncDebounceTimer = null;
let autoSyncInterval = null;
let isApplyingRemoteSync = false;
let lastSyncedHash = "";
let lastSyncTimestamp = null;

function getSyncPairKey() {
  return localStorage.getItem(STORAGE_KEY_PAIR_SYNC) || (appState.currentUser ? `user_${appState.currentUser.id}` : "");
}

function setSyncPairKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY_PAIR_SYNC, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_PAIR_SYNC);
  }
  updateSyncUIStatus();
}

function buildFullSyncPayload() {
  const curStreak = parseInt(localStorage.getItem("EMH_STREAK")) || (appState.currentUser?.streak_count || 1);
  return {
    missionRegistry: missionRegistry,
    streak: {
      count: curStreak,
      lastActiveDate: localStorage.getItem("EMH_LAST_ACTIVE_DATE") || new Date().toISOString().slice(0, 10)
    },
    customWords: getSavedCustomWords(),
    interleavedConfig: getInterleavedConfig(),
    device: navigator.userAgent.includes("Mobile") ? "Điện thoại" : "Máy tính",
    updatedAt: new Date().toISOString()
  };
}

function applyFullSyncPayload(payload) {
  if (!payload || typeof payload !== "object") return;
  if (isApplyingRemoteSync) return;
  isApplyingRemoteSync = true;

  try {
    let hasChanges = false;

    // 1. Merge missionRegistry
    if (payload.missionRegistry && typeof payload.missionRegistry === "object") {
      const remoteReg = payload.missionRegistry;
      const remoteDay = parseInt(remoteReg.currentDay) || 1;
      const localDay = missionRegistry.currentDay || 1;

      // Giữ ngày cao hơn hoặc ngày hiện tại
      if (remoteDay > localDay) {
        missionRegistry.currentDay = remoteDay;
        hasChanges = true;
      }

      if (remoteReg.history && typeof remoteReg.history === "object") {
        Object.keys(remoteReg.history).forEach(dayKey => {
          const rDay = remoteReg.history[dayKey];
          const lDay = missionRegistry.history[dayKey] || {
            vocabDone: false,
            vocabCount: 0,
            readingDone: false,
            readingDoneCount: 0,
            completedReadings: [],
            grammarDone: false
          };

          // Gộp thông minh: Giữ trạng thái hoàn thành nếu một trong hai bên đã xong
          const mergedVocabCount = Math.max(lDay.vocabCount || 0, rDay.vocabCount || 0);
          const mergedVocabDone = !!(lDay.vocabDone || rDay.vocabDone || mergedVocabCount >= 20);
          const mergedReadingDone = !!(lDay.readingDone || rDay.readingDone);
          const mergedGrammarDone = !!(lDay.grammarDone || rDay.grammarDone);
          const mergedReadingsList = Array.from(new Set([...(lDay.completedReadings || []), ...(rDay.completedReadings || [])]));

          if (
            mergedVocabDone !== lDay.vocabDone ||
            mergedReadingDone !== lDay.readingDone ||
            mergedGrammarDone !== lDay.grammarDone ||
            mergedVocabCount > (lDay.vocabCount || 0)
          ) {
            hasChanges = true;
          }

          missionRegistry.history[dayKey] = {
            ...lDay,
            ...rDay,
            vocabDone: mergedVocabDone,
            vocabCount: mergedVocabCount,
            readingDone: mergedReadingDone,
            readingDoneCount: Math.max(lDay.readingDoneCount || 0, rDay.readingDoneCount || 0, mergedReadingsList.length),
            completedReadings: mergedReadingsList,
            grammarDone: mergedGrammarDone
          };
        });
      }
    }

    // 2. Merge streak
    if (payload.streak && payload.streak.count) {
      const curStreak = parseInt(localStorage.getItem("EMH_STREAK")) || 1;
      const maxStreak = Math.max(curStreak, parseInt(payload.streak.count) || 1);
      localStorage.setItem("EMH_STREAK", String(maxStreak));
      if (payload.streak.lastActiveDate) {
        localStorage.setItem("EMH_LAST_ACTIVE_DATE", payload.streak.lastActiveDate);
      }
    }

    // 3. Merge customWords
    if (Array.isArray(payload.customWords) && payload.customWords.length > 0) {
      const localWords = getSavedCustomWords();
      const map = new Map();
      localWords.forEach(w => map.set(w.word.toLowerCase(), w));
      payload.customWords.forEach(w => {
        const k = (w.word || "").toLowerCase();
        if (k && (!map.has(k) || (w.meaning_vi && w.meaning_vi !== w.word))) {
          map.set(k, w);
          hasChanges = true;
        }
      });
      localStorage.setItem(CUSTOM_SAVED_WORDS_KEY, JSON.stringify(Array.from(map.values())));
    }

    if (hasChanges) {
      try {
        const dataStr = JSON.stringify(missionRegistry);
        localStorage.setItem(MISSION_REGISTRY_KEY, dataStr);
        localStorage.setItem("EMH_MISSION_REGISTRY_BACKUP", dataStr);
      } catch (e) {}
      updateDailyMissionUI();
      updateDailyGoalChecklist();
      if (typeof renderFlashcard === "function") renderFlashcard();
      if (typeof tickDeadlineCountdown === "function") tickDeadlineCountdown();
    }
  } finally {
    isApplyingRemoteSync = false;
  }
}

// 1. TỰ ĐỘNG ĐỒNG BỘ: Tự động đẩy tiến độ ngầm lên đám mây khi có thay đổi
function triggerBackgroundCloudSync() {
  if (isApplyingRemoteSync) return;
  const pairKey = getSyncPairKey();
  if (!pairKey && !appState.authToken) return;

  clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(async () => {
    try {
      const payload = buildFullSyncPayload();
      const res = await apiCall("/api/sync/cloud-save", "POST", {
        sync_key: pairKey,
        payload: payload,
        device_name: navigator.userAgent.includes("Mobile") ? "Điện thoại" : "Máy tính"
      });
      if (res && res.success) {
        lastSyncTimestamp = new Date();
        updateSyncUIStatus("Tự động đồng bộ đám mây ✓");
      }
    } catch (e) {
      console.warn("Background auto-sync failed:", e);
    }
  }, 1000);
}

// 2. TỰ ĐỘNG ĐỒNG BỘ: Tự động kéo tiến độ mới nhất từ đám mây về
async function pullLatestCloudSync(showToastOnUpdate = false) {
  const pairKey = getSyncPairKey();
  if (!pairKey && !appState.authToken) return;

  try {
    const url = `/api/sync/cloud-load?sync_key=${encodeURIComponent(pairKey || "")}`;
    const res = await apiCall(url);
    if (res && res.success && res.data) {
      const hash = JSON.stringify(res.data);
      if (hash !== lastSyncedHash) {
        lastSyncedHash = hash;
        applyFullSyncPayload(res.data);
        lastSyncTimestamp = new Date();
        updateSyncUIStatus(`Tự động đồng bộ (${res.device_name || 'Đám mây'}) ✓`);
        if (showToastOnUpdate) {
          showToast(`🔄 Đã tự động cập nhật tiến độ mới nhất từ ${res.device_name || 'thiết bị khác'}!`, "info");
        }
      }
    }
  } catch (e) {
    console.warn("Pull cloud sync error:", e);
  }
}

// 3. KHỞI CHẠY HỆ THỐNG TỰ ĐỘNG ĐỒNG BỘ (Background Auto-Sync)
async function initCrossDeviceAutoSync() {
  // A. Kéo tiến độ ngay khi vừa mở trang web
  await pullLatestCloudSync(false);
  updateSyncUIStatus();

  // B. Tự động kiểm tra đồng bộ khi quay lại màn hình / chuyển tab (Visibility / Focus)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      pullLatestCloudSync(true);
    }
  });

  window.addEventListener("focus", () => {
    pullLatestCloudSync(false);
  });

  // C. Tự động kiểm tra định kỳ mỗi 25 giây ngầm
  if (!autoSyncInterval) {
    autoSyncInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        pullLatestCloudSync(false);
      }
    }, 25000);
  }
}

// 4. ĐỒNG BỘ THỦ CÔNG (Bấm nút là ép đồng bộ ngay lập tức 100%)
async function manualSyncNow(showNotification = true) {
  const btnHeader = document.getElementById("btnManualSyncHeader");
  const iconHeader = document.getElementById("manualSyncIcon");
  const btnModal = document.getElementById("btnManualSyncModal");
  const iconModal = document.getElementById("modalSyncIcon");

  if (iconHeader) iconHeader.classList.add("animate-spin");
  if (iconModal) iconModal.classList.add("animate-spin");
  if (btnHeader) btnHeader.disabled = true;
  if (btnModal) btnModal.disabled = true;

  const pairKey = getSyncPairKey();

  // Nếu máy này chưa có mã liên kết -> Hướng dẫn tạo mã tức thì
  if (!pairKey && !appState.authToken) {
    if (showNotification) {
      showToast("💡 Bạn chưa ghép nối thiết bị! Đang tạo mã kết nối cho bạn...", "info");
    }
    openSyncModal();
    await requestNewSyncCode();
    if (iconHeader) iconHeader.classList.remove("animate-spin");
    if (iconModal) iconModal.classList.remove("animate-spin");
    if (btnHeader) btnHeader.disabled = false;
    if (btnModal) btnModal.disabled = false;
    return;
  }

  try {
    if (showNotification) {
      showToast("⏳ Đang đồng bộ thủ công 2 chiều với đám mây...", "info");
    }

    // A. Kéo dữ liệu mới nhất từ Cloud về trước
    const url = `/api/sync/cloud-load?sync_key=${encodeURIComponent(pairKey || "")}`;
    const loadRes = await apiCall(url);
    if (loadRes && loadRes.success && loadRes.data) {
      applyFullSyncPayload(loadRes.data);
    }

    // B. Đẩy toàn bộ dữ liệu hiện tại lên Cloud
    const payload = buildFullSyncPayload();
    const saveRes = await apiCall("/api/sync/cloud-save", "POST", {
      sync_key: pairKey,
      payload: payload,
      device_name: navigator.userAgent.includes("Mobile") ? "Điện thoại" : "Máy tính"
    });

    lastSyncTimestamp = new Date();
    const timeStr = lastSyncTimestamp.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    updateSyncUIStatus(`Đã đồng bộ thủ công lúc ${timeStr} ✓`);
    if (showNotification) {
      showToast(`✅ ĐÃ ĐỒNG BỘ THỦ CÔNG THÀNH CÔNG! Dữ liệu giữa Điện thoại & Máy tính đã khớp 100% (Lúc ${timeStr}).`, "success");
    }
  } catch (err) {
    console.error("Manual sync failed:", err);
    if (showNotification) {
      showToast("❌ Lỗi đồng bộ: " + (err.message || "Không thể kết nối máy chủ"), "error");
    }
  } finally {
    if (iconHeader) iconHeader.classList.remove("animate-spin");
    if (iconModal) iconModal.classList.remove("animate-spin");
    if (btnHeader) btnHeader.disabled = false;
    if (btnModal) btnModal.disabled = false;
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
}

function updateSyncUIStatus(customMsg) {
  const key = getSyncPairKey();
  const banner = document.getElementById("syncStatusText");
  const badge = document.getElementById("syncKeyBadge");
  const headerStatus = document.getElementById("userStatusText");
  const lastTimeEl = document.getElementById("syncLastTimeText");

  if (lastSyncTimestamp && lastTimeEl) {
    lastTimeEl.innerText = lastSyncTimestamp.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  if (key) {
    if (badge) badge.innerText = `Mã: ${key}`;
    if (banner) banner.innerText = customMsg || `Tự động đồng bộ: Đang bật (Mã: ${key})`;
    if (headerStatus) headerStatus.innerText = `Đã đồng bộ đám mây • Mã: ${key}`;
  } else if (appState.authToken) {
    if (badge) badge.innerText = "Tài khoản";
    if (banner) banner.innerText = customMsg || "Tự động đồng bộ: Đang bật (Tài khoản)";
    if (headerStatus) headerStatus.innerText = "Đã đồng bộ tài khoản đám mây";
  } else {
    if (badge) badge.innerText = "Chưa liên kết";
    if (banner) banner.innerText = customMsg || "Sẵn sàng kết nối & Tự động đồng bộ 2 chiều";
    if (headerStatus) headerStatus.innerText = "Đang chạy máy chủ • Bấm để Đồng Bộ";
  }
}

function openSyncModal() {
  const modal = document.getElementById("syncModal");
  if (modal) {
    modal.classList.remove("hidden");
    updateSyncUIStatus();
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
}

function closeSyncModal() {
  const modal = document.getElementById("syncModal");
  if (modal) modal.classList.add("hidden");
}

function switchSyncMode(mode) {
  const secGen = document.getElementById("syncSectionGenerate");
  const secClaim = document.getElementById("syncSectionClaim");
  const btnGen = document.getElementById("tabBtnSyncGen");
  const btnClaim = document.getElementById("tabBtnSyncClaim");

  if (mode === "generate") {
    if (secGen) secGen.classList.remove("hidden");
    if (secClaim) secClaim.classList.add("hidden");
    if (btnGen) {
      btnGen.className = "py-2 rounded-lg font-bold text-xs bg-cyan-600 text-white transition shadow";
    }
    if (btnClaim) {
      btnClaim.className = "py-2 rounded-lg font-bold text-xs text-slate-400 hover:text-white transition";
    }
  } else {
    if (secGen) secGen.classList.add("hidden");
    if (secClaim) secClaim.classList.remove("hidden");
    if (btnGen) {
      btnGen.className = "py-2 rounded-lg font-bold text-xs text-slate-400 hover:text-white transition";
    }
    if (btnClaim) {
      btnClaim.className = "py-2 rounded-lg font-bold text-xs bg-emerald-600 text-white transition shadow";
    }
    const inp = document.getElementById("syncCodeInput");
    if (inp) setTimeout(() => inp.focus(), 150);
  }
}

async function requestNewSyncCode() {
  const btn = document.getElementById("btnGenerateCode");
  if (btn) btn.disabled = true;
  showToast("⏳ Đang tải dữ liệu từ máy này lên đám mây...", "info");

  try {
    const payload = buildFullSyncPayload();
    const res = await apiCall("/api/sync/generate-code", "POST", {
      payload: payload,
      device_name: navigator.userAgent.includes("Mobile") ? "Điện thoại" : "Máy tính"
    });

    if (res && res.success && res.sync_code) {
      setSyncPairKey(res.sync_code);
      const box = document.getElementById("syncCodeDisplayBox");
      const digits = document.getElementById("syncCodeDigits");
      if (digits) digits.innerText = res.sync_code.slice(0, 3) + " " + res.sync_code.slice(3);
      if (box) box.classList.remove("hidden");
      showToast(`🎉 Mã đồng bộ của bạn: ${res.sync_code}. Hãy mở máy tính và nhập mã này!`, "success");
    } else {
      showToast("Không thể tạo mã đồng bộ, vui lòng thử lại!", "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ khi tạo mã!", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function submitClaimSyncCode() {
  const input = document.getElementById("syncCodeInput");
  const code = (input?.value || "").replace(/\s+/g, "").trim();

  if (!code || code.length < 5) {
    showToast("Vui lòng nhập mã đồng bộ gồm 6 chữ số!", "warning");
    return;
  }

  const btn = document.getElementById("btnClaimCode");
  if (btn) btn.disabled = true;
  showToast("⏳ Đang tải tiến độ học tập từ điện thoại sang...", "info");

  try {
    const res = await apiCall("/api/sync/claim-code", "POST", {
      sync_code: code,
      device_name: navigator.userAgent.includes("Mobile") ? "Điện thoại" : "Máy tính"
    });

    if (res && res.success && res.data) {
      setSyncPairKey(code);
      applyFullSyncPayload(res.data);
      // Immediately push back merged progress so both devices are permanently unified
      triggerBackgroundCloudSync();
      closeSyncModal();
      showToast(`🎉 TUYỆT VỜI! Đã đồng bộ 100% dữ liệu từ điện thoại sang máy tính và tự động liên kết 2 chiều!`, "success");
    } else {
      showToast("Mã đồng bộ không chính xác hoặc đã hết hạn!", "error");
    }
  } catch (e) {
    showToast(e.message || "Không tìm thấy mã đồng bộ!", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ============================================================================
// ============================================================================
// MODULE 1: LISTENING PRACTICE ENGINE (FORM ĐỀ THI HP3 - BỘ CÔNG AN & CAMBRIDGE)
// ============================================================================
let currentListeningTestIdx = 0;
let currentListeningPartIdx = 0;
let userListeningAnswers = {};
let isListeningSubmitted = false;
let listeningAudioEl = null;
let isSyntheticSpeechPlaying = false;
let syntheticSpeechUtterance = null;

function initListeningModule() {
  listeningAudioEl = document.getElementById("listeningAudio");
  setupListeningAudioEvents();
  renderListeningTestSelector();
  renderListeningPartTabs();
  loadListeningPart(0);
}

function renderListeningTestSelector() {
  const container = document.getElementById("listeningTestSelector");
  if (!container || typeof LISTENING_TESTS === "undefined" || !LISTENING_TESTS.length) return;

  let html = "";
  LISTENING_TESTS.forEach((t, idx) => {
    const active = idx === currentListeningTestIdx;
    html += `
      <button onclick="switchListeningTest(${idx})" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40"
          : "glass-card text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800"
      }">
        <i data-lucide="file-check" class="w-4 h-4 text-cyan-400"></i>
        <span>${t.title.split(":")[0]}</span>
      </button>
    `;
  });
  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function switchListeningTest(testIdx) {
  currentListeningTestIdx = testIdx;
  currentListeningPartIdx = 0;
  userListeningAnswers = {};
  isListeningSubmitted = false;
  stopAllListeningAudio();
  renderListeningTestSelector();
  renderListeningPartTabs();
  loadListeningPart(0);
}

function setupListeningAudioEvents() {
  if (!listeningAudioEl) return;

  listeningAudioEl.addEventListener("timeupdate", () => {
    const cur = listeningAudioEl.currentTime;
    const dur = listeningAudioEl.duration || 1;
    const curSpan = document.getElementById("listeningTimeCurrent");
    const durSpan = document.getElementById("listeningTimeTotal");
    const range = document.getElementById("listeningSeekRange");

    if (curSpan) curSpan.innerText = formatAudioTime(cur);
    if (durSpan && !isNaN(dur) && dur > 0) durSpan.innerText = formatAudioTime(dur);
    if (range && !range.dataset.dragging) {
      range.value = (cur / dur) * 100;
    }
  });

  listeningAudioEl.addEventListener("ended", () => {
    const icon = document.getElementById("listeningPlayIcon");
    if (icon) {
      icon.setAttribute("data-lucide", "play");
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
  });
}

function formatAudioTime(secs) {
  if (isNaN(secs) || secs < 0) return "00:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function renderListeningPartTabs() {
  const container = document.getElementById("listeningPartTabs");
  if (!container || typeof LISTENING_TESTS === "undefined" || !LISTENING_TESTS.length) return;

  const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
  let html = "";
  test.parts.forEach((p, idx) => {
    const active = idx === currentListeningPartIdx;
    html += `
      <button onclick="switchListeningPart(${idx})" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30"
          : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
      }">
        <i data-lucide="headphones" class="w-4 h-4"></i>
        <span>Part ${p.partNumber}: ${p.title.split(":")[1]?.trim() || p.title}</span>
      </button>
    `;
  });
  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function switchListeningPart(idx) {
  currentListeningPartIdx = idx;
  userListeningAnswers = {};
  isListeningSubmitted = false;
  stopAllListeningAudio();
  renderListeningPartTabs();
  loadListeningPart(idx);
}

function stopAllListeningAudio() {
  if (listeningAudioEl) {
    listeningAudioEl.pause();
    listeningAudioEl.currentTime = 0;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isSyntheticSpeechPlaying = false;
  const playIcon = document.getElementById("listeningPlayIcon");
  if (playIcon) {
    playIcon.setAttribute("data-lucide", "play");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
}

function loadListeningPart(idx) {
  if (typeof LISTENING_TESTS === "undefined" || !LISTENING_TESTS.length) return;
  const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
  const part = test.parts[idx];
  if (!part) return;

  // 1. Audio track setup
  if (listeningAudioEl) {
    if (part.audioSrc) {
      listeningAudioEl.src = part.audioSrc;
      listeningAudioEl.load();
    } else {
      listeningAudioEl.removeAttribute("src");
    }
  }

  const trackTitle = document.getElementById("listeningTrackTitle");
  if (trackTitle) trackTitle.innerText = `${part.title} (${part.questions.length} Câu hỏi)`;

  const playIcon = document.getElementById("listeningPlayIcon");
  if (playIcon) {
    playIcon.setAttribute("data-lucide", "play");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  // 2. Render instruction
  const instrEl = document.getElementById("listeningInstructionText");
  if (instrEl) instrEl.innerText = part.instruction;

  // 3. Render questions
  renderListeningQuestions(part);

  // 4. Render transcript
  renderListeningTranscript(part);

  // 5. Hide results banner
  const scoreBanner = document.getElementById("listeningScoreBanner");
  if (scoreBanner) scoreBanner.classList.add("hidden");
}

function renderListeningQuestions(part) {
  const container = document.getElementById("listeningQuestionsContainer");
  if (!container) return;

  let html = "";

  // If part has a Map Image, render it first!
  if (part.mapImage) {
    html += `
      <div class="glass-card p-4 sm:p-5 rounded-2xl border-2 border-cyan-500/40 bg-slate-900/90 text-center space-y-3 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="map" class="w-4 h-4 text-cyan-400"></i>
            <span>Sơ Đồ Bản Đồ Đề Thi (Dùng Cho Câu 16 - 20)</span>
          </span>
          <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">Map Labeling</span>
        </div>
        <div class="relative inline-block max-w-full overflow-hidden rounded-xl border border-slate-700 bg-black/40 p-1">
          <img src="${part.mapImage}" alt="Map Layout" class="max-h-[380px] w-auto mx-auto rounded-lg shadow-md object-contain">
        </div>
        <p class="text-xs text-slate-300 italic">Đối chiếu vị trí cổng GATE ở phía Nam và các chữ cái A, B, C, D, E, F, G, H trên sơ đồ.</p>
      </div>
    `;
  }

  part.questions.forEach(q => {
    const selectedOpt = userListeningAnswers[q.id];
    let statusClass = "";

    if (isListeningSubmitted) {
      if (selectedOpt === q.correct) {
        statusClass = "border-emerald-500/80 bg-emerald-950/20";
      } else {
        statusClass = "border-rose-500/80 bg-rose-950/20";
      }
    }

    html += `
      <div id="q_card_${q.id}" class="glass-card p-4 sm:p-5 rounded-2xl border border-slate-700/80 space-y-3 ${statusClass}">
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1">
            <h4 class="font-bold text-white text-sm sm:text-base leading-snug">${q.text}</h4>
            ${q.isMap ? '<span class="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-bold">Chọn chữ cái (A - H) trên bản đồ</span>' : ""}
          </div>
          ${
            isListeningSubmitted
              ? selectedOpt === q.correct
                ? '<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs shrink-0 flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> Đúng</span>'
                : `<span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs shrink-0 flex items-center gap-1"><i data-lucide="x" class="w-3.5 h-3.5"></i> Sai (Đáp án: ${q.correct})</span>`
              : ""
          }
        </div>

        ${
          q.isMap
            ? `
          <!-- MAP LETTER PILLS SELECTOR -->
          <div class="flex items-center gap-2 flex-wrap pt-1">
            ${["A", "B", "C", "D", "E", "F", "G", "H"].map(letter => {
              const isSelected = selectedOpt === letter;
              let btnClass = "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700";

              if (isListeningSubmitted) {
                if (letter === q.correct) {
                  btnClass = "bg-emerald-600 text-white font-black ring-2 ring-emerald-400 scale-105";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 text-white font-bold ring-2 ring-rose-400 line-through";
                } else {
                  btnClass = "opacity-30 bg-slate-800 text-slate-500 border-slate-800";
                }
              } else if (isSelected) {
                btnClass = "bg-cyan-600 text-white font-black ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-900/50";
              }

              return `
                <button type="button" onclick="selectListeningOption(${q.id}, '${letter}')" class="w-10 h-10 rounded-xl font-mono text-sm font-bold border transition flex items-center justify-center ${btnClass}">
                  ${letter}
                </button>
              `;
            }).join("")}
            <span class="text-xs text-slate-400 ml-2 font-mono">Đã chọn: <strong class="text-amber-300 font-bold">${selectedOpt || "Chưa chọn"}</strong></span>
          </div>
        `
            : `
          <!-- STANDARD A, B, C OPTIONS -->
          <div class="grid grid-cols-1 gap-2 pt-1">
            ${q.options.map(opt => {
              const isSelected = selectedOpt === opt.key;
              let optStyle = "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200";

              if (isListeningSubmitted) {
                if (opt.key === q.correct) {
                  optStyle = "bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400";
                } else if (isSelected) {
                  optStyle = "bg-rose-600/30 border-rose-400 text-rose-200 line-through ring-1 ring-rose-400";
                } else {
                  optStyle = "opacity-40 bg-slate-800/40 border-slate-700 text-slate-400";
                }
              } else if (isSelected) {
                optStyle = "bg-cyan-600/30 border-cyan-400 text-cyan-200 font-bold ring-2 ring-cyan-500/50";
              }

              return `
                <div onclick="selectListeningOption(${q.id}, '${opt.key}')" class="p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${optStyle}">
                  <span class="w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-cyan-500 text-black" : "bg-slate-700 text-slate-300"
                  }">${opt.key}</span>
                  <span class="text-xs sm:text-sm">${opt.text}</span>
                </div>
              `;
            }).join("")}
          </div>
        `
        }

        ${
          isListeningSubmitted && q.explanation
            ? `
          <div class="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
            <div>
              <strong class="text-amber-300 font-bold">Giải thích đáp án:</strong> ${q.explanation}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  });

  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function selectListeningOption(qId, optKey) {
  if (isListeningSubmitted) return;
  userListeningAnswers[qId] = optKey;
  if (typeof LISTENING_TESTS !== "undefined" && LISTENING_TESTS.length) {
    const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
    renderListeningQuestions(test.parts[currentListeningPartIdx]);
  }
}

function toggleListeningPlay() {
  const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
  const part = test.parts[currentListeningPartIdx];
  const icon = document.getElementById("listeningPlayIcon");

  // A. If part has real MP3 audio file
  if (part.audioSrc && listeningAudioEl) {
    if (listeningAudioEl.paused) {
      listeningAudioEl.play().then(() => {
        if (icon) {
          icon.setAttribute("data-lucide", "pause");
          if (typeof lucide !== "undefined") lucide.createIcons();
        }
      }).catch(e => {
        console.warn("Audio play prevented:", e);
        showToast("Bấm lại nút Play để phát audio!", "warning");
      });
    } else {
      listeningAudioEl.pause();
      if (icon) {
        icon.setAttribute("data-lucide", "play");
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
    }
    return;
  }

  // B. Fallback to Web Speech API narration if no MP3
  if ("speechSynthesis" in window && part.transcript) {
    if (isSyntheticSpeechPlaying) {
      window.speechSynthesis.cancel();
      isSyntheticSpeechPlaying = false;
      if (icon) {
        icon.setAttribute("data-lucide", "play");
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
      showToast("Đã tạm dừng bài đọc", "info");
    } else {
      window.speechSynthesis.cancel();
      const fullText = part.transcript.map(t => `${t.speaker}: ${t.en}`).join(". ");
      syntheticSpeechUtterance = new SpeechSynthesisUtterance(fullText);
      syntheticSpeechUtterance.lang = "en-US";
      syntheticSpeechUtterance.rate = 0.9;

      syntheticSpeechUtterance.onend = () => {
        isSyntheticSpeechPlaying = false;
        if (icon) {
          icon.setAttribute("data-lucide", "play");
          if (typeof lucide !== "undefined") lucide.createIcons();
        }
      };

      window.speechSynthesis.speak(syntheticSpeechUtterance);
      isSyntheticSpeechPlaying = true;
      if (icon) {
        icon.setAttribute("data-lucide", "pause");
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
      showToast("Đang phát bài nói qua giọng đọc chuẩn tiếng Anh...", "info");
    }
  }
}

function seekListening(secs) {
  if (listeningAudioEl && listeningAudioEl.duration) {
    listeningAudioEl.currentTime = Math.max(0, Math.min(listeningAudioEl.duration, listeningAudioEl.currentTime + secs));
  }
}

function onListeningSeek(percent) {
  if (listeningAudioEl && listeningAudioEl.duration) {
    listeningAudioEl.currentTime = (percent / 100) * listeningAudioEl.duration;
  }
}

function setListeningSpeed(rate) {
  if (listeningAudioEl) listeningAudioEl.playbackRate = parseFloat(rate);
  const btns = document.querySelectorAll(".btn-listening-speed");
  btns.forEach(b => {
    b.classList.toggle("bg-cyan-600", b.dataset.rate === String(rate));
    b.classList.toggle("text-white", b.dataset.rate === String(rate));
    b.classList.toggle("bg-slate-800", b.dataset.rate !== String(rate));
  });
  showToast(`Tốc độ nghe: ${rate}x`, "info");
}

function submitListeningTest() {
  if (typeof LISTENING_TESTS === "undefined" || !LISTENING_TESTS.length) return;
  const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
  const part = test.parts[currentListeningPartIdx];
  if (!part) return;

  const total = part.questions.length;
  const answered = Object.keys(userListeningAnswers).length;
  if (answered < total) {
    if (!confirm(`Bạn mới trả lời ${answered}/${total} câu. Bạn có chắc chắn muốn nộp bài để chấm điểm ngay?`)) {
      return;
    }
  }

  isListeningSubmitted = true;
  let correctCount = 0;
  part.questions.forEach(q => {
    if (userListeningAnswers[q.id] === q.correct) {
      correctCount++;
    }
  });

  const pct = Math.round((correctCount / total) * 100);
  const scoreBanner = document.getElementById("listeningScoreBanner");
  const scoreText = document.getElementById("listeningScoreText");

  if (scoreBanner && scoreText) {
    scoreBanner.classList.remove("hidden");
    scoreText.innerHTML = `
      <div class="text-2xl sm:text-3xl font-black text-amber-300">Kết quả: ${correctCount} / ${total} Câu Đúng (${pct}%)</div>
      <p class="text-xs sm:text-sm text-slate-300 mt-1">
        ${
          pct === 100
            ? "🎉 Tuyệt đỉnh! Bạn trả lời chính xác 100% tất cả các câu hỏi của bài thi này!"
            : pct >= 80
            ? "👏 Rất tốt! Kỹ năng nghe hiểu chi tiết của bạn đạt mức xuất sắc!"
            : pct >= 50
            ? "👍 Khá tốt! Hãy xem Lời thoại (Transcript) bên dưới để xem lại các câu chưa đúng nhé."
            : "💪 Cố lên! Hãy đọc kỹ Lời thoại & Bằng chứng bên dưới để rút kinh nghiệm cho lần nghe sau nhé."
        }
      </p>
    `;
  }

  renderListeningQuestions(part);
  const transBox = document.getElementById("listeningTranscriptCard");
  if (transBox) transBox.classList.remove("hidden");

  // Ghi nhận hoàn thành bài nghe chuẩn form vào Deadline hôm nay (Mục tiêu 2 bài/ngày)
  const curDay = missionRegistry.currentDay || 1;
  const curStatus = getDayMissionStatus(curDay);
  const partKey = `${test.id}_p${part.partNumber}`;

  let doneList = [...(curStatus.completedListeningTests || [])];
  if (!doneList.includes(partKey)) {
    doneList.push(partKey);
  }

  const isAllListeningDone = doneList.length >= 2;
  setDayMissionStatus(curDay, {
    completedListeningTests: doneList,
    listeningDoneCount: Math.min(2, doneList.length),
    listeningDone: isAllListeningDone
  });

  const dailyBadge = document.getElementById("listeningDailyStatusBadge");
  if (dailyBadge) {
    dailyBadge.innerText = isAllListeningDone ? "✓ Hôm nay: Đã xong 2/2 bài nghe!" : `⏳ Hôm nay: ${doneList.length}/2 bài nghe`;
    dailyBadge.className = isAllListeningDone ? "px-3 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1" : "px-3 py-1.5 rounded-xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1";
  }

  updateDailyGoalChecklist();
  updateDailyMissionUI();

  if (isAllListeningDone) {
    showToast(`🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn mục tiêu 2 bài nghe chuẩn form hôm nay (${correctCount}/${total} câu đúng)!`, "success");
  } else {
    showToast(`✓ Đã nộp bài nghe: ${correctCount}/${total} câu đúng (${doneList.length}/2 bài hôm nay). Hãy làm thêm 1 bài nữa để hoàn thành deadline nhé!`, "info");
  }
}

function resetListeningTest() {
  userListeningAnswers = {};
  isListeningSubmitted = false;
  if (typeof LISTENING_TESTS !== "undefined" && LISTENING_TESTS.length) {
    const test = LISTENING_TESTS[currentListeningTestIdx] || LISTENING_TESTS[0];
    renderListeningQuestions(test.parts[currentListeningPartIdx]);
  }
  const scoreBanner = document.getElementById("listeningScoreBanner");
  if (scoreBanner) scoreBanner.classList.add("hidden");
  showToast("Đã làm mới bài thi. Hãy chọn lại các đáp án!", "info");
}

function toggleListeningTranscript() {
  const transBox = document.getElementById("listeningTranscriptCard");
  if (transBox) {
    transBox.classList.toggle("hidden");
  }
}

function renderListeningTranscript(part) {
  const container = document.getElementById("listeningTranscriptBody");
  if (!container || !part.transcript) return;

  let html = "";
  part.transcript.forEach((line) => {
    html += `
      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            line.speaker.toLowerCase().includes("interviewer") ? "bg-indigo-500/20 text-indigo-300" : "bg-cyan-500/20 text-cyan-300"
          }">${line.speaker}</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">${line.en}</p>
        <p class="text-xs text-slate-400 leading-relaxed italic border-t border-slate-800/60 pt-1 mt-1">${line.vi}</p>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ============================================================================
// VIETNAM TODAY & 100 INTERNATIONAL NEWS VIDEO HUB CONTROLLER
// Supports BBC News, CNN 10, Bloomberg, TED-Ed, Reuters, Vox, CNBC, VTV4
// ============================================================================
let currentVideoIdx = 0;
let currentVideoSourceFilter = "all";
let currentVideoSearchQuery = "";
const WATCHED_VIDEOS_KEY = "EMH_WATCHED_VIDEOS_V1";

function getAllNewsVideos() {
  const vnt = (typeof VIETNAM_TODAY_VIDEOS !== "undefined" && Array.isArray(VIETNAM_TODAY_VIDEOS)) ? VIETNAM_TODAY_VIDEOS : [];
  const intl = (typeof INTERNATIONAL_NEWS_VIDEOS !== "undefined" && Array.isArray(INTERNATIONAL_NEWS_VIDEOS)) ? INTERNATIONAL_NEWS_VIDEOS : [];
  
  const normalizedVnt = vnt.map((v, i) => ({
    ...v,
    source: v.source || "Vietnam Today",
    id: v.id || `vnt_${i}`
  }));
  return [...normalizedVnt, ...intl];
}

function getFilteredNewsVideos() {
  const all = getAllNewsVideos();
  return all.filter(vid => {
    // Channel / source filter
    if (currentVideoSourceFilter !== "all") {
      const src = (vid.source || "").toLowerCase();
      const filter = currentVideoSourceFilter.toLowerCase();
      if (!src.includes(filter) && !filter.includes(src)) return false;
    }
    // Search query
    if (currentVideoSearchQuery && currentVideoSearchQuery.trim()) {
      const q = currentVideoSearchQuery.toLowerCase().trim();
      const matchTitle = (vid.title || "").toLowerCase().includes(q);
      const matchVnTitle = (vid.vnTitle || "").toLowerCase().includes(q);
      const matchCat = (vid.category || "").toLowerCase().includes(q);
      const matchSource = (vid.source || "").toLowerCase().includes(q);
      if (!matchTitle && !matchVnTitle && !matchCat && !matchSource) return false;
    }
    return true;
  });
}

function filterNewsVideoSource(src) {
  currentVideoSourceFilter = src;
  const btnMap = {
    "all": "btnVidSrcAll",
    "BBC News": "btnVidSrcBBC",
    "CNN 10": "btnVidSrcCNN",
    "Bloomberg": "btnVidSrcBloomberg",
    "TED-Ed": "btnVidSrcTED",
    "Vietnam Today": "btnVidSrcVNT"
  };
  Object.entries(btnMap).forEach(([k, btnId]) => {
    const b = document.getElementById(btnId);
    if (b) {
      if (k === src) {
        b.className = "px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow transition";
      } else {
        b.className = "px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition";
      }
    }
  });
  currentVideoIdx = 0;
  renderVietnamTodaySelector();
  const filtered = getFilteredNewsVideos();
  if (filtered.length > 0) {
    loadVietnamTodayVideo(0);
  }
}

function searchNewsVideos(query) {
  currentVideoSearchQuery = query || "";
  currentVideoIdx = 0;
  renderVietnamTodaySelector();
  const filtered = getFilteredNewsVideos();
  if (filtered.length > 0) {
    loadVietnamTodayVideo(0);
  }
}

function getWatchedVietnamTodayVideos() {
  try {
    const raw = localStorage.getItem(WATCHED_VIDEOS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
}

function saveWatchedVietnamTodayVideos(setObj) {
  try {
    localStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(Array.from(setObj)));
  } catch (e) {}
}

function isVietnamTodayVideoWatched(vidIdx) {
  const filtered = getFilteredNewsVideos();
  const vid = filtered[vidIdx];
  if (!vid) return false;
  const watchedSet = getWatchedVietnamTodayVideos();
  return watchedSet.has(vid.id || `vnt_${vidIdx}`);
}

function toggleWatchVietnamTodayVideo(vidIdx) {
  const filtered = getFilteredNewsVideos();
  const vid = filtered[vidIdx];
  if (!vid) return;

  const vidId = vid.id || `vnt_${vidIdx}`;
  const watchedSet = getWatchedVietnamTodayVideos();
  let nowWatched = false;

  if (watchedSet.has(vidId)) {
    watchedSet.delete(vidId);
    nowWatched = false;
    showToast(`Đã bỏ đánh dấu xem video "${vid.title.substring(0, 30)}..."`, "info");
  } else {
    watchedSet.add(vidId);
    nowWatched = true;
    showToast(`🎉 Tuyệt vời! Bạn đã hoàn thành xem video bản tin hôm nay (Hạn 22:00)! Đã ghi nhận tiến độ!`, "success");
  }
  saveWatchedVietnamTodayVideos(watchedSet);

  // Update daily mission
  const curDay = missionRegistry.currentDay || 1;
  const watchedList = Array.from(watchedSet);
  setDayMissionStatus(curDay, {
    videoDone: watchedSet.size > 0,
    completedVideos: watchedList
  });

  renderVietnamTodaySelector();
  updateTopWatchToggleBtn(vidIdx);
  updateDailyMissionUI();
  updateDailyGoalChecklist();
  if (typeof triggerBackgroundCloudSync === "function") triggerBackgroundCloudSync();
}

function updateTopWatchToggleBtn(vidIdx) {
  const btn = document.getElementById("btnTopWatchToggle");
  const txt = document.getElementById("btnTopWatchToggleText");
  if (!btn || !txt) return;

  const watched = isVietnamTodayVideoWatched(vidIdx);
  if (watched) {
    btn.className = "px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-95 border border-emerald-400";
    txt.innerText = "✓ Đã xem video này (Hoàn thành hạn 22:00)";
  } else {
    btn.className = "px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95";
    txt.innerText = "○ Đánh dấu đã xem video này (Hạn 22:00)";
  }
}

function initVietnamTodayModule() {
  renderVietnamTodaySelector();
  loadVietnamTodayVideo(0);
}

// SIDEBAR PLAYLIST RENDERER (DANH SÁCH 100+ BẢN TIN QUỐC TẾ & VIETNAM TODAY)
function renderVietnamTodaySelector() {
  const container = document.getElementById("vietnamTodayVideoSelector");
  const statsBadge = document.getElementById("vntWatchedStatsBadge");
  if (!container) return;

  const filtered = getFilteredNewsVideos();
  const allVideos = getAllNewsVideos();
  const watchedSet = getWatchedVietnamTodayVideos();
  const total = allVideos.length;
  let watchedCount = 0;
  allVideos.forEach((v, i) => {
    if (watchedSet.has(v.id || `vnt_${i}`)) watchedCount++;
  });

  if (statsBadge) {
    statsBadge.innerText = `${watchedCount}/${total} Đã xem (${filtered.length} hiển thị)`;
    statsBadge.className = watchedCount > 0 ? "px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30" : "px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-xs";
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 glass-card rounded-2xl border border-slate-800 space-y-2">
        <i data-lucide="video-off" class="w-8 h-8 text-slate-500 mx-auto"></i>
        <p class="text-xs font-semibold">Không tìm thấy video nào phù hợp.</p>
        <button onclick="filterNewsVideoSource('all')" class="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold">Xem tất cả 100+ video</button>
      </div>
    `;
    if (typeof lucide !== "undefined") lucide.createIcons();
    return;
  }

  let html = "";
  filtered.forEach((vid, idx) => {
    const active = (idx === currentVideoIdx);
    const isWatched = watchedSet.has(vid.id || `vnt_${idx}`);
    const sourceLabel = vid.source || "Bản tin";

    html += `
      <div onclick="switchVietnamTodayVideo(${idx})" class="p-3.5 rounded-2xl border cursor-pointer transition space-y-2 group relative overflow-hidden ${
        active
          ? "bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/50"
          : "glass-card hover:bg-slate-800/90 border-slate-800 text-slate-300"
      }">
        <div class="flex items-center justify-between text-[11px] gap-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">${sourceLabel}</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">${vid.category || "Tin Tức"}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-mono text-[10px] flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${vid.duration}</span>
            <button onclick="event.stopPropagation(); toggleWatchVietnamTodayVideo(${idx})" class="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${
              isWatched
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
            }" title="Bấm để đánh dấu đã xem">
              <i data-lucide="${isWatched ? 'check-circle' : 'circle'}" class="w-3 h-3 ${isWatched ? 'text-emerald-400' : 'text-slate-500'}"></i>
              <span>${isWatched ? 'Đã xem' : 'Chưa xem'}</span>
            </button>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-rose-200 transition">${vid.title}</h4>
          <p class="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">${vid.vnTitle}</p>
        </div>

        ${active ? '<div class="text-[10px] text-rose-400 font-bold flex items-center gap-1"><i data-lucide="play" class="w-3 h-3 fill-rose-400"></i> Đang phát video này</div>' : ''}
      </div>
    `;
  });

  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function switchVietnamTodayVideo(idx) {
  currentVideoIdx = idx;
  renderVietnamTodaySelector();
  loadVietnamTodayVideo(idx);
}

function loadVietnamTodayVideo(idx) {
  const filtered = getFilteredNewsVideos();
  if (!filtered.length) return;
  const vid = filtered[idx];
  if (!vid) return;

  // 1. YouTube Iframe with robust cross-origin & no-cookie support
  const playerContainer = document.getElementById("vietnamTodayIframeContainer");
  if (playerContainer) {
    playerContainer.innerHTML = `
      <div class="relative w-full h-full flex flex-col justify-center items-center bg-black/90 rounded-2xl overflow-hidden group">
        <iframe 
          id="ytPlayerFrame"
          class="w-full h-full rounded-2xl border-0 aspect-video" 
          src="https://www.youtube.com/embed/${vid.youtubeId}?rel=0&playsinline=1&modestbranding=1" 
          title="${vid.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  }

  // 2. Video Info & Quick Watch Toolbar
  const titleEl = document.getElementById("vntVideoTitle");
  const descEl = document.getElementById("vntVideoDesc");
  if (titleEl) {
    titleEl.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>${vid.title}</span>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">${vid.source || 'Tin Tức'}</span>
      </div>
    `;
  }
  if (descEl) {
    descEl.innerHTML = `
      <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${vid.vnTitle} • ${vid.description}</p>
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 mt-2">
        <a href="https://www.youtube.com/watch?v=${vid.youtubeId}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/40">
          <i data-lucide="youtube" class="w-4 h-4 fill-white"></i> Xem trực tiếp trên YouTube
        </a>
        <button onclick="reloadVietnamTodayPlayer()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i> Tải lại Player
        </button>
        <span class="text-xs text-slate-400 font-mono py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
          Chủ đề: ${vid.category || 'Quốc tế'}
        </span>
      </div>
    `;
  }

  // 3. Vocabulary
  renderVietnamTodayVocab(vid.vocabulary || []);

  // 4. Script
  renderVietnamTodayScript(vid.script || []);
  updateTopWatchToggleBtn(idx);
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function reloadVietnamTodayPlayer() {
  loadVietnamTodayVideo(currentVideoIdx);
  showToast("🔄 Đã tải lại trình phát video YouTube!", "info");
}

function renderVietnamTodayVocab(vocabList) {
  const container = document.getElementById("vntVocabContainer");
  const countBadge = document.getElementById("vntVocabCountBadge");
  if (!container || !Array.isArray(vocabList)) return;

  if (countBadge) countBadge.innerText = `${vocabList.length} Từ Vựng Trọng Tâm`;

  let html = "";
  vocabList.forEach((v, idx) => {
    html += `
      <div class="glass-card p-4 rounded-xl border border-slate-700/80 hover:border-cyan-500/50 transition space-y-2 group bg-slate-900/60">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base sm:text-lg font-black text-amber-300 font-mono tracking-wide">${v.word}</span>
              <button onclick="speakWord('${v.word}')" class="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-600 transition active:scale-90" title="🔊 Nghe phát âm chuẩn US">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
              </button>
            </div>
            <div class="text-[11px] text-cyan-300 font-mono mt-0.5">${v.ipa || ""} • <span class="text-slate-300">${v.pos || ""}</span></div>
          </div>
          <button id="btn-save-vnt-${currentVideoIdx}-${idx}" onclick="saveVideoWordToNotebook(${currentVideoIdx}, ${idx})" class="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/40 transition shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0" title="Thêm vào Flashcard để ôn tập lặp lại ngắt quãng">
            <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
            <span>+ Lưu Flashcard</span>
          </button>
        </div>

        <div class="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs sm:text-sm text-slate-100 font-medium">
          🇻🇳 ${v.meaning}
        </div>

        <div class="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-indigo-500/40 space-y-0.5">
          <p class="font-medium text-slate-200">${v.example}</p>
          <p class="text-slate-400 italic text-[11px]">${v.exampleVn || ""}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function saveVideoWordToNotebook(vidIdx, wordIdx) {
  const filtered = getFilteredNewsVideos();
  const vid = filtered[vidIdx];
  if (!vid || !vid.vocabulary || !vid.vocabulary[wordIdx]) return;

  const v = vid.vocabulary[wordIdx];
  const item = {
    word: v.word,
    pos: v.pos || "Từ vựng",
    pron: v.ipa || `/${v.word.toLowerCase()}/`,
    meaning_vi: v.meaning,
    meaning_en: v.meaning,
    example: v.example || `Context: "${v.word}"`,
    source: vid.source || "Tin tức quốc tế",
    cardOrigin: "news_video",
    cardOriginText: `📺 ${vid.source || 'Video'}: ${vid.title.substring(0, 25)}...`,
    type: "word"
  };

  saveCustomWordItem(item);

  const btn = document.getElementById(`btn-save-vnt-${vidIdx}-${wordIdx}`);
  if (btn) {
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>✓ Đã lưu</span>`;
    btn.className = "px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-950/40 shrink-0";
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  showToast(`🎉 Đã thêm từ "${v.word}" vào bộ Flashcard ôn tập!`, "success");
  if (typeof triggerBackgroundCloudSync === "function") {
    triggerBackgroundCloudSync();
  }
}

function saveAllVietnamTodayWordsToNotebook(vidIdx) {
  const filtered = getFilteredNewsVideos();
  const vid = filtered[vidIdx];
  if (!vid || !vid.vocabulary || !vid.vocabulary.length) return;

  let added = 0;
  vid.vocabulary.forEach((v, idx) => {
    const item = {
      word: v.word,
      pos: v.pos || "Từ vựng",
      pron: v.ipa || `/${v.word.toLowerCase()}/`,
      meaning_vi: v.meaning,
      meaning_en: v.meaning,
      example: v.example || `Context: "${v.word}"`,
      source: vid.source || "Tin tức quốc tế",
      cardOrigin: "news_video",
      cardOriginText: `📺 ${vid.source || 'Video'}: ${vid.title.substring(0, 25)}...`,
      type: "word"
    };
    saveCustomWordItem(item);
    added++;
  });

  renderVietnamTodayVocab(vid.vocabulary);
  showToast(`🎉 Đã lưu toàn bộ ${added} từ vựng của bản tin vào Flashcard ôn tập!`, "success");
  if (typeof triggerBackgroundCloudSync === "function") {
    triggerBackgroundCloudSync();
  }
}

function renderVietnamTodayScript(scriptList) {
  const container = document.getElementById("vntScriptContainer");
  if (!container || !Array.isArray(scriptList)) return;

  let html = "";
  scriptList.forEach(s => {
    html += `
      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1">
            <i data-lucide="play-circle" class="w-3 h-3"></i> ${s.time}
          </span>
        </div>
        <p class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">${s.en}</p>
        <p class="text-xs text-slate-400 italic leading-relaxed pt-1 border-t border-slate-800/60">${s.vi}</p>
      </div>
    `;
  });

  container.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();
}


// ============================================================================
// INSTANT CLIENT-SIDE VIETNAMESE TRANSLATION ENGINE (100% COVERAGE)
// ============================================================================
async function translateWordClient(rawWord, contextSentence = "") {
  const clean = cleanWordText(rawWord);
  if (!clean) return { word: "", meaning_vi: "" };
  const lower = clean.toLowerCase();

  // 1. Static Lexicon
  if (typeof READING_WORDS_LEXICON !== "undefined" && READING_WORDS_LEXICON[lower]) {
    const entry = READING_WORDS_LEXICON[lower];
    return {
      word: clean,
      pos: entry.pos || "Từ vựng",
      ipa: entry.ipa || `/${lower}/`,
      meaning_vi: entry.meaning_vi,
      example: entry.example || contextSentence || `Example sentence with "${clean}".`
    };
  }

  // 2. Units in APP_DATA
  if (window.APP_DATA && window.APP_DATA.units) {
    for (const u of window.APP_DATA.units) {
      for (const d of u.days || []) {
        for (const w of d.words || []) {
          if (w.word && w.word.toLowerCase() === lower) {
            return {
              word: w.word,
              pos: w.pos || "Từ vựng",
              ipa: w.pron || `/${lower}/`,
              meaning_vi: w.meaning_vi || w.meaning || "",
              example: w.example || contextSentence || `Example with "${w.word}".`
            };
          }
        }
      }
    }
  }

  // 3. Vietnam Today, International News & Cinema Vocab
  if (typeof INTERNATIONAL_NEWS_VIDEOS !== "undefined") {
    for (const vid of INTERNATIONAL_NEWS_VIDEOS) {
      for (const v of vid.vocabulary || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning,
            example: v.example || contextSentence
          };
        }
      }
    }
  }
  if (typeof VIETNAM_TODAY_VIDEOS !== "undefined") {
    for (const vid of VIETNAM_TODAY_VIDEOS) {
      for (const v of vid.vocabulary || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning,
            example: v.example || contextSentence
          };
        }
      }
    }
  }
  if (typeof BILINGUAL_MOVIES !== "undefined") {
    for (const m of BILINGUAL_MOVIES) {
      for (const v of m.vocabulary || []) {
        if (v.word && v.word.toLowerCase() === lower) {
          return {
            word: v.word,
            pos: v.pos || "Từ vựng",
            ipa: v.ipa || `/${lower}/`,
            meaning_vi: v.meaning_vi || v.meaning,
            example: v.example || contextSentence
          };
        }
      }
    }
  }

  // 4. Word Stemming
  const stems = ["ing", "ed", "es", "s", "ly"];
  for (const sfx of stems) {
    if (lower.endsWith(sfx) && lower.length > sfx.length + 2) {
      const stem = lower.slice(0, -sfx.length);
      if (typeof READING_WORDS_LEXICON !== "undefined" && READING_WORDS_LEXICON[stem]) {
        const entry = READING_WORDS_LEXICON[stem];
        return {
          word: clean,
          pos: entry.pos || "Từ vựng",
          ipa: entry.ipa || `/${lower}/`,
          meaning_vi: entry.meaning_vi,
          example: entry.example || contextSentence
        };
      }
    }
  }

  // 5. Client-side Realtime Translation via Google API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const vi = data?.[0]?.map(p => p[0]).join("").trim();
      if (vi && vi.toLowerCase() !== lower) {
        return {
          word: clean,
          pos: "Từ vựng tra cứu",
          ipa: `/${lower}/`,
          meaning_vi: vi,
          example: contextSentence || `Authentic context: "${clean}".`
        };
      }
    }
  } catch (e) {}

  return {
    word: clean,
    pos: "Từ vựng",
    ipa: `/${lower}/`,
    meaning_vi: `Định nghĩa từ vựng: ${clean}`,
    example: contextSentence || `Example sentence with ${clean}.`
  };
}

// ============================================================================
// BILINGUAL CINEMA & TV SERIES CONTROLLER (PHIM SONG NGỮ ANH - VIỆT)
// ============================================================================
let currentCinemaIdx = 0;
let currentCinemaSubMode = "bilingual"; // 'bilingual', 'en', 'none'

function initBilingualCinemaModule() {
  renderCinemaPlaylist();
  loadCinemaMovie(0);
}

function renderCinemaPlaylist() {
  const container = document.getElementById("cinemaPlaylistSelector");
  const countBadge = document.getElementById("cinemaMoviesCountBadge");
  if (!container || typeof BILINGUAL_MOVIES === "undefined" || !BILINGUAL_MOVIES.length) return;

  if (countBadge) countBadge.innerText = `${BILINGUAL_MOVIES.length} trích đoạn kinh điển`;

  let html = "";
  BILINGUAL_MOVIES.forEach((m, idx) => {
    const isActive = (idx === currentCinemaIdx);
    const borderClass = isActive ? "border-pink-500 bg-pink-950/40 shadow-lg" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/80";
    html += `
      <div onclick="selectCinemaMovie(${idx})" class="p-3 rounded-xl border ${borderClass} cursor-pointer transition flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-pink-400 font-bold shrink-0 border border-slate-700">
          <i data-lucide="${isActive ? 'play' : 'film'}" class="w-5 h-5"></i>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold font-mono">${m.duration}</span>
            <span class="text-[10px] text-slate-400">${m.genre.split('•')[0]}</span>
          </div>
          <h4 class="font-bold text-white text-xs truncate mt-0.5">${m.title}</h4>
          <p class="text-[11px] text-slate-400 truncate">${m.vnTitle}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function selectCinemaMovie(idx) {
  currentCinemaIdx = idx;
  renderCinemaPlaylist();
  loadCinemaMovie(idx);
}

function loadCinemaMovie(idx) {
  if (typeof BILINGUAL_MOVIES === "undefined" || !BILINGUAL_MOVIES[idx]) return;
  const m = BILINGUAL_MOVIES[idx];

  // 1. YouTube Iframe with robust parameters
  const playerContainer = document.getElementById("cinemaVideoPlayerContainer");
  if (playerContainer) {
    playerContainer.innerHTML = `
      <div class="relative w-full h-full flex flex-col justify-center items-center bg-black/95 rounded-2xl overflow-hidden group">
        <iframe 
          id="cinemaPlayerFrame"
          class="w-full h-full rounded-2xl border-0 aspect-video" 
          src="https://www.youtube.com/embed/${m.youtubeId}?rel=0&playsinline=1&modestbranding=1" 
          title="${m.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  }

  // 2. Movie Title & Action Links
  const titleEl = document.getElementById("cinemaMovieTitle");
  const descEl = document.getElementById("cinemaMovieDesc");
  if (titleEl) {
    titleEl.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>${m.title}</span>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 font-mono">${m.level}</span>
      </div>
    `;
  }
  if (descEl) {
    descEl.innerHTML = `
      <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${m.vnTitle} • ${m.description}</p>
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 mt-2">
        <a href="https://www.youtube.com/watch?v=${m.youtubeId}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/40">
          <i data-lucide="youtube" class="w-4 h-4 fill-white"></i> Mở xem trực tiếp trên YouTube
        </a>
        <button onclick="reloadCinemaMoviePlayer()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i> Tải lại Player
        </button>
      </div>
    `;
  }

  // 3. Key Expressions
  renderCinemaExpressions(m.key_expressions);

  // 4. Subtitles
  renderCinemaSubtitles(m.subtitles);

  // 5. Vocab
  renderCinemaVocab(m.vocabulary);

  if (window.lucide) lucide.createIcons();
}

function reloadCinemaMoviePlayer() {
  loadCinemaMovie(currentCinemaIdx);
  showToast("🔄 Đã tải lại trình phát phim!", "info");
}

function setCinemaSubMode(mode) {
  currentCinemaSubMode = mode;
  ["bilingual", "en", "none"].forEach(m => {
    const btn = document.getElementById(`btnSub${m.charAt(0).toUpperCase() + m.slice(1)}`);
    if (btn) {
      if (m === mode) {
        btn.className = "px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow transition";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition";
      }
    }
  });

  const curMovie = BILINGUAL_MOVIES[currentCinemaIdx];
  if (curMovie) renderCinemaSubtitles(curMovie.subtitles);
}

function renderCinemaExpressions(expressions) {
  const container = document.getElementById("cinemaExpressionsContainer");
  if (!container || !Array.isArray(expressions)) return;

  let html = "";
  expressions.forEach(e => {
    html += `
      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-1 hover:border-amber-500/40 transition">
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold text-amber-300 text-xs sm:text-sm">"${e.phrase}"</span>
          <button onclick="speakText('${e.phrase.replace(/'/g, "\'")}')" class="p-1 rounded bg-amber-500/20 text-amber-300 hover:text-white hover:bg-amber-500 transition" title="Nghe phát âm">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-xs text-slate-200 font-medium">${e.vi}</p>
        <p class="text-[11px] text-slate-400 italic">${e.note || ""}</p>
      </div>
    `;
  });
  container.innerHTML = html;
}

function renderCinemaSubtitles(subtitles) {
  const container = document.getElementById("cinemaSubtitlesList");
  if (!container || !Array.isArray(subtitles)) return;

  if (currentCinemaSubMode === "none") {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 space-y-2">
        <i data-lucide="eye-off" class="w-8 h-8 mx-auto text-slate-500"></i>
        <p class="text-xs font-semibold">Chế độ thử thách: Đã ẩn toàn bộ phụ đề để rèn luyện thính giác tự nhiên.</p>
        <button onclick="setCinemaSubMode('bilingual')" class="px-3 py-1.5 rounded-xl bg-pink-600/30 text-pink-300 hover:bg-pink-600 hover:text-white text-xs font-bold transition">
          Bật lại phụ đề song ngữ
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  let html = "";
  subtitles.forEach((s, sIdx) => {
    // Make each word clickable for 1-click lookup
    const wordsTokens = s.en.split(/\s+/).map(tok => {
      const clean = tok.replace(/[^a-zA-Z]/g, "");
      if (!clean) return tok;
      return `<span onclick="showWordPopup('${clean}', '${s.en.replace(/'/g, "\'")}')" class="hover:text-pink-300 hover:underline cursor-pointer transition">${tok}</span>`;
    }).join(" ");

    html += `
      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 hover:border-pink-500/30 transition">
        <div class="flex items-center justify-between gap-2">
          <span class="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono font-bold text-[10px] flex items-center gap-1">
            <i data-lucide="clock" class="w-3 h-3"></i> ${s.start}
          </span>
          <button onclick="speakText('${s.en.replace(/'/g, "\'")}')" class="p-1 rounded bg-slate-800 hover:bg-pink-600/30 text-slate-400 hover:text-pink-300 transition" title="Nghe câu thoại">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">${wordsTokens}</p>
        ${currentCinemaSubMode === "bilingual" ? `<p class="text-xs text-slate-400 italic pt-1 border-t border-slate-800/60">${s.vi}</p>` : ""}
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function renderCinemaVocab(vocabList) {
  const container = document.getElementById("cinemaVocabContainer");
  if (!container || !Array.isArray(vocabList)) return;

  let html = "";
  vocabList.forEach(v => {
    html += `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <strong class="text-white text-sm">${v.word}</strong>
            <span class="text-[10px] text-slate-400 font-mono">${v.ipa}</span>
          </div>
          <button onclick="speakWord('${v.word}')" class="p-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-cyan-400 transition" title="Nghe phát âm">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-cyan-300 font-semibold">${v.meaning_vi || v.meaning}</p>
        <p class="text-[11px] text-slate-400 italic">"${v.example}"</p>
      </div>
    `;
  });
  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function saveAllCinemaWordsToFlashcard() {
  const curMovie = BILINGUAL_MOVIES[currentCinemaIdx];
  if (!curMovie || !Array.isArray(curMovie.vocabulary)) return;

  let added = 0;
  curMovie.vocabulary.forEach(v => {
    const item = {
      word: v.word,
      pos: v.pos || "word",
      pron: v.ipa || `/${v.word}/`,
      meaning_vi: v.meaning_vi || v.meaning,
      meaning_en: `Vocabulary from movie: ${curMovie.title}`,
      example: v.example,
      source: "Phim Song Ngữ",
      cardOrigin: "cinema",
      cardOriginText: `🎬 Phim: ${curMovie.title.substring(0, 20)}...`,
      type: "word"
    };
    saveCustomWordItem(item);
    added++;
  });
  showToast(`🎉 Đã lưu toàn bộ ${added} từ vựng của phim vào bộ Flashcard ôn tập!`, "success");
}

// ============================================================================
// BILINGUAL GLOBAL NEWS CONTROLLER (BÁO SONG NGỮ QUỐC TẾ)
// ============================================================================
let activeReaderMode = "vstep"; // 'vstep' or 'news'

function switchReaderMode(mode) {
  activeReaderMode = mode;
  const btnVstep = document.getElementById("btnReaderModeVstep");
  const btnNews = document.getElementById("btnReaderModeNews");
  const vstepView = document.querySelector("#tab-reader .grid.grid-cols-1.lg\:grid-cols-12");
  const newsView = document.getElementById("bilingualNewsContainer");

  if (mode === "news") {
    if (btnNews) btnNews.className = "px-3.5 py-2 rounded-lg bg-cyan-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow";
    if (btnVstep) btnVstep.className = "px-3.5 py-2 rounded-lg text-slate-400 hover:text-white font-bold text-xs transition flex items-center gap-1.5";
    if (vstepView) vstepView.classList.add("hidden");
    if (newsView) {
      newsView.classList.remove("hidden");
      renderBilingualNewsArticles();
    }
  } else {
    if (btnVstep) btnVstep.className = "px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow";
    if (btnNews) btnNews.className = "px-3.5 py-2 rounded-lg text-slate-400 hover:text-white font-bold text-xs transition flex items-center gap-1.5";
    if (vstepView) vstepView.classList.remove("hidden");
    if (newsView) newsView.classList.add("hidden");
  }
}

function renderBilingualNewsArticles() {
  const container = document.getElementById("bilingualNewsContainer");
  if (!container || typeof BILINGUAL_NEWS_ARTICLES === "undefined") return;

  let html = `
    <div class="space-y-6">
      <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
        <i data-lucide="newspaper" class="w-5 h-5 text-cyan-400"></i>
        <h3 class="font-bold text-white text-base">Tuyển Tập Báo Thời Sự Song Ngữ Quốc Tế</h3>
      </div>
  `;

  BILINGUAL_NEWS_ARTICLES.forEach((art, aIdx) => {
    html += `
      <div class="glass-card rounded-2xl p-6 border border-slate-700/80 bg-slate-900/90 space-y-4 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] uppercase tracking-wider">${art.source}</span>
              <span class="text-xs text-slate-400">${art.date}</span>
              <span class="text-xs text-amber-300 font-medium">⏱️ ${art.readTime}</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-white mt-1">${art.title}</h3>
            <p class="text-xs sm:text-sm text-cyan-200">${art.vnTitle}</p>
          </div>
        </div>

        <!-- Parallel Paragraphs -->
        <div class="space-y-4">
          ${art.paragraphs.map((p, pIdx) => `
            <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 font-mono">ĐOẠN ${pIdx + 1}</span>
                <button onclick="speakText('${p.en.replace(/'/g, "\'")}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1" title="Nghe đọc đoạn văn bằng giọng US chuẩn">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Nghe đọc đoạn
                </button>
              </div>
              <p class="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">${p.en}</p>
              <p class="text-xs sm:text-sm text-slate-400 italic leading-relaxed pt-2 border-t border-slate-800/60">${p.vi}</p>
            </div>
          `).join("")}
        </div>

        <!-- Target Vocab in Article -->
        <div class="pt-3 border-t border-slate-800">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-400"></i> Từ vựng trọng tâm trong bài báo:
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            ${art.target_vocab.map(v => `
              <div class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="font-bold text-white">${v.word} <span class="text-[10px] text-slate-400 font-normal">(${v.pos})</span></div>
                  <div class="text-[11px] text-cyan-300">${v.meaning_vi}</div>
                </div>
                <button onclick="speakWord('${v.word}')" class="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white transition" title="Nghe phát âm">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

// ============================================================================
// 3 PHIÊN HỌC NGẮT QUÃNG SÁNG - TRƯA - TỐI (SPACED ROUTINE ENGINE)
// ============================================================================
function updateSessionRoutineUI() {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const totalMins = hours * 60 + mins;

  const cardMorning = document.getElementById("sessionCardMorning");
  const cardNoon = document.getElementById("sessionCardNoon");
  const cardEvening = document.getElementById("sessionCardEvening");
  const badge = document.getElementById("currentSessionBadge");

  // Reset highlight classes
  [cardMorning, cardNoon, cardEvening].forEach(c => {
    if (c) {
      c.classList.remove("ring-2", "ring-indigo-400", "bg-indigo-950/40", "ring-cyan-400", "bg-cyan-950/40", "ring-rose-400", "bg-rose-950/40");
    }
  });

  // Check progress
  const curDay = missionRegistry.currentDay || 1;
  const st = getDayMissionStatus(curDay);

  const sttM = document.getElementById("sttSessionMorning");
  const sttN = document.getElementById("sttSessionNoon");
  const sttE = document.getElementById("sttSessionEvening");

  if (sttM) {
    sttM.innerHTML = st.vocabDone ? "<span class='text-emerald-400 font-bold'>✓ Đã xong</span>" : "<span class='text-amber-400'>Chưa xong</span>";
  }
  if (sttN) {
    const isNoonDone = st.readingDone && st.grammarDone;
    sttN.innerHTML = isNoonDone ? "<span class='text-emerald-400 font-bold'>✓ Đã xong</span>" : (st.readingDone || st.grammarDone ? "<span class='text-cyan-400'>Đang làm</span>" : "<span class='text-slate-400'>Chưa xong</span>");
  }
  if (sttE) {
    sttE.innerHTML = st.videoDone ? "<span class='text-emerald-400 font-bold'>✓ Đã chốt xong</span>" : "<span class='text-slate-400'>Hạn 22:00</span>";
  }

  // Determine current active window
  if (totalMins < 690) { // Before 11:30
    if (cardMorning) cardMorning.classList.add("ring-2", "ring-indigo-400", "bg-indigo-950/40");
    if (badge) badge.innerText = "🌅 Đang ở Phiên Sáng (Học Từ Mới)";
  } else if (totalMins < 1050) { // 11:30 - 17:30
    if (cardNoon) cardNoon.classList.add("ring-2", "ring-cyan-400", "bg-cyan-950/40");
    if (badge) badge.innerText = "☀️ Đang ở Phiên Trưa (Đọc & Ngữ Pháp)";
  } else { // 17:30 - 22:00+
    if (cardEvening) cardEvening.classList.add("ring-2", "ring-rose-400", "bg-rose-950/40");
    if (badge) badge.innerText = "🌙 Đang ở Phiên Tối (Xem Video/Phim & Chốt Streak)";
  }
}

// Run routine update periodically
setInterval(updateSessionRoutineUI, 30000);



// ============================================================================
// MULTI-ACCOUNT MANAGEMENT & COMPETITIVE LEADERBOARD CONTROLLER
// ============================================================================
const STORAGE_KEY_SAVED_ACCOUNTS = "EMH_SAVED_ACCOUNTS_V1";
let currentLeaderboardFilterMode = "all"; // 'all', 'streak', 'vocab'

function getSavedAccounts() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY_SAVED_ACCOUNTS) || "[]");
  } catch (e) {
    list = [];
  }

  const currentEmail = appState.currentUser?.email || "hocvien.chinh@emh.edu.vn";
  const currentName = appState.currentUser?.full_name || (currentEmail ? currentEmail.split("@")[0].toUpperCase() : "Bạn (Học Viên)");
  const currentStreak = parseInt(localStorage.getItem("EMH_STREAK") || "14", 10);
  const curDay = (typeof missionRegistry !== "undefined" && missionRegistry.currentDay) ? missionRegistry.currentDay : 1;
  const missionDonePct = (typeof getDayMissionStatus === "function" && getDayMissionStatus(curDay).isAllDone) ? 100 : 70;

  if (!Array.isArray(list) || list.length === 0) {
    list = [
      {
        id: appState.currentUser?.id || "user_me",
        email: currentEmail,
        full_name: currentName,
        target_exam: appState.currentUser?.target_exam || "VSTEP B2 / IELTS 7.0+",
        streak: currentStreak,
        mature_words: 345,
        today_progress: missionDonePct,
        xp: (currentStreak * 150) + (345 * 20) + Math.round(missionDonePct * 5),
        token: appState.authToken || "",
        isCurrent: true
      },
      {
        id: "peer_1",
        email: "tran.mai@studygroup.vn",
        full_name: "Trần Thị Mai",
        target_exam: "VSTEP B2 Chuẩn",
        streak: Math.max(currentStreak + 2, 16),
        mature_words: 382,
        today_progress: 100,
        xp: ((Math.max(currentStreak + 2, 16)) * 150) + (382 * 20) + 500,
        token: "",
        isCurrent: false
      },
      {
        id: "peer_2",
        email: "le.hoang.dung@studygroup.vn",
        full_name: "Lê Hoàng Dũng",
        target_exam: "Speakout B1+ Toàn Diện",
        streak: Math.max(currentStreak - 1, 12),
        mature_words: 295,
        today_progress: 80,
        xp: ((Math.max(currentStreak - 1, 12)) * 150) + (295 * 20) + 400,
        token: "",
        isCurrent: false
      },
      {
        id: "peer_3",
        email: "minhthu.ielts@studygroup.vn",
        full_name: "Phạm Minh Thư",
        target_exam: "IELTS 7.5+",
        streak: Math.max(currentStreak + 5, 19),
        mature_words: 420,
        today_progress: 100,
        xp: ((Math.max(currentStreak + 5, 19)) * 150) + (420 * 20) + 500,
        token: "",
        isCurrent: false
      }
    ];
    saveSavedAccounts(list);
  } else {
    // Update active account stats
    list = list.map(acc => {
      if (acc.email === currentEmail || acc.isCurrent) {
        return {
          ...acc,
          email: currentEmail,
          full_name: currentName,
          streak: currentStreak,
          today_progress: missionDonePct,
          xp: (currentStreak * 150) + ((acc.mature_words || 345) * 20) + Math.round(missionDonePct * 5),
          token: appState.authToken || acc.token,
          isCurrent: true
        };
      }
      return { ...acc, isCurrent: false };
    });
    saveSavedAccounts(list);
  }
  return list;
}

function saveSavedAccounts(list) {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_ACCOUNTS, JSON.stringify(list));
  } catch (e) {}
}

function initMultiAccountAndLeaderboard() {
  getSavedAccounts();
  renderSavedAccounts();
  renderHomeLeaderboardPreview();
  renderLeaderboard();
}

function toggleLeaderboardDrawer() {
  const drawer = document.getElementById("leaderboardDrawer");
  if (!drawer) return;
  drawer.classList.toggle("hidden");
  if (!drawer.classList.contains("hidden")) {
    renderLeaderboard();
  }
  if (window.lucide) lucide.createIcons();
}

function filterLeaderboardMode(mode) {
  currentLeaderboardFilterMode = mode;
  ["all", "streak", "vocab"].forEach(m => {
    const btn = document.getElementById(`lb-tab-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = "py-1.5 rounded-lg bg-indigo-600 text-white shadow";
      } else {
        btn.className = "py-1.5 rounded-lg text-slate-400 hover:text-white transition";
      }
    }
  });
  renderLeaderboard();
}

function renderLeaderboard() {
  const podium = document.getElementById("leaderboardPodium");
  const listContainer = document.getElementById("leaderboardListContainer");
  if (!podium && !listContainer) return;

  const accounts = [...getSavedAccounts()];

  // Sort based on current filter
  if (currentLeaderboardFilterMode === "streak") {
    accounts.sort((a, b) => (b.streak || 0) - (a.streak || 0));
  } else if (currentLeaderboardFilterMode === "vocab") {
    accounts.sort((a, b) => (b.mature_words || 0) - (a.mature_words || 0));
  } else {
    accounts.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }

  // 1. Render Top 3 Podium
  if (podium && accounts.length >= 3) {
    const first = accounts[0];
    const second = accounts[1];
    const third = accounts[2];

    podium.innerHTML = `
      <!-- Rank 2: Silver -->
      <div class="flex flex-col items-center">
        <span class="text-xs font-bold text-slate-300">🥈 Hạng 2</span>
        <div class="w-12 h-12 rounded-full bg-slate-700/80 border-2 border-slate-400 flex items-center justify-center font-bold text-white text-sm my-1 shadow">
          ${(second.full_name || 'U').charAt(0)}
        </div>
        <div class="text-[11px] font-bold text-white truncate max-w-[85px]">${second.full_name}</div>
        <div class="text-[10px] text-slate-400 font-mono">${second.streak} ngày 🔥</div>
        <div class="w-full h-16 bg-gradient-to-t from-slate-800 to-slate-700/60 rounded-t-xl mt-1 flex items-center justify-center text-xs font-bold text-slate-300">2nd</div>
      </div>

      <!-- Rank 1: Gold -->
      <div class="flex flex-col items-center -mt-3">
        <span class="text-sm font-black text-amber-300 flex items-center gap-1">👑 🥇 Top 1</span>
        <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-yellow-200 flex items-center justify-center font-black text-slate-950 text-base my-1 shadow-lg shadow-amber-500/30">
          ${(first.full_name || 'U').charAt(0)}
        </div>
        <div class="text-xs font-extrabold text-amber-200 truncate max-w-[95px]">${first.full_name}</div>
        <div class="text-[10px] text-amber-300 font-bold font-mono">${first.streak} ngày 🔥 • ${first.xp} XP</div>
        <div class="w-full h-24 bg-gradient-to-t from-amber-950/80 via-amber-800/60 to-yellow-600/70 rounded-t-xl mt-1 border-t-2 border-amber-400 flex items-center justify-center text-sm font-black text-amber-200">1st</div>
      </div>

      <!-- Rank 3: Bronze -->
      <div class="flex flex-col items-center">
        <span class="text-xs font-bold text-amber-600">🥉 Hạng 3</span>
        <div class="w-12 h-12 rounded-full bg-amber-950/80 border-2 border-amber-700 flex items-center justify-center font-bold text-amber-200 text-sm my-1 shadow">
          ${(third.full_name || 'U').charAt(0)}
        </div>
        <div class="text-[11px] font-bold text-white truncate max-w-[85px]">${third.full_name}</div>
        <div class="text-[10px] text-slate-400 font-mono">${third.streak} ngày 🔥</div>
        <div class="w-full h-12 bg-gradient-to-t from-slate-900 to-amber-950/60 rounded-t-xl mt-1 flex items-center justify-center text-xs font-bold text-amber-400">3rd</div>
      </div>
    `;
  }

  // 2. Render Full List
  if (listContainer) {
    let listHtml = "";
    accounts.forEach((acc, idx) => {
      const isMe = !!acc.isCurrent;
      const rankBadge = idx === 0 ? "🥇" : (idx === 1 ? "🥈" : (idx === 2 ? "🥉" : `#${idx + 1}`));
      const borderClass = isMe ? "border-amber-500/80 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900" : "border-slate-800 bg-slate-950/70";

      listHtml += `
        <div class="p-3 rounded-xl border ${borderClass} flex items-center justify-between gap-3 transition">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="font-mono font-bold text-xs ${idx < 3 ? 'text-amber-300 text-sm' : 'text-slate-500'} shrink-0 w-6 text-center">${rankBadge}</span>
            <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
              ${(acc.full_name || 'U').charAt(0)}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-bold text-white text-xs truncate">${acc.full_name}</span>
                ${isMe ? '<span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40">👉 Bạn</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-400 truncate">${acc.target_exam || "VSTEP B2"}</p>
            </div>
          </div>

          <div class="text-right shrink-0">
            <div class="text-xs font-mono font-bold text-amber-300">${acc.streak} ngày 🔥</div>
            <div class="text-[11px] text-slate-400 font-mono">${acc.mature_words || 0} từ • <strong class="text-indigo-300">${acc.xp || 0} XP</strong></div>
          </div>
        </div>
      `;
    });
    listContainer.innerHTML = listHtml;
  }
}

function renderHomeLeaderboardPreview() {
  const container = document.getElementById("homeLeaderboardPreview");
  if (!container) return;

  const accounts = [...getSavedAccounts()];
  accounts.sort((a, b) => (b.xp || 0) - (a.xp || 0));

  let html = "";
  accounts.slice(0, 3).forEach((acc, idx) => {
    const medal = idx === 0 ? "🥇 Top 1" : (idx === 1 ? "🥈 Top 2" : "🥉 Top 3");
    const isMe = !!acc.isCurrent;
    const border = isMe ? "border-amber-500/70 bg-gradient-to-br from-amber-950/30 to-slate-900" : "border-slate-800 bg-slate-900/60";

    html += `
      <div class="p-3.5 rounded-xl border ${border} space-y-2 shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-300">${medal}</span>
          ${isMe ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Hồ sơ của bạn</span>' : '<span class="text-[10px] text-slate-400">Bạn cùng tiến</span>'}
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
            ${(acc.full_name || 'U').charAt(0)}
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-white text-xs truncate">${acc.full_name}</h4>
            <p class="text-[10px] text-slate-400">${acc.target_exam}</p>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 font-mono">
          <span class="text-slate-300">${acc.streak} ngày 🔥</span>
          <span class="text-indigo-300 font-bold">${acc.xp} XP</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openMultiAccountModal() {
  const modal = document.getElementById("multiAccountModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderSavedAccounts();
  if (window.lucide) lucide.createIcons();
}

function closeMultiAccountModal() {
  const modal = document.getElementById("multiAccountModal");
  if (modal) modal.classList.add("hidden");
}

function renderSavedAccounts() {
  const container = document.getElementById("savedAccountsListContainer");
  const countBadge = document.getElementById("savedAccountsCountBadge");
  const headerName = document.getElementById("headerAccountName");
  if (!container) return;

  const accounts = getSavedAccounts();
  if (countBadge) countBadge.innerText = `${accounts.length} học viên`;

  const activeAcc = accounts.find(a => a.isCurrent) || accounts[0];
  if (headerName && activeAcc) {
    headerName.innerText = activeAcc.full_name.split(" ").slice(-1)[0] || "Đổi TK";
  }

  let html = "";
  accounts.forEach(acc => {
    const isMe = !!acc.isCurrent;
    const border = isMe ? "border-indigo-500 bg-indigo-950/40" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/80";

    html += `
      <div class="p-3.5 rounded-xl border ${border} flex items-center justify-between gap-3 transition">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow">
            ${(acc.full_name || 'U').charAt(0)}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-white text-xs sm:text-sm truncate">${acc.full_name}</span>
              ${isMe ? '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">Đang học</span>' : ''}
            </div>
            <p class="text-xs text-slate-400 truncate">${acc.email} • <span class="text-cyan-300">${acc.target_exam}</span></p>
            <div class="text-[11px] text-slate-500 font-mono mt-0.5">Streak: ${acc.streak} ngày 🔥 • Từ thuộc: ${acc.mature_words || 0}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${isMe ? `
            <span class="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <i data-lucide="check" class="w-4 h-4"></i> Hiện tại
            </span>
          ` : `
            <button onclick="switchAccount('${acc.email}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-sm active:scale-95">
              Chuyển Ngay
            </button>
          `}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

async function switchAccount(email) {
  let list = getSavedAccounts();
  const target = list.find(a => a.email === email);
  if (!target) return;

  list = list.map(a => ({ ...a, isCurrent: (a.email === email) }));
  saveSavedAccounts(list);

  if (target.token) {
    appState.authToken = target.token;
    localStorage.setItem(STORAGE_KEY_AUTH, target.token);
    await checkAuthStatus();
  } else {
    appState.authToken = "";
    localStorage.removeItem(STORAGE_KEY_AUTH);
    appState.currentUser = {
      id: target.id,
      email: target.email,
      full_name: target.full_name,
      target_exam: target.target_exam,
      streak_count: target.streak
    };
    updateDailyStreak(target.streak);
    updateAuthUI();
  }

  renderSavedAccounts();
  renderLeaderboard();
  renderHomeLeaderboardPreview();
  closeMultiAccountModal();
  showToast(`🔄 Đã chuyển sang tài khoản học viên: ${target.full_name}!`, "success");
}

async function createNewAccountFromModal() {
  const nameInput = document.getElementById("newAccName");
  const targetInput = document.getElementById("newAccTarget");
  const emailInput = document.getElementById("newAccEmail");
  const passInput = document.getElementById("newAccPassword");

  const name = nameInput?.value.trim();
  const target = targetInput?.value || "VSTEP";
  const email = emailInput?.value.trim();
  const pass = passInput?.value.trim();

  if (!name || !email || !pass) {
    alert("Vui lòng nhập đầy đủ Tên, Email và Mật khẩu.");
    return;
  }
  if (pass.length < 4) {
    alert("Mật khẩu tối thiểu 4 ký tự.");
    return;
  }

  let list = getSavedAccounts();
  if (list.some(a => a.email.toLowerCase() === email.toLowerCase())) {
    alert("Email này đã tồn tại trên thiết bị. Bạn có thể bấm 'Chuyển Ngay'.");
    return;
  }

  let token = "";
  try {
    const res = await apiCall("/api/auth/register", "POST", {
      email,
      password: pass,
      full_name: name,
      target_exam: target
    });
    if (res && res.token) {
      token = res.token;
    }
  } catch (e) {}

  const newAcc = {
    id: "user_" + Date.now(),
    email,
    full_name: name,
    target_exam: target,
    streak: 1,
    mature_words: 20,
    today_progress: 0,
    xp: 250,
    token: token,
    isCurrent: true
  };

  list = list.map(a => ({ ...a, isCurrent: false }));
  list.push(newAcc);
  saveSavedAccounts(list);

  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (passInput) passInput.value = "";

  await switchAccount(email);
  showToast(`🎉 Cấp tài khoản mới thành công cho ${name}! Bắt đầu lộ trình ngay.`, "success");
}
