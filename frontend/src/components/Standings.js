import React, { useState, useEffect } from 'react';

const Standings = () => {
  const [selectedChampionship, setSelectedChampionship] = useState('Serie C1');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lista di campionati di esempio
  const [championships, setChampionships] = useState([
    'Serie C1',
    'Serie C2',
    'Coppa Italia',
    'Torneo Amatoriale'
  ]);

  // Carica i campionati dal backend
  useEffect(() => {
    fetch('/api/championships')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setChampionships(data);
          if (!data.includes(selectedChampionship)) {
            setSelectedChampionship(data[0]);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching championships:', error);
      });
  }, [selectedChampionship]);

  // Carica le classifiche dal backend
  useEffect(() => {
    if (!selectedChampionship) return;
    
    setLoading(true);
    fetch(`/api/standings/${selectedChampionship}`)
      .then(response => response.json())
      .then(data => {
        setStandings(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching standings:', error);
        setError('Errore durante il caricamento della classifica');
        setLoading(false);
        
        // Dati di esempio in caso di errore
        if (selectedChampionship === 'Serie C1') {
          setStandings([
            { position: 1, team: 'Rugby Club Milano', played: 5, won: 4, drawn: 1, lost: 0, pointsFor: 142, pointsAgainst: 87, points: 21 },
            { position: 2, team: 'Rugby Varese', played: 5, won: 4, drawn: 0, lost: 1, pointsFor: 135, pointsAgainst: 92, points: 19 },
            { position: 3, team: 'Amatori Rugby Novara', played: 5, won: 3, drawn: 0, lost: 2, pointsFor: 118, pointsAgainst: 105, points: 15 },
            { position: 4, team: 'Rugby Lecco', played: 5, won: 2, drawn: 0, lost: 3, pointsFor: 98, pointsAgainst: 112, points: 10 },
            { position: 5, team: 'Rugby Como', played: 5, won: 1, drawn: 1, lost: 3, pointsFor: 92, pointsAgainst: 124, points: 7 },
            { position: 6, team: 'Rugby Sondrio', played: 5, won: 0, drawn: 0, lost: 5, pointsFor: 78, pointsAgainst: 143, points: 1 }
          ]);
        } else if (selectedChampionship === 'Serie C2') {
          setStandings([
            { position: 1, team: 'Rugby Bergamo', played: 4, won: 3, drawn: 1, lost: 0, pointsFor: 112, pointsAgainst: 76, points: 16 },
            { position: 2, team: 'Rugby Monza', played: 4, won: 3, drawn: 1, lost: 0, pointsFor: 105, pointsAgainst: 82, points: 16 },
            { position: 3, team: 'Rugby Crema', played: 4, won: 2, drawn: 0, lost: 2, pointsFor: 98, pointsAgainst: 87, points: 10 },
            { position: 4, team: 'Rugby Lodi', played: 4, won: 1, drawn: 0, lost: 3, pointsFor: 76, pointsAgainst: 95, points: 5 },
            { position: 5, team: 'Rugby Mantova', played: 4, won: 0, drawn: 0, lost: 4, pointsFor: 65, pointsAgainst: 116, points: 0 }
          ]);
        } else if (selectedChampionship === 'Coppa Italia') {
          setStandings([
            { position: 1, team: 'Rugby Club Milano', played: 2, won: 2, drawn: 0, lost: 0, pointsFor: 58, pointsAgainst: 32, points: 9 },
            { position: 2, team: 'Rugby Bergamo', played: 2, won: 1, drawn: 0, lost: 1, pointsFor: 45, pointsAgainst: 38, points: 5 },
            { position: 3, team: 'Rugby Varese', played: 2, won: 0, drawn: 0, lost: 2, pointsFor: 27, pointsAgainst: 60, points: 0 }
          ]);
        } else {
          setStandings([]);
        }
      });
  }, [selectedChampionship]);

  return (
    <div className="standings">
      <div className="header">Classifica</div>
      
      <div className="form-group">
        <label className="form-label">Campionato</label>
        <select 
          className="input" 
          value={selectedChampionship} 
          onChange={(e) => setSelectedChampionship(e.target.value)}
        >
          {championships.map((champ) => (
            <option key={champ} value={champ}>{champ}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="card">
          <p>Caricamento in corso...</p>
        </div>
      ) : error ? (
        <div className="card">
          <p>{error}</p>
        </div>
      ) : standings && standings.length > 0 ? (
        <div className="standings-table">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--tg-theme-hint-color, #999999)' }}>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>#</th>
                  <th style={{ padding: '8px 4px', textAlign: 'left' }}>Squadra</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>G</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>V</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>P</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>S</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>PF</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>PS</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>Punti</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.team} style={{ borderBottom: '1px solid var(--tg-theme-hint-color, #999999)' }}>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.position}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'left' }}>{team.team}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.played}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.won}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.drawn}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.lost}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.pointsFor}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>{team.pointsAgainst}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--tg-theme-hint-color, #999999)' }}>
            G = Giocate, V = Vinte, P = Pareggiate, S = Sconfitte, PF = Punti Fatti, PS = Punti Subiti
          </div>
        </div>
      ) : (
        <div className="card">
          <p>Nessun dato disponibile per questo campionato.</p>
        </div>
      )}
    </div>
  );
};

export default Standings;