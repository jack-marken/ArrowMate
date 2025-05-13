---------------------------------------------------------------------
-- To be edited by Data Scientist later for correct implementation --
---------------------------------------------------------------------

-- DROP TABLE IF EXISTS archers;
-- DROP TABLE IF EXISTS rounds;
-- DROP TABLE IF EXISTS scores;

-- CREATE TABLE archers(
--   id        INTEGER PRIMARY KEY AUTOINCREMENT,
--   name      TEXT NOT NULL,
--   equipment TEXT DEFAULT 'Recurve'
-- );

-- CREATE TABLE rounds(
--   id        INTEGER PRIMARY KEY AUTOINCREMENT,
--   date      TEXT NOT NULL,
--   location  TEXT NOT NULL,
--   face      TEXT
-- );

-- CREATE TABLE scores(
--   id         INTEGER PRIMARY KEY AUTOINCREMENT,
--   archer_id  INTEGER,
--   round_id   INTEGER,
--   end_no     INTEGER,
--   arrows     TEXT,       -- "X 10 9 8 7 6"
--   total      INTEGER,
--   FOREIGN KEY(archer_id) REFERENCES archers(id),
--   FOREIGN KEY(round_id)  REFERENCES rounds(id)
-- );

-- INSERT INTO archers (name,equipment) VALUES
--  ('Cindy Archer','Recurve'),
--  ('Lachlan Lee','Compound');

-- INSERT INTO rounds (date,location,face) VALUES
--  ('2024-12-27','Drake','122cm'),
--  ('2024-12-27','Launceston','80cm');

-- INSERT INTO scores (archer_id,round_id,end_no,arrows,total) VALUES
--  (1,1,1,'10 9 9 9 8 7',52),
--  (1,1,2,'10 10 9 9 9 9',56);
