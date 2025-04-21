# Rugby Results Tracker - Telegram Mini App

Questa è una mini app Telegram per raccogliere e visualizzare i risultati delle partite di rugby di campionati amatoriali.

## Funzionalità

- Registrazione dei risultati delle partite
- Visualizzazione delle partite giocate
- Visualizzazione delle classifiche per campionato
- Filtro per campionato

## Struttura del Progetto

- `frontend/`: Contiene il codice dell'interfaccia utente della mini app
  - `src/components/`: Componenti React
  - `src/pages/`: Pagine dell'applicazione
  - `src/utils/`: Funzioni di utilità

- `backend/`: Contiene il codice del server che gestisce i dati e l'API
  - `server.js`: File principale del server
  - `.env.example`: Template per le variabili d'ambiente

## Requisiti

- Node.js (v14 o superiore)
- Un account Telegram
- Un bot Telegram creato tramite BotFather

## Configurazione

### 1. Creare un Bot Telegram e una Mini App

1. Apri Telegram e cerca @BotFather
2. Invia il comando `/newbot`
3. Segui le istruzioni per creare un nuovo bot
4. Salva il token API che ti viene fornito
5. Usa il comando `/newapp` per creare una mini app collegata al tuo bot
6. Segui le istruzioni per configurare la mini app:
   - Nome: Rugby Results Tracker
   - Descrizione breve: Traccia i risultati delle partite di rugby amatoriali
   - URL: l'URL dove sarà ospitata la tua web app (vedi sezione Deployment)

### 2. Configurare il Backend

1. Copia il file `.env.example` in `.env`:
   ```
   cp backend/.env.example backend/.env
   ```

2. Modifica il file `.env` inserendo il token del tuo bot Telegram e l'URL della tua web app:
   ```
   PORT=3001
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   WEBAPP_URL=https://your-webapp-url.com
   ```

3. Installa le dipendenze:
   ```
   cd backend
   npm install
   ```

4. Avvia il server:
   ```
   npm start
   ```

### 3. Configurare il Frontend

1. Installa le dipendenze:
   ```
   cd frontend
   npm install
   ```

2. Avvia il server di sviluppo:
   ```
   npm start
   ```

## Deployment

Per utilizzare la mini app in produzione, dovrai:

1. Ospitare il frontend su un servizio di hosting statico (come Netlify, Vercel, GitHub Pages)
2. Ospitare il backend su un servizio di hosting per applicazioni Node.js (come Heroku, Render, DigitalOcean)
3. Configurare l'URL della tua web app nella mini app tramite BotFather

## Utilizzo

1. Apri Telegram e cerca il tuo bot
2. Invia il comando `/start`
3. Clicca sul pulsante "Apri Mini App"
4. Usa l'interfaccia per:
   - Aggiungere nuovi risultati di partite
   - Visualizzare le partite giocate
   - Consultare le classifiche

## Personalizzazione

Puoi personalizzare l'applicazione modificando:

- I campionati disponibili nel file `backend/server.js`
- Lo stile dell'interfaccia utente nei file CSS
- La logica di calcolo dei punti in classifica nel file `backend/server.js`