// Importa le dipendenze
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Inizializzazione dell'app Express
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Percorsi dei file di database
const DATA_DIR = path.join(__dirname, 'data');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');

// Assicurati che la directory data esista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Carica i dati dai file o inizializza con valori predefiniti
let matches = [];
let teams = {};

try {
  if (fs.existsSync(MATCHES_FILE)) {
    matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf8'));
    console.log(`Caricati ${matches.length} partite dal file`);
  }
} catch (error) {
  console.error('Errore nel caricamento delle partite:', error);
}

try {
  if (fs.existsSync(TEAMS_FILE)) {
    teams = JSON.parse(fs.readFileSync(TEAMS_FILE, 'utf8'));
    console.log(`Caricati dati di ${Object.keys(teams).length} squadre dal file`);
  }
} catch (error) {
  console.error('Errore nel caricamento delle squadre:', error);
}

// Funzione per salvare i dati nei file
function saveData() {
  try {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
    fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2));
    console.log('Dati salvati con successo');
  } catch (error) {
    console.error('Errore nel salvataggio dei dati:', error);
  }
}

const championships = [
  'Serie C1',
  'Serie C2',
  'Coppa Italia',
  'Torneo Amatoriale'
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Rugby Results Tracker API' });
});

// Ottieni tutti i campionati
app.get('/championships', (req, res) => {
  res.json(championships);
});

// Ottieni tutte le partite
app.get('/matches', (req, res) => {
  const { championship } = req.query;
  
  if (championship) {
    const filteredMatches = matches.filter(match => match.championship === championship);
    return res.json(filteredMatches);
  }
  
  res.json(matches);
});

// Aggiungi una nuova partita
app.post('/matches', (req, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, date, championship } = req.body;
  
  console.log('Ricevuta richiesta di aggiunta partita:', req.body);
  
  // Validazione
  if (!homeTeam || !awayTeam || homeScore === undefined || awayScore === undefined || !date || !championship) {
    console.error('Validazione fallita:', { homeTeam, awayTeam, homeScore, awayScore, date, championship });
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }
  
  // Genera un ID univoco
  const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
  
  const newMatch = {
    id: newId,
    homeTeam,
    awayTeam,
    homeScore: parseInt(homeScore),
    awayScore: parseInt(awayScore),
    date,
    championship,
    createdAt: new Date().toISOString()
  };
  
  matches.push(newMatch);
  
  // Aggiorna le statistiche delle squadre
  updateTeamStats(homeTeam, awayTeam, homeScore, awayScore, championship);
  
  // Salva i dati nei file
  saveData();
  
  console.log('Partita aggiunta con successo:', newMatch);
  res.status(201).json(newMatch);
});

// Ottieni la classifica di un campionato
app.get('/standings/:championship', (req, res) => {
  const { championship } = req.params;
  
  if (!championships.includes(championship)) {
    return res.status(404).json({ error: 'Campionato non trovato' });
  }
  
  const teamsInChampionship = Object.keys(teams)
    .filter(teamName => teams[teamName][championship])
    .map(teamName => {
      const stats = teams[teamName][championship];
      return {
        team: teamName,
        played: stats.played,
        won: stats.won,
        drawn: stats.drawn,
        lost: stats.lost,
        pointsFor: stats.pointsFor,
        pointsAgainst: stats.pointsAgainst,
        points: calculatePoints(stats)
      };
    })
    .sort((a, b) => b.points - a.points);
  
  // Aggiungi la posizione
  const standings = teamsInChampionship.map((team, index) => ({
    position: index + 1,
    ...team
  }));
  
  res.json(standings);
});

// Funzione per aggiornare le statistiche delle squadre
function updateTeamStats(homeTeam, awayTeam, homeScore, awayScore, championship) {
  // Inizializza le squadre se non esistono
  if (!teams[homeTeam]) {
    teams[homeTeam] = {};
  }
  
  if (!teams[awayTeam]) {
    teams[awayTeam] = {};
  }
  
  // Inizializza le statistiche del campionato per le squadre
  if (!teams[homeTeam][championship]) {
    teams[homeTeam][championship] = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0
    };
  }
  
  if (!teams[awayTeam][championship]) {
    teams[awayTeam][championship] = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0
    };
  }
  
  // Aggiorna le statistiche della squadra di casa
  teams[homeTeam][championship].played += 1;
  teams[homeTeam][championship].pointsFor += homeScore;
  teams[homeTeam][championship].pointsAgainst += awayScore;
  
  // Aggiorna le statistiche della squadra ospite
  teams[awayTeam][championship].played += 1;
  teams[awayTeam][championship].pointsFor += awayScore;
  teams[awayTeam][championship].pointsAgainst += homeScore;
  
  // Aggiorna vittorie, pareggi e sconfitte
  if (homeScore > awayScore) {
    teams[homeTeam][championship].won += 1;
    teams[awayTeam][championship].lost += 1;
  } else if (homeScore < awayScore) {
    teams[homeTeam][championship].lost += 1;
    teams[awayTeam][championship].won += 1;
  } else {
    teams[homeTeam][championship].drawn += 1;
    teams[awayTeam][championship].drawn += 1;
  }
}

// Calcola i punti in classifica (4 per vittoria, 2 per pareggio, 0 per sconfitta)
function calculatePoints(stats) {
  return (stats.won * 4) + (stats.drawn * 2);
}

// Gestisci tutte le richieste API
app.all('*', (req, res) => {
  const path = req.path;
  res.status(404).json({ error: `Endpoint non trovato: ${path}` });
});

// Esporta l'app Express per Vercel
module.exports = app;