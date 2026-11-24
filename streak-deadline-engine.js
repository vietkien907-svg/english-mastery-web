/**
 * StreakDeadlineEngine
 * Real daily deadline streak enforcement + 3/month Streak Recovery (Freeze).
 * - Never auto-marks uncompleted days.
 * - Requires at least 1 core task (Flashcard daily goal, Speaking practice, or Reading/Grammar)
 *   before 23:59 local time each day to maintain & increment streak.
 * - Grants 3 Streak Recovery credits per calendar month (YYYY-MM), resetting automatically each new month.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StreakDeadlineEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const MAX_MONTHLY_RECOVERIES = 3;

  function toLocalDateStr(dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function toMonthKey(dateStr) {
    return String(dateStr || '').slice(0, 7); // YYYY-MM
  }

  function diffDays(earlierDateStr, laterDateStr) {
    if (!earlierDateStr || !laterDateStr) return 0;
    const d1 = new Date(earlierDateStr + 'T00:00:00');
    const d2 = new Date(laterDateStr + 'T00:00:00');
    return Math.round((d2.getTime() - d1.getTime()) / 86400000);
  }

  function normalizeState(rawState, nowDate) {
    const todayStr = toLocalDateStr(nowDate);
    const currentMonth = toMonthKey(todayStr);
    const base = Object.assign(
      {
        streak: 0,
        longestStreak: 0,
        lastCompletedDate: '', // YYYY-MM-DD when user actually completed >= 1 core task
        todayCompletedTasks: [], // e.g. ['flashcard', 'speaking']
        todayDate: todayStr,
        missedPreviousStreak: 0, // Saved streak eligible for recovery if missed yesterday
        recoveryMonth: currentMonth,
        recoveriesUsedThisMonth: 0,
        lastEvaluatedDate: todayStr
      },
      rawState || {}
    );

    // Reset monthly recovery counter automatically on a new calendar month
    if (base.recoveryMonth !== currentMonth) {
      base.recoveryMonth = currentMonth;
      base.recoveriesUsedThisMonth = 0;
    }

    // Reset today's task list if calendar date moved forward
    if (base.todayDate !== todayStr) {
      base.todayDate = todayStr;
      base.todayCompletedTasks = [];
    }

    return base;
  }

  /**
   * Evaluates daily deadline status at `nowDate`.
   * If the user missed >= 1 full calendar day since `lastCompletedDate`,
   * streak drops to 0 and `missedPreviousStreak` is preserved for monthly recovery.
   */
  function evaluateDeadline(rawState, nowDate) {
    const now = nowDate instanceof Date ? nowDate : new Date();
    const todayStr = toLocalDateStr(now);
    const state = normalizeState(rawState, now);

    let status = 'PENDING_TODAY'; // PENDING_TODAY | COMPLETED_TODAY | MISSED_RECOVERABLE | LOST_NO_RECOVERY
    const completedToday = state.lastCompletedDate === todayStr;

    if (completedToday) {
      status = 'COMPLETED_TODAY';
      state.missedPreviousStreak = 0;
    } else if (state.lastCompletedDate) {
      const gap = diffDays(state.lastCompletedDate, todayStr);
      if (gap > 1 && state.streak > 0) {
        // Missed at least one full day deadline!
        state.missedPreviousStreak = state.streak;
        state.streak = 0;
      }
      if (state.missedPreviousStreak > 0) {
        const remaining = Math.max(0, MAX_MONTHLY_RECOVERIES - state.recoveriesUsedThisMonth);
        status = remaining > 0 ? 'MISSED_RECOVERABLE' : 'LOST_NO_RECOVERY';
      } else {
        status = 'PENDING_TODAY';
      }
    }

    state.lastEvaluatedDate = todayStr;

    // Compute remaining time until 23:59:59 today
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const msLeft = Math.max(0, endOfDay.getTime() - now.getTime());
    const hoursLeft = Math.floor(msLeft / 3600000);
    const minsLeft = Math.floor((msLeft % 3600000) / 60000);
    const secsLeft = Math.floor((msLeft % 60000) / 1000);

    return {
      state,
      status,
      completedToday,
      recoveriesRemaining: Math.max(0, MAX_MONTHLY_RECOVERIES - state.recoveriesUsedThisMonth),
      maxMonthlyRecoveries: MAX_MONTHLY_RECOVERIES,
      canRecover:
        state.missedPreviousStreak > 0 && state.recoveriesUsedThisMonth < MAX_MONTHLY_RECOVERIES,
      countdown: {
        msLeft,
        hours: hoursLeft,
        minutes: minsLeft,
        seconds: secsLeft,
        formatted: `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`
      }
    };
  }

  /**
   * Records genuine completion of a core daily task ('flashcard' | 'speaking' | 'reading' | 'grammar').
   * Increments streak ONCE per calendar day.
   */
  function recordCoreTaskCompletion(rawState, taskType, nowDate) {
    const now = nowDate instanceof Date ? nowDate : new Date();
    const todayStr = toLocalDateStr(now);
    const evalResult = evaluateDeadline(rawState, now);
    const state = evalResult.state;

    const cleanTask = String(taskType || 'study').toLowerCase();
    if (!state.todayCompletedTasks.includes(cleanTask)) {
      state.todayCompletedTasks.push(cleanTask);
    }

    let streakIncremented = false;
    if (state.lastCompletedDate !== todayStr) {
      state.streak = (state.streak || 0) + 1;
      if (state.streak > (state.longestStreak || 0)) {
        state.longestStreak = state.streak;
      }
      state.lastCompletedDate = todayStr;
      state.missedPreviousStreak = 0;
      streakIncremented = true;
    }

    return {
      state,
      streakIncremented,
      newStreak: state.streak
    };
  }

  /**
   * Uses 1 of the 3 monthly Streak Recovery credits to restore a missed streak.
   */
  function recoverMissedStreak(rawState, nowDate) {
    const now = nowDate instanceof Date ? nowDate : new Date();
    const todayStr = toLocalDateStr(now);
    const evalResult = evaluateDeadline(rawState, now);
    const state = evalResult.state;

    if (state.missedPreviousStreak <= 0) {
      return {
        success: false,
        state,
        message: 'Chuỗi Streak của bạn hiện không bị mất nên không cần khôi phục.'
      };
    }

    if (state.recoveriesUsedThisMonth >= MAX_MONTHLY_RECOVERIES) {
      return {
        success: false,
        state,
        recoveriesRemaining: 0,
        message: `Bạn đã dùng hết ${MAX_MONTHLY_RECOVERIES}/${MAX_MONTHLY_RECOVERIES} lượt khôi phục chuỗi trong tháng ${state.recoveryMonth}.`
      };
    }

    // Restore streak and set lastCompletedDate to yesterday so user still needs to complete today's deadline
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    state.streak = state.missedPreviousStreak;
    state.missedPreviousStreak = 0;
    state.lastCompletedDate = toLocalDateStr(yesterday);
    state.recoveriesUsedThisMonth += 1;

    const remaining = Math.max(0, MAX_MONTHLY_RECOVERIES - state.recoveriesUsedThisMonth);
    return {
      success: true,
      state,
      restoredStreak: state.streak,
      recoveriesRemaining: remaining,
      message: `🛡️ Khôi phục thành công chuỗi ${state.streak} ngày! Còn ${remaining}/${MAX_MONTHLY_RECOVERIES} lượt trong tháng ${state.recoveryMonth}. Hãy hoàn thành 1 nhiệm vụ hôm nay trước 23:59 để giữ chuỗi!`
    };
  }

  return {
    MAX_MONTHLY_RECOVERIES,
    toLocalDateStr,
    evaluateDeadline,
    recordCoreTaskCompletion,
    recoverMissedStreak
  };
});
