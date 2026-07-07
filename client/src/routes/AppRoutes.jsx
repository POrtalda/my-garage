import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router";
import { useCallback, useEffect, useState } from "react";
import App from "../App";
import "./AppRoutes.css";
import Menu from "../components/Menu/Menu";
import ThemeContext from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Details from "../components/Details/Details";
import StateMessage from "../components/StateMessage/StateMessage";
import { addExpiryFlags } from "../utils/vehicleDates";
import { sortVehiclesByUrgency } from "../utils/vehicleSorting";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../services/vehiclesApi";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import NotificationSettings from "../components/NotificationSettings/NotificationSettings";

function getVehicleId(vehicle) {
  return vehicle.id || vehicle._id;
}

function isSameVehicle(vehicleA, vehicleB) {
  return getVehicleId(vehicleA)?.toString() === getVehicleId(vehicleB)?.toString();
}

function isAuthError(error) {
  return error?.status === 401;
}

function getStoredAuthToken() {
  const storedAuth = localStorage.getItem("my-garage-auth");

  if (!storedAuth) {
    return "";
  }

  try {
    const auth = JSON.parse(storedAuth);
    return auth.token || "";
  } catch (error) {
    console.error("Errore lettura sessione auth:", error);
    localStorage.removeItem("my-garage-auth");
    return "";
  }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const hasStoredToken = Boolean(getStoredAuthToken());

  if (!isAuthenticated && !hasStoredToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const hasStoredToken = Boolean(getStoredAuthToken());

  if (isAuthenticated || hasStoredToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
}

function AppRoutesContent() {
  const [vehicles, setVehicles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleExpiredSession = useCallback(() => {
    logout();
    setVehicles([]);
    setError("");
    setIsLoading(false);

    showToast({
      type: "error",
      title: "Sessione scaduta",
      message: "Effettua di nuovo il login per continuare.",
    });

    navigate("/login", { replace: true });
  }, [logout, navigate, showToast]);

  const fetchVehicles = useCallback(
    async ({ showErrorToast = true } = {}) => {
      const hasStoredToken = Boolean(getStoredAuthToken());

      if (!isAuthenticated && !hasStoredToken) {
        setVehicles([]);
        setIsLoading(false);
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const apiVehicles = await getVehicles();
        const withFlags = apiVehicles.map((vehicle) => addExpiryFlags(vehicle));

        setVehicles(withFlags);
      } catch (err) {
        console.error("Errore fetch:", err);

        if (isAuthError(err)) {
          handleExpiredSession();
          return;
        }

        const storedVehicles = localStorage.getItem("vehicles");

        if (storedVehicles) {
          setVehicles(JSON.parse(storedVehicles));
          setError(
            "Backend momentaneamente non raggiungibile. Sto mostrando gli ultimi dati salvati nel browser."
          );

          if (showErrorToast) {
            showToast({
              type: "error",
              title: "Backend non raggiungibile",
              message:
                "Sto usando eventuali dati salvati nel browser. Riprova tra qualche secondo.",
            });
          }
        } else {
          setError(
            "Non riesco a caricare i veicoli. Il server potrebbe essere in fase di avvio: riprova tra qualche secondo."
          );

          if (showErrorToast) {
            showToast({
              type: "error",
              title: "Caricamento non riuscito",
              message:
                "Il backend potrebbe essere in fase di avvio. Riprova tra qualche secondo.",
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [handleExpiredSession, isAuthenticated, showToast]
  );

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (!isAuthenticated && !getStoredAuthToken()) {
      setVehicles([]);
      setError("");
      setIsLoading(false);
    }
  }, [isAuthenticated]);

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

      showToast({
        type: "success",
        title: "Veicolo aggiunto",
        message: "Il veicolo è stato salvato correttamente.",
      });

      setError("");
    } catch (err) {
      console.error("Errore creazione veicolo:", err);

      if (isAuthError(err)) {
        handleExpiredSession();
        throw err;
      }

      setError("Non riesco ad aggiungere il veicolo. Riprova più tardi.");

      showToast({
        type: "error",
        title: "Aggiunta non riuscita",
        message:
          "Il veicolo non è stato salvato. Controlla la connessione e riprova.",
      });

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

      showToast({
        type: "success",
        title: "Modifiche salvate",
        message: "Le informazioni del veicolo sono state aggiornate.",
      });

      setError("");
      return vehicleWithFlags;
    } catch (err) {
      console.error("Errore aggiornamento veicolo:", err);

      if (isAuthError(err)) {
        handleExpiredSession();
        throw err;
      }

      setError("Non riesco ad aggiornare il veicolo. Riprova più tardi.");

      await fetchVehicles({ showErrorToast: false });

      showToast({
        type: "error",
        title: "Modifica non riuscita",
        message:
          "Le modifiche non sono state salvate. Riprova tra qualche secondo.",
      });

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

      showToast({
        type: "success",
        title: "Veicolo eliminato",
        message: "Il veicolo è stato rimosso correttamente.",
      });

      setError("");
    } catch (err) {
      console.error("Errore eliminazione veicolo:", err);

      if (isAuthError(err)) {
        handleExpiredSession();
        throw err;
      }

      setError("Non riesco a eliminare il veicolo. Riprova più tardi.");

      showToast({
        type: "error",
        title: "Eliminazione non riuscita",
        message:
          "Il veicolo non è stato eliminato. Riprova tra qualche secondo.",
      });

      throw err;
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <Menu title="My Garage" onAddVehicle={handleAddVehicle} />

      <div className="main-content">
        <Routes>
          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <HomeSortingNote />
                  <App
                    vehicles={sortVehiclesByUrgency(vehicles)}
                    showDashboard
                    isLoading={isLoading}
                    error={error}
                    onRetry={fetchVehicles}
                    emptyTitle="Nessun veicolo presente"
                    emptyDescription="Aggiungi il tuo primo veicolo per iniziare a monitorare le scadenze."
                  />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="expired"
            element={
              <ProtectedRoute>
                <App
                  vehicles={sortVehiclesByUrgency(
                    vehicles.filter(
                      (vehicle) =>
                        vehicle.expired_car_tax ||
                        vehicle.expired_insurance ||
                        vehicle.expired_revision
                    )
                  )}
                  expiryView="expired"
                  isLoading={isLoading}
                  error={error}
                  onRetry={fetchVehicles}
                  emptyTitle="Nessun veicolo scaduto ✅"
                  emptyDescription="Tutte le scadenze sono sotto controllo."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="expiring"
            element={
              <ProtectedRoute>
                <App
                  vehicles={sortVehiclesByUrgency(
                    vehicles.filter(
                      (vehicle) =>
                        vehicle.expiring_car_tax ||
                        vehicle.expiring_insurance ||
                        vehicle.expiring_revision
                    )
                  )}
                  expiryView="expiring"
                  isLoading={isLoading}
                  error={error}
                  onRetry={fetchVehicles}
                  emptyTitle="Nessun veicolo in scadenza 👌"
                  emptyDescription="Non ci sono scadenze nei prossimi 30 giorni."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="impostazioni"
            element={
              <ProtectedRoute>
                <NotificationSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="details/:id"
            element={
              <ProtectedRoute>
                <DetailsWrapper
                  vehicles={vehicles}
                  isLoading={isLoading}
                  onUpdate={handleUpdateVehicle}
                  onDelete={handleDeleteVehicle}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<p style={{ padding: "20px" }}>❌ Pagina non trovata</p>}
          />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

function HomeSortingNote() {
  return (
    <section className="home-sorting-note" aria-label="Ordinamento veicoli">
      <div className="home-sorting-note__icon">⚡</div>
      <div>
        <strong>Veicoli ordinati per urgenza</strong>
        <p>
          Mostriamo prima le scadenze già superate, poi quelle entro 30 giorni
          e infine i veicoli in regola.
        </p>
      </div>
    </section>
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

  return <Details vehicle={vehicle} onUpdate={onUpdate} onDelete={onDelete} />;
}
