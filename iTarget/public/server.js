/*─────────────────────────────────────────────────────────────────────────
  iTarget – Express REST API  (MariaDB)
  This is an AI generated code snippet for a simple Express REST API
  that interacts with a MariaDB database. It provides templates for
  CRUD operations on archers, rounds, and scores. The API also includes
  the ability to retrieve personal bests and club bests for archers.
  The code is structured to be modular and easy to understand, with
  clear separation of concerns. This can easily be swapped in for the 
  proper addition of the database connection and CRUD operations in the
  near future when they are provided and the database is set up.
─────────────────────────────────────────────────────────────────────────*/
const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const body    = require('body-parser');
const path    = require('path');

const app = express();
app.use(cors());
app.use(body.json());
app.use(express.static(path.join(__dirname, 'public')));

/*──────────────── DB POOL (replace creds) ────────────────*/
const pool = mysql.createPool({
  host:'feenix-db-host', user:'archery_user', password:'secret', database:'archery',
  waitForConnections:true, connectionLimit:10
});
const all = (sql,p=[]) => pool.execute(sql,p).then(([rows])=>rows);
const run = (sql,p=[]) => pool.execute(sql,p).then(([r])=>({id:r.insertId,changes:r.affectedRows}));

/*──────────────── ARCHERS ────────────────*/
app.get ('/api/archers', async(_,res)=>res.json(await all('SELECT * FROM archers')));
app.post('/api/archers', async(req,res)=>{
  const {name,equipment='Recurve'} = req.body;
  res.json(await run('INSERT INTO archers (name,equipment) VALUES (?,?)',[name,equipment]));
});

/*──────────────── ROUNDS ────────────────*/
app.get ('/api/rounds',  async(_,res)=>res.json(await all('SELECT * FROM rounds')));
app.post('/api/rounds',  async(req,res)=>{
  const {date,location,face='122cm'} = req.body;
  res.json(await run('INSERT INTO rounds (date,location,face) VALUES (?,?,?)',[date,location,face]));
});

/*──────────────── SCORES ────────────────*/
app.post('/api/scores', async(req,res)=>{
  const {archer_id,round_id,end_no,arrows,total} = req.body;
  res.json(await run('INSERT INTO scores (archer_id,round_id,end_no,arrows,total) VALUES (?,?,?,?,?)',[archer_id,round_id,end_no,arrows,total]));
});

app.get('/api/scores', async(req,res)=>{
  const {archer,round,location,from,to} = req.query;
  let  sql = `
    SELECT sc.*, rd.date, rd.location, ar.name, ar.equipment
    FROM   scores sc
    JOIN   rounds  rd ON sc.round_id  = rd.id
    JOIN   archers ar ON sc.archer_id = ar.id
    WHERE  1=1`, p=[];
  if(archer)   { sql+=' AND archer_id=?';    p.push(archer); }
  if(round)    { sql+=' AND round_id =?';    p.push(round);  }
  if(location) { sql+=' AND rd.location=?';  p.push(location);}
  if(from)     { sql+=' AND rd.date>=?';     p.push(from); }
  if(to)       { sql+=' AND rd.date<=?';     p.push(to);   }
  sql += ' ORDER BY rd.date DESC, sc.end_no';
  res.json(await all(sql,p));
});

/*──────────────── DERIVED DATA ────────────────*/
app.get('/api/personal-bests', async(req,res)=>{
  const {archer} = req.query; if(!archer) return res.json([]);
  res.json(await all(`
    SELECT rd.location, MAX(sc.total) best_total,
           ar.equipment, MIN(rd.date) shot_on
    FROM   scores sc
    JOIN   rounds  rd ON sc.round_id  = rd.id
    JOIN   archers ar ON sc.archer_id = ar.id
    WHERE  archer_id = ?
    GROUP  BY rd.location
    ORDER  BY best_total DESC`, [archer]));
});

app.get('/api/clubs', async(_,res)=>
  res.json(await all('SELECT DISTINCT location FROM rounds ORDER BY location')));

app.get('/api/club-bests', async(req,res)=>{
  const {location} = req.query; if(!location) return res.json([]);
  res.json(await all(`
    SELECT ar.name, ar.equipment,
           MAX(sc.total) best_total,
           MIN(rd.date)  shot_on
    FROM   scores sc
    JOIN   archers ar ON sc.archer_id = ar.id
    JOIN   rounds  rd ON sc.round_id  = rd.id
    WHERE  rd.location = ?
    GROUP  BY archer_id
    ORDER  BY best_total DESC`, [location]));
});

/*──────────────── SERVER ────────────────*/
const PORT = 8080;
app.listen(PORT, ()=> console.log(`▶ iTarget API  •  http://localhost:${PORT}`));
