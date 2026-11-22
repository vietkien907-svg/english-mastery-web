/**
 * Unit Review Engine (Comprehensive Unit Vocabulary & Smart SRS Sorter)
 * - Gathers all vocabulary for a selected Unit or across all learned units
 * - Smart SRS prioritization: Level 1 (Forgot) & Level 2 (Difficult) are surfaced first
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UnitReviewEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Extract all words for a given unitId, or all units if unitId === 'all'
   */
  function getUnitWords(unitId) {
    const appData = (typeof window !== 'undefined' && window.APP_DATA) ? window.APP_DATA : null;
    if (!appData || !Array.isArray(appData.units)) return [];

    const words = [];

    if (unitId === 'all') {
      appData.units.forEach(u => {
        if (Array.isArray(u.days)) {
          u.days.forEach(d => {
            if (Array.isArray(d.words)) {
              words.push(...d.words);
            }
          });
        }
      });
      return words;
    }

    const unit = appData.units.find(u => u.unitId === unitId);
    if (!unit || !Array.isArray(unit.days)) return [];

    unit.days.forEach(d => {
      if (Array.isArray(d.words)) {
        words.push(...d.words);
      }
    });

    return words;
  }

  /**
   * Sort words with Smart SRS:
   * Level 1 (Quên) & Level 2 (Khó) come first to reinforce weak spots,
   * then higher levels (3, 4, 5) come later.
   */
  function sortWordsBySmartSRS(words, srsGetter) {
    if (!Array.isArray(words)) return [];

    const getter = typeof srsGetter === 'function' ? srsGetter : () => ({ level: 1 });

    return [...words].sort((a, b) => {
      const sA = getter(a.word || a.term || '');
      const sB = getter(b.word || b.term || '');
      const lvlA = typeof sA.level === 'number' ? sA.level : 1;
      const lvlB = typeof sB.level === 'number' ? sB.level : 1;

      if (lvlA !== lvlB) {
        return lvlA - lvlB; // Lower level (1, 2) comes first
      }
      return 0;
    });
  }

  return {
    getUnitWords,
    sortWordsBySmartSRS
  };
}));
