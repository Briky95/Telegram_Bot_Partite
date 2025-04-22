import React, { useState, useEffect, useCallback } from 'react';
import WebApp from '@twa-dev/sdk';
import { FiPlusCircle, FiCalendar, FiHome, FiUsers, FiAward } from 'react-icons/fi';

const MatchForm = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [date, setDate] = useState('');
  const [championship, setChampionship] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lista di campionati di esempio
  const championships = [
    'Serie C1',
    'Serie C2',
    'Coppa Italia',
    'Torneo Amatoriale'
  ];

  // Lista di squadre di esempio per l'autocompletamento
  const teamSuggestions = [
    'Rugby Club Milano',
    'Amatori Rugby Novara',
    'Rugby Varese',
    'Rugby Lecco',
    'Rugby Como',
    'Rugby Sondrio',
    'Rugby Bergamo',
    'Rugby Monza',
    'Rugby Crema',
    'Rugby Lodi',
    'Rugby Mantova'
  ];

  // Funzione per validare il form
  const validateForm = () => {
    const newErrors = {};
    
    if (!championship) newErrors.championship = 'Seleziona un campionato';
    if (!date) newErrors.date = 'Inserisci la data della partita';
    if (!homeTeam) newErrors.homeTeam = 'Inserisci il nome della squadra di casa';
    if (!awayTeam) newErrors.awayTeam = 'Inserisci il nome della squadra ospite';
    if (homeTeam === awayTeam && homeTeam !== '') 
      newErrors.awayTeam = 'Le squadre devono essere diverse';
    if (homeScore === '') newErrors.homeScore = 'Inserisci il punteggio';
    if (awayScore === '') newErrors.awayScore = 'Inserisci il punteggio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
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
    fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setIsSubmitting(false);
      
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
        
        // Aggiungi un effetto di vibrazione per confermare il salvataggio
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (error) {
        alert(`Risultato salvato: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
      }
      
      // Resetta il form
      setHomeTeam('');
      setAwayTeam('');
      setHomeScore('');
      setAwayScore('');
      setDate('');
      setChampionship('');
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsSubmitting(false);
      
      try {
        WebApp.showPopup({
          title: 'Errore',
          message: 'Si è verificato un errore durante il salvataggio del risultato.',
          buttons: [
            {
              id: 'ok',
              type: 'ok'
            }
          ]
        });
      } catch (e) {
        alert('Errore durante il salvataggio del risultato');
      }
    });
  }, [homeTeam, awayTeam, homeScore, awayScore, date, championship]);

  // Mostra il pulsante principale quando il form è valido
  useEffect(() => {
    const isFormValid = homeTeam && awayTeam && 
                        homeScore !== '' && awayScore !== '' && 
                        date && championship;
    
    try {
      if (isFormValid) {
        WebApp.MainButton.setText(isSubmitting ? 'Salvataggio...' : 'Salva Risultato');
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(handleSubmit);
        
        if (isSubmitting) {
          WebApp.MainButton.showProgress(true);
        } else {
          WebApp.MainButton.showProgress(false);
        }
      } else {
        WebApp.MainButton.hide();
      }
      
      return () => {
        WebApp.MainButton.offClick(handleSubmit);
      };
    } catch (error) {
      console.warn('Telegram WebApp button features not available in standalone mode');
    }
  }, [homeTeam, awayTeam, homeScore, awayScore, date, championship, isSubmitting, handleSubmit]);

  // Funzione per filtrare i suggerimenti delle squadre
  const filterTeamSuggestions = (input, currentTeams) => {
    if (!input) return [];
    const filtered = teamSuggestions.filter(team => 
      team.toLowerCase().includes(input.toLowerCase()) && 
      !currentTeams.includes(team)
    );
    return filtered.slice(0, 5); // Limita a 5 suggerimenti
  };

  // Stato per i suggerimenti
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [awaySuggestions, setAwaySuggestions] = useState([]);

  // Aggiorna i suggerimenti quando l'utente digita
  useEffect(() => {
    if (homeTeam) {
      setHomeSuggestions(filterTeamSuggestions(homeTeam, [awayTeam]));
    } else {
      setHomeSuggestions([]);
    }
  }, [homeTeam, awayTeam]);

  useEffect(() => {
    if (awayTeam) {
      setAwaySuggestions(filterTeamSuggestions(awayTeam, [homeTeam]));
    } else {
      setAwaySuggestions([]);
    }
  }, [awayTeam, homeTeam]);

  return (
    <div className="match-form">
      <div className="header">
        <span className="header-icon"><FiPlusCircle /></span>
        Aggiungi Risultato
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FiAward style={{ marginRight: '8px' }} />
          Campionato
        </label>
        <select 
          className={`input ${errors.championship ? 'error' : ''}`}
          value={championship} 
          onChange={(e) => setChampionship(e.target.value)}
        >
          <option value="">Seleziona campionato</option>
          {championships.map((champ) => (
            <option key={champ} value={champ}>{champ}</option>
          ))}
        </select>
        {errors.championship && <div className="error-message">{errors.championship}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FiCalendar style={{ marginRight: '8px' }} />
          Data
        </label>
        <input 
          type="date" 
          className={`input ${errors.date ? 'error' : ''}`}
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
        {errors.date && <div className="error-message">{errors.date}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FiHome style={{ marginRight: '8px' }} />
          Squadra Casa
        </label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className={`input ${errors.homeTeam ? 'error' : ''}`}
            placeholder="Nome squadra casa" 
            value={homeTeam} 
            onChange={(e) => setHomeTeam(e.target.value)} 
            autoComplete="off"
          />
          {homeSuggestions.length > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 10,
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              border: '1px solid var(--tg-theme-hint-color, #cccccc)',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {homeSuggestions.map((team, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: index < homeSuggestions.length - 1 ? '1px solid var(--tg-theme-hint-color, #eeeeee)' : 'none'
                  }}
                  onClick={() => {
                    setHomeTeam(team);
                    setHomeSuggestions([]);
                  }}
                >
                  {team}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.homeTeam && <div className="error-message">{errors.homeTeam}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FiUsers style={{ marginRight: '8px' }} />
          Squadra Ospite
        </label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className={`input ${errors.awayTeam ? 'error' : ''}`}
            placeholder="Nome squadra ospite" 
            value={awayTeam} 
            onChange={(e) => setAwayTeam(e.target.value)} 
            autoComplete="off"
          />
          {awaySuggestions.length > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 10,
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              border: '1px solid var(--tg-theme-hint-color, #cccccc)',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {awaySuggestions.map((team, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: index < awaySuggestions.length - 1 ? '1px solid var(--tg-theme-hint-color, #eeeeee)' : 'none'
                  }}
                  onClick={() => {
                    setAwayTeam(team);
                    setAwaySuggestions([]);
                  }}
                >
                  {team}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.awayTeam && <div className="error-message">{errors.awayTeam}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Punteggio</label>
        <div className="team-score">
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--tg-theme-hint-color, #999999)' }}>
              {homeTeam || 'Casa'}
            </div>
            <input 
              type="number" 
              className={`score-input ${errors.homeScore ? 'error' : ''}`}
              placeholder="0" 
              value={homeScore} 
              onChange={(e) => setHomeScore(e.target.value)} 
              min="0"
            />
          </div>
          <span className="vs">-</span>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--tg-theme-hint-color, #999999)' }}>
              {awayTeam || 'Ospite'}
            </div>
            <input 
              type="number" 
              className={`score-input ${errors.awayScore ? 'error' : ''}`}
              placeholder="0" 
              value={awayScore} 
              onChange={(e) => setAwayScore(e.target.value)} 
              min="0"
            />
          </div>
        </div>
        {(errors.homeScore || errors.awayScore) && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '8px' }}>
            Inserisci un punteggio valido per entrambe le squadre
          </div>
        )}
      </div>
      
      {/* Pulsante di salvataggio per dispositivi non Telegram */}
      <button 
        className="button" 
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isSubmitting ? 'Salvataggio...' : 'Salva Risultato'}
      </button>
    </div>
  );
};

export default MatchForm;