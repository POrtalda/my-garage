# My Garage

**My Garage** è una web app full-stack sviluppata con **React + Vite**, **Node.js/Express** e **MongoDB Atlas** per gestire veicoli e relative scadenze, come bollo, assicurazione e revisione.

Il progetto nasce come applicazione portfolio e ha l’obiettivo di mostrare un flusso completo di sviluppo web moderno: frontend responsive, routing, componenti riutilizzabili, backend REST API, database MongoDB, deploy online, gestione immagini, validazione dei form, feedback utente e persistenza dati.

---

## 🌐 Demo online

Puoi provare la web app qui:

👉 [Apri My Garage](https://my-garage-expiration.netlify.app/)

La demo è pubblicata online con:

* Frontend React su **Netlify**
* Backend Express su **Render**
* Database **MongoDB Atlas**

Il frontend comunica con il backend tramite API REST.

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
* Upload immagine veicolo
* Modifica delle scadenze
* Eliminazione veicolo con modale di conferma
* Filtro veicoli scaduti
* Filtro veicoli in scadenza
* Dashboard riepilogativa in Home
* Empty state personalizzati
* Stati di caricamento ed errore
* Validazione form con messaggi campo per campo
* Supporto Light/Dark mode
* Persistenza dati su MongoDB Atlas
* Fallback di lettura da localStorage se il backend non è raggiungibile
* Layout responsive ottimizzato per smartphone
* Supporto refresh diretto delle rotte su Netlify

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
│     │  └─ ThemeContext
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

## 💾 Gestione dati

I dati dei veicoli vengono salvati su **MongoDB Atlas** tramite backend Express.

Operazioni gestite:

* caricamento veicoli dal backend
* aggiunta veicolo
* upload immagine veicolo
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
* messaggio di errore se il backend non risponde
* validazione nel form di aggiunta veicolo
* validazione nella pagina dettaglio
* messaggio di successo dopo aggiornamento scadenze
* modale personalizzata per confermare l’eliminazione
* card veicolo responsive
* dashboard riepilogativa ottimizzata su mobile
* layout mobile migliorato per form, dettaglio veicolo e modale delete
* semaforo stato veicolo ricostruito in CSS per maggiore stabilità su smartphone

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

Dopo ogni modifica importante, è consigliato verificare manualmente i principali flussi dell’app:

* aprire la Home e controllare la dashboard riepilogativa
* verificare la lista veicoli caricata dal backend
* aggiungere un veicolo senza foto
* aggiungere un veicolo con foto sotto 5 MB
* aprire il dettaglio di un veicolo
* modificare le scadenze e salvare
* verificare il messaggio di successo
* provare a salvare scadenze vuote e controllare i messaggi di errore
* aprire i filtri `/expired` e `/expiring`
* eliminare un veicolo tramite modale di conferma
* aggiornare la pagina e verificare la persistenza dei dati
* cambiare tema chiaro/scuro e verificare che la preferenza resti salvata
* verificare che non compaia errore `QuotaExceededError`
* verificare il refresh diretto delle rotte Netlify:

  * `/expired`
  * `/expiring`
  * `/details/:id`

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

Il progetto è attualmente un **MVP full-stack online**.

Sono già presenti:

* frontend React pubblicato su Netlify
* backend Express pubblicato su Render
* database MongoDB Atlas
* CRUD completo dei veicoli
* upload immagine veicolo
* validazione form
* feedback utente
* supporto Light/Dark mode
* responsive design
* gestione refresh rotte su Netlify
* API base URL configurabile tramite variabile ambiente
* fallback localStorage per vecchi dati locali

Possibili sviluppi futuri:

* autenticazione utenti
* veicoli associati al singolo utente
* notifiche per scadenze imminenti
* dashboard più avanzata
* storage immagini con Cloudinary o Amazon S3
* CORS più restrittivo per ambiente produzione/demo
* test con Vitest / React Testing Library

---

## 👨‍💻 Autore

Progetto sviluppato da **Paolo Ortalda** come parte del percorso di crescita nello sviluppo web frontend/full-stack.
