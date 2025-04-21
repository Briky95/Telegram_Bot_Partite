import React, { useState, useEffect } from 'react';

const MatchList = () => {
  // Stato per le partite
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica le partite dal backend
  useEffect(() => {
    setLoading(true);
    fetch('/api/matches')
      .then(response => response.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching matches:', error);
        setError('Errore durante il caricamento delle partite');
        setLoading(false);
        
        // Carica dati di esempio in caso di errore
        setMatches([
          {
            id: 1,
            homeTeam: 'Rugby Club Milano',
            awayTeam: 'Amatori Rugby Novara',
            homeScore: 24,
            awayScore: 17,
            date: '2023-10-15',
            championship: 'Serie C1'
          },
          {
            id: 2,
            homeTeam: 'Rugby Varese',
            awayTeam: 'Rugby Lecco',
            homeScore: 31,
            awayScore: 22,
            date: '2023-10-15',
            championship: 'Serie C1'
          },
          {
            id: 3,
            homeTeam: 'Rugby Bergamo',
            awayTeam: 'Rugby Monza',
            homeScore: 19,
            awayScore: 19,
            date: '2023-10-14',
            championship: 'Serie C2'
          }
        ]);
      });
  }, []);

  const [selectedChampionship, setSelectedChampionship] = useState('');
  
  // Lista di campionati di esempio
  const championships = [
    'Tutti',
    'Serie C1',
    'Serie C2',
    'Coppa Italia',
    'Torneo Amatoriale'
  ];

  // Filtra le partite in base al campionato selezionato
  const filteredMatches = selectedChampionship && selectedChampionship !== 'Tutti'
    ? matches.filter(match => match.championship === selectedChampionship)
    : matches;

  return (
    <div className="match-list">
      <div className="header">Risultati Partite</div>
      
      <div className="form-group">
        <label className="form-label">Filtra per campionato</label>
        <select 
          className="input" 
          value={selectedChampionship} 
          onChange={(e) => setSelectedChampionship(e.target.value)}
        >
          <option value="">Tutti i campionati</option>
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
      ) : filteredMatches.length === 0 ? (
        <div className="card">
          <p>Nessuna partita trovata.</p>
        </div>
      ) : (
        filteredMatches.map((match) => (
          <div key={match.id} className="card">
            <div style={{ marginBottom: '8px' }}>
              <strong>{match.championship}</strong> • {new Date(match.date).toLocaleDateString('it-IT')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, textAlign: 'right', paddingRight: '10px' }}>
                {match.homeTeam}
              </div>
              <div style={{ fontWeight: 'bold', padding: '0 10px' }}>
                {match.homeScore} - {match.awayScore}
              </div>
              <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px' }}>
                {match.awayTeam}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchList;