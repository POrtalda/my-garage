import { addExpiryFlags } from "../utils/vehicleDates";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import App from "../App";
import "./AppRoutes.css";
import Menu from "../components/Menu/Menu";
import { useCallback, useEffect, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import Details from "../components/Details/Details";
import StateMessage from "../components/StateMessage/StateMessage";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../services/vehiclesApi";

function getVehicleId(vehicle) {
  return vehicle.id || vehicle._id;
}

function isSameVehicle(vehicleA, vehicleB) {
  return getVehicleId(vehicleA)?.toString() === getVehicleId(vehicleB)?.toString();
}

export default function AppRoutes() {
  const [vehicles, setVehicles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const apiVehicles = await getVehicles();
      const withFlags = apiVehicles.map((vehicle) => addExpiryFlags(vehicle));

      setVehicles(withFlags);
    } catch (err) {
      console.error("Errore fetch:", err);

      const storedVehicles = localStorage.getItem("vehicles");

      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
        setError(
          "Backend momentaneamente non raggiungibile. Sto mostrando gli ultimi dati salvati nel browser."
        );
      } else {
        setError(
          "Non riesco a caricare i veicoli. Il server potrebbe essere in fase di avvio: riprova tra qualche secondo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    const lsDark = JSON.parse(localStorage.getItem("vehicles-dark-mode"));
    setIsDarkMode(lsDark ?? false);
  }, []);

  useEffect(() => {
    localStorage.setItem("vehicles-dark-mode", JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const handleAddVehicle = async (newVehicle) => {
    try {
      const createdVehicle = await createVehicle(newVehicle);
      const vehicleWithFlags = addExpiryFlags(createdVehicle);

      setVehicles((prevVehicles) => [...prevVehicles, vehicleWithFlags]);
      setError("");
    } catch (err) {
      console.error("Errore creazione veicolo:", err);
      setError("Non riesco ad aggiungere il veicolo. Riprova più tardi.");
      throw err;
    }
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    const optimisticVehicle = addExpiryFlags(updatedVehicle);

    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        isSameVehicle(vehicle, optimisticVehicle) ? optimisticVehicle : vehicle
      )
    );

    try {
      const savedVehicle = await updateVehicle(
        getVehicleId(updatedVehicle),
        updatedVehicle
      );

      const vehicleWithFlags = addExpiryFlags(savedVehicle);

      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          isSameVehicle(vehicle, vehicleWithFlags) ? vehicleWithFlags : vehicle
        )
      );

      setError("");
      return vehicleWithFlags;
    } catch (err) {
      console.error("Errore aggiornamento veicolo:", err);
      setError("Non riesco ad aggiornare il veicolo. Riprova più tardi.");

      await fetchVehicles();
      throw err;
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteVehicle(vehicleId);

      setVehicles((prevVehicles) =>
        prevVehicles.filter(
          (vehicle) => getVehicleId(vehicle)?.toString() !== vehicleId.toString()
        )
      );

      setError("");
    } catch (err) {
      console.error("Errore eliminazione veicolo:", err);
      setError("Non riesco a eliminare il veicolo. Riprova più tardi.");
      throw err;
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
                  onRetry={fetchVehicles}
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
                    (vehicle) =>
                      vehicle.expired_car_tax ||
                      vehicle.expired_insurance ||
                      vehicle.expired_revision
                  )}
                  isLoading={isLoading}
                  error={error}
                  onRetry={fetchVehicles}
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
                    (vehicle) =>
                      vehicle.expiring_car_tax ||
                      vehicle.expiring_insurance ||
                      vehicle.expiring_revision
                  )}
                  isLoading={isLoading}
                  error={error}
                  onRetry={fetchVehicles}
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
                  isLoading={isLoading}
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

function DetailsWrapper({ vehicles, isLoading, onUpdate, onDelete }) {
  const { id } = useParams();
  const vehicle = vehicles.find(
    (currentVehicle) => getVehicleId(currentVehicle)?.toString() === id
  );

  if (isLoading) {
    return (
      <StateMessage
        icon="⏳"
        title="Caricamento dettaglio veicolo..."
        description="Sto recuperando le informazioni del veicolo."
      />
    );
  }

  if (!vehicle) {
    return (
      <StateMessage
        icon="🚗"
        title="Veicolo non trovato"
        description="Il veicolo richiesto non esiste o non è più disponibile."
        type="error"
      />
    );
  }

  return (
    <Details
      vehicle={vehicle}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}
