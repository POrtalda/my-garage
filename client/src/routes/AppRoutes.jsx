import { BrowserRouter, Route, Routes, useParams } from "react-router";
import App from "../App";
import "./AppRoutes.css";
import Menu from "../components/Menu/Menu";
import { useEffect, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import Details from "../components/Details/Details";

const URL_API = "https://portalda.github.io/fake-api-my-garage/my-garage.json";

export default function AppRoutes() {
  const [vehicles, setVehicles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔹 Al mount: prova a leggere dal localStorage, se vuoto fai fetch
  useEffect(() => {
    const storedVehicles = localStorage.getItem("vehicles");
    if (storedVehicles) {
      setVehicles(JSON.parse(storedVehicles));
    } else {
      fetchVehicles();
    }
  }, []);

  const fetchVehicles = () => {
    fetch(URL_API)
      .then((res) => res.json())
      .then((data) => {
        const withFlags = data.map((v) => addExpiryFlags(v));
        setVehicles(withFlags);
        localStorage.setItem("vehicles", JSON.stringify(withFlags)); // 🔹 salvi subito in LS
      })
      .catch((err) => console.error("Errore fetch:", err));
  };

  // 🔹 Ogni volta che cambia vehicles → aggiorna localStorage
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

  // --- funzioni di utility già presenti ---
  function parseDate(dateString) {
    if (!dateString) return null;
    if (dateString.includes("-")) return new Date(dateString);
    const parts = dateString.split(/[\/\-.]/).map((p) => parseInt(p, 10));
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return new Date(year, month - 1, day);
  }

  const daysBeforeExpiry = 30;

  function checkStatus(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = parseDate(dateString);
    if (!expiryDate) return { expired: false, expiring: false };
    if (expiryDate < today) return { expired: true, expiring: false };
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= daysBeforeExpiry) return { expired: false, expiring: true };
    return { expired: false, expiring: false };
  }

  function addExpiryFlags(v) {
    const carTax = checkStatus(v.scadenza_bollo);
    const insurance = checkStatus(v.scadenza_assicurazione);
    const revision = checkStatus(v.scadenza_revisione);

    return {
      ...v,
      expired_car_tax: carTax.expired,
      expired_insurance: insurance.expired,
      expired_revision: revision.expired,
      expiring_car_tax: carTax.expiring,
      expiring_insurance: insurance.expiring,
      expiring_revision: revision.expiring,
    };
  }

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
            <Route path="/" element={<App vehicles={vehicles} />} />
            <Route
              path="expired"
              element={
                <App
                  vehicles={vehicles.filter(
                    (v) => v.expired_car_tax || v.expired_insurance || v.expired_revision
                  )}
                />
              }
            />
            <Route
              path="expiring"
              element={
                <App
                  vehicles={vehicles.filter(
                    (v) =>
                      v.expiring_car_tax || v.expiring_insurance || v.expiring_revision
                  )}
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
            <Route path="*" element={<p style={{ padding: "20px" }}>❌ Pagina non trovata</p>} />
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
