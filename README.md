# My Garage

**My Garage** è una web app full-stack sviluppata con **React + Vite**, **Node.js/Express** e **MongoDB Atlas** per gestire veicoli e relative scadenze, come bollo, assicurazione e revisione.

Il progetto nasce come applicazione portfolio e ha l’obiettivo di mostrare un flusso completo di sviluppo web moderno: frontend responsive, routing, componenti riutilizzabili, backend REST API, database MongoDB, deploy online, gestione immagini, validazione dei form, feedback utente, notifiche globali e persistenza dati.

---

## 🌐 Demo online

Puoi provare la web app qui:

👉 [Apri My Garage](https://my-garage-expiration.netlify.app/)

La demo è pubblicata online con:

* Frontend React su **Netlify**
* Backend Express su **Render**
* Database **MongoDB Atlas**

Il frontend comunica con il backend tramite API REST.

> Nota: il backend è pubblicato su Render con piano free. Al primo accesso può richiedere qualche secondo per riattivarsi dopo un periodo di inattività.

---

## 🔗 Link utili

* Demo Netlify: https://my-garage-expiration.netlify.app/
* Backend Render: https://my-garage-api.onrender.com
* Health check API: https://my-garage-api.onrender.com/api/health
* Repository GitHub: https://github.com/POrtalda/my-garage

Esempio risposta health check:

```json
{
  "status": "ok",
  "message": "My Garage API running"
}
```

---

## 📸 Screenshot

### Home e dashboard

![Home e dashboard di My Garage](docs/images/home-my-garage.png)

### Dettaglio veicolo

![Dettaglio veicolo di My Garage](docs/images/details-my-garage.png)

### Conferma eliminazione

![Modale di conferma eliminazione veicolo](docs/images/modale-my-garage.jpg)

---

## 🚗 Funzionalità principali

* Visualizzazione lista veicoli
* Dettaglio veicolo
* Aggiunta nuovo veicolo
* Upload immagine veicolo fino a 5 MB
* Modifica e rimozione immagine dalla pagina dettaglio
* Modifica delle scadenze
* Eliminazione veicolo con modale di conferma
* Filtro veicoli scaduti
* Filtro veicoli in scadenza
* Dashboard riepilogativa in Home
* Empty state personalizzati
* Stati di caricamento ed errore
* Pulsante “Riprova” in caso di errore API
* Validazione form con messaggi campo per campo
* Feedback durante aggiunta, modifica ed eliminazione
* Notifiche toast globali dopo aggiunta, modifica ed eliminazione veicolo
* Sistema di notifiche riutilizzabile con `ToastContext`
* Supporto Light/Dark mode
* Persistenza dati su MongoDB Atlas
* Fallback di lettura da localStorage se il backend non è raggiungibile
* Layout responsive ottimizzato per smartphone
* Supporto refresh diretto delle rotte su Netlify
* Refresh diretto su `/details/:id` senza falso messaggio “Veicolo non trovato”
* Backend CORS ristretto alla demo Netlify e all’ambiente locale

---

## 🧰 Stack utilizzato

### Frontend

* React 19
* Vite
* React Router
* React Icons
* Context API
* CSS modulare per componenti
* localStorage per preferenza tema e fallback dati
* Netlify

### Backend

* Node.js
* Express
* Mongoose
* MongoDB Atlas
* dotenv
* cors
* Render

---

## 🏗️ Architettura full-stack

```text
Frontend Netlify
      │
      ▼
React + Vite
      │
      ▼
VITE_API_BASE_URL
      │
      ▼
Backend Render
Node.js + Express
      │
      ▼
MongoDB Atlas
```

Il frontend usa una variabile ambiente Vite per comunicare con il backend:

```env
VITE_API_BASE_URL=https://my-garage-api.onrender.com/api
```

In locale, se la variabile non è presente, viene usato il fallback:

```env
http://localhost:5000/api
```

---

## 📁 Struttura progetto

```text
my-garage/
├─ README.md
├─ .gitignore
├─ docs/
│  └─ images/
│     ├─ details-my-garage.png
│     ├─ home-my-garage.png
│     └─ modale-my-garage.jpg
├─ client/
│  ├─ .env.example
│  ├─ package.json
│  ├─ public/
│  │  └─ _redirects
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ App.css
│     ├─ routes/
│     │  └─ AppRoutes.jsx
│     ├─ services/
│     │  └─ vehiclesApi.js
│     ├─ context/
│     │  ├─ ThemeContext
│     │  └─ ToastContext.jsx
│     ├─ utils/
│     │  └─ vehicleDates.js
│     └─ components/
│        ├─ DashboardSummary/
│        ├─ DarkLight/
│        ├─ DeleteConfirmationModal/
│        ├─ Details/
│        ├─ EmptyState/
│        ├─ Menu/
│        ├─ NewVehicle/
│        ├─ StateMessage/
│        ├─ Toast/
│        └─ Vehicle/
└─ server/
   ├─ .env.example
   ├─ package.json
   └─ src/
      ├─ app.js
      ├─ server.js
      ├─ config/
      │  └─ db.js
      ├─ controllers/
      │  ├─ healthController.js
      │  └─ vehicleController.js
      ├─ models/
      │  └─ Vehicle.js
      └─ routes/
         ├─ healthRoutes.js
         └─ vehicleRoutes.js
```

---

## 🧭 Rotte frontend disponibili

| Rotta          | Descrizione                                      |
| -------------- | ------------------------------------------------ |
| `/`            | Home con lista veicoli e dashboard riepilogativa |
| `/expired`     | Veicoli con almeno una scadenza superata         |
| `/expiring`    | Veicoli con almeno una scadenza entro 30 giorni  |
| `/details/:id` | Dettaglio e modifica scadenze del veicolo        |

---

## 🔌 API backend

Endpoint principali:

| Metodo | Endpoint            | Descrizione                   |
| ------ | ------------------- | ----------------------------- |
| GET    | `/api/health`       | Verifica stato API            |
| GET    | `/api/vehicles`     | Recupera tutti i veicoli      |
| GET    | `/api/vehicles/:id` | Recupera un veicolo per ID    |
| POST   | `/api/vehicles`     | Crea un nuovo veicolo         |
| PATCH  | `/api/vehicles/:id` | Aggiorna un veicolo esistente |
| DELETE | `/api/vehicles/:id` | Elimina un veicolo            |

---

## 🔐 CORS backend

Il backend usa una configurazione CORS controllata.

Origini abilitate:

```text
https://my-garage-expiration.netlify.app
http://localhost:5173
```

Sono inoltre consentite le richieste senza `origin`, utili per:

* health check Render
* curl
* Postman
* test diretti dell’API

Questa configurazione evita di lasciare il backend aperto a qualsiasi dominio, mantenendo comunque funzionanti demo online e sviluppo locale.

---

## 💾 Gestione dati

I dati dei veicoli vengono salvati su **MongoDB Atlas** tramite backend Express.

Operazioni gestite:

* caricamento veicoli dal backend
* aggiunta veicolo
* upload immagine veicolo
* modifica immagine veicolo
* rimozione immagine veicolo
* modifica scadenze
* eliminazione veicolo
* persistenza dati dopo refresh pagina
* mantenimento preferenza tema chiaro/scuro

Il `localStorage` viene usato per:

* preferenza tema Light/Dark
* fallback di lettura di eventuali vecchi dati locali se il backend non è raggiungibile

Il `localStorage` non salva più le immagini dei veicoli, per evitare errori di quota come:

```text
QuotaExceededError
```

---

## 🖼️ Gestione immagini

Per l’MVP/demo, le immagini dei veicoli vengono salvate come base64 nel database MongoDB.

Il limite attuale di upload è:

```text
5 MB
```

La pagina dettaglio permette di:

* visualizzare l’immagine del veicolo
* caricare una nuova immagine
* sostituire l’immagine esistente
* rimuovere l’immagine
* tornare alla Home dopo il salvataggio corretto delle modifiche

Questa soluzione è accettabile per una demo portfolio, ma in futuro potrà essere migliorata usando un servizio dedicato come:

* Cloudinary
* Amazon S3
* altro storage esterno per immagini

In quel caso il database salverebbe solo l’URL dell’immagine, rendendo l’app più leggera e scalabile.

---

## 🎨 UX e feedback utente

Il progetto include diversi miglioramenti pensati per rendere l’esperienza più chiara e curata:

* messaggi dedicati quando una lista è vuota
* messaggio di caricamento durante il recupero dati
* messaggio dedicato al possibile avvio lento del backend Render free
* messaggio di errore se il backend non risponde
* pulsante “Riprova” per rilanciare il caricamento dei veicoli
* fallback di lettura da localStorage se il backend non è raggiungibile
* validazione nel form di aggiunta veicolo
* validazione nella pagina dettaglio
* messaggi di errore nei form in caso di richiesta API fallita
* disabilitazione dei pulsanti durante salvataggio, modifica o eliminazione
* feedback “Salvataggio...” durante l’invio del form
* notifiche toast globali per confermare le azioni completate
* notifica dopo aggiunta veicolo completata
* notifica dopo modifica veicolo completata
* notifica dopo eliminazione veicolo completata
* sistema toast responsive e compatibile con dark mode
* navigazione alla Home solo dopo salvataggio o cancellazione riusciti
* modale personalizzata per confermare l’eliminazione
* card veicolo responsive
* dashboard riepilogativa ottimizzata su mobile
* layout mobile migliorato per form, dettaglio veicolo e modale delete
* semaforo stato veicolo ricostruito in CSS per maggiore stabilità su smartphone

---

## 🔔 Notifiche globali

Il progetto include un sistema di notifiche toast globali basato su `ToastContext`.

Le notifiche vengono mostrate dopo le principali azioni completate correttamente:

* aggiunta veicolo
* modifica veicolo
* eliminazione veicolo

Il sistema è composto da:

* componente riutilizzabile `Toast`
* provider globale `ToastProvider`
* funzione `showToast`
* stile responsive
* supporto Light/Dark mode

Questa struttura permette di riutilizzare facilmente le notifiche anche per future funzionalità, come autenticazione, errori API globali o conferme di salvataggio più avanzate.

---

## 🆕 Migliorie recenti

Le ultime iterazioni hanno migliorato la stabilità e l’esperienza utente del progetto.

### Loading ed errori API

* migliorato il messaggio di caricamento iniziale
* aggiunto riferimento al possibile avvio lento del backend Render free
* aggiunto pulsante “Riprova” nel componente `StateMessage`
* collegata l’azione retry al nuovo caricamento dei veicoli
* migliorato il messaggio quando il backend non è raggiungibile
* mantenuto fallback con dati salvati nel browser

### Refresh diretto Details

È stato corretto il comportamento della rotta:

```text
/details/:id
```

Prima, facendo refresh diretto sulla pagina dettaglio, poteva comparire per un attimo il messaggio “Veicolo non trovato” mentre il backend stava ancora caricando i dati.

Ora viene mostrato lo stato di caricamento e il messaggio “Veicolo non trovato” compare solo dopo il completamento del caricamento.

### CORS ristretto

Il backend non usa più una configurazione CORS completamente aperta.

Le richieste browser sono consentite solo dalla demo Netlify e dall’ambiente locale di sviluppo.

### Feedback form

I form ora gestiscono meglio le azioni asincrone:

* il form nuovo veicolo attende la risposta del backend
* i pulsanti vengono disabilitati durante il salvataggio
* il form si chiude solo se il salvataggio va a buon fine
* gli errori vengono mostrati nel form
* la pagina Details naviga alla Home solo dopo aggiornamento o eliminazione riusciti

### Notifiche globali toast

È stato aggiunto un sistema di notifiche globali per rendere più evidente il risultato delle azioni principali.

Attualmente vengono mostrate notifiche di successo dopo:

* creazione veicolo
* aggiornamento veicolo
* eliminazione veicolo

Il sistema usa un `ToastContext` globale e un componente `Toast` riutilizzabile.

---

## 🚀 Deploy full-stack

### Frontend Netlify

La demo frontend è pubblicata su Netlify:

```text
https://my-garage-expiration.netlify.app/
```

Variabile ambiente configurata su Netlify:

```env
VITE_API_BASE_URL=https://my-garage-api.onrender.com/api
```

Il progetto include il file:

```text
client/public/_redirects
```

Questo file permette il refresh diretto delle rotte gestite da React Router, come:

* `/expired`
* `/expiring`
* `/details/:id`

### Backend Render

Il backend Express è pubblicato su Render:

```text
https://my-garage-api.onrender.com
```

Health check:

```text
https://my-garage-api.onrender.com/api/health
```

Variabili ambiente principali lato backend:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

### Database MongoDB Atlas

MongoDB Atlas viene usato per salvare i dati dei veicoli.

---

## 🧪 Verifiche

Durante lo sviluppo vengono eseguiti:

```bash
npm run lint
npm run build
```

Per il frontend:

```bash
npm --prefix client run build
```

Per le modifiche solo documentali viene verificato anche:

```bash
git diff --check
```

---

## ✅ Test manuale consigliato

Dopo ogni modifica importante, è consigliato verificare manualmente i principali flussi dell’app.

### Checklist generale

* aprire la Home e controllare la dashboard riepilogativa
* verificare la lista veicoli caricata dal backend
* verificare il messaggio di caricamento iniziale
* considerare il possibile avvio lento del backend Render free
* verificare il pulsante “Riprova” in caso di errore API
* aggiungere un veicolo senza foto
* aggiungere un veicolo con foto sotto 5 MB
* verificare la validazione dei campi obbligatori nel form nuovo veicolo
* verificare il feedback durante il salvataggio
* verificare la notifica toast dopo aggiunta veicolo
* aprire il dettaglio di un veicolo
* modificare le scadenze e salvare
* verificare che la navigazione alla Home avvenga dopo il salvataggio riuscito
* verificare la notifica toast dopo modifica veicolo
* modificare l’immagine dalla pagina Details
* rimuovere l’immagine dalla pagina Details
* eliminare un veicolo tramite modale di conferma
* verificare che la navigazione alla Home avvenga dopo eliminazione riuscita
* verificare la notifica toast dopo eliminazione veicolo
* verificare la chiusura manuale della notifica toast
* verificare la scomparsa automatica della notifica dopo qualche secondo
* verificare i toast in dark mode e su mobile
* aggiornare la pagina e verificare la persistenza dei dati
* cambiare tema chiaro/scuro e verificare che la preferenza resti salvata
* verificare che non compaia errore `QuotaExceededError`
* verificare il comportamento se il backend non è raggiungibile
* verificare il fallback sui vecchi dati locali del browser, quando disponibili

### Checklist rotte Netlify

Verificare il refresh diretto delle rotte:

* `/`
* `/expired`
* `/expiring`
* `/details/:id`

In particolare, su `/details/:id` il refresh diretto non deve mostrare temporaneamente “Veicolo non trovato” mentre i dati sono ancora in caricamento.

### Checklist post-deploy full-stack

Dopo un deploy online, verificare:

* apertura Home dalla demo Netlify
* caricamento veicoli dal backend Render
* health check backend
* aggiunta veicolo con e senza immagine
* salvataggio su MongoDB Atlas
* notifica toast dopo aggiunta veicolo
* refresh pagina con dati persistenti
* modifica scadenze
* notifica toast dopo modifica veicolo
* modifica/rimozione immagine
* eliminazione veicolo
* notifica toast dopo eliminazione veicolo
* filtri `/expired` e `/expiring`
* refresh diretto delle rotte
* comportamento del frontend in caso di backend non raggiungibile

---

## 🧑‍💻 Avvio in locale

Clona la repository:

```bash
git clone https://github.com/POrtalda/my-garage.git
cd my-garage
```

### Frontend

Entra nella cartella client:

```bash
cd client
```

Installa le dipendenze:

```bash
npm install
```

Crea il file `.env` partendo da `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Avvia il frontend:

```bash
npm run dev
```

### Backend

In un secondo terminale, entra nella cartella server:

```bash
cd server
```

Installa le dipendenze:

```bash
npm install
```

Crea il file `.env` partendo da `.env.example`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Avvia il backend:

```bash
npm run dev
```

Il backend sarà disponibile su:

```text
http://localhost:5000
```

Health check locale:

```text
http://localhost:5000/api/health
```

---

## 🌱 Stato del progetto

Il progetto è attualmente un **MVP full-stack online stabile**.

Sono già presenti:

* frontend React pubblicato su Netlify
* backend Express pubblicato su Render
* database MongoDB Atlas
* CRUD completo dei veicoli
* upload immagine veicolo fino a 5 MB
* modifica e rimozione immagine dalla pagina Details
* validazione form
* feedback utente durante aggiunta, modifica ed eliminazione
* notifiche toast globali dopo aggiunta, modifica ed eliminazione
* sistema `ToastContext` riutilizzabile
* supporto Light/Dark mode
* responsive design
* gestione refresh rotte su Netlify
* refresh diretto su `/details/:id` corretto
* API base URL configurabile tramite variabile ambiente
* fallback localStorage per vecchi dati locali
* CORS backend ristretto alla demo Netlify e all’ambiente locale

Possibili sviluppi futuri:

* estendere le notifiche toast anche a errori API globali, login e scadenze imminenti
* autenticazione utenti
* veicoli associati al singolo utente
* notifiche per scadenze imminenti
* dashboard più avanzata
* gestione offline/backend non raggiungibile più evoluta
* storage immagini con Cloudinary o Amazon S3
* test con Vitest / React Testing Library

---

## 👨‍💻 Autore

Progetto sviluppato da **Paolo Ortalda** come parte del percorso di crescita nello sviluppo web frontend/full-stack.
