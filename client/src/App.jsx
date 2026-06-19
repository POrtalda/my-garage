import { useContext } from "react";
import "./App.css";
import Vehicle from "./components/Vehicle/Vehicle";
import DashboardSummary from "./components/DashboardSummary/DashboardSummary";
import EmptyState from "./components/EmptyState/EmptyState";
import StateMessage from "./components/StateMessage/StateMessage";
import ThemeContext from "./context/ThemeContext";

function App({
  vehicles,
  showDashboard = false,
  isLoading = false,
  error = "",
  onRetry,
  emptyTitle = "Nessun veicolo da mostrare",
  emptyDescription = "Aggiungi un veicolo o controlla un'altra sezione.",
}) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      {showDashboard && <DashboardSummary vehicles={vehicles} />}

      {isLoading ? (
        <StateMessage
          icon="⏳"
          title="Caricamento veicoli..."
          description="Sto recuperando le informazioni del tuo garage. Se il backend gratuito su Render si sta avviando, potrebbe servire qualche secondo."
        />
      ) : error ? (
        <StateMessage
          icon="⚠️"
          title="Qualcosa è andato storto"
          description={error}
          type="error"
          actionLabel="Riprova"
          onAction={onRetry}
        />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon="🚗"
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        vehicles.map((v) => <Vehicle key={v.id} vehicle={v} />)
      )}
    </div>
  );
}

export default App;