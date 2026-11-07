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
  grammarTopics: [],
  activeGrammarWeek: 1,
  activeReadingIndex: 0,
  offlineQueue: JSON.parse(localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE) || "[]"),
  authMode: "login" // login or register
};

// ================= INITIALIZATION =================
window.addEventListener("DOMContentLoaded", async () => {
  setupUnitSelectors();
  await checkAuthStatus();
  await loadTodayQueue();
  await loadGrammarTopics();
  setupReadingSelector();
  setupTouchAndKeyboard();
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
  appState.activeTab = tabId;

  ["today", "flashcard", "review", "reader", "grammar", "profile"].forEach(id => {
    const sec = document.getElementById(`tab-${id}`);
    if (sec) sec.classList.toggle("hidden", id !== tabId);

    const navBtn = document.getElementById(`nav-btn-${id}`);
    if (navBtn) {
      if (id === tabId) {
        navBtn.classList.add("bg-indigo-600", "text-white");
        navBtn.classList.remove("text-slate-400", "hover:text-white", "hover:bg-slate-800");
      } else {
        navBtn.classList.remove("bg-indigo-600", "text-white");
        navBtn.classList.add("text-slate-400", "hover:text-white", "hover:bg-slate-800");
      }
    }

    const mobBtn = document.getElementById(`mob-btn-${id}`);
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
      <option value="${idx}">${d.dayTitle} (${d.words.length} từ)</option>
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

function getCurrentDayWords() {
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
  return day?.words || [];
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
  document.getElementById("cardPron").innerText = curWord.pron || "/.../";
  document.getElementById("cardPos").innerText = `(${curWord.pos || "word"}) • ${curWord.level || "B1"}`;
  document.getElementById("cardTypeTag").innerText = curWord.type || "Vocabulary";

  document.getElementById("cardBackWord").innerText = curWord.word;
  document.getElementById("cardBackPos").innerText = curWord.pos || "";

  const viElem = document.getElementById("cardMeaningVi");
  const enElem = document.getElementById("cardMeaningEn");
  const defElem = document.getElementById("cardDefinition");

  const viText = curWord.meaning_vi || "Đang mở rộng nghĩa...";
  const enText = curWord.meaning_en || "Expanding English definition...";

  if (viElem) viElem.innerText = viText;
  if (enElem) enElem.innerText = enText;
  if (defElem) defElem.innerText = `${viText} • ${enText}`;

  document.getElementById("cardExample").innerText = curWord.example ? `"${curWord.example}"` : `Example with ${curWord.word}.`;

  document.getElementById("cardCounter").innerText = `Thẻ ${appState.currentCardIndex + 1} / ${words.length}`;
  const pct = Math.round(((appState.currentCardIndex + 1) / words.length) * 100);
  document.getElementById("flashcardProgressBar").style.width = `${pct}%`;
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
  renderFlashcard();
}

function nextCard() {
  const words = getCurrentDayWords();
  if (words.length <= 1) return;
  appState.currentCardIndex = (appState.currentCardIndex + 1) % words.length;
  renderFlashcard();
}

// SRS Review Rating with Offline Queueing
async function rateSRS(score) {
  const words = getCurrentDayWords();
  if (!words || words.length === 0) return;
  const curWord = words[appState.currentCardIndex];

  const clientEventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const payload = {
    item_id: curWord.id,
    test_type: "recognition",
    rating: score,
    used_hint: false,
    response_time_ms: 2500,
    client_event_id: clientEventId,
    device_id: navigator.userAgent.substring(0, 30)
  };

  const res = await apiCall("/api/study/rate", "POST", payload);
  if (!res) {
    appState.offlineQueue.push({
      ...payload,
      created_at_client: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(appState.offlineQueue));
  } else if (res.streak !== undefined) {
    const el = document.getElementById("streakCount");
    if (el) el.innerText = `${res.streak} ngày`;
  }

  nextCard();
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

// ================= 21 WEEKS GRAMMAR CONTROLLER =================
async function loadGrammarTopics() {
  const topics = await apiCall("/api/grammar/topics") || (window.APP_DATA?.grammar || []);
  appState.grammarTopics = topics;

  const nav = document.getElementById("grammarTopicsNav");
  if (!nav) return;

  nav.innerHTML = topics.map((t, idx) => `
    <button onclick="renderGrammarDetail(${t.week_number || (idx + 1)})" id="grammar-btn-${t.week_number || (idx + 1)}" class="w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${idx === 0 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}">
      <span class="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px] font-bold">${t.week_number || (idx + 1)}</span>
      <span class="truncate">${(t.title || "").replace(/Chuyên đề\s*/, "")}</span>
    </button>
  `).join("");

  renderGrammarDetail(1);
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

  appState.grammarTopics.forEach((t, i) => {
    const w = t.week_number || (i + 1);
    const btn = document.getElementById(`grammar-btn-${w}`);
    if (btn) {
      btn.className = (w === weekNum)
        ? "w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition bg-indigo-600 text-white shadow"
        : "w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition text-slate-300 hover:bg-slate-800";
    }
  });

  document.getElementById("grammarTopicTitle").innerText = detail.title;
  document.getElementById("grammarTopicSummary").innerText = detail.summary;

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
  qList.innerHTML = quiz.map((q, idx) => `
    <div class="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
      <p class="font-semibold text-xs sm:text-sm text-slate-100">${idx + 1}. ${q.q}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        ${q.options.map((opt, oIdx) => `
          <button onclick="checkGrammarQuiz(${idx}, ${oIdx})" id="gq-${idx}-opt-${oIdx}" class="text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700/50 transition">
            ${String.fromCharCode(65 + oIdx)}. ${opt}
          </button>
        `).join("")}
      </div>
      <div id="gq-feedback-${idx}" class="hidden p-3 rounded-xl bg-slate-800 text-xs text-slate-300 mt-2"></div>
    </div>
  `).join("");

  lucide.createIcons();
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
    const isCorrect = (optIdx === localQ.answer);
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

// ================= READING PASSAGES & INSTANT CARD CREATION =================
function setupReadingSelector() {
  const readings = window.APP_DATA?.readings || [];
  const select = document.getElementById("readingSelect");
  if (!select) return;

  select.innerHTML = readings.map((r, idx) => `
    <option value="${idx}">${r.title}</option>
  `).join("");

  renderReadingPassage(0);
}

let activePopupWord = "";
let activeContextSentence = "";

function renderReadingPassage(passageIdx) {
  appState.activeReadingIndex = parseInt(passageIdx) || 0;
  const passage = window.APP_DATA?.readings?.[appState.activeReadingIndex];
  if (!passage) return;

  document.getElementById("readingArticleTitle").innerText = passage.title;
  document.getElementById("readingUnitTag").innerText = passage.unit || "Context";
  document.getElementById("readingLevelTag").innerText = `Level ${passage.level || "B1+"}`;

  let content = passage.content;
  passage.target_words.forEach(word => {
    const regex = new RegExp(`\\b(${word})\\b`, "gi");
    content = content.replace(regex, `<span class="target-word-pill" onclick="showWordPopup('$1', \`${passage.content.replace(/"/g, "'")}\`)">$1</span>`);
  });

  document.getElementById("readingContent").innerHTML = content;

  const qList = document.getElementById("readingQuestionsList");
  qList.innerHTML = passage.questions.map((q, idx) => `
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
      <p class="font-semibold text-sm text-slate-100">${idx + 1}. ${q.q}</p>
      <div class="space-y-1.5 pt-1">
        ${q.options.map((opt, oIdx) => `
          <button onclick="checkReadingQuestion(${idx}, ${oIdx}, ${q.answer})" id="rq-${idx}-opt-${oIdx}" class="w-full text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700/50 transition">
            ${String.fromCharCode(65 + oIdx)}. ${opt}
          </button>
        `).join("")}
      </div>
      <p id="rq-feedback-${idx}" class="hidden text-xs font-semibold pt-1"></p>
    </div>
  `).join("");
}

function checkReadingQuestion(qIdx, selectedIdx, correctIdx) {
  const selectedBtn = document.getElementById(`rq-${qIdx}-opt-${selectedIdx}`);
  const feedback = document.getElementById(`rq-feedback-${qIdx}`);

  if (selectedIdx === correctIdx) {
    selectedBtn.classList.add("bg-emerald-600/30", "border-emerald-500", "text-emerald-300");
    feedback.innerText = "✓ Chính xác!";
    feedback.className = "text-xs font-semibold text-emerald-400 pt-1";
  } else {
    selectedBtn.classList.add("bg-red-600/30", "border-red-500", "text-red-300");
    feedback.innerText = "✗ Chưa đúng!";
    feedback.className = "text-xs font-semibold text-red-400 pt-1";
  }
  feedback.classList.remove("hidden");
}

function showWordPopup(wordText, context) {
  activePopupWord = wordText;
  activeContextSentence = context || "";

  document.getElementById("popupWord").innerText = wordText;

  let found = null;
  if (window.APP_DATA && window.APP_DATA.units) {
    for (const u of window.APP_DATA.units) {
      for (const d of u.days) {
        const match = d.words.find(w => w.word.toLowerCase() === wordText.toLowerCase());
        if (match) {
          found = match;
          break;
        }
      }
      if (found) break;
    }
  }

  if (found) {
    document.getElementById("popupPron").innerText = found.pron || `(${found.pos || "word"})`;
    const vi = found.meaning_vi ? `🇻🇳 ${found.meaning_vi}` : "";
    const en = found.meaning_en ? `🇬🇧 ${found.meaning_en}` : "";
    document.getElementById("popupMeaning").innerText = [vi, en].filter(Boolean).join("\n\n") || `Từ vựng: "${wordText}"`;
  } else {
    document.getElementById("popupPron").innerText = "/.../";
    document.getElementById("popupMeaning").innerText = `Đang kích hoạt ngữ cảnh bài đọc cho "${wordText}".`;
  }
  document.getElementById("wordPopupModal").classList.remove("hidden");
}

function closeWordPopup() {
  document.getElementById("wordPopupModal").classList.add("hidden");
}

async function saveCurrentPopupWord(saveType) {
  const res = await apiCall("/api/reading/save-word", "POST", {
    word_or_phrase: activePopupWord,
    context_sentence: activeContextSentence,
    passage_id: appState.activeReadingIndex + 1,
    save_type: saveType
  });

  closeWordPopup();
  alert(res?.message || `Đã lưu "${activePopupWord}" vào kho học!`);
}

function speakPopupWord() {
  if (activePopupWord) speakText(activePopupWord);
}

function readAloudPassage() {
  const passage = window.APP_DATA?.readings?.[appState.activeReadingIndex];
  if (passage) speakText(passage.content);
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
      questionSubtitle = item.pron ? `Phát âm: <span class="text-slate-300 font-mono">${item.pron}</span> • (${item.pos || "word"})` : `(${item.pos || "word"})`;
      
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

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function openQrModal() {
  const m = document.getElementById("qrModal");
  if (m) m.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeQrModal() {
  const m = document.getElementById("qrModal");
  if (m) m.classList.add("hidden");
}

function copyMobileLink() {
  const inp = document.getElementById("mobileLinkInput");
  if (inp) {
    inp.select();
    navigator.clipboard.writeText(inp.value);
    showToast("Đã sao chép link truy cập điện thoại!", "success");
  }
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
    } else if (e.code === "KeyS") {
      speakCurrentWord();
    }
  });
}
