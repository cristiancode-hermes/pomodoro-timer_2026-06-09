# 🍅 Pomodoro Timer — 2026-06-09

> Una aplicación web elegante y funcional de la Técnica Pomodoro para mejorar tu productividad.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-yellow)
![Licencia](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Descripción

**Pomodoro Timer** es una aplicación web vanilla (HTML + CSS + JavaScript) que implementa la famosa Técnica Pomodoro de Francesco Cirillo. Te ayuda a dividir tu trabajo en intervalos de 25 minutos separados por pausas cortas y largas, maximizando tu concentración y productividad.

Características principales:
- ⏱️ Temporizador configurable con modos Trabajo, Pausa Corta y Pausa Larga
- 🔄 Ciclo automático de pomodoros con pausas largas cada 4 bloques
- 📊 Estadísticas de sesiones completadas (persistencia en localStorage)
- 🔊 Notificación sonora al finalizar cada bloque
- 🎨 Diseño responsive con tema claro/oscuro
- ⌨️ Atajos de teclado para control rápido

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| HTML5 | — | Estructura semántica |
| CSS3 | — | Estilos, animaciones, diseño responsive |
| JavaScript (ES6+) | — | Lógica del temporizador, UI, persistencia |
| Google Fonts | — | Tipografía (Inter + JetBrains Mono) |
| localStorage | — | Persistencia de estadísticas y preferencias |
| Web Audio API | — | Sonido de notificación |

**Sin dependencias externas** — 100% vanilla, zero frameworks.

---

## 📁 Estructura del Proyecto

```
pomodoro-timer_2026-06-09/
├── README.md              # Este archivo
├── package.json           # Configuración npm (solo live-server)
├── index.html             # Página principal
├── css/
│   └── styles.css         # Estilos completos
├── js/
│   ├── app.js             # Lógica principal del temporizador
│   ├── timer.js           # Clase Timer (motor del temporizador)
│   └── storage.js         # Gestión de localStorage
└── assets/
    └── sound/             # Archivos de sonido (generados vía Web Audio)
```

---

## ⚙️ Instalación y Uso

### Requisitos
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)

### Opción 1 — Abrir directamente (recomendado)
```bash
# Simplemente abre el archivo en tu navegador
open index.html
# o
xdg-open index.html
```

### Opción 2 — Servidor local (opcional)
```bash
# Usando live-server
npm install -g live-server
live-server .
```

### Opción 3 — Python (built-in)
```bash
python3 -m http.server 8000
# Abre http://localhost:8000
```

---

## 🎮 Cómo Usarlo

### Controles principales

| Control | Acción | Atajo |
|---------|--------|-------|
| ▶️ **Iniciar** | Comienza el temporizador | `Space` |
| ⏸️ **Pausar** | Pausa el temporizador | `Space` |
| 🔄 **Reiniciar** | Reinicia al tiempo actual | `R` |
| 🍅 **Modo Trabajo** | 25 minutos de enfoque | `1` |
| ☕ **Pausa Corta** | 5 minutos de descanso | `2` |
| 😴 **Pausa Larga** | 15 minutos de descanso | `3` |
| 🌙 **Tema** | Alterna claro/oscuro | `T` |

### Ciclo de trabajo recomendado
1. Trabaja 25 minutos (🍅 1 pomodoro)
2. Toma 5 minutos de pausa corta
3. Repite 4 veces
4. Toma 15-30 minutos de pausa larga 🎉

### Visualizaciones
- **Anillo de progreso**: El círculo alrededor del timer se llena/ vacía según avanza el tiempo
- **Contador de pomodoros**: Muestra cuántos pomodoros llevas en la sesión actual
- **Estadísticas**: Total de pomodoros completados hoy

---

## 🧠 Arquitectura del Código

### `js/timer.js` — Clase `Timer`
```
Timer {
  + duration: number        # Duración en segundos
  + remaining: number       # Tiempo restante
  + running: boolean        # Estado
  + onTick: callback        # Cada segundo
  + onComplete: callback    # Al terminar
  
  + start()
  + pause()
  + reset()
  + setDuration(seconds)
}
```

### `js/storage.js` — Módulo `storage`
```
storage {
  + getStats(): Stats
  + addPomodoro(): void
  + resetStats(): void
  + getTheme(): string
  + setTheme(mode): void
}
```

### `js/app.js` — Controlador principal
Gestiona:
- Vinculación Timer → UI
- Cambios de modo (trabajo/corto/largo)
- Ciclo automático de pomodoros
- Atajos de teclado
- Inicialización de tema

---

## 🧪 Testing Manual

Para verificar el funcionamiento:
1. Abre `index.html` en el navegador
2. Haz clic en **Iniciar** — el temporizador debe contar hacia atrás
3. El anillo de progreso debe animarse suavemente
4. Pausa y reanuda — debe mantener el tiempo correcto
5. Cambia entre modos (Trabajo, Pausa Corta, Pausa Larga)
6. Al llegar a 0, debe sonar una notificación
7. Tras completar 4 pomodoros, debe sugerir una pausa larga
8. Alterna el tema claro/oscuro con el botón 🌙
9. Recarga la página — las estadísticas deben persistir

---

## ✅ Funcionalidades Implementadas

- [x] Temporizador preciso con intervalos de 1 segundo
- [x] Tres modos: Trabajo (25'), Pausa Corta (5'), Pausa Larga (15')
- [x] Anillo de progreso animado con SVG
- [x] Notificación sonora al finalizar (Web Audio API)
- [x] Atajos de teclado completos
- [x] Persistencia de estadísticas (localStorage)
- [x] Temas claro y oscuro
- [x] Diseño responsive (móvil + escritorio)
- [x] Contador de pomodoros de la sesión
- [x] Sin dependencias externas (excepto Google Fonts)

---

## 📈 Próximas Mejoras (TODO)

- [ ] Configuración de tiempos por el usuario
- [ ] Gráfico de productividad semanal
- [ ] Exportar estadísticas a CSV
- [ ] Modo enfoque (bloquea notificaciones del sistema)
- [ ] Integración con sonidos personalizados
- [ ] PWA para instalación en móvil
- [ ] Música de fondo integrada (lo-fi)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 🙏 Créditos

- Inspirado en la [Técnica Pomodoro](https://es.wikipedia.org/wiki/T%C3%A9cnica_Pomodoro) de Francesco Cirillo
- Tipografía [Inter](https://rsms.me/inter/) de Rasmus Andersson
- Tipografía [JetBrains Mono](https://www.jetbrains.com/lp/mono/) para números

---

<p align="center">
  <sub>Hecho con ❤️ y 🍅 — Proyecto Diario #1 · 2026-06-09</sub>
</p>
