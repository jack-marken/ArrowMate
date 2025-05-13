/*  iTarget – simple Express + SQLite 3 API
 *  run:  node server.js
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const body    = require('body-parser');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(body.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('archery.db');

/* tiny helpers */
const run = (sql,p=[]) => new Promise((res,rej)=>
  db.run(sql,p,function(e){e?rej(e):res({id:this.lastID,changes:this.changes})}));
const all = (sql,p=[]) => new Promise((res,rej)=>
  db.all(sql,p,(e,r)=>e?rej(e):res(r)));

/* ───────────  ARCHERS  ─────────── */
app.get ('/api/archers',   async(_,res)=>res.json(await all(`SELECT * FROM archers`)));
app.post('/api/archers',   async(req,res)=>{
  const {name,equipment='Recurve'} = req.body;
  const r = await run(`INSERT INTO archers (name,equipment) VALUES (?,?)`,[name,equipment]);
  res.json({id:r.id});
});

/* ───────────  ROUNDS & SCORES  ─────────── */
app.get ('/api/rounds',    async(_,res)=>res.json(await all(`SELECT * FROM rounds`)));
app.post('/api/rounds',    async(req,res)=>{
  const {date,location,face='122cm'} = req.body;
  const r = await run(`INSERT INTO rounds (date,location,face) VALUES (?,?,?)`,[date,location,face]);
  res.json({id:r.id});
});

app.get ('/api/scores',    async(req,res)=>{
  /* optional filters shared by many pages */
  const {archer,round,location,from,to} = req.query;
  let  sql = `
     SELECT sc.*, rd.date, rd.location, ar.name, ar.equipment
     FROM   scores sc
     JOIN   rounds rd  ON sc.round_id  = rd.id
     JOIN   archers ar ON sc.archer_id = ar.id
     WHERE  1=1`, p = [];
  if (archer)   { sql+=` AND archer_id = ?`;         p.push(archer); }
  if (round)    { sql+=` AND round_id  = ?`;         p.push(round);  }
  if (location) { sql+=` AND rd.location = ?`;       p.push(location);}
  if (from)     { sql+=` AND date(rd.date) >= date(?)`; p.push(from);}
  if (to)       { sql+=` AND date(rd.date) <= date(?)`; p.push(to); }
  sql += ' ORDER BY rd.date DESC, sc.end_no';
  res.json(await all(sql,p));
});

app.post('/api/scores',    async(req,res)=>{
  const {archer_id,round_id,end_no,arrows,total} = req.body;
  const r = await run(
    `INSERT INTO scores (archer_id,round_id,end_no,arrows,total) VALUES (?,?,?,?,?)`,
    [archer_id,round_id,end_no,arrows,total]);
  res.json({id:r.id});
});

/* ───────────  DERIVED DATA  ─────────── */
app.get('/api/personal-bests', async(req,res)=>{
  const {archer} = req.query;
  if(!archer) return res.json([]);
  res.json(await all(`
    SELECT rd.location, MAX(sc.total) as best_total,
           ar.equipment, MIN(rd.date) as shot_on
    FROM   scores sc
    JOIN   rounds rd  ON sc.round_id  = rd.id
    JOIN   archers ar ON sc.archer_id = ar.id
    WHERE  archer_id = ?
    GROUP  BY rd.location
    ORDER  BY best_total DESC
  `,[archer]));
});

/* list of clubs / locations */
app.get('/api/clubs', async(_,res)=>{
  res.json(await all(`SELECT DISTINCT location FROM rounds ORDER BY location`));
});

/* best score *per archer* at one club */
app.get('/api/club-bests', async(req,res)=>{
  const {location} = req.query;
  if(!location) return res.json([]);
  res.json(await all(`
    SELECT ar.name, ar.equipment,
           MAX(sc.total) as best_total,
           MIN(rd.date)  as shot_on
    FROM   scores sc
    JOIN   archers ar ON sc.archer_id = ar.id
    JOIN   rounds  rd ON sc.round_id  = rd.id
    WHERE  rd.location = ?
    GROUP  BY archer_id
    ORDER  BY best_total DESC
  `,[location]));
});

app.listen(8080,()=>console.log('▶ iTarget API • http://localhost:8080'));
