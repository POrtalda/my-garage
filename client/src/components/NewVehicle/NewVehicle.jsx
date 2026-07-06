import { useState } from "react";
import { lookupVehicleByPlate } from "../../services/plateLookupApi";
import "./NewVehicle.css";

const initialFormData = {
  brand: "",
  model: "",
  plate: "",
  img_url: "",
  scadenza_bollo: "",
  scadenza_assicurazione: "",
  scadenza_revisione: "",
};

const maxImageSizeInBytes = 5 * 1024 * 1024;

function validateVehicleForm(formData) {
  const newErrors = {};

  if (!formData.brand.trim()) {
    newErrors.brand = "Inserisci la marca del veicolo.";
  }

  if (!formData.model.trim()) {
    newErrors.model = "Inserisci il modello del veicolo.";
  }

  if (!formData.scadenza_bollo) {
    newErrors.scadenza_bollo = "Inserisci la scadenza del bollo.";
  }

  if (!formData.scadenza_assicurazione) {
    newErrors.scadenza_assicurazione =
      "Inserisci la scadenza dell'assicurazione.";
  }

  if (!formData.scadenza_revisione) {
    newErrors.scadenza_revisione = "Inserisci la scadenza della revisione.";
  }

  return newErrors;
}

export default function NewVehicle({ onAdd, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [plateLookupData, setPlateLookupData] = useState(null);
  const [isPlateLookupLoading, setIsPlateLookupLoading] = useState(false);
  const [plateLookupError, setPlateLookupError] = useState("");

  const [assistedDeadlines, setAssistedDeadlines] = useState({
    scadenza_bollo: "",
    scadenza_assicurazione: "",
    scadenza_revisione: "",
  });

  const [assistedDeadlinesApplied, setAssistedDeadlinesApplied] =
    useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setSubmitError("");

    if (name === "plate") {
      setPlateLookupError("");
      setPlateLookupData(null);
      setAssistedDeadlines({
        scadenza_bollo: "",
        scadenza_assicurazione: "",
        scadenza_revisione: "",
      });
      setAssistedDeadlinesApplied(false);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({
        ...errors,
        img_url: "Seleziona un file immagine valido.",
      });
      return;
    }

    if (file.size > maxImageSizeInBytes) {
      setErrors({
        ...errors,
        img_url: "L'immagine è troppo grande. Usa un file massimo di 5 MB.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageDataUrl = reader.result;

      setFormData((prev) => ({
        ...prev,
        img_url: imageDataUrl,
      }));

      setImagePreview(imageDataUrl);

      if (errors.img_url) {
        setErrors((prev) => ({ ...prev, img_url: "" }));
      }
    };

    reader.readAsDataURL(file);
  }

  async function handlePlateLookup() {
    const plate = formData.plate.trim();

    if (!plate) {
      setPlateLookupData(null);
      setPlateLookupError("Inserisci una targa prima di cercare i dati.");
      setErrors((prev) => ({
        ...prev,
        plate: "Inserisci una targa prima di cercare i dati.",
      }));
      return;
    }

    setIsPlateLookupLoading(true);
    setPlateLookupError("");
    setPlateLookupData(null);
    setSubmitError("");
    setAssistedDeadlines({
      scadenza_bollo: "",
      scadenza_assicurazione: "",
      scadenza_revisione: "",
    });
    setAssistedDeadlinesApplied(false);

    try {
      const data = await lookupVehicleByPlate(plate);

      setFormData((prev) => ({
        ...prev,
        plate: data.plate || prev.plate,
      }));

      setPlateLookupData(data);

      if (errors.plate) {
        setErrors((prev) => ({ ...prev, plate: "" }));
      }
    } catch (err) {
      setPlateLookupError(
        err.message || "Non è stato possibile cercare i dati dalla targa."
      );
    } finally {
      setIsPlateLookupLoading(false);
    }
  }

  function handleAssistedDeadlineChange(field, value) {
    setAssistedDeadlines((prevDeadlines) => ({
      ...prevDeadlines,
      [field]: value,
    }));

    setAssistedDeadlinesApplied(false);
  }

  function handleApplyAssistedDeadlines() {
    setFormData((prevFormData) => ({
      ...prevFormData,
      scadenza_bollo:
        assistedDeadlines.scadenza_bollo || prevFormData.scadenza_bollo,
      scadenza_assicurazione:
        assistedDeadlines.scadenza_assicurazione ||
        prevFormData.scadenza_assicurazione,
      scadenza_revisione:
        assistedDeadlines.scadenza_revisione ||
        prevFormData.scadenza_revisione,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      scadenza_bollo: assistedDeadlines.scadenza_bollo
        ? ""
        : prevErrors.scadenza_bollo,
      scadenza_assicurazione: assistedDeadlines.scadenza_assicurazione
        ? ""
        : prevErrors.scadenza_assicurazione,
      scadenza_revisione: assistedDeadlines.scadenza_revisione
        ? ""
        : prevErrors.scadenza_revisione,
    }));

    setAssistedDeadlinesApplied(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateVehicleForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await onAdd({
        ...formData,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        plate: formData.plate.trim().toUpperCase(),
        img_url: formData.img_url.trim(),
        id: Date.now(),
      });

      onClose();
    } catch (error) {
      setSubmitError(
        error.message ||
          "Non è stato possibile aggiungere il veicolo. Controlla la connessione e riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasAssistedDeadlines =
    assistedDeadlines.scadenza_bollo ||
    assistedDeadlines.scadenza_assicurazione ||
    assistedDeadlines.scadenza_revisione;

  return (
    <div className="new-vehicle">
      <div className="new-vehicle__header">
        <span className="new-vehicle__eyebrow">Nuovo veicolo</span>
        <h2>Aggiungi un veicolo</h2>
        <p>
          Inserisci i dati principali, aggiungi le scadenze e carica una foto
          per completare la scheda.
        </p>
      </div>

      <form className="new-vehicle__form" onSubmit={handleSubmit} noValidate>
        <section className="new-vehicle__section">
          <div className="new-vehicle__section-header">
            <span className="new-vehicle__section-icon">1</span>
            <div>
              <h3>Dati veicolo</h3>
              <p>Informazioni principali per riconoscere subito il mezzo.</p>
            </div>
          </div>

          <div className="new-vehicle__grid">
            <label>
              Marca
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Es. Fiat"
                className={errors.brand ? "input-error" : ""}
              />
              {errors.brand && (
                <span className="field-error">{errors.brand}</span>
              )}
            </label>

            <label>
              Modello
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Es. Panda"
                className={errors.model ? "input-error" : ""}
              />
              {errors.model && (
                <span className="field-error">{errors.model}</span>
              )}
            </label>
          </div>

          <div className="plate-lookup">
            <div className="plate-lookup__row">
              <label>
                Targa
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="Es. AB123CD"
                  className={errors.plate ? "input-error" : ""}
                />
                {errors.plate && (
                  <span className="field-error">{errors.plate}</span>
                )}
              </label>

              <button
                type="button"
                className="plate-lookup__button"
                onClick={handlePlateLookup}
                disabled={isPlateLookupLoading || isSubmitting}
              >
                {isPlateLookupLoading ? "Ricerca..." : "Cerca dati"}
              </button>
            </div>

            {plateLookupError && (
              <p className="form-error">{plateLookupError}</p>
            )}

            {plateLookupData && (
              <div className="plate-lookup__result">
                <div className="plate-lookup__result-header">
                  <h3>Assistente scadenze da targa</h3>
                  <p>{plateLookupData.message}</p>
                </div>

                <p className="plate-lookup__verified">
                  <strong>Targa verificata:</strong> {plateLookupData.plate}
                </p>

                <div className="plate-lookup__guided-flow">
                  <div className="plate-lookup__step">
                    <div className="plate-lookup__step-header">
                      <span className="plate-lookup__step-number">1</span>
                      <div>
                        <h4>{plateLookupData.tax.label}</h4>
                        <p>{plateLookupData.tax.message}</p>
                      </div>
                    </div>

                    {plateLookupData.tax.officialUrl && (
                      <a
                        href={plateLookupData.tax.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="plate-lookup__link"
                      >
                        Apri servizio ACI
                      </a>
                    )}

                    <label>
                      Scadenza bollo trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_bollo}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_bollo",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="plate-lookup__step">
                    <div className="plate-lookup__step-header">
                      <span className="plate-lookup__step-number">2</span>
                      <div>
                        <h4>{plateLookupData.insurance.label}</h4>
                        <p>{plateLookupData.insurance.message}</p>
                      </div>
                    </div>

                    {plateLookupData.insurance.officialUrl && (
                      <a
                        href={plateLookupData.insurance.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="plate-lookup__link"
                      >
                        Apri verifica RCA
                      </a>
                    )}

                    <label>
                      Scadenza assicurazione trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_assicurazione}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_assicurazione",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="plate-lookup__step">
                    <div className="plate-lookup__step-header">
                      <span className="plate-lookup__step-number">3</span>
                      <div>
                        <h4>{plateLookupData.inspection.label}</h4>
                        <p>{plateLookupData.inspection.message}</p>
                      </div>
                    </div>

                    {plateLookupData.inspection.officialUrl && (
                      <a
                        href={plateLookupData.inspection.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="plate-lookup__link"
                      >
                        Apri verifica revisione
                      </a>
                    )}

                    <label>
                      Scadenza revisione trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_revisione}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_revisione",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  className="plate-lookup__apply-button"
                  onClick={handleApplyAssistedDeadlines}
                  disabled={!hasAssistedDeadlines || isSubmitting}
                >
                  Applica scadenze al form
                </button>

                {assistedDeadlinesApplied && (
                  <p className="plate-lookup__applied-message">
                    Scadenze applicate al form. Ora puoi salvare il veicolo e
                    My Garage ti avviserà prima delle prossime scadenze.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="new-vehicle__section">
          <div className="new-vehicle__section-header">
            <span className="new-vehicle__section-icon">2</span>
            <div>
              <h3>Scadenze</h3>
              <p>Inserisci le date principali da monitorare.</p>
            </div>
          </div>

          <div className="new-vehicle__grid new-vehicle__grid--three">
            <label>
              Revisione
              <input
                type="date"
                name="scadenza_revisione"
                value={formData.scadenza_revisione}
                onChange={handleChange}
                className={errors.scadenza_revisione ? "input-error" : ""}
              />
              {errors.scadenza_revisione && (
                <span className="field-error">
                  {errors.scadenza_revisione}
                </span>
              )}
            </label>

            <label>
              Bollo
              <input
                type="date"
                name="scadenza_bollo"
                value={formData.scadenza_bollo}
                onChange={handleChange}
                className={errors.scadenza_bollo ? "input-error" : ""}
              />
              {errors.scadenza_bollo && (
                <span className="field-error">{errors.scadenza_bollo}</span>
              )}
            </label>

            <label>
              Assicurazione
              <input
                type="date"
                name="scadenza_assicurazione"
                value={formData.scadenza_assicurazione}
                onChange={handleChange}
                className={errors.scadenza_assicurazione ? "input-error" : ""}
              />
              {errors.scadenza_assicurazione && (
                <span className="field-error">
                  {errors.scadenza_assicurazione}
                </span>
              )}
            </label>
          </div>
        </section>

        <section className="new-vehicle__section new-vehicle__section--photo">
          <div className="new-vehicle__section-header">
            <span className="new-vehicle__section-icon">3</span>
            <div>
              <h3>Foto veicolo</h3>
              <p>Carica un’immagine dal dispositivo. Dimensione massima 5 MB.</p>
            </div>
          </div>

          <div className="new-vehicle__photo-layout">
            <label className="new-vehicle__file-field">
              <span>Upload immagine</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
              {errors.img_url && (
                <span className="field-error">{errors.img_url}</span>
              )}
            </label>

            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Anteprima veicolo" />
              ) : (
                <div className="image-preview__placeholder">
                  <span>Foto veicolo</span>
                  <small>Anteprima immagine</small>
                </div>
              )}
            </div>
          </div>
        </section>

        {submitError && <p className="form-error">{submitError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : "Salva veicolo"}
          </button>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
