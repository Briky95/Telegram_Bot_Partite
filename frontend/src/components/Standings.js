import React, { useState, useEffect } from 'react';
import { FiAward, FiAlertCircle, FiLoader, FiInfo } from 'react-icons/fi';

const Standings = () => {
  const [selectedChampionship, setSelectedChampionship] = useState('Serie C1');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  
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

  // Calcola la differenza punti
  const calculatePointDiff = (pointsFor, pointsAgainst) => {
    const diff = pointsFor - pointsAgainst;
    return diff > 0 ? `+${diff}` : diff;
  };

  // Determina la classe CSS per la posizione
  const getPositionClass = (position) => {
    if (position <= 3) return `position-${position}`;
    return '';
  };

  return (
    <div className="standings">
      <div className="header">
        <span className="header-icon"><FiAward /></span>
        Classifica
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FiAward style={{ marginRight: '8px' }} />
          Campionato
        </label>
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
        <div className="loading">
          <div className="loading-icon"><FiLoader /></div>
          <p>Caricamento classifica...</p>
        </div>
      ) : error ? (
        <div className="error">
          <div className="error-icon"><FiAlertCircle /></div>
          <p>{error}</p>
        </div>
      ) : standings && standings.length > 0 ? (
        <>
          <div className="standings-table">
            <table>
              <thead>
                <tr>
                  <th className="position">#</th>
                  <th className="team-name">Squadra</th>
                  <th>G</th>
                  <th>V</th>
                  <th>P</th>
                  <th>S</th>
                  <th>Diff</th>
                  <th className="points">Punti</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.team} className={getPositionClass(team.position)}>
                    <td className="position">{team.position}</td>
                    <td className="team-name">{team.team}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td style={{ 
                      color: team.pointsFor > team.pointsAgainst 
                        ? 'var(--tg-theme-button-color, #2481cc)' 
                        : team.pointsFor < team.pointsAgainst 
                          ? '#e53935' 
                          : 'inherit'
                    }}>
                      {calculatePointDiff(team.pointsFor, team.pointsAgainst)}
                    </td>
                    <td className="points">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="button" 
              onClick={() => setShowLegend(!showLegend)}
              style={{ 
                width: 'auto', 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px'
              }}
            >
              <FiInfo style={{ marginRight: '8px' }} />
              {showLegend ? 'Nascondi legenda' : 'Mostra legenda'}
            </button>
            
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--tg-theme-hint-color, #999999)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: 'rgba(36, 129, 204, 0.1)',
                marginRight: '4px',
                borderRadius: '2px'
              }}></div>
              Qualificazione
            </div>
          </div>
          
          {showLegend && (
            <div className="legend">
              <div style={{ marginBottom: '8px', fontWeight: '500' }}>Legenda:</div>
              <div>G = Giocate</div>
              <div>V = Vinte</div>
              <div>P = Pareggiate</div>
              <div>S = Sconfitte</div>
              <div>Diff = Differenza punti (Fatti - Subiti)</div>
              <div>Punti = Punti in classifica</div>
              
              <div style={{ marginTop: '12px', fontWeight: '500' }}>Sistema di punteggio:</div>
              <div>• Vittoria: 4 punti</div>
              <div>• Pareggio: 2 punti</div>
              <div>• Sconfitta: 0 punti</div>
              <div>• Bonus offensivo (4+ mete): 1 punto</div>
              <div>• Bonus difensivo (sconfitta con ≤7 punti): 1 punto</div>
            </div>
          )}
        </>
      ) : (
        <div className="empty">
          <div className="empty-icon">🏉</div>
          <p>Nessun dato disponibile per questo campionato.</p>
        </div>
      )}
    </div>
  );
};

export default Standings;