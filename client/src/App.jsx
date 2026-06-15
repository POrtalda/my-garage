import { useContext } from "react";
import "./App.css";
import Vehicle from "./components/Vehicle/Vehicle";
import DashboardSummary from "./components/DashboardSummary/DashboardSummary";
import ThemeContext from "./context/ThemeContext";

function App({
  vehicles,
  showDashboard = false,
  emptyTitle = "Nessun veicolo trovato",
  emptyDescription = "Non ci sono veicoli da mostrare in questa sezione.",
}) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      {showDashboard && <DashboardSummary vehicles={vehicles} />}

      {vehicles === null ? (
        <p>Loading vehicles...</p>
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