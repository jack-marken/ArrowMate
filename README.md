# iTarget - Archery Victoria Application Repository for COS20031 🏹

iTarget is a mobile-first web application that helps Victorian archers join rounds, record scores, and track personal-best results.
It runs entirely in the browser as a single-page app (SPA) and communicates with a lightweight Node + SQL API - Feenix MariaDB.

✨ Current Feature Set

| Area                        | What it does today                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Profile & login**         | • Simple username/password gate (both `1234` for now).<br>• Bottom navigation stays hidden until login, then slides up.<br>• Mock profile card (name, flag, log-out).                                                      |
| **Home**                    | Landing screen with “Recorder” or “Archer” entry points (UI polish coming next).                                                                                                                                           |
| **Recorder**                | • Pick an existing archer or add a new one.<br>• Create a round on the fly (date + location).<br>• Record end-by-end arrow values; totals are auto-calculated.<br>• Confirmation toast and live refresh of Personal Bests. |
| **Round list (Archer tab)** | Shows every round the logged-in archer has shot, newest first, with a link to the end-by-end breakdown.                                                                                                                    |
| **Detail view**             | Re-usable page that displays all ends for a selected round.                                                                                                                                                                |
| **Personal Bests**          | Lists the archer’s highest-scoring round totals, one row per round.<br>• **Location** link → jumps to Clubs tab filtered to that venue.<br>• **Score** link → opens the same end-by-end Detail page.                       |
| **Clubs**                   | Dropdown of venues fetched from the DB; selecting one shows every archer’s best score there.                                                                                                                               |
| **Responsive design**       | Built mobile-first with centred headings, flexible tables, Font Awesome icons, and a sliding bottom navigation bar.                                                                                                        |
| **API**                     | REST-style endpoints for `archers`, `rounds`, `scores`, plus derived routes (`personal-bests`, `club-bests`, `clubs`).                                                                                                     |

🖥️ Tech Stack:

| Layer         | Choice                                      |
| ------------- | ------------------------------------------- |
| **Front-end** | Vanilla HTML + CSS + JS (no framework)      |
| **Icons**     | Font Awesome 6 CDN                          |
| **Back-end**  | Node.js (Express)                           |
| **Database**  | SQL Feenix MariaDB                          |
| **Dev deps**  | `express`, `sql (feenix mariadb)`, `cors`, `body-parser` |

| Path                | Purpose                              |
| ------------------- | ------------------------------------ |
| `iTarget/`          | Parent Folder
| `server.js`         | Express API (runs on port 8080)      |
| `db.sql`            | Schema                               |
| `/public/`          | Easy File Reading                    |
| `public/index.html` | Main HTML shell                      |
| `public/styles.css` | Global styles (mobile-first palette) |
| `public/script.js`  | SPA logic, navigation, data calls    |

🗺️ Road Map // Future Milestones

| Phase                                  | Planned work                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| **🏠 Functional home page + branding** | Add hero banner, brand image/logo, and refined layout.                           |
| **📊 Full-scale Personal-Bests table** | Populate from live DB once back-end data is online.                              |
| **📍 Championships & nearby clubs**    | Display upcoming championships and other venues with distance filters.           |
| **📝 Round sign-up flow**              | Allow users to register (full details) into available rounds/events.             |
| **🔐 Proper authentication**           | Replace demo login with secure, hashed-password auth.                            |
| **🖼 Custom image uploads**            | User avatars and profile images stored with each archer.                         |
| **📱 Native wrapper**                  | Package as PWA / Capacitor app to enhance readability and UX on iOS and Android. |


📜 **License**
MIT - See LICENSE for full text
