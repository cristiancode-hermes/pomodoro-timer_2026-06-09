/**
 * 🍅 Pomodoro Timer — Storage Module
 * Persistencia de estadísticas y preferencias vía localStorage.
 */

const Storage = (() => {
  const KEYS = {
    STATS: 'pomodoro_stats',
    THEME: 'pomodoro_theme',
  };

  /**
   * Obtiene la fecha actual como YYYY-MM-DD.
   */
  function _today() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Obtiene el inicio de la semana actual (lunes) como YYYY-MM-DD.
   */
  function _weekStart() {
    const d = new Date();
    const day = d.getDay(); // 0=Sun, 1=Mon...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar a lunes
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  /**
   * Estadísticas por defecto.
   */
  function _defaultStats() {
    return {
      total: 0,
      today: 0,
      days: {},        // { 'YYYY-MM-DD': count }
      streak: 0,
      lastDate: null,
      weekStart: _weekStart(),
      weekCount: 0,
    };
  }

  /**
   * Lee las estadísticas de localStorage.
   * @returns {Object}
   */
  function getStats() {
    try {
      const raw = localStorage.getItem(KEYS.STATS);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrar weekStart si la semana cambió
        const currentWeek = _weekStart();
        if (parsed.weekStart !== currentWeek) {
          parsed.weekStart = currentWeek;
          parsed.weekCount = 0;
        }
        // Migrar today si es otro día
        const td = _today();
        if (parsed.days[td] === undefined) {
          parsed.today = 0;
        } else {
          parsed.today = parsed.days[td];
        }
        return { ..._defaultStats(), ...parsed };
      }
    } catch (e) {
      console.warn('Error reading stats, resetting:', e);
    }
    return _defaultStats();
  }

  /**
   * Guarda las estadísticas.
   * @param {Object} stats
   */
  function _saveStats(stats) {
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error saving stats:', e);
    }
  }

  /**
   * Registra un pomodoro completado.
   */
  function addPomodoro() {
    const stats = getStats();
    const td = _today();

    stats.total += 1;
    stats.days[td] = (stats.days[td] || 0) + 1;
    stats.today = stats.days[td];
    stats.weekCount += 1;

    // Calcular racha (días consecutivos)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    if (stats.lastDate === yStr) {
      // Día consecutivo
      stats.streak += 1;
    } else if (stats.lastDate === td) {
      // Mismo día, no cambiar racha
    } else {
      // Se rompió la racha
      stats.streak = 1;
    }
    stats.lastDate = td;

    _saveStats(stats);
    return stats;
  }

  /**
   * Reinicia las estadísticas.
   */
  function resetStats() {
    const defaults = _defaultStats();
    _saveStats(defaults);
    return defaults;
  }

  /**
   * Obtiene el tema guardado.
   * @returns {string} 'dark' | 'light'
   */
  function getTheme() {
    try {
      return localStorage.getItem(KEYS.THEME) || 'dark';
    } catch {
      return 'dark';
    }
  }

  /**
   * Guarda el tema.
   * @param {string} mode - 'dark' | 'light'
   */
  function setTheme(mode) {
    try {
      localStorage.setItem(KEYS.THEME, mode);
    } catch {
      // Silently fail
    }
  }

  return {
    getStats,
    addPomodoro,
    resetStats,
    getTheme,
    setTheme,
  };
})();
