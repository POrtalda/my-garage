import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "./Details.css";
import ThemeContext from "../../context/ThemeContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { formatDateForInput } from "../../utils/vehicleDates";

function validateDetailsForm({ revision, bollo, insurance }) {
  const newErrors = {};

  if (!revision) {
    newErrors.revision = "Inserisci la scadenza della revisione.";
  }

  if (!bollo) {
    newErrors.bollo = "Inserisci la scadenza del bollo.";
  }

  if (!insurance) {
    newErrors.insurance = "Inserisci la scadenza dell'assicurazione.";
  }

  return newErrors;
}

export default function Details({ vehicle, onUpdate, onDelete }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [revision, setRevision] = useState(vehicle.scadenza_revisione || "");
  const [bollo, setBollo] = useState(vehicle.scadenza_bollo || "");
  const [insurance, setInsurance] = useState(
    vehicle.scadenza_assicurazione || ""
  );
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setRevision(vehicle.scadenza_revisione || "");
    setBollo(vehicle.scadenza_bollo || "");
    setInsurance(vehicle.scadenza_assicurazione || "");
    setErrors({});
    setSuccessMessage("");
    setShowDeleteModal(false);
  }, [vehicle]);

  const handleFieldChange = (fieldName, value) => {
    setSuccessMessage("");

    if (fieldName === "revision") {
      setRevision(value);
    }

    if (fieldName === "bollo") {
      setBollo(value);
    }

    if (fieldName === "insurance") {
      setInsurance(value);
    }

    if (errors[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    }
  };

  const handleRenew = () => {
    const validationErrors = validateDetailsForm({
      revision,
      bollo,
      insurance,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    const updatedVehicle = {
      ...vehicle,
      scadenza_revisione: revision,
      scadenza_bollo: bollo,
      scadenza_assicurazione: insurance,
    };

    onUpdate(updatedVehicle);
    setSuccessMessage("✅ Scadenze aggiornate correttamente.");
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    onDelete(vehicle.id);
    navigate("/");
  };

  return (
    <>
      <div className={isDarkMode ? "card-details dark" : "card-details light"}>
        <h2>
          {vehicle.brand} {vehicle.model}
        </h2>

        <img src={vehicle.img_url} alt={vehicle.model} />

        {successMessage && (
          <p className="details-success-message">{successMessage}</p>
        )}

        <div className="input-group">
          <label>Scadenza Revisione:</label>
          <input
            type="date"
            value={formatDateForInput(revision)}
            onChange={(e) => handleFieldChange("revision", e.target.value)}
            className={errors.revision ? "input-error" : ""}
          />
          {errors.revision && (
            <span className="field-error">{errors.revision}</span>
          )}
        </div>

        <div className="input-group">
          <label>Scadenza Bollo:</label>
          <input
            type="date"
            value={formatDateForInput(bollo)}
            onChange={(e) => handleFieldChange("bollo", e.target.value)}
            className={errors.bollo ? "input-error" : ""}
          />
          {errors.bollo && <span className="field-error">{errors.bollo}</span>}
        </div>

        <div className="input-group">
          <label>Scadenza Assicurazione:</label>
          <input
            type="date"
            value={formatDateForInput(insurance)}
            onChange={(e) => handleFieldChange("insurance", e.target.value)}
            className={errors.insurance ? "input-error" : ""}
          />
          {errors.insurance && (
            <span className="field-error">{errors.insurance}</span>
          )}
        </div>

        <div className="details-actions">
          <button onClick={handleRenew}>💾 Salva modifiche</button>
          <button onClick={openDeleteModal} className="btn-delete">
            🗑️ Elimina
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isDarkMode={isDarkMode}
          vehicleName={`${vehicle.brand} ${vehicle.model}`}
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
