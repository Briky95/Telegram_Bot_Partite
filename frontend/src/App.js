import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import MatchForm from './components/MatchForm';
import MatchList from './components/MatchList';
import Standings from './components/Standings';
import { FiPlusCircle, FiList, FiAward } from 'react-icons/fi';

function App() {
  const [activeTab, setActiveTab] = useState('add');
  const [isLoading, setIsLoading] = useState(true);
  
  // Imposta il colore del tema principale
  useEffect(() => {
    try {
      WebApp.setHeaderColor('secondary_bg_color');
      // Imposta il pulsante principale nella parte inferiore dell'app
      WebApp.MainButton.setText('Salva');
      WebApp.MainButton.hide();
      
      // Simula un breve caricamento per mostrare l'animazione
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.warn('Telegram WebApp features not available in standalone mode');
      setIsLoading(false);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Aggiungi un effetto di vibrazione quando si cambia tab (solo su dispositivi mobili)
    try {
      if (WebApp.isExpanded && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.warn('Vibration not supported');
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">
            <div className="loading-icon">⚽</div>
            <p>Caricamento in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="tab-bar">
          <div 
            className={`tab ${activeTab === 'add' ? 'active' : ''}`} 
            onClick={() => handleTabChange('add')}
          >
            <div className="tab-icon"><FiPlusCircle /></div>
            <div className="tab-text">Aggiungi</div>
          </div>
          <div 
            className={`tab ${activeTab === 'matches' ? 'active' : ''}`} 
            onClick={() => handleTabChange('matches')}
          >
            <div className="tab-icon"><FiList /></div>
            <div className="tab-text">Partite</div>
          </div>
          <div 
            className={`tab ${activeTab === 'standings' ? 'active' : ''}`} 
            onClick={() => handleTabChange('standings')}
          >
            <div className="tab-icon"><FiAward /></div>
            <div className="tab-text">Classifica</div>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'add' && <MatchForm />}
          {activeTab === 'matches' && <MatchList />}
          {activeTab === 'standings' && <Standings />}
        </div>
      </div>
    </div>
  );
}

export default App;