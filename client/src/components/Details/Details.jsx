import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "./Details.css";
import ThemeContext from "../../context/ThemeContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { formatDateForInput } from "../../utils/vehicleDates";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Errore durante la lettura del file."));
    reader.readAsDataURL(file);
  });
}

export default function Details({ vehicle, onUpdate, onDelete }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [revision, setRevision] = useState(vehicle.scadenza_revisione || "");
  const [bollo, setBollo] = useState(vehicle.scadenza_bollo || "");
  const [insurance, setInsurance] = useState(
    vehicle.scadenza_assicurazione || ""
  );
  const [imagePreview, setImagePreview] = useState(vehicle.img_url || "");
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRevision(vehicle.scadenza_revisione || "");
    setBollo(vehicle.scadenza_bollo || "");
    setInsurance(vehicle.scadenza_assicurazione || "");
    setImagePreview(vehicle.img_url || "");
    setErrors({});
    setImageError("");
    setSuccessMessage("");
    setShowDeleteModal(false);
    setIsSaving(false);
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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    setSuccessMessage("");
    setImageError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Seleziona un file immagine valido.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError("L'immagine non può superare i 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setImagePreview(imageDataUrl);
    } catch {
      setImageError("Non è stato possibile caricare l'immagine.");
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageError("");
    setSuccessMessage("");
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

    if (imageError) {
      setSuccessMessage("");
      return;
    }

    const updatedVehicle = {
      ...vehicle,
      img_url: imagePreview,
      scadenza_revisione: revision,
      scadenza_bollo: bollo,
      scadenza_assicurazione: insurance,
    };

    setIsSaving(true);

    onUpdate(updatedVehicle).catch(() => {
      console.error("Errore durante il salvataggio delle modifiche.");
    });

    navigate("/", { replace: true });
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

        {imagePreview ? (
          <img src={imagePreview} alt={vehicle.model} />
        ) : (
          <div className="details-image-placeholder">
            <span>🚗</span>
            <p>Nessuna foto disponibile</p>
          </div>
        )}

        <div className="input-group details-image-upload">
          <label htmlFor="vehicle-image">Foto veicolo:</label>
          <input
            id="vehicle-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Puoi caricare o sostituire la foto. Dimensione massima: 5 MB.</small>

          {imagePreview && (
            <button
              type="button"
              className="details-remove-image"
              onClick={handleRemoveImage}
            >
              Rimuovi foto
            </button>
          )}

          {imageError && <span className="field-error">{imageError}</span>}
        </div>

        {successMessage && (
          <p className="details-success-message">{successMessage}</p>
        )}

        {errors.submit && <p className="field-error">{errors.submit}</p>}

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
          <button onClick={handleRenew} disabled={isSaving}>
            {isSaving ? "Salvataggio..." : "💾 Salva modifiche"}
          </button>
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