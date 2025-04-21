import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WebApp from '@twa-dev/sdk';

// Inizializza l'app Telegram solo se siamo all'interno di Telegram
try {
  WebApp.ready();
  console.log('Telegram WebApp initialized');
} catch (error) {
  console.warn('Telegram WebApp not available, running in standalone mode');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);