# ~iTarget~ ArrowMate - Archery Victoria Application Repository for COS20031 🏹

ArrowMate is a mobile-first web application that helps Victorian archers join rounds, record scores, and track personal-best results.
It runs entirely in the browser as a single-page app (SPA) and communicates with a lightweight Node + SQL API - Feenix MariaDB.

✨ Current Feature Set

| Area | What it does today |
|------|-------------------|
| **Profile & login** | Demo credentials gate (`1234/1234`), nav bar slides in after login, profile card with avatar / flag, swap-account + robust logout. |
| **Home** | Four-quadrant welcome (live clock & Melbourne weather), brand logo. |
| **Join-a-Range picker** | Orange banner with two jumbo buttons: **Archer** or **Recorder**. |
| **Archer flow** | New-or-existing archer form (DOB / class / division required), championship selector, range briefing. |
| **Recorder flow** | Active-archer dropdown, colour-coded 6-arrow keypad (auto total), multi-end capture, colourised review and Save & Exit. |
| **Personal bests / Clubs** | Lists and filters (stubbed to local memory until DB online). |
| **Leaderboard** | Mock ranking table with avatar, points, and range breakdown. |
| **Responsive design** | Mobile-first layout, slid-up nav, Font Awesome icons, colour palette from design brief. |

🖥️ Tech Stack:

| Layer         | Choice                                      |
| ------------- | ------------------------------------------- |
| **Front-end** | Vanilla HTML + CSS + JS (no framework)      |
| **Icons**     | Font Awesome 6 CDN & Locally Created        |
| **Back-end**  | Node.js (Express)                           |
| **Database**  | SQL Feenix MariaDB                          |
| **Dev deps**  | `express`, `sql (feenix mariadb)`, `cors`, `body-parser` |

| Path                | Purpose                              |
| ------------------- | ------------------------------------ |
| `ArrowMate/`          | Parent Folder
| `server.js`         | Express API (runs on port 8080)      |
| `db.sql`            | Schema                               |
| `/public/`          | Easy File Reading                    |
| `public/index.html` | Main HTML shell                      |
| `public/styles.css` | Global styles (mobile-first palette) |
| `public/script.js`  | SPA logic, navigation, data calls    |

🗺️ Road Map // Future Milestones

| Phase | Planned work |
|-------|--------------|
| **🔗 DB integration** | Wire front-end calls to Feenix MariaDB (archers, rounds, scores). |
| **🔐 Proper authentication** | Replace demo login with secure hashed-password flow. |
| **📸 Image uploads** | User-avatar & club-logo uploads. |
| **📍 Championships API** | Pull real events & ranges instead of mock list. |
| **📊 Personal bests (live)** | Populate tables from DB once scores persist. |
| **📱 Native wrapper** | Wrap as PWA / Capacitor for installable iOS / Android experience. |

📜 **License**
MIT - See LICENSE for full text
