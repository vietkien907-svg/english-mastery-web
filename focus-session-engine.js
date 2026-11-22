/**
 * Focus Session Engine (1h / 2h Unit Comprehensive Review Timer & Stats)
 * - Manages focused study sessions with countdown timer
 * - Real-time statistics: cards reviewed, remembered, forgotten, and accuracy %
 * - Session summaries and completion alerts
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FocusSessionEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const state = {
    active: false,
    unitTitle: '',
    durationMinutes: 60,
    startTime: null,
    targetEndTime: null,
    totalCards: 0,
    reviewedCount: 0,
    rememberedCount: 0,
    forgottenWords: [],
    timerInterval: null
  };

  /**
   * Start a new focus session
   */
  function startSession(durationMinutes, totalCards, options = {}) {
    state.active = true;
    state.durationMinutes = Number(durationMinutes) || 60;
    state.totalCards = Number(totalCards) || 0;
    state.unitTitle = options.unitTitle || 'Ôn Tập Tổng Thể';
    state.startTime = Date.now();
    state.targetEndTime = state.startTime + state.durationMinutes * 60 * 1000;
    state.reviewedCount = 0;
    state.rememberedCount = 0;
    state.forgottenWords = [];

    return { ...state };
  }

  /**
   * Record card review rating (1: Quên, 2: Khó, 3: Bình thường, 4: Nhớ, 5: Rất dễ)
   */
  function recordCardReview(score, wordStr) {
    if (!state.active) return getStats();

    state.reviewedCount++;

    if (score >= 4) {
      state.rememberedCount++;
    } else if (score <= 2 && wordStr) {
      if (!state.forgottenWords.includes(wordStr)) {
        state.forgottenWords.push(wordStr);
      }
    }

    return getStats();
  }

  /**
   * Get current session statistics
   */
  function getStats() {
    const accuracy = state.reviewedCount > 0
      ? Math.round((state.rememberedCount / state.reviewedCount) * 100)
      : 100;

    const now = Date.now();
    const remainingMs = Math.max(0, (state.targetEndTime || now) - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    return {
      active: state.active,
      unitTitle: state.unitTitle,
      durationMinutes: state.durationMinutes,
      totalCards: state.totalCards,
      reviewedCount: state.reviewedCount,
      rememberedCount: state.rememberedCount,
      forgottenWords: [...state.forgottenWords],
      accuracy,
      remainingSeconds
    };
  }

  /**
   * Format seconds to HH:MM:SS
   */
  function formatTime(seconds) {
    const totalSecs = Math.max(0, Math.floor(seconds || 0));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  /**
   * End current session and return final summary
   */
  function endSession() {
    const summary = getStats();
    state.active = false;
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    summary.active = false;
    return summary;
  }

  return {
    startSession,
    recordCardReview,
    getStats,
    formatTime,
    endSession,
    state
  };
}));
