/*───────────────────────────────────────────────────────────────────────────
  ArrowMate  –  Live REST API wired to Swinburne’s MariaDB instance
  Schema  :  s105584279_db   (see ER-diagram v5.png)
  Host    :  feenix-mariadb-web.swin.edu.au
  Account :  user = 's105584279' ,  pass = '210605'
───────────────────────────────────────────────────────────────────────────*/
import  express          from 'express';
import  cors             from 'cors';
import  bodyParser       from 'body-parser';
import  path             from 'path';
import  { fileURLToPath } from 'url';
import  mysql            from 'mysql2/promise';

/*──────────────── DB POOL ───────────────────────────────────────────────*/
const pool = mysql.createPool({
  host              : 'feenix-mariadb-web.swin.edu.au',
  user              : 's105584279',
  password          : '210605',
  database          : 's105584279_db',
  waitForConnections: true,
  connectionLimit   : 10,
  namedPlaceholders : true
});
const all = (sql, p = {}) => pool.execute(sql, p).then(([rows]) => rows);         // SELECT
const run = (sql, p = {}) => pool.execute(sql, p).then(([r]) =>
  ({ id: r.insertId, changes: r.affectedRows })                                    // INSERT / UPDATE
);

/*──────────────── ONE-TIME START-UP – helper tables & views ─────────────*/
async function initSchema() {
  // Helper table ROUNDS  (light-weight “event” container)
  await run(`
    CREATE TABLE IF NOT EXISTS rounds (
      id         INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
      date       DATE        NOT NULL,
      location   VARCHAR(255)NOT NULL,
      face       VARCHAR(50) DEFAULT '122 cm',
      UNIQUE KEY uk_round (date, location)
    ) ENGINE=InnoDB` );

  // Helper table SCORES  (one row = one END of 6 arrows)
  await run(`
    CREATE TABLE IF NOT EXISTS scores (
      id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
      archer_id   INT          NOT NULL,
      round_id    INT          NOT NULL,
      end_no      TINYINT      NOT NULL,
      arrows      VARCHAR(60)  NOT NULL,
      total       SMALLINT     NOT NULL,
      created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_scores_archer FOREIGN KEY (archer_id)
                 REFERENCES Archer(ArcheryVicNumber)
                 ON DELETE CASCADE,
      CONSTRAINT fk_scores_round  FOREIGN KEY (round_id)
                 REFERENCES rounds(id)
                 ON DELETE CASCADE,
      UNIQUE KEY uk_score (archer_id, round_id, end_no)
    ) ENGINE=InnoDB` );

  // VIEW “archers” so the front-end sees exactly what it expects
  await run(`
    CREATE OR REPLACE VIEW v_archers AS
      SELECT  ArcheryVicNumber      AS id,
              CONCAT(FirstName,' ',LastName) AS name,
              CategoryID            AS category_id,
              Gender,
              DOB
        FROM  Archer
  `);
}
await initSchema();   /* <-- executes immediately at start-up */

/*──────────────── EXPRESS APP BOOTSTRAP ────────────────────────────────*/
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* serve front-end SPA from root folder */
app.use(express.static(__dirname));

/* helper – safe query-param builder */
function qf(q, key, sqlFrag, params) {
  if (q[key]) { sqlFrag.push(sqlFrag.pop() + sqlFrag.shift()); params[key] = q[key]; }
}

/*──────────────── ARCHERS ───────────────────────────────────────────────*/
/*  GET  /api/archers     → list [{id,name,gender,category_id,dob}, …]    */
app.get('/api/archers', async (_, res) =>
  res.json(await all('SELECT * FROM v_archers ORDER BY name')));

/*  POST /api/archers     body:{firstName,lastName,gender,dob,categoryID}
                          → {id:<newID>}                                 */
app.post('/api/archers', async (req, res) => {
  const { firstName, lastName, gender, dob, categoryID } = req.body;
  if (!firstName || !lastName) return res.status(400).json({ error: 'Name required' });
  const { id } = await run(`
      INSERT INTO Archer (ArcheryVicNumber, CategoryID, FirstName, LastName, Gender, DOB)
      VALUES (NULL, :cat, :fn, :ln, :g, :dob)`,
    { cat: categoryID || null, fn: firstName, ln: lastName, g: gender || null, dob }
  );
  res.json({ id });
});

