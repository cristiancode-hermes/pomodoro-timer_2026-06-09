/**
 * 🍅 Pomodoro Timer — App Controller
 * Orquesta el Timer, la UI, los modos y las estadísticas.
 */

(function () {
  'use strict';

  // --- Constantes ---
  const DURATIONS = {
    work: 25 * 60,   // 25 min
    short: 5 * 60,   // 5 min
    long: 15 * 60,   // 15 min
  };

  const MODE_LABELS = {
    work: '🍅 Trabajo',
    short: '☕ Pausa Corta',
    long: '😴 Pausa Larga',
  };

  // --- Estado ---
  let currentMode = 'work';
  let sessionPomodoros = 0;   // Pomodoros en el ciclo actual (hasta 4)
  let timer = null;
  let audioCtx = null;

  // --- DOM refs ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const elTimerDisplay = $('#timer-display');
  const elTimerLabel = $('#timer-label');
  const elProgressRing = document.querySelector('.progress-ring__fill');
  const elModeBtns = $$('.mode-btn');
  const elBtnStart = $('#btn-start');
  const elBtnReset = $('#btn-reset');
  const elPomoDots = $$('.pomodoro-dot');
  const elTimerSection = document.querySelector('.timer-display');
  const elThemeToggle = $('#theme-toggle');
  const elStatToday = $('#stat-today');
  const elStatWeek = $('#stat-week');
  const elStatTotal = $('#stat-total');
  const elStatStreak = $('#stat-streak');
  const elBtnResetStats = $('#btn-reset-stats');

  const CIRCUMFERENCE = 2 * Math.PI * 130; // ≈ 816.81

  // --- Inicialización ---

  function init() {
    // Tema
    const savedTheme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Timer
    timer = new Timer({
      duration: DURATIONS.work,
      onTick: onTick,
      onComplete: onComplete,
    });

    // UI inicial
    updateDisplay();
    updateStatsUI();

    // Event listeners
    bindEvents();
  }

  // --- Event Binders ---

  function bindEvents() {
    // Modos
    elModeBtns.forEach((btn) => {
      btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Start/Pause
    elBtnStart.addEventListener('click', toggleTimer);

    // Reset
    elBtnReset.addEventListener('click', () => {
      timer.reset();
      updateDisplay();
      updateButtonState();
      elTimerSection.classList.remove('completed', 'running');
    });

    // Tema
    elThemeToggle.addEventListener('click', toggleTheme);

    // Reset stats
    elBtnResetStats.addEventListener('click', () => {
      if (confirm('¿Reiniciar todas las estadísticas?')) {
        Storage.resetStats();
        updateStatsUI();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Evitar atajos si el usuario está escribiendo en un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
        case 'R':
          timer.reset();
          updateDisplay();
          updateButtonState();
          elTimerSection.classList.remove('completed', 'running');
          break;
        case '1':
          switchMode('work');
          break;
        case '2':
          switchMode('short');
          break;
        case '3':
          switchMode('long');
          break;
        case 't':
        case 'T':
          toggleTheme();
          break;
      }
    });
  }

  // --- Timer Callbacks ---

  function onTick({ remaining, elapsed, total }) {
    elTimerDisplay.textContent = Timer.formatTime(remaining);

    // Actualizar anillo de progreso
    const progress = elapsed / total;
    const offset = CIRCUMFERENCE * (1 - progress);
    elProgressRing.style.strokeDashoffset = offset;
  }

  function onComplete() {
    // Sonido
    playNotification();

    // Registrar pomodoro completado si estábamos en modo trabajo
    if (currentMode === 'work') {
      sessionPomodoros += 1;
      const stats = Storage.addPomodoro();
      updateStatsUI();
      updatePomoDots();

      // Si completamos 4, sugerir pausa larga automáticamente
      if (sessionPomodoros % 4 === 0) {
        setTimeout(() => {
          switchMode('long');
          timer.start();
        }, 2000);
        return;
      }
    }

    // Auto-pasar a pausa corta después de trabajo
    if (currentMode === 'work') {
      setTimeout(() => {
        switchMode('short');
        timer.start();
      }, 2000);
      return;
    }

    // Después de cualquier pausa, volver a trabajo
    setTimeout(() => {
      switchMode('work');
    }, 2000);
  }

  // --- Timer Controls ---

  function toggleTimer() {
    if (timer.running) {
      timer.pause();
      elBtnStart.textContent = '▶ Iniciar';
      elTimerSection.classList.remove('running');
    } else {
      timer.start();
      elBtnStart.textContent = '⏸ Pausar';
      elBtnReset.disabled = false;
      elTimerSection.classList.add('running');
      elTimerSection.classList.remove('completed');
    }
    updateButtonState();
  }

  // --- Mode Switching ---

  function switchMode(mode) {
    if (mode === currentMode && !timer.completed) return;

    currentMode = mode;
    const duration = DURATIONS[mode];

    // Actualizar botones de modo
    elModeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
      btn.setAttribute('aria-selected', btn.dataset.mode === mode);
    });

    // Actualizar timer
    timer.setDuration(duration);

    // Actualizar UI
    elTimerLabel.textContent = MODE_LABELS[mode];
    updateDisplay();
    updateButtonState();
    elTimerSection.classList.remove('completed', 'running');
    elBtnStart.textContent = '▶ Iniciar';
    elBtnReset.disabled = true;
  }

  // --- UI Updates ---

  function updateDisplay() {
    elTimerDisplay.textContent = Timer.formatTime(timer.remaining);
    elTimerLabel.textContent = MODE_LABELS[currentMode];

    // Anillo de progreso — reset a full
    elProgressRing.style.strokeDashoffset = '0';
  }

  function updateButtonState() {
    const isRunning = timer.running;
    const isCompleted = timer.completed;

    elBtnStart.textContent = isRunning
      ? '⏸ Pausar'
      : isCompleted
        ? '▶ Iniciar'
        : '▶ Iniciar';

    elBtnStart.disabled = false;
  }

  function updatePomoDots() {
    const count = sessionPomodoros % 4;
    elPomoDots.forEach((dot, i) => {
      dot.classList.toggle('active', i < count);
    });
  }

  function updateStatsUI() {
    const stats = Storage.getStats();
    elStatToday.textContent = stats.today;
    elStatWeek.textContent = stats.weekCount;
    elStatTotal.textContent = stats.total;
    elStatStreak.textContent = stats.streak;
  }

  // --- Theme ---

  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    Storage.setTheme(next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(mode) {
    const icon = document.querySelector('.icon-theme');
    if (icon) {
      icon.textContent = mode === 'dark' ? '🌙' : '☀️';
    }
  }

  // --- Sound ---

  function playNotification() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Sonido agradable: campanita
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);       // A5
      oscillator.frequency.setValueAtTime(1108.73, audioCtx.currentTime + 0.15); // C#6
      oscillator.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.3);  // E6

      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);

      // Repetir para énfasis
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.6);
      }, 250);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  // --- Arranque ---
  document.addEventListener('DOMContentLoaded', init);
})();
