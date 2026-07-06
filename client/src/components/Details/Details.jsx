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

function getVehicleStatus(vehicle) {
  if (
    vehicle.expired_car_tax ||
    vehicle.expired_insurance ||
    vehicle.expired_revision
  ) {
    return {
      label: "Scadenze da gestire",
      tone: "expired",
      description: "Almeno una scadenza risulta superata.",
    };
  }

  if (
    vehicle.expiring_car_tax ||
    vehicle.expiring_insurance ||
    vehicle.expiring_revision
  ) {
    return {
      label: "In scadenza",
      tone: "expiring",
      description: "Almeno una scadenza è vicina.",
    };
  }

  return {
    label: "Tutto ok",
    tone: "ok",
    description: "Le scadenze principali sono sotto controllo.",
  };
}

function getDeadlineStatus(vehicle, type) {
  const statusMap = {
    revision: {
      expired: vehicle.expired_revision,
      expiring: vehicle.expiring_revision,
    },
    bollo: {
      expired: vehicle.expired_car_tax,
      expiring: vehicle.expiring_car_tax,
    },
    insurance: {
      expired: vehicle.expired_insurance,
      expiring: vehicle.expiring_insurance,
    },
  };

  if (statusMap[type].expired) {
    return {
      label: "Scaduta",
      tone: "expired",
    };
  }

  if (statusMap[type].expiring) {
    return {
      label: "In scadenza",
      tone: "expiring",
    };
  }

  return {
    label: "Ok",
    tone: "ok",
  };
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

  const vehicleStatus = getVehicleStatus(vehicle);

  const deadlines = [
    {
      id: "revision",
      title: "Revisione",
      value: revision,
      error: errors.revision,
      onChange: (value) => handleFieldChange("revision", value),
      status: getDeadlineStatus(vehicle, "revision"),
    },
    {
      id: "bollo",
      title: "Bollo",
      value: bollo,
      error: errors.bollo,
      onChange: (value) => handleFieldChange("bollo", value),
      status: getDeadlineStatus(vehicle, "bollo"),
    },
    {
      id: "insurance",
      title: "Assicurazione",
      value: insurance,
      error: errors.insurance,
      onChange: (value) => handleFieldChange("insurance", value),
      status: getDeadlineStatus(vehicle, "insurance"),
    },
  ];

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

  const handleRenew = async () => {
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
    setErrors((prevErrors) => ({ ...prevErrors, submit: "" }));

    try {
      await onUpdate(updatedVehicle);
      navigate("/", { replace: true });
    } catch {
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit:
          "Non è stato possibile salvare le modifiche. Controlla la connessione e riprova.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    setErrors((prevErrors) => ({ ...prevErrors, submit: "" }));

    try {
      await onDelete(vehicle.id || vehicle._id);
      navigate("/");
    } catch {
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit:
          "Non è stato possibile eliminare il veicolo. Controlla la connessione e riprova.",
      }));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <main
        className={
          isDarkMode
            ? "details-page details-page_dark"
            : "details-page details-page_light"
        }
      >
        <section className="details-hero">
          <div className="details-hero-copy">
            <span className="details-eyebrow">Dettaglio veicolo</span>

            <h1>
              {vehicle.brand} {vehicle.model}
            </h1>

            <div className={`details-status details-status_${vehicleStatus.tone}`}>
              <span className="details-status-dot" />
              <div>
                <strong>{vehicleStatus.label}</strong>
                <p>{vehicleStatus.description}</p>
              </div>
            </div>
          </div>

          <div className="details-hero-media">
            {imagePreview ? (
              <img src={imagePreview} alt={`${vehicle.brand} ${vehicle.model}`} />
            ) : (
              <div className="details-image-placeholder">
                <span>🚗</span>
                <p>Nessuna foto disponibile</p>
              </div>
            )}
          </div>
        </section>

        {successMessage && (
          <p className="details-success-message">{successMessage}</p>
        )}

        {errors.submit && <p className="field-error">{errors.submit}</p>}

        <section className="details-layout">
          <div className="details-panel details-panel_deadlines">
            <div className="details-panel-header">
              <span className="details-panel-icon">📅</span>
              <div>
                <h2>Scadenze</h2>
                <p>Aggiorna le date principali del veicolo.</p>
              </div>
            </div>

            <div className="details-deadlines-list">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`details-deadline details-deadline_${deadline.status.tone}`}
                >
                  <div className="details-deadline-header">
                    <div>
                      <h3>{deadline.title}</h3>
                      <span
                        className={`details-deadline-badge details-deadline-badge_${deadline.status.tone}`}
                      >
                        {deadline.status.label}
                      </span>
                    </div>
                  </div>

                  <label htmlFor={`deadline-${deadline.id}`}>
                    Data scadenza
                  </label>

                  <input
                    id={`deadline-${deadline.id}`}
                    type="date"
                    value={formatDateForInput(deadline.value)}
                    onChange={(e) => deadline.onChange(e.target.value)}
                    className={deadline.error ? "input-error" : ""}
                  />

                  {deadline.error && (
                    <span className="field-error">{deadline.error}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="details-panel details-panel_media">
            <div className="details-panel-header">
              <span className="details-panel-icon">🖼️</span>
              <div>
                <h2>Foto veicolo</h2>
                <p>Carica o sostituisci l’immagine del veicolo.</p>
              </div>
            </div>

            <div className="details-image-upload">
              <label htmlFor="vehicle-image">Seleziona immagine</label>

              <input
                id="vehicle-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <small>Dimensione massima: 5 MB.</small>

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
          </aside>
        </section>

        <section className="details-actions-panel">
          <div>
            <h2>Azioni</h2>
            <p>Salva le modifiche o elimina il veicolo dal garage.</p>
          </div>

          <div className="details-actions">
            <button onClick={handleRenew} disabled={isSaving}>
              {isSaving ? "Salvataggio..." : "💾 Salva modifiche"}
            </button>

            <button onClick={openDeleteModal} className="btn-delete">
              🗑️ Elimina
            </button>
          </div>
        </section>
      </main>

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
