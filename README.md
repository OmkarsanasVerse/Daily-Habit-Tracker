# Daily-Habit-Tracker


🗂️ Project Overview
A single-file, client-side web app built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies, no backend required.

🎨 Design & Aesthetics

  📁 habit-tracker/
├── index.html    →  Structure & layout only
├── style.css     →  All styling, variables & animations
└── script.js     →  All logic, data & event handling


Theme: Dark luxury — deep charcoal background with gold accents
Fonts: Playfair Display (headings) + Lato (body) via Google Fonts
Grain texture overlay for a refined, tactile feel
Color accent system — each habit gets its own highlight color (left bar + checkbox)


🧩 Core Features
FeatureDetailsAdd HabitsName, time of day, custom color via modal popupToggle CompleteClick card → animates checkmark, strikethroughStreak TrackingAuto-increments on each completionProgress RingSVG circle that fills based on % done todayStats BarShows total habits, completed count, best streakWeek Strip7-day calendar row, today highlighted in goldDelete HabitsHover card → ✕ button appearsDaily ResetCompletions clear each new day, streaks persistAuto-saveAll data stored in localStorage

⚙️ Technical Stack

HTML5 — semantic structure
CSS3 — custom properties (variables), keyframe animations, grid/flexbox layout, SVG gradients
Vanilla JavaScript — DOM manipulation, localStorage, date logic
No libraries — fully self-contained in one .html file (~350 lines)


📁 File Structure
Since it's a single file, everything lives in habit-tracker.html:

<style> — all CSS (~220 lines)
<body> — all HTML markup
<script> — all JS logic (~120 lines)


💾 Data Storage
Uses the browser's localStorage with two keys:

habits_v2 — JSON array of all habit objects
last_day — string of last active date (used to trigger daily reset)

Each habit object looks like:
json{
  "name": "Morning Meditation",
  "time": "7:00 AM",
  "color": "#4caf7a",
  "emoji": "🧘",
  "done": false,
  "streak": 5
}
