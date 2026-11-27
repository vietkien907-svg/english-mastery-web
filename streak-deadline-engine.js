/**
 * StreakDeadlineEngine
 * Real daily deadline streak enforcement + 3/month Streak Recovery (Freeze).
 * - Never auto-marks uncompleted days.
 * - Requires at least 1 core task ('vocab' | 'flashcard' | 'video' | 'reading' | 'grammar' |
 *   'listening' | 'speaking' | 'translation' | 'readaloud' | 'translation_readaloud')
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
  const MAX_COMPLETED_DATES = 365;
  const CORE_TASKS = [
    'vocab',
    'flashcard',
    'video',
    'reading',
    'grammar',
    'listening',
    'speaking',
    'translation',
    'readaloud',
    'translation_readaloud'
  ];

  function toValidDate(dateObj) {
    return (dateObj instanceof Date && !isNaN(dateObj.getTime())) ? dateObj : new Date();
  }

  function toLocalDateStr(dateObj) {
    const d = toValidDate(dateObj);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function toMonthKey(dateStr) {
    return String(dateStr || '').slice(0, 7); // YYYY-MM
  }

  function isValidDateStr(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || '').trim());
  }

  function diffDays(earlierDateStr, laterDateStr) {
    if (!isValidDateStr(earlierDateStr) || !isValidDateStr(laterDateStr)) return 0;
    const d1 = new Date(String(earlierDateStr).trim() + 'T00:00:00');
    const d2 = new Date(String(laterDateStr).trim() + 'T00:00:00');
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    return Math.round((d2.getTime() - d1.getTime()) / 86400000);
  }

  function normalizeCompletedDates(rawDates) {
    if (!Array.isArray(rawDates)) return [];
    const cleaned = rawDates
      .map(s => String(s || '').trim().slice(0, 10))
      .filter(s => isValidDateStr(s));
    return Array.from(new Set(cleaned)).sort().slice(-MAX_COMPLETED_DATES);
  }

  function computeConsecutiveStreak(completedDates, nowDate) {
    const now = toValidDate(nowDate);
    const todayStr = toLocalDateStr(now);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStr = toLocalDateStr(yesterday);

    const validSet = new Set(normalizeCompletedDates(completedDates));
    let anchorStr = '';
    if (validSet.has(todayStr)) {
      anchorStr = todayStr;
    } else if (validSet.has(yesterdayStr)) {
      anchorStr = yesterdayStr;
    } else {
      return 0;
    }

    let streak = 0;
    let cursor = new Date(anchorStr + 'T00:00:00');
    while (validSet.has(toLocalDateStr(cursor))) {
      streak += 1;
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
    }
    return streak;
  }

  function normalizeState(rawState, nowDate) {
    const now = toValidDate(nowDate);
    const todayStr = toLocalDateStr(now);
    const currentMonth = toMonthKey(todayStr);
    const base = Object.assign(
      {
        streak: 0,
        longestStreak: 0,
        lastCompletedDate: '', // YYYY-MM-DD when user actually completed >= 1 core task
        completedDates: [], // Deduplicated sorted local YYYY-MM-DD history (capped at 365)
        todayCompletedTasks: [], // e.g. ['flashcard', 'speaking', 'translation']
        todayDate: todayStr,
        missedPreviousStreak: 0, // Saved streak eligible for recovery if missed yesterday
        recoveryMonth: currentMonth,
        recoveriesUsedThisMonth: 0,
        lastEvaluatedDate: todayStr
      },
      rawState || {}
    );

    base.streak = Math.max(0, parseInt(base.streak, 10) || 0);
    base.longestStreak = Math.max(0, parseInt(base.longestStreak, 10) || 0);
    base.missedPreviousStreak = Math.max(0, parseInt(base.missedPreviousStreak, 10) || 0);
    base.recoveriesUsedThisMonth = Math.max(0, parseInt(base.recoveriesUsedThisMonth, 10) || 0);
    base.lastCompletedDate = isValidDateStr(base.lastCompletedDate) ? String(base.lastCompletedDate).trim() : '';
    base.completedDates = normalizeCompletedDates(base.completedDates);
    base.todayCompletedTasks = Array.isArray(base.todayCompletedTasks)
      ? Array.from(new Set(base.todayCompletedTasks.map(t => String(t || '').trim().toLowerCase()).filter(Boolean)))
      : [];

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
   * Never resets streak to 0 while in the active calendar day before 23:59 (gap <= 1).
   * If the user missed >= 1 full calendar day since `lastCompletedDate` (gap > 1),
   * streak drops to 0 and `missedPreviousStreak` is preserved for monthly recovery.
   */
  function evaluateDeadline(rawState, nowDate) {
    const now = toValidDate(nowDate);
    const todayStr = toLocalDateStr(now);
    const state = normalizeState(rawState, now);

    let status = 'PENDING_TODAY'; // PENDING_TODAY | COMPLETED_TODAY | MISSED_RECOVERABLE | LOST_NO_RECOVERY
    const completedToday = state.lastCompletedDate === todayStr;

    if (completedToday) {
      status = 'COMPLETED_TODAY';
      state.missedPreviousStreak = 0;
      if (!state.completedDates.includes(todayStr)) {
        state.completedDates = normalizeCompletedDates([...state.completedDates, todayStr]);
      }
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
    } else if (state.completedDates.length > 0 && state.streak === 0 && state.missedPreviousStreak === 0) {
      const histStreak = computeConsecutiveStreak(state.completedDates, now);
      if (histStreak > 0) {
        state.streak = histStreak;
        if (state.streak > state.longestStreak) {
          state.longestStreak = state.streak;
        }
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
   * Records genuine completion of a core daily task
   * ('vocab' | 'flashcard' | 'video' | 'reading' | 'grammar' | 'listening' | 'speaking' | 'translation' | 'readaloud' | 'translation_readaloud').
   * Increments streak ONCE per local calendar day.
   */
  function recordCoreTaskCompletion(rawState, taskType, nowDate) {
    const now = toValidDate(nowDate);
    const todayStr = toLocalDateStr(now);
    const evalResult = evaluateDeadline(rawState, now);
    const state = evalResult.state;

    const cleanTask = String(taskType || 'study').trim().toLowerCase();
    if (!state.todayCompletedTasks.includes(cleanTask)) {
      state.todayCompletedTasks.push(cleanTask);
    }

    if (!state.completedDates.includes(todayStr)) {
      state.completedDates = normalizeCompletedDates([...state.completedDates, todayStr]);
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
   * Reconciles local deadline state with server user data (streak_count, last_active_date, longest_streak).
   * Restores server streak_count when local is 0 (e.g., after v103 wipe or fresh browser)
   * or when serverUser.streak_count > local.streak, updating lastCompletedDate cleanly
   * when serverUser.last_active_date is valid and diffDays <= 1 (or yesterdayStr if empty).
   */
  function reconcileWithServer(rawState, serverUser, nowDate) {
    const now = toValidDate(nowDate);
    const todayStr = toLocalDateStr(now);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStr = toLocalDateStr(yesterday);

    const state = normalizeState(rawState, now);
    if (!serverUser || typeof serverUser !== 'object') {
      return evaluateDeadline(state, now).state;
    }

    const srvStreak = Math.max(0, parseInt(serverUser.streak_count ?? serverUser.streak ?? 0, 10) || 0);
    const srvLongest = Math.max(0, parseInt(serverUser.longest_streak ?? 0, 10) || 0);
    const rawSrvLast = String(serverUser.last_active_date || '').trim().slice(0, 10);
    const srvLastValid = isValidDateStr(rawSrvLast) ? rawSrvLast : '';

    if (srvStreak > 0 && (state.streak === 0 || srvStreak > state.streak)) {
      const srvGap = srvLastValid ? diffDays(srvLastValid, todayStr) : null;
      if (srvLastValid && srvGap <= 1) {
        state.streak = Math.max(state.streak, srvStreak);
        state.missedPreviousStreak = 0;
        if (state.lastCompletedDate !== todayStr) {
          state.lastCompletedDate = srvLastValid;
        }
        state.completedDates = normalizeCompletedDates([...state.completedDates, srvLastValid]);
      } else if (!srvLastValid) {
        state.streak = Math.max(state.streak, srvStreak);
        state.missedPreviousStreak = 0;
        if (state.lastCompletedDate !== todayStr) {
          const anchor = state.todayCompletedTasks.length > 0 ? todayStr : yesterdayStr;
          state.lastCompletedDate = anchor;
          state.completedDates = normalizeCompletedDates([...state.completedDates, anchor]);
        }
      } else if (state.streak === 0 && state.missedPreviousStreak === 0) {
        // Server has an older last_active_date (gap > 1) and local had no saved missed streak yet
        state.streak = srvStreak;
        if (!state.lastCompletedDate) {
          state.lastCompletedDate = srvLastValid;
        }
      }
    } else if (srvLastValid && diffDays(srvLastValid, todayStr) <= 1) {
      if (!state.lastCompletedDate || diffDays(state.lastCompletedDate, srvLastValid) > 0) {
        state.lastCompletedDate = srvLastValid;
        state.missedPreviousStreak = 0;
      }
      state.completedDates = normalizeCompletedDates([...state.completedDates, srvLastValid]);
    }

    state.longestStreak = Math.max(state.longestStreak || 0, state.streak || 0, srvLongest);
    return evaluateDeadline(state, now).state;
  }

  /**
   * Uses 1 of the 3 monthly Streak Recovery credits to restore a missed streak.
   */
  function recoverMissedStreak(rawState, nowDate) {
    const now = toValidDate(nowDate);
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
    const yStr = toLocalDateStr(yesterday);
    state.streak = state.missedPreviousStreak;
    state.missedPreviousStreak = 0;
    state.lastCompletedDate = yStr;
    state.completedDates = normalizeCompletedDates([...state.completedDates, yStr]);
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
    CORE_TASKS,
    toLocalDateStr,
    diffDays,
    computeConsecutiveStreak,
    evaluateDeadline,
    recordCoreTaskCompletion,
    reconcileWithServer,
    recoverMissedStreak
  };
});
