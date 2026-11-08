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
  loadTelegramSettings();
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
  ["today", "flashcard", "review", "reader", "grammar", "profile"].forEach(id => {
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
  } else if (tabId === "review") {
    generateDailyQuiz();
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
}

function getDayMissionStatus(dayNum) {
  const dStr = String(dayNum);
  const data = missionRegistry.history[dStr] || {
    vocabDone: false,
    vocabCount: 0,
    readingDone: false,
    readingDoneCount: 0,
    completedReadings: [],
    grammarDone: false
  };
  const isVocab = !!data.vocabDone || (data.vocabCount >= 20);
  const readingCount = (data.completedReadings && Array.isArray(data.completedReadings))
    ? data.completedReadings.length
    : (data.readingDoneCount || (data.readingDone ? 3 : 0));
  const isReading = !!data.readingDone || (readingCount >= 3);
  const isGrammar = !!data.grammarDone;
  let count = 0;
  if (isVocab) count++;
  if (isReading) count++;
  if (isGrammar) count++;

  return {
    vocabDone: isVocab,
    vocabCount: data.vocabCount || 0,
    readingDone: isReading,
    readingDoneCount: readingCount,
    completedReadings: data.completedReadings || [],
    grammarDone: isGrammar,
    completedCount: count,
    isAllDone: count === 3
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

function getDailyAssignedVocab(dayNum) {
  const units = window.APP_DATA?.units || [];
  const validDay = Math.max(1, Math.min(TOTAL_ROADMAP_DAYS, parseInt(dayNum) || 1));
  
  // Flatten all available unit days
  const allUnitDays = [];
  units.forEach((u, uIdx) => {
    (u.days || []).forEach((d, dIdx) => {
      allUnitDays.push({
        unitIndex: uIdx,
        dayIndex: dIdx,
        unitTitle: u.unitTitle,
        dayTitle: `Ngày ${validDay} (Lộ trình 3 tháng) • ${d.dayTitle}`,
        words: d.words || []
      });
    });
  });

  if (allUnitDays.length === 0) {
    return { unitIndex: 0, dayIndex: 0, unitTitle: "Unit 1", dayTitle: `Ngày ${validDay}`, words: [] };
  }

  // Map 1..60 evenly across all available unit days
  const mappedIdx = Math.min(allUnitDays.length - 1, Math.floor(((validDay - 1) / TOTAL_ROADMAP_DAYS) * allUnitDays.length));
  return allUnitDays[mappedIdx];
}

function getWordsUpToDay(maxDayNum) {
  const words = [];
  const seen = new Set();
  const limitDay = Math.max(1, parseInt(maxDayNum) || 1);
  for (let d = 1; d <= limitDay; d++) {
    const dayData = getDailyAssignedVocab(d);
    if (dayData && dayData.words) {
      dayData.words.forEach(w => {
        const lw = (w.word || "").toLowerCase();
        if (lw && !seen.has(lw)) {
          seen.add(lw);
          words.push({
            ...w,
            sourceDay: d,
            cardOrigin: "past_day",
            cardOriginText: `Lặp lại Ngày ${d}`
          });
        }
      });
    }
  }
  return words;
}

function getDailyAssignedReadings(dayNum) {
  const list = window.APP_DATA?.readings || [];
  if (list.length === 0) return [];
  const d = Math.max(1, parseInt(dayNum) || 1);
  const total = list.length;
  const idx1 = ((d - 1) * 3) % total;
  const idx2 = ((d - 1) * 3 + 1) % total;
  const idx3 = ((d - 1) * 3 + 2) % total;
  return [
    { slotNumber: 1, index: idx1, ...list[idx1] },
    { slotNumber: 2, index: idx2, ...list[idx2] },
    { slotNumber: 3, index: idx3, ...list[idx3] }
  ];
}

function getDailyAssignedReading(dayNum) {
  const readings = getDailyAssignedReadings(dayNum);
  return readings[0] || { id: 0, index: 0, title: "Bài đọc 1" };
}

function getDailyAssignedGrammar(dayNum) {
  const list = appState.grammarTopics || (window.APP_DATA?.grammar || []);
  if (list.length === 0) return { id: 0, index: 0, title: "Chuyên đề 1: Thì Động Từ", topic_title: "Chuyên đề 1: Thì Động Từ", summary: "Nắm vững công thức, cách dùng và dấu hiệu nhận biết của 4 thì cơ bản nhất." };
  const idx = (dayNum - 1) % list.length;
  const item = list[idx] || {};
  const t = item.title || item.topic_title || `Chuyên đề ${idx + 1}`;
  return {
    index: idx,
    ...item,
    title: t,
    topic_title: t
  };
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

  if (appState.studyMode === "daily_locked") {
    const info = getDailyAssignedVocab(d);
    appState.currentUnitIndex = info.unitIndex;
    appState.currentDayIndex = info.dayIndex;
    appState.currentCardIndex = 0;
    appState.isFlipped = false;
  }
  updateDailyMissionUI();
  showToast(`🚀 Lộ trình: Đang ở Ngày ${d} / ${total}`, "info");
}

function changeMissionDay(delta) {
  jumpToMissionDay(missionRegistry.currentDay + delta);
}

function advanceToNextDay() {
  const total = getTotalMissionDays();
  const nextDay = missionRegistry.currentDay + 1;
  if (nextDay > total) {
    showToast("🎉 Chúc mừng bạn đã hoàn thành toàn bộ lộ trình!", "success");
    return;
  }
  jumpToMissionDay(nextDay);
  showToast(`🚀 Đã chuyển sang Lộ trình Ngày ${nextDay} (Học vượt deadline)`, "success");
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
  if (appState.studyMode === "daily_locked") {
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
          <span class="text-slate-400 text-xs">(${allWords.length} từ vựng từ Ngày 1 đến Ngày ${curDay})</span>
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

function startTodayGrammarMission() {
  const g = getDailyAssignedGrammar(missionRegistry.currentDay);
  const weekNum = g.week_number || (g.index + 1);
  switchTab("grammar");
  renderGrammarDetail(weekNum);
  showToast(`✍️ Đang mở Chuyên đề chỉ định Ngày ${missionRegistry.currentDay}: ${g.topic_title}`, "info");
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
    if (curWord.cardOrigin === "reading") {
      typeTag.className = "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1";
      typeTag.innerHTML = `<span>📖</span><span>${curWord.cardOriginText || 'Từ bài đọc'}</span>`;
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
  if (appState.grammarDoneExercises.size >= 2) {
    const curStatus = getDayMissionStatus(missionRegistry.currentDay);
    if (!curStatus.grammarDone) {
      setDayMissionStatus(missionRegistry.currentDay, { grammarDone: true });
      showToast(`🎉 Chúc mừng! Bạn đã hoàn thành các bài tập ngữ pháp hôm nay! Đã tự động đánh dấu hoàn thành!`, "success");
      updateDailyMissionUI();
    }
  }

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
    const isAllThreeDone = doneAssignedCount >= 3 || completedList.length >= 3;

    setDayMissionStatus(curDay, {
      completedReadings: completedList,
      readingDoneCount: Math.min(3, Math.max(doneAssignedCount, completedList.length)),
      readingDone: isAllThreeDone || curStatus.readingDone
    });

    if (isAllThreeDone) {
      showToast(`🎉 Tuyệt vời! Bạn đã hoàn thành trọn vẹn 3 bài đọc của Ngày ${curDay}! Đã tự động đánh dấu hoàn thành 100%!`, "success");
    } else {
      showToast(`✓ Đã hoàn thành bài đọc (${doneAssignedCount}/3 bài hôm nay). Hãy tiếp tục bài tiếp theo nhé!`, "info");
    }
    updateDailyMissionUI();
  }

  const isCorrect = (selectedIdx === correctIdx);
  if (isCorrect) {
    selectedBtn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
    feedback.innerHTML = `✓ Chính xác! ${qData?.explain || ""}`;
    feedback.className = "text-xs font-semibold text-emerald-400 pt-1";

    const slotEl = document.getElementById(`cloze-slot-${qIdx + 1}`);
    if (slotEl && qData && qData.options && qData.options[selectedIdx]) {
      const optWord = qData.options[selectedIdx].replace(/^[A-D]\.\s*/, "").trim();
      slotEl.innerHTML = `<span>[${qIdx + 1}]</span> <strong class="text-emerald-300 underline">${optWord}</strong> <span class="text-emerald-400">✓</span>`;
      slotEl.className = "cloze-slot-pill mx-1 px-3 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500 shadow-sm inline-flex items-center gap-1 transition text-sm align-middle animate-pulse";
    }
  } else {
    selectedBtn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
    feedback.innerHTML = `✗ Chưa đúng! ${qData?.explain || ""}`;
    feedback.className = "text-xs font-semibold text-red-400 pt-1";
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

  // Fallback to local data
  let found = null;
  if (window.APP_DATA && window.APP_DATA.units) {
    for (const u of window.APP_DATA.units) {
      for (const d of u.days) {
        const match = d.words.find(w => w.word.toLowerCase() === cleanWord.toLowerCase());
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
      meaning_vi: found.meaning_vi || "",
      meaning_en: found.meaning_en || "",
      example: found.example || context
    };
    document.getElementById("popupWord").innerText = found.word;
    if (pronEl) {
      pronEl.innerHTML = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30 mr-1">🇺🇸 US</span>${formatPronHtml(found.pron || cleanWord)}`;
    }
    document.getElementById("popupPos").innerText = found.pos || "word";
    document.getElementById("popupMeaningVi").innerText = found.meaning_vi || cleanWord;
    document.getElementById("popupMeaningEn").innerText = found.meaning_en || "English definition available.";
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
  if (activePopupWord) speakText(activePopupWord);
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

function speakText(text, audioUrl) {
  if (audioUrl) {
    try {
      const snd = new Audio(audioUrl);
      snd.play().catch(() => speakWithSynthesis(text));
      return;
    } catch (e) {}
  }
  speakWithSynthesis(text);
}

function speakWithSynthesis(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  const voices = window.speechSynthesis.getVoices() || [];
  const usVoice = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("US") || v.name.includes("David") || v.name.includes("Zira")));
  if (usVoice) u.voice = usVoice;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function setupTouchAndKeyboard() {
  window.addEventListener("keydown", (e) => {
    if (appState.activeTab !== "flashcard") return;
    if (e.code === "Space") {
      e.preventDefault();
      flipCard();
    } else if (e.code === "ArrowRight") {
      nextCard();
    } else if (e.code === "ArrowLeft") {
      prevCard();
    } else if (["Digit1", "Numpad1"].includes(e.code)) {
      rateSRS(1); // Quên -> Tự chuyển
    } else if (["Digit2", "Numpad2"].includes(e.code)) {
      rateSRS(2); // Khó -> Tự chuyển
    } else if (["Digit3", "Numpad3"].includes(e.code)) {
      rateSRS(3); // Nhớ -> Tự chuyển
    } else if (["Digit4", "Numpad4"].includes(e.code)) {
      rateSRS(4); // Dễ -> Tự chuyển
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

  const diffMs = deadlineDate.getTime() - now.getTime();
  const countdownEl = document.getElementById("deadlineCountdownDisplay");
  const subtextEl = document.getElementById("deadlineStatusSubtext");

  const curMissionStatus = getDayMissionStatus(missionRegistry.currentDay);
  if (curMissionStatus.isAllDone) {
    if (countdownEl) {
      countdownEl.innerText = "✓ ĐÃ HOÀN THÀNH HÔM NAY!";
      countdownEl.className = "text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = "🎉 Xuất sắc! Bạn đã hoàn thành toàn bộ 3 mục tiêu của Ngày hôm nay. Chuỗi ngày học Streak đã được bảo vệ an toàn!";
    }
    return;
  }

  if (diffMs > 0) {
    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    const pad = (n) => String(n).padStart(2, "0");
    if (countdownEl) {
      countdownEl.innerText = `⏳ Còn ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
      countdownEl.className = "text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = `Hạn chót ${deadlineSettings.deadlineTime} hôm nay. Hoàn thành để bảo toàn Streak!`;
    }

    // 60-minute deadline warning notification
    if (deadlineSettings.remindDeadline && totalSecs <= 3600 && totalSecs > 3540 && !sentNotificationsToday.has("deadline_60m")) {
      sentNotificationsToday.add("deadline_60m");
      sendMobileNotification(
        "🚨 CẢNH BÁO: Còn 60 phút đến Deadline học tập!",
        `Chỉ còn 1 giờ nữa là đến hạn chót ${deadlineSettings.deadlineTime}. Hãy mở app để hoàn thành từ vựng và bảo vệ chuỗi Streak của bạn!`
      );
    }
  } else {
    // Past deadline
    const overdueSecs = Math.abs(Math.floor(diffMs / 1000));
    const hours = Math.floor(overdueSecs / 3600);
    const mins = Math.floor((overdueSecs % 3600) / 60);
    if (countdownEl) {
      countdownEl.innerText = `🚨 Đã quá hạn chót (${hours}h ${mins}m)`;
      countdownEl.className = "text-xl sm:text-2xl font-black text-red-400 font-mono tracking-tight";
    }
    if (subtextEl) {
      subtextEl.innerText = "Hãy hoàn thành bài tập ngay bây giờ để hệ thống kịp ghi nhận hoạt động hôm nay!";
    }
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
  const infoReading = getDailyAssignedReading(curDay);

  const wItem = document.getElementById("goalItemWords");
  const rItem = document.getElementById("goalItemReading");
  const gItem = document.getElementById("goalItemGrammar");

  if (wItem) {
    wItem.innerHTML = curStatus.vocabDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">20 Từ vựng (ĐÃ XONG ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-amber-400"></i> <span>20 Từ vựng Ngày ${curDay} (${curStatus.vocabCount}/20)</span>`;
  }
  if (rItem) {
    rItem.innerHTML = curStatus.readingDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">Bài đọc (ĐÃ XONG ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i> <span>1 Bài đọc (${(infoReading.title || "Reading").substring(0, 16)}...)</span>`;
  }
  if (gItem) {
    gItem.innerHTML = curStatus.grammarDone
      ? `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-300 font-bold">Ngữ pháp (ĐÃ XONG ✓)</span>`
      : `<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i> <span>1 Chuyên đề ngữ pháp</span>`;
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
  const cacheKey = `${appState.currentUnitIndex}_${dIdx}_${cfg.insertCount}_${cfg.insertMode}_${cfg.includePastDays}_${cfg.includeSRS}_${cfg.includeReadingCustom}`;
  
  if (appState.activeInterleavedDeck && appState.interleavedDeckKey === cacheKey) {
    return appState.activeInterleavedDeck;
  }

  // 1. Base words from today
  const todayTagged = baseWords.map(w => ({
    ...w,
    cardOrigin: "today",
    cardOriginText: `Bài học Ngày ${dIdx + 1}`,
    sourceDay: dIdx + 1
  }));
  const todayWordSet = new Set(baseWords.map(w => w.word.toLowerCase()));

  // 2. Build candidate pool
  const candidatePool = [];
  const seenPool = new Set(todayWordSet);

    // A. Past studied words from Day 1 to (curDayNum - 1)
  if (cfg.includePastDays) {
    const curDayNum = missionRegistry.currentDay || (dIdx + 1);
    if (curDayNum > 1) {
      const pastWords = getWordsUpToDay(curDayNum - 1);
      pastWords.forEach(w => {
        const lw = (w.word || "").toLowerCase();
        if (!seenPool.has(lw)) {
          seenPool.add(lw);
          candidatePool.push({
            ...w,
            cardOrigin: "past_day",
            cardOriginText: w.sourceDay ? `Lặp lại Ngày ${w.sourceDay}` : "Ôn ngày trước"
          });
        }
      });
    }
  }

  // B. SRS review words
  if (cfg.includeSRS) {
    (appState.todayQueue || []).forEach(w => {
      const lw = (w.word || "").toLowerCase();
      if (lw && !seenPool.has(lw)) {
        seenPool.add(lw);
        candidatePool.push({
          ...w,
          cardOrigin: "srs",
          cardOriginText: "Cần củng cố (SRS)"
        });
      }
    });
  }

  // C. Reading & Notebook custom words
  if (cfg.includeReadingCustom) {
    const customList = getSavedCustomWords();
    customList.forEach(w => {
      const lw = (w.word || "").toLowerCase();
      if (lw && !seenPool.has(lw)) {
        seenPool.add(lw);
        candidatePool.push({
          ...w,
          cardOrigin: "reading",
          cardOriginText: "Từ bài đọc mới lưu"
        });
      }
    });
  }

  // 3. Shuffle candidates and select
  const shuffledCandidates = shuffleArray(candidatePool);
  let insertCount = parseInt(cfg.insertCount) || 10;
  if (cfg.insertCount === "all") insertCount = shuffledCandidates.length;
  const chosenReviewWords = shuffledCandidates.slice(0, insertCount);

  // 4. Interleave or full random mix
  let finalDeck = [];
  if (chosenReviewWords.length === 0) {
    finalDeck = todayTagged;
  } else if (cfg.insertMode === "random_mix") {
    finalDeck = shuffleArray([...todayTagged, ...chosenReviewWords]);
  } else {
    // Interleave: insert 1 review card after every 2 today cards
    let tIdx = 0;
    let rIdx = 0;
    while (tIdx < todayTagged.length || rIdx < chosenReviewWords.length) {
      if (tIdx < todayTagged.length) finalDeck.push(todayTagged[tIdx++]);
      if (tIdx < todayTagged.length) finalDeck.push(todayTagged[tIdx++]);
      if (rIdx < chosenReviewWords.length) finalDeck.push(chosenReviewWords[rIdx++]);
    }
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
// CROSS-DEVICE CLOUD SYNC & 6-DIGIT PAIRING ENGINE (ĐỒNG BỘ ĐIỆN THOẠI & MÁY TÍNH)
// ============================================================================
const STORAGE_KEY_PAIR_SYNC = "EMH_PAIR_SYNC_KEY_V1";
let syncDebounceTimer = null;

function getSyncPairKey() {
  return localStorage.getItem(STORAGE_KEY_PAIR_SYNC) || (appState.currentUser ? `user_${appState.currentUser.id}` : "");
}

function setSyncPairKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY_PAIR_SYNC, key);
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
  let hasChanges = false;

  // 1. Merge missionRegistry
  if (payload.missionRegistry && typeof payload.missionRegistry === "object") {
    const remoteReg = payload.missionRegistry;
    const remoteDay = parseInt(remoteReg.currentDay) || 1;
    const localDay = missionRegistry.currentDay || 1;

    // Use higher day or merge history
    missionRegistry.currentDay = Math.max(localDay, remoteDay);

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

        // Merge intelligently: keep true if either is true, keep higher counts
        const mergedVocabCount = Math.max(lDay.vocabCount || 0, rDay.vocabCount || 0);
        const mergedVocabDone = !!(lDay.vocabDone || rDay.vocabDone || mergedVocabCount >= 20);
        const mergedReadingDone = !!(lDay.readingDone || rDay.readingDone);
        const mergedGrammarDone = !!(lDay.grammarDone || rDay.grammarDone);
        const mergedReadingsList = Array.from(new Set([...(lDay.completedReadings || []), ...(rDay.completedReadings || [])]));

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
    hasChanges = true;
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
      }
    });
    localStorage.setItem(CUSTOM_SAVED_WORDS_KEY, JSON.stringify(Array.from(map.values())));
  }

  if (hasChanges) {
    saveMissionRegistry();
    updateDailyMissionUI();
    renderFlashcard();
  }
}

function triggerBackgroundCloudSync() {
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
        updateSyncUIStatus("Đã đồng bộ đám mây ✓");
      }
    } catch (e) {
      console.warn("Background auto-sync failed:", e);
    }
  }, 1200);
}

async function initCrossDeviceAutoSync() {
  const pairKey = getSyncPairKey();
  if (!pairKey && !appState.authToken) {
    updateSyncUIStatus();
    return;
  }

  try {
    const url = `/api/sync/cloud-load?sync_key=${encodeURIComponent(pairKey || "")}`;
    const res = await apiCall(url);
    if (res && res.success && res.data) {
      applyFullSyncPayload(res.data);
      updateSyncUIStatus(`Đã liên kết (${res.sync_key}) ✓`);
      showToast(`🔄 Đã tự động đồng bộ tiến độ mới nhất từ đám mây (${res.device_name || 'Thiết bị khác'})!`, "info");
    } else {
      updateSyncUIStatus();
    }
  } catch (e) {
    console.warn("Cloud load failed on start:", e);
    updateSyncUIStatus();
  }
}

function updateSyncUIStatus(customMsg) {
  const key = getSyncPairKey();
  const banner = document.getElementById("syncStatusText");
  const badge = document.getElementById("syncKeyBadge");
  const headerStatus = document.getElementById("userStatusText");

  if (key) {
    if (badge) badge.innerText = `Mã: ${key}`;
    if (banner) banner.innerText = customMsg || `Đang tự động đồng bộ 2 chiều (Mã: ${key})`;
    if (headerStatus) headerStatus.innerText = `Đã kết nối đám mây • Mã: ${key}`;
  } else {
    if (badge) badge.innerText = "Chưa liên kết";
    if (banner) banner.innerText = customMsg || "Sẵn sàng đồng bộ tiến độ 2 chiều";
    if (headerStatus) headerStatus.innerText = "Đang chạy máy chủ • Bấm để Đồng Bộ ĐT & Máy Tính";
  }
}

function openSyncModal() {
  const modal = document.getElementById("syncModal");
  if (modal) {
    modal.classList.remove("hidden");
    updateSyncUIStatus();
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
