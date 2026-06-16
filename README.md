# My Garage

**My Garage** è una web app frontend sviluppata con **React + Vite** per gestire veicoli e relative scadenze, come bollo, assicurazione e revisione.

Il progetto nasce come applicazione portfolio e ha l’obiettivo di mostrare una gestione completa lato frontend: routing, componenti riutilizzabili, persistenza locale, gestione tema, feedback utente e logica di stato.

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

---

## 📁 Struttura progetto

```text
my-garage/
├─ README.md
└─ client/
   ├─ package.json
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

---

## 🧪 Verifiche

Durante lo sviluppo vengono eseguiti:

```bash
npm run lint
npm run build
```

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
