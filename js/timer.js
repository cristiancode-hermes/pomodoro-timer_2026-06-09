/**
 * 🍅 Pomodoro Timer — Timer Class
 * Engine del temporizador con callbacks de tick y completado.
 */

class Timer {
  /**
   * @param {Object} options
   * @param {number} options.duration - Duración en segundos
   * @param {Function} options.onTick - Callback cada segundo (recibe {remaining, elapsed, total})
   * @param {Function} options.onComplete - Callback al finalizar
   */
  constructor(options = {}) {
    this.duration = options.duration || 25 * 60; // default 25 min
    this.remaining = this.duration;
    this.running = false;
    this.completed = false;
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this._intervalId = null;
    this._startTimestamp = null;
    this._elapsedBeforePause = 0;
  }

  /**
   * Inicia el temporizador.
   * Si estaba pausado, reanuda desde donde se quedó.
   */
  start() {
    if (this.running) return;

    if (this.completed) {
      this.reset();
    }

    this.running = true;
    this.completed = false;
    this._startTimestamp = Date.now();

    this._intervalId = setInterval(() => {
      const elapsed = this._elapsedBeforePause + (Date.now() - this._startTimestamp) / 1000;
      this.remaining = Math.max(0, this.duration - elapsed);

      this.onTick({
        remaining: this.remaining,
        elapsed: Math.min(elapsed, this.duration),
        total: this.duration,
      });

      if (this.remaining <= 0) {
        this.remaining = 0;
        this.completed = true;
        this._stop();
        this.onComplete();
      }
    }, 200); // Check more frequently than 1s for accuracy
  }

  /**
   * Pausa el temporizador.
   */
  pause() {
    if (!this.running) return;
    this._elapsedBeforePause += (Date.now() - this._startTimestamp) / 1000;
    this._stop(false);
    this.running = false;
  }

  /**
   * Reinicia al tiempo completo.
   */
  reset() {
    this._stop(false);
    this.remaining = this.duration;
    this.running = false;
    this.completed = false;
    this._elapsedBeforePause = 0;

    this.onTick({
      remaining: this.remaining,
      elapsed: 0,
      total: this.duration,
    });
  }

  /**
   * Cambia la duración (reinicia el timer).
   * @param {number} seconds - Nueva duración en segundos
   */
  setDuration(seconds) {
    const wasRunning = this.running;
    this._stop(false);
    this.duration = seconds;
    this.remaining = seconds;
    this.running = false;
    this.completed = false;
    this._elapsedBeforePause = 0;

    this.onTick({
      remaining: this.remaining,
      elapsed: 0,
      total: this.duration,
    });

    if (wasRunning) {
      this.start();
    }
  }

  /**
   * Detiene el intervalo interno.
   */
  _stop(resetElapsed = true) {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    if (resetElapsed) {
      this._elapsedBeforePause = 0;
    }
  }

  /**
   * Formatea segundos a MM:SS
   * @param {number} seconds
   * @returns {string}
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Limpia recursos.
   */
  destroy() {
    this._stop();
    this.onTick = () => {};
    this.onComplete = () => {};
  }
}

// Export para ES modules o window global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timer;
}
