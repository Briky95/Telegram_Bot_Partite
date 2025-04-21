import React, { useState } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import MatchForm from './components/MatchForm';
import MatchList from './components/MatchList';
import Standings from './components/Standings';

function App() {
  const [activeTab, setActiveTab] = useState('add');
  
  // Imposta il colore del tema principale
  React.useEffect(() => {
    try {
      WebApp.setHeaderColor('secondary_bg_color');
      // Imposta il pulsante principale nella parte inferiore dell'app
      WebApp.MainButton.setText('Salva');
      WebApp.MainButton.hide();
    } catch (error) {
      console.warn('Telegram WebApp features not available in standalone mode');
    }
  }, []);

  return (
    <div className="app">
      <div className="container">
        <div className="tab-bar">
          <div 
            className={`tab ${activeTab === 'add' ? 'active' : ''}`} 
            onClick={() => setActiveTab('add')}
          >
            Aggiungi Risultato
          </div>
          <div 
            className={`tab ${activeTab === 'matches' ? 'active' : ''}`} 
            onClick={() => setActiveTab('matches')}
          >
            Partite
          </div>
          <div 
            className={`tab ${activeTab === 'standings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('standings')}
          >
            Classifica
          </div>
        </div>

        {activeTab === 'add' && <MatchForm />}
        {activeTab === 'matches' && <MatchList />}
        {activeTab === 'standings' && <Standings />}
      </div>
    </div>
  );
}

export default App;