/*──────────────── ROUNDS (light-weight “event” container) ──────────────*/
/*  GET  /api/rounds           → list                                    */
app.get('/api/rounds', async (_, res) =>
  res.json(await all('SELECT * FROM rounds ORDER BY date DESC, location')));

/*  POST /api/rounds  body:{date,location,face?}  → {id:<roundID>}       */
app.post('/api/rounds', async (req, res) => {
  const { date, location, face = '122 cm' } = req.body;
  if (!date || !location) return res.status(400).json({ error: 'date & location required' });
  const { id } = await run(
    `INSERT INTO rounds (date,location,face) VALUES (:d,:l,:f)
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    { d: date, l: location, f: face }
  );
  res.json({ id });
});

/*──────────────── SCORES – one row == one END of six arrows ────────────*/
/*  POST /api/scores  body:{archer_id,round_id,end_no,arrows,total}       */
app.post('/api/scores', async (req, res) => {
  const { archer_id, round_id, end_no, arrows, total } = req.body;
  if (!archer_id || !round_id || !end_no || !arrows) {
    return res.status(400).json({ error: 'missing field(s)' });
  }
  res.json(await run(
    `INSERT INTO scores (archer_id,round_id,end_no,arrows,total)
     VALUES (:ai,:ri,:en,:ar,:t)
     ON DUPLICATE KEY UPDATE arrows=:ar,total=:t`,
    { ai: archer_id, ri: round_id, en: end_no, ar: arrows, t: total }
  ));
});

/*  GET /api/scores?archer=&round=&location=&from=&to=                    */
app.get('/api/scores', async (req, res) => {
  const sql = [`
    SELECT sc.*, rd.date, rd.location,
           (SELECT name FROM v_archers WHERE id=sc.archer_id) AS name
      FROM scores sc
      JOIN rounds rd ON sc.round_id = rd.id
      WHERE 1`];
  const params = {};

  qf(req.query, 'archer',   [' AND sc.archer_id = :archer'],   params);
  qf(req.query, 'round',    [' AND sc.round_id  = :round'],    params);
  qf(req.query, 'location', [' AND rd.location  = :location'], params);
  qf(req.query, 'from',     [' AND rd.date     >= :from'],     params);
  qf(req.query, 'to',       [' AND rd.date     <= :to'],       params);

  sql.push(' ORDER BY rd.date DESC, sc.end_no');
  res.json(await all(sql.join(''), params));
});

/*──────────────── PERSONAL BESTS (per location) ────────────────────────*/
app.get('/api/personal-bests', async (req, res) => {
  const { archer } = req.query;
  if (!archer) return res.json([]);
  res.json(await all(`
    SELECT  rd.location,
            MAX(sc.total)             AS best_total,
            MIN(rd.date)              AS shot_on
      FROM  scores sc
      JOIN  rounds rd  ON sc.round_id = rd.id
      WHERE sc.archer_id = :archer
      GROUP BY rd.location
      ORDER BY best_total DESC`, { archer }));
});

/*──────────────── CLUB BESTS (leaderboard for a given range) ───────────*/
app.get('/api/clubs', async (_, res) =>
  res.json(await all('SELECT DISTINCT location FROM rounds ORDER BY location')));

app.get('/api/club-bests', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.json([]);
  res.json(await all(`
    SELECT  (SELECT name FROM v_archers WHERE id=sc.archer_id) AS name,
            MAX(sc.total) AS best_total,
            MIN(rd.date)  AS shot_on
      FROM  scores sc
      JOIN  rounds rd ON sc.round_id = rd.id
      WHERE rd.location = :loc
      GROUP BY sc.archer_id
      ORDER BY best_total DESC`, { loc: location }));
});

/*──────────────── FALLBACK – SPA route catcher  ───────────────────────*/
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

/*──────────────── SERVER LISTEN ───────────────────────────────────────*/
const PORT = 8080;
app.listen(PORT, () => console.log(`▶ ArrowMate API live  →  http://localhost:${PORT}`));
