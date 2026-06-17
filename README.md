# My Garage

**My Garage** è una web app frontend sviluppata con **React + Vite** per gestire veicoli e relative scadenze, come bollo, assicurazione e revisione.

Il progetto nasce come applicazione portfolio e ha l’obiettivo di mostrare una gestione completa lato frontend: routing, componenti riutilizzabili, persistenza locale, gestione tema, feedback utente, validazione dei form, responsive design e logica di stato.

---

## 🌐 Demo online

Puoi provare la web app qui:

👉 [Apri My Garage](https://my-garage-expiration.netlify.app/)

> Nota: la demo è frontend-only. I dati iniziali vengono caricati da una JSON API esterna, mentre le modifiche effettuate vengono salvate nel `localStorage` del browser.

La demo è pubblicata su **Netlify** e include il file `_redirects` per supportare il refresh diretto delle rotte gestite da React Router.

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
* Modifica delle scadenze
* Eliminazione veicolo con modale di conferma
* Filtro veicoli scaduti
* Filtro veicoli in scadenza
* Dashboard riepilogativa in Home
* Empty state personalizzati
* Stati di caricamento ed errore
* Validazione form con messaggi campo per campo
* Supporto Light/Dark mode
* Persistenza dati in `localStorage`
* Caricamento iniziale dati da JSON API esterna
* Layout responsive ottimizzato per smartphone
* Supporto refresh diretto delle rotte su Netlify

---

## 🧰 Stack utilizzato

* React 19
* Vite
* React Router
* React Icons
* Context API
* CSS modulare per componenti
* localStorage
* JSON API esterna
* Netlify

---

## 📁 Struttura progetto

```text
my-garage/
├─ README.md
├─ docs/
│  └─ images/
│     ├─ details-my-garage.png
│     ├─ home-my-garage.png
│     └─ modale-my-garage.jpg
└─ client/
   ├─ package.json
   ├─ public/
   │  └─ _redirects
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ App.css
      ├─ routes/
      │  └─ AppRoutes.jsx
      ├─ context/
      │  └─ ThemeContext
      ├─ utils/
      │  └─ vehicleDates.js
      └─ components/
         ├─ DashboardSummary/
         ├─ DarkLight/
         ├─ DeleteConfirmationModal/
         ├─ Details/
         ├─ EmptyState/
         ├─ Menu/
         ├─ NewVehicle/
         ├─ StateMessage/
         └─ Vehicle/
```

---

## 🧭 Rotte disponibili

| Rotta          | Descrizione                                      |
| -------------- | ------------------------------------------------ |
| `/`            | Home con lista veicoli e dashboard riepilogativa |
| `/expired`     | Veicoli con almeno una scadenza superata         |
| `/expiring`    | Veicoli con almeno una scadenza entro 30 giorni  |
| `/details/:id` | Dettaglio e modifica scadenze del veicolo        |

---

## 💾 Gestione dati

Al primo caricamento, l’app recupera i dati da una **JSON API esterna**.

Le modifiche effettuate dall’utente vengono poi salvate in `localStorage`, così i dati restano disponibili anche dopo il refresh della pagina.

Operazioni gestite:

* aggiunta veicolo
* modifica scadenze
* eliminazione veicolo
* mantenimento preferenza tema chiaro/scuro
* persistenza delle modifiche dopo il refresh

---

## 🎨 UX e feedback utente

Il progetto include diversi miglioramenti pensati per rendere l’esperienza più chiara e curata:

* messaggi dedicati quando una lista è vuota
* messaggio di caricamento durante il recupero dati
* messaggio di errore se la fetch iniziale fallisce
* validazione nel form di aggiunta veicolo
* validazione nella pagina dettaglio
* messaggio di successo dopo aggiornamento scadenze
* modale personalizzata per confermare l’eliminazione
* card veicolo responsive
* dashboard riepilogativa ottimizzata su mobile
* layout mobile migliorato per form, dettaglio veicolo e modale delete
* semaforo stato veicolo ricostruito in CSS per maggiore stabilità su smartphone

---

## 🧪 Verifiche

Durante lo sviluppo vengono eseguiti:

```bash
npm run lint
npm run build
```

Per le modifiche solo documentali viene verificato anche:

```bash
git diff --check
```

---

## ✅ Test manuale consigliato

Dopo ogni modifica importante, è consigliato verificare manualmente i principali flussi dell’app:

* aprire la Home e controllare la dashboard riepilogativa
* verificare la lista veicoli
* aprire il dettaglio di un veicolo
* modificare le scadenze e salvare
* verificare il messaggio di successo
* provare a salvare scadenze vuote e controllare i messaggi di errore
* aggiungere un nuovo veicolo
* provare ad aggiungere un veicolo incompleto e controllare la validazione
* aprire i filtri `/expired` e `/expiring`
* eliminare un veicolo tramite modale di conferma
* aggiornare la pagina e verificare la persistenza in `localStorage`
* cambiare tema chiaro/scuro e verificare che la preferenza resti salvata
* verificare il refresh diretto delle rotte Netlify:

  * `/expired`
  * `/expiring`
  * `/details/:id`

---

## 🚀 Avvio in locale

Clona la repository:

```bash
git clone https://github.com/POrtalda/my-garage.git
cd my-garage/client
```

Installa le dipendenze:

```bash
npm install
```

Avvia il progetto:

```bash
npm run dev
```

Build di produzione:

```bash
npm run build
```

---

## 🌱 Stato del progetto

Il progetto è attualmente una web app **frontend-only**.

È pensato come progetto portfolio e come base evolutiva per una futura versione full stack.

La parte frontend include già:

* routing con React Router
* gestione stato e dati lato client
* persistenza in `localStorage`
* validazione form
* feedback utente
* supporto Light/Dark mode
* responsive design
* gestione refresh rotte su Netlify

Possibili sviluppi futuri:

* backend con Node.js/Express
* database MongoDB
* autenticazione utenti
* veicoli associati al singolo utente
* notifiche per scadenze imminenti
* dashboard più avanzata
* test con Vitest / React Testing Library

---

## 👨‍💻 Autore

Progetto sviluppato da **Paolo Ortalda** come parte del percorso di crescita nello sviluppo web frontend/full stack.
