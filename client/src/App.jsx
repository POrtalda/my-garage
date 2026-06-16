import { useContext } from "react";
import "./App.css";
import Vehicle from "./components/Vehicle/Vehicle";
import DashboardSummary from "./components/DashboardSummary/DashboardSummary";
import ThemeContext from "./context/ThemeContext";

function App({
  vehicles,
  showDashboard = false,
  isLoading = false,
  error = "",
  emptyTitle = "Nessun veicolo trovato",
  emptyDescription = "Non ci sono veicoli da mostrare in questa sezione.",
}) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      {showDashboard && <DashboardSummary vehicles={vehicles} />}

      {isLoading ? (
        <div className="state-message">
          <div className="state-message-icon">⏳</div>
          <h2>Caricamento veicoli...</h2>
          <p>Sto recuperando le informazioni del tuo garage.</p>
        </div>
      ) : error ? (
        <div className="state-message state-message-error">
          <div className="state-message-icon">⚠️</div>
          <h2>Qualcosa è andato storto</h2>
          <p>{error}</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚗</div>
          <h2>{emptyTitle}</h2>
          <p>{emptyDescription}</p>
        </div>
      ) : (
        vehicles.map((v) => <Vehicle key={v.id} vehicle={v} />)
      )}
    </div>
  );
}

export default App;