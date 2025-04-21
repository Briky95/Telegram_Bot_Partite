import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const MatchForm = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [date, setDate] = useState('');
  const [championship, setChampionship] = useState('');
  
  // Lista di campionati di esempio
  const championships = [
    'Serie C1',
    'Serie C2',
    'Coppa Italia',
    'Torneo Amatoriale'
  ];

  // Mostra il pulsante principale quando il form è valido
  useEffect(() => {
    const isFormValid = homeTeam && awayTeam && 
                        homeScore && awayScore && 
                        date && championship;
    
    try {
      if (isFormValid) {
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(handleSubmit);
      } else {
        WebApp.MainButton.hide();
      }
      
      return () => {
        WebApp.MainButton.offClick(handleSubmit);
      };
    } catch (error) {
      console.warn('Telegram WebApp button features not available in standalone mode');
    }
  }, [homeTeam, awayTeam, homeScore, awayScore, date, championship]);

  const handleSubmit = () => {
    // Qui invieremo i dati al backend
    const matchData = {
      homeTeam,
      awayTeam,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
      date,
      championship
    };
    
    console.log('Dati partita:', matchData);
    
    // Invia i dati al backend
    fetch('http://localhost:3002/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      
      // Mostra un popup di conferma se siamo in Telegram
      try {
        WebApp.showPopup({
          title: 'Risultato Salvato',
          message: `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
          buttons: [
            {
              id: 'ok',
              type: 'ok'
            }
          ]
        });
      } catch (error) {
        alert(`Risultato salvato: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Errore durante il salvataggio del risultato');
    });
    
    // Resetta il form
    setHomeTeam('');
    setAwayTeam('');
    setHomeScore('');
    setAwayScore('');
    setDate('');
    setChampionship('');
  };

  return (
    <div className="match-form">
      <div className="header">Aggiungi Risultato Partita</div>
      
      <div className="form-group">
        <label className="form-label">Campionato</label>
        <select 
          className="input" 
          value={championship} 
          onChange={(e) => setChampionship(e.target.value)}
        >
          <option value="">Seleziona campionato</option>
          {championships.map((champ) => (
            <option key={champ} value={champ}>{champ}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Data</label>
        <input 
          type="date" 
          className="input" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Squadra Casa</label>
        <input 
          type="text" 
          className="input" 
          placeholder="Nome squadra casa" 
          value={homeTeam} 
          onChange={(e) => setHomeTeam(e.target.value)} 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Squadra Ospite</label>
        <input 
          type="text" 
          className="input" 
          placeholder="Nome squadra ospite" 
          value={awayTeam} 
          onChange={(e) => setAwayTeam(e.target.value)} 
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Punteggio</label>
        <div className="team-score">
          <input 
            type="number" 
            className="input score-input" 
            placeholder="0" 
            value={homeScore} 
            onChange={(e) => setHomeScore(e.target.value)} 
            min="0"
          />
          <span className="vs">-</span>
          <input 
            type="number" 
            className="input score-input" 
            placeholder="0" 
            value={awayScore} 
            onChange={(e) => setAwayScore(e.target.value)} 
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default MatchForm;