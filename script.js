/* ══════════════════════════════════════
   Daily Habit Tracker — script.js
   ══════════════════════════════════════ */

// ── Constants ──────────────────────────
const COLORS = [
  '#4caf7a', '#c9a84c', '#5090c9', '#9060c9',
  '#c97840', '#c95080', '#50b8c9', '#7ac940'
];

const EMOJIS = ['🧘','💪','📚','🥗','💧','🌅','✍️','🏃','🎯','🧠','🎨','🌿'];

// ── State ──────────────────────────────
let habits = JSON.parse(localStorage.getItem('habits_v2') || '[]');
let selectedColor = COLORS[0];
const today = new Date().toDateString();
const now = new Date();

// ── Daily Reset ────────────────────────
// If it's a new day, reset all completions (streaks persist)
const lastDay = localStorage.getItem('last_day');
if (lastDay !== today) {
  habits = habits.map(h => ({ ...h, done: false }));
  localStorage.setItem('last_day', today);
  save();
}

// ── Seed Default Habits (first load) ───
if (!habits.length) {
  habits = [
    { name: 'Morning Meditation',      time: '7:00 AM',  color: COLORS[0], emoji: '🧘', done: false, streak: 5  },
    { name: 'Drink 8 Glasses of Water', time: 'All Day', color: COLORS[2], emoji: '💧', done: false, streak: 12 },
    { name: 'Read for 30 Minutes',     time: '9:00 PM',  color: COLORS[3], emoji: '📚', done: false, streak: 3  },
    { name: 'Evening Walk',            time: '6:30 PM',  color: COLORS[1], emoji: '🏃', done: false, streak: 7  },
  ];
  save();
}

// ══════════════════════════════════════
// PERSISTENCE
// ══════════════════════════════════════

/**
 * Save habits array to localStorage.
 */
function save() {
  localStorage.setItem('habits_v2', JSON.stringify(habits));
}

// ══════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════

/**
 * Set the date badge text in the header.
 */
function initDateBadge() {
  const dateEl = document.getElementById('dateBadge').querySelector('span');
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Build the 7-day week strip calendar.
 */
function buildWeek() {
  const strip = document.getElementById('weekStrip');
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayIdx = now.getDay();

  // Start from Sunday of the current week
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - todayIdx);

  strip.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const isToday = d.toDateString() === today;

    strip.innerHTML += `
      <div class="week-day ${isToday ? 'today' : ''}">
        <div class="wd-name">${days[d.getDay()]}</div>
        <div class="wd-num">${d.getDate()}</div>
        <div class="wd-dot"></div>
      </div>
    `;
  }
}

// ══════════════════════════════════════
// RENDER
// ══════════════════════════════════════

/**
 * Re-render the entire habits list and update all stats/progress.
 */
function render() {
  const list = document.getElementById('habitsList');
  const done  = habits.filter(h => h.done).length;
  const total = habits.length;

  // ── Update Stats ──
  document.getElementById('statTotal').textContent  = total;
  document.getElementById('statDone').textContent   = done;
  const best = habits.reduce((m, h) => Math.max(m, h.streak || 0), 0);
  document.getElementById('statStreak').textContent = best;

  // ── Update Progress Ring ──
  const pct          = total ? Math.round((done / total) * 100) : 0;
  const circumference = 2 * Math.PI * 51;
  const offset        = circumference - (pct / 100) * circumference;

  document.getElementById('ringPct').textContent                    = pct + '%';
  document.getElementById('ringFill').style.strokeDasharray  = circumference;
  document.getElementById('ringFill').style.strokeDashoffset = offset;

  // ── Empty State ──
  if (!total) {
    list.innerHTML = `<div class="empty">No rituals yet — add your first habit ✨</div>`;
    return;
  }

  // ── Render Habit Cards ──
  list.innerHTML = habits.map((h, i) => `
    <div class="habit-card ${h.done ? 'done' : ''}"
         style="--accent-color: ${h.color}; animation-delay: ${i * 0.05}s"
         onclick="toggle(${i})"
         id="card-${i}">
      <div class="habit-check">
        <span class="checkmark">✓</span>
      </div>
      <div class="habit-info">
        <div class="habit-name">${h.emoji} ${h.name}</div>
        <div class="habit-meta">
          ${h.time ? `🕐 ${h.time}` : 'Anytime'}
          <span class="streak-badge">🔥 ${h.streak || 0} day streak</span>
        </div>
      </div>
      <div class="habit-right">
        <button class="del-btn" onclick="deleteHabit(event, ${i})">✕</button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════
// HABIT ACTIONS
// ══════════════════════════════════════

/**
 * Toggle a habit's done state and update its streak.
 * @param {number} i - Index of the habit in the habits array.
 */
function toggle(i) {
  habits[i].done = !habits[i].done;

  if (habits[i].done) {
    habits[i].streak = (habits[i].streak || 0) + 1;
  } else {
    habits[i].streak = Math.max(0, (habits[i].streak || 1) - 1);
  }

  save();
  render();

  // Apply pop animation after render
  setTimeout(() => {
    const card = document.getElementById(`card-${i}`);
    if (card) {
      card.classList.add('pop');
      setTimeout(() => card.classList.remove('pop'), 400);
    }
  }, 10);
}

/**
 * Delete a habit by index.
 * @param {Event}  e - Click event (stopped from bubbling to card toggle).
 * @param {number} i - Index of the habit to remove.
 */
function deleteHabit(e, i) {
  e.stopPropagation();
  habits.splice(i, 1);
  save();
  render();
}

// ══════════════════════════════════════
// MODAL
// ══════════════════════════════════════

/**
 * Build (or rebuild) the color dot picker inside the modal.
 */
function buildColorPicker() {
  const cp = document.getElementById('colorPicker');
  cp.innerHTML = COLORS.map(c => `
    <div class="color-dot ${c === selectedColor ? 'selected' : ''}"
         style="background:${c}"
         onclick="selectColor('${c}')"></div>
  `).join('');
}

/**
 * Set the selected accent color and refresh the picker UI.
 * @param {string} c - Hex color string.
 */
function selectColor(c) {
  selectedColor = c;
  buildColorPicker();
}

/**
 * Open the Add Habit modal.
 */
function openModal() {
  buildColorPicker();
  document.getElementById('habitNameInput').value = '';
  document.getElementById('habitTimeInput').value = '';
  document.getElementById('modalOverlay').classList.add('open');
  // Auto-focus the name field after transition
  setTimeout(() => document.getElementById('habitNameInput').focus(), 300);
}

/**
 * Close the Add Habit modal.
 */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/**
 * Read the modal form values and add a new habit to the list.
 */
function addHabit() {
  const name = document.getElementById('habitNameInput').value.trim();
  if (!name) {
    document.getElementById('habitNameInput').focus();
    return;
  }

  const time  = document.getElementById('habitTimeInput').value.trim();
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  habits.push({
    name,
    time,
    color:  selectedColor,
    emoji,
    done:   false,
    streak: 0
  });

  save();
  closeModal();
  render();
}

// ══════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════

// Close modal when clicking the dark backdrop
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Submit modal with Enter key
document.getElementById('habitNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addHabit();
});

// ══════════════════════════════════════
// BOOT
// ══════════════════════════════════════
initDateBadge();
buildWeek();
render();
