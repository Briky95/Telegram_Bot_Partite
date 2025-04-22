import React, { useState, useEffect } from 'react';
import { FiList, FiFilter, FiCalendar, FiTrophy, FiAlertCircle, FiLoader } from 'react-icons/fi';

const MatchList = () => {
  // Stato per le partite
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' o 'desc'

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
          },
          {
            id: 4,
            homeTeam: 'Rugby Como',
            awayTeam: 'Rugby Sondrio',
            homeScore: 28,
            awayScore: 12,
            date: '2023-10-08',
            championship: 'Serie C1'
          },
          {
            id: 5,
            homeTeam: 'Rugby Crema',
            awayTeam: 'Rugby Lodi',
            homeScore: 22,
            awayScore: 15,
            date: '2023-10-08',
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

  // Ordina le partite per data
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Raggruppa le partite per data
  const groupedMatches = sortedMatches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {});

  // Formatta la data in modo leggibile
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  // Determina il risultato della partita (vittoria, sconfitta, pareggio)
  const getMatchResult = (homeScore, awayScore) => {
    if (homeScore > awayScore) return 'win-home';
    if (homeScore < awayScore) return 'win-away';
    return 'draw';
  };

  return (
    <div className="match-list">
      <div className="header">
        <span className="header-icon"><FiList /></span>
        Risultati Partite
      </div>
      
      <div className="form-group">
        <div className="form-row">
          <div style={{ flex: 1 }}>
            <label className="form-label">
              <FiFilter style={{ marginRight: '8px' }} />
              Filtra per campionato
            </label>
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
          
          <div style={{ flex: 1, marginLeft: '12px' }}>
            <label className="form-label">
              <FiCalendar style={{ marginRight: '8px' }} />
              Ordinamento
            </label>
            <select 
              className="input" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Più recenti prima</option>
              <option value="asc">Più vecchie prima</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-icon"><FiLoader /></div>
          <p>Caricamento risultati...</p>
        </div>
      ) : error ? (
        <div className="error">
          <div className="error-icon"><FiAlertCircle /></div>
          <p>{error}</p>
        </div>
      ) : sortedMatches.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏉</div>
          <p>Nessuna partita trovata.</p>
        </div>
      ) : (
        Object.keys(groupedMatches).map((date) => (
          <div key={date} className="match-date-group">
            <div className="date-header">
              <FiCalendar style={{ marginRight: '8px' }} />
              {formatDate(date)}
            </div>
            
            {groupedMatches[date].map((match) => {
              const resultClass = getMatchResult(match.homeScore, match.awayScore);
              
              return (
                <div key={match.id} className="card">
                  <div className="championship-badge">
                    <FiTrophy style={{ marginRight: '4px', fontSize: '12px' }} />
                    {match.championship}
                  </div>
                  
                  <div className="match-result">
                    <div className={`team team-home ${resultClass === 'win-home' ? 'winner' : ''}`}>
                      <div style={{ 
                        fontWeight: resultClass === 'win-home' ? 'bold' : 'normal',
                        color: resultClass === 'win-home' ? 'var(--tg-theme-button-color, #2481cc)' : 'inherit'
                      }}>
                        {match.homeTeam}
                      </div>
                    </div>
                    
                    <div className="score-display">
                      <span style={{ 
                        color: resultClass === 'win-home' ? 'var(--tg-theme-button-color, #2481cc)' : 'inherit',
                        fontWeight: resultClass === 'win-home' ? 'bold' : 'normal'
                      }}>
                        {match.homeScore}
                      </span>
                      <span style={{ margin: '0 8px', color: 'var(--tg-theme-hint-color, #999999)' }}>-</span>
                      <span style={{ 
                        color: resultClass === 'win-away' ? 'var(--tg-theme-button-color, #2481cc)' : 'inherit',
                        fontWeight: resultClass === 'win-away' ? 'bold' : 'normal'
                      }}>
                        {match.awayScore}
                      </span>
                    </div>
                    
                    <div className={`team team-away ${resultClass === 'win-away' ? 'winner' : ''}`}>
                      <div style={{ 
                        fontWeight: resultClass === 'win-away' ? 'bold' : 'normal',
                        color: resultClass === 'win-away' ? 'var(--tg-theme-button-color, #2481cc)' : 'inherit'
                      }}>
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default MatchList;