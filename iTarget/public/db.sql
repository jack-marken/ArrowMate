---------------------------------------------------------------------
-- To be edited by Data Scientist later for correct implementation --
---------------------------------------------------------------------

---------------------------------------------------------------------
-- Username: s105584279
-- Password: 210605
---------------------------------------------------------------------

---------------------------------------------------------------------
-- DROP TABLE IF EXISTS PersonalBest;
-- DROP TABLE IF EXISTS ClubRecord;
-- DROP TABLE IF EXISTS EquivalentRound;
-- DROP TABLE IF EXISTS QualifyingRound;
-- DROP TABLE IF EXISTS Competition;
-- DROP TABLE IF EXISTS Championship;
-- DROP TABLE IF EXISTS RoundScore;
-- DROP TABLE IF EXISTS ArrowScore;
-- DROP TABLE IF EXISTS EndScore;
-- DROP TABLE IF EXISTS RangeScore;
-- DROP TABLE IF EXISTS StagingArrowScore;
-- DROP TABLE IF EXISTS StagingScore;
-- DROP TABLE IF EXISTS Archer;
-- DROP TABLE IF EXISTS DefaultEquipment;
-- DROP TABLE IF EXISTS Category;
-- DROP TABLE IF EXISTS AgeClass;
-- DROP TABLE IF EXISTS RoundRange;
-- DROP TABLE IF EXISTS Round;
-- DROP TABLE IF EXISTS `Range`;

-- CREATE TABLE Round (
--     RoundID INT PRIMARY KEY,
--     CategoryID INT,
--     RoundName VARCHAR(255),
--     MaximumPossibleScore INT
-- );

-- CREATE TABLE `Range` (
--     RangeID INT PRIMARY KEY,
--     TargetFace VARCHAR(20),  -- Changed from ENUM to VARCHAR for MariaDB compatibility
--     Distance INT,
--     RangeNumber INT,
--     RoundNum INT,
--     NumberOfArrows INT,
--     SequenceNumber INT
-- );

-- CREATE TABLE AgeClass (
--     Name VARCHAR(255) PRIMARY KEY,
--     MinAge INT,
--     MaxAge INT
-- );

-- CREATE TABLE Category (
--     CategoryID INT PRIMARY KEY,
--     AgeClass VARCHAR(255),
--     Gender ENUM('Male', 'Female'),
--     Equipment ENUM('Recurve', 'Compound', 'Barebow'),
--     FOREIGN KEY (AgeClass) REFERENCES AgeClass(Name)
-- );

-- CREATE TABLE Archer (
--     ArcheryVicNumber INT PRIMARY KEY,
--     CategoryID INT,
--     FirstName VARCHAR(255),
--     LastName VARCHAR(255),
--     Gender ENUM('Male', 'Female'),
--     DOB DATE,
--     FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
-- );

-- CREATE TABLE DefaultEquipment (
--     DefaultEquipmentID INT PRIMARY KEY,
--     ArcheryVicNumber INT,
--     EquipmentType VARCHAR(255),
--     IsPrimary BOOLEAN,
--     DateSet DATE,
--     FOREIGN KEY (ArcheryVicNumber) REFERENCES Archer(ArcheryVicNumber)
-- );

-- CREATE TABLE RoundRange (
--     RangeID INT,
--     RoundID INT,
--     PRIMARY KEY (RangeID, RoundID),
--     FOREIGN KEY (RangeID) REFERENCES `Range`(RangeID),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID)
-- );

-- -- STAGING

-- CREATE TABLE StagingScore (
--     StagingScoreID INT PRIMARY KEY,
--     ArcherVicNumber INT,
--     RoundID INT,
--     DateTime DATETIME,
--     EquipmentUsed VARCHAR(255),
--     IsApproved BOOLEAN,
--     IsCompetition BOOLEAN,
--     Notes TEXT,
--     FOREIGN KEY (ArcherVicNumber) REFERENCES Archer(ArcheryVicNumber),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID)
-- );

-- CREATE TABLE StagingArrowScore (
--     StagingArrowScoreID INT PRIMARY KEY,
--     StagingScoreID INT,
--     RangeNumber INT,
--     EndNumber INT,
--     ArrowNumber INT,
--     ScoreValue INT,
--     FOREIGN KEY (StagingScoreID) REFERENCES StagingScore(StagingScoreID)
-- );

-- -- SCORES

-- CREATE TABLE Championship (
--     ChampionshipID INT PRIMARY KEY,
--     BaseRoundID INT,
--     Year YEAR,
--     Name VARCHAR(255),
--     StartDate DATE,
--     EndDate DATE,
--     IsActive BOOLEAN,
--     FOREIGN KEY (BaseRoundID) REFERENCES Round(RoundID)
-- );

-- CREATE TABLE Competition (
--     CompetitionID INT PRIMARY KEY,
--     ChampionshipID INT,
--     BaseRoundID INT,
--     Date DATE,
--     Venue VARCHAR(255),
--     FOREIGN KEY (ChampionshipID) REFERENCES Championship(ChampionshipID),
--     FOREIGN KEY (BaseRoundID) REFERENCES Round(RoundID)
-- );

-- CREATE TABLE RangeScore (
--     RangeScoreID INT PRIMARY KEY,
--     RangeID INT,
--     CompetitionID INT,
--     ArcheryVicNumber INT,
--     DateTime DATETIME,
--     IsConfirmed BOOLEAN,
--     FOREIGN KEY (RangeID) REFERENCES `Range`(RangeID),
--     FOREIGN KEY (CompetitionID) REFERENCES Competition(CompetitionID),
--     FOREIGN KEY (ArcheryVicNumber) REFERENCES Archer(ArcheryVicNumber)
-- );

-- CREATE TABLE EndScore (
--     EndScoreID INT PRIMARY KEY,
--     RangeScoreID INT,
--     `Order` INT,
--     FOREIGN KEY (RangeScoreID) REFERENCES RangeScore(RangeScoreID)
-- );

-- CREATE TABLE ArrowScore (
--     ArrowScoreID INT PRIMARY KEY,
--     EndScoreID INT,
--     ScoreValue INT,
--     Sequence INT,
--     FOREIGN KEY (EndScoreID) REFERENCES EndScore(EndScoreID)
-- );

-- CREATE TABLE RoundScore (
--     RoundScoreID INT PRIMARY KEY,
--     ArcheryVicNumber INT,
--     RoundID INT,
--     CompetitionID INT,
--     DateTime DATETIME,
--     EquipmentUsed VARCHAR(255),
--     TotalScore INT,
--     IsChampionship BOOLEAN,
--     IsConfirmed BOOLEAN,
--     Notes TEXT,
--     FOREIGN KEY (ArcheryVicNumber) REFERENCES Archer(ArcheryVicNumber),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID),
--     FOREIGN KEY (CompetitionID) REFERENCES Competition(CompetitionID)
-- );

-- CREATE TABLE QualifyingRound (
--     QualifyingRoundID INT PRIMARY KEY,
--     ChampionshipID INT,
--     RoundID INT,
--     FOREIGN KEY (ChampionshipID) REFERENCES Championship(ChampionshipID),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID)
-- );

-- CREATE TABLE EquivalentRound (
--     EquivalentRoundID INT PRIMARY KEY,
--     BaseRoundID INT,
--     CategoryID INT,
--     FOREIGN KEY (BaseRoundID) REFERENCES Round(RoundID),
--     FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
-- );

-- CREATE TABLE ClubRecord (
--     ClubRecordID INT PRIMARY KEY,
--     ArcheryVicNumber INT,
--     RoundID INT,
--     CategoryID INT,
--     RoundScoreID INT,
--     DateAchieved DATE,
--     ScoreValue INT,
--     FOREIGN KEY (ArcheryVicNumber) REFERENCES Archer(ArcheryVicNumber),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID),
--     FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
--     FOREIGN KEY (RoundScoreID) REFERENCES RoundScore(RoundScoreID)
-- );

-- CREATE TABLE PersonalBest (
--     PersonalBestID INT PRIMARY KEY,
--     ArcheryVicNumber INT,
--     RoundID INT,
--     CategoryID INT,
--     RoundScoreID INT,
--     DateAchieved DATE,
--     ScoreValue INT,
--     FOREIGN KEY (ArcheryVicNumber) REFERENCES Archer(ArcheryVicNumber),
--     FOREIGN KEY (RoundID) REFERENCES Round(RoundID),
--     FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
--     FOREIGN KEY (RoundScoreID) REFERENCES RoundScore(RoundScoreID)
-- );
----------------------------------------------------------------------
-- Note: This above SQL is the real database schema for this application.
-- This code is simply provided to assist in understanding the structure.
-- Please do not modify this file directly - unless truely necessary.