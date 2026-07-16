import { useContext, useEffect } from "react";
import { useLocation } from "react-router";
import "./App.css";
import Vehicle from "./components/Vehicle/Vehicle";
import DashboardSummary from "./components/DashboardSummary/DashboardSummary";
import PrioritySummary from "./components/PrioritySummary/PrioritySummary";
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
  expiryView = "",
}) {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const shouldShowHomeSummary =
    showDashboard && !isLoading && !error && vehicles.length > 0;

  useEffect(() => {
    if (!location.state?.scrollToVehicles || isLoading) {
      return;
    }

    requestAnimationFrame(() => {
      document
        .getElementById("vehicles-list")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.key, location.state, isLoading, error, vehicles.length]);

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      {showDashboard && (
        <section className="home-hero" aria-labelledby="home-title">
          <div>
            <span className="home-hero__eyebrow">Panoramica garage</span>
            <h1 id="home-title">Tutto sotto controllo, in un solo posto.</h1>
            <p>
              Controlla rapidamente lo stato dei tuoi veicoli e intervieni
              prima delle prossime scadenze.
            </p>
          </div>

          <div className="home-hero__badge" aria-label="Veicoli registrati">
            <span>Veicoli</span>
            <strong>{vehicles.length}</strong>
          </div>
        </section>
      )}

      {showDashboard && <DashboardSummary vehicles={vehicles} />}

      {shouldShowHomeSummary && <PrioritySummary vehicles={vehicles} />}

      <section id="vehicles-list" className="vehicles-list-section">
        {isLoading ? (
          <StateMessage
            icon={"\u23F3"}
            title="Caricamento veicoli..."
            description="Sto recuperando le informazioni dei tuoi veicoli. Potrebbero servire alcuni secondi."
          />
        ) : error ? (
          <StateMessage
            icon={"\u26A0\uFE0F"}
            title="Qualcosa è andato storto"
            description={error}
            type="error"
            actionLabel="Riprova"
            onAction={onRetry}
          />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={"\u{1F697}"}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          vehicles.map((v) => (
            <Vehicle
              key={v.id || v._id}
              vehicle={v}
              expiryView={expiryView}
              showNextExpiry={showDashboard && !expiryView}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default App;
