import { addExpiryFlags } from "../utils/vehicleDates";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import App from "../App";
import "./AppRoutes.css";
import Menu from "../components/Menu/Menu";
import { useCallback, useEffect, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import Details from "../components/Details/Details";

const URL_API = "https://portalda.github.io/fake-api-my-garage/my-garage.json";

export default function AppRoutes() {
  const [vehicles, setVehicles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = useCallback(() => {
    setIsLoading(true);
    setError("");

    fetch(URL_API)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento dei veicoli");
        }

        return res.json();
      })
      .then((data) => {
        const withFlags = data.map((v) => addExpiryFlags(v));
        setVehicles(withFlags);
        localStorage.setItem("vehicles", JSON.stringify(withFlags));
      })
      .catch((err) => {
        console.error("Errore fetch:", err);
        setError("Non riesco a caricare i dati iniziali. Riprova più tardi.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedVehicles = localStorage.getItem("vehicles");

    if (storedVehicles) {
      setVehicles(JSON.parse(storedVehicles));
      setIsLoading(false);
    } else {
      fetchVehicles();
    }
  }, [fetchVehicles]);

  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    const lsDark = JSON.parse(localStorage.getItem("vehicles-dark-mode"));
    setIsDarkMode(lsDark ?? false);
  }, []);

  useEffect(() => {
    localStorage.setItem("vehicles-dark-mode", JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const handleAddVehicle = (newVehicle) => {
    const vehicleWithFlags = addExpiryFlags({ ...newVehicle, id: Date.now() });
    setVehicles((prev) => [...prev, vehicleWithFlags]);
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    const vehicleWithFlags = addExpiryFlags(updatedVehicle);
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleWithFlags.id ? vehicleWithFlags : v))
    );
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (window.confirm("❌ Sei sicuro di voler eliminare questo veicolo?")) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <BrowserRouter>
        <Menu title="My Garage" onAddVehicle={handleAddVehicle} />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <App
                  vehicles={vehicles}
                  showDashboard
                  isLoading={isLoading}
                  error={error}
                  emptyTitle="Nessun veicolo presente"
                  emptyDescription="Aggiungi il tuo primo veicolo per iniziare a monitorare le scadenze."
                />
              }
            />

            <Route
              path="expired"
              element={
                <App
                  vehicles={vehicles.filter(
                    (v) =>
                      v.expired_car_tax ||
                      v.expired_insurance ||
                      v.expired_revision
                  )}
                  isLoading={isLoading}
                  error={error}
                  emptyTitle="Nessun veicolo scaduto ✅"
                  emptyDescription="Tutte le scadenze sono sotto controllo."
                />
              }
            />

            <Route
              path="expiring"
              element={
                <App
                  vehicles={vehicles.filter(
                    (v) =>
                      v.expiring_car_tax ||
                      v.expiring_insurance ||
                      v.expiring_revision
                  )}
                  isLoading={isLoading}
                  error={error}
                  emptyTitle="Nessun veicolo in scadenza 👌"
                  emptyDescription="Non ci sono scadenze nei prossimi 30 giorni."
                />
              }
            />

            <Route
              path="details/:id"
              element={
                <DetailsWrapper
                  vehicles={vehicles}
                  onUpdate={handleUpdateVehicle}
                  onDelete={handleDeleteVehicle}
                />
              }
            />

            <Route
              path="*"
              element={<p style={{ padding: "20px" }}>❌ Pagina non trovata</p>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

function DetailsWrapper({ vehicles, onUpdate, onDelete }) {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id.toString() === id.toString());

  return vehicle ? (
    <Details vehicle={vehicle} onUpdate={onUpdate} onDelete={onDelete} />
  ) : (
    <p style={{ padding: "20px" }}>❌ Veicolo non trovato</p>
  );
}
