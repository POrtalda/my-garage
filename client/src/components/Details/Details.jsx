import { useState, useEffect, useContext } from "react";
import "./Details.css";
import ThemeContext from "../../context/ThemeContext";

// Converti "DD/MM/YYYY" o simili in Date
function parseDate(dateString) {
  if (!dateString) return null;
  if (dateString.includes("-")) return new Date(dateString);
  const parts = dateString.split(/[\/\-.]/).map((p) => parseInt(p, 10));
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

// Converti Date in YYYY-MM-DD per input type="date"
function formatDateForInput(dateString) {
  const date = parseDate(dateString);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Details({ vehicle, onUpdate }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [revision, setRevision] = useState(vehicle.scadenza_revisione || "");
  const [bollo, setBollo] = useState(vehicle.scadenza_bollo || "");
  const [insurance, setInsurance] = useState(vehicle.scadenza_assicurazione || "");

  useEffect(() => {
    setRevision(vehicle.scadenza_revisione || "");
    setBollo(vehicle.scadenza_bollo || "");
    setInsurance(vehicle.scadenza_assicurazione || "");
  }, [vehicle]);

  const handleRenew = () => {
    const updatedVehicle = {
      ...vehicle,
      scadenza_revisione: revision,
      scadenza_bollo: bollo,
      scadenza_assicurazione: insurance,
    };
    onUpdate(updatedVehicle);
    alert("✅ Scadenze aggiornate!");
  };

  return (
    <div className={isDarkMode ? "card-details dark" : "card-details light"}>
      <h2>{vehicle.brand} {vehicle.model}</h2>
      <img src={vehicle.img_url} alt={vehicle.model} />

      <div className="input-group">
        <label>Scadenza Revisione:</label>
        <input
          type="date"
          value={formatDateForInput(revision)}
          onChange={(e) => setRevision(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Scadenza Bollo:</label>
        <input
          type="date"
          value={formatDateForInput(bollo)}
          onChange={(e) => setBollo(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Scadenza Assicurazione:</label>
        <input
          type="date"
          value={formatDateForInput(insurance)}
          onChange={(e) => setInsurance(e.target.value)}
        />
      </div>

      <button onClick={handleRenew}>💾 Salva modifiche</button>
    </div>
  );
}
