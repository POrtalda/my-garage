import { useState } from "react";
import "./NewVehicle.css";

const initialFormData = {
  brand: "",
  model: "",
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

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

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

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateVehicleForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAdd({
      ...formData,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      img_url: formData.img_url.trim(),
      id: Date.now(),
    });

    onClose();
  }

  return (
    <div className="new-vehicle">
      <h2>Aggiungi Veicolo</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label>
          Marca
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={errors.brand ? "input-error" : ""}
          />
          {errors.brand && <span className="field-error">{errors.brand}</span>}
        </label>

        <label>
          Modello
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={errors.model ? "input-error" : ""}
          />
          {errors.model && <span className="field-error">{errors.model}</span>}
        </label>

        <label>
          Carica immagine dal dispositivo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
          {errors.img_url && (
            <span className="field-error">{errors.img_url}</span>
          )}
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Anteprima veicolo" />
          </div>
        )}

        <label>
          Scadenza Bollo
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
          Scadenza Assicurazione
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

        <label>
          Scadenza Revisione
          <input
            type="date"
            name="scadenza_revisione"
            value={formData.scadenza_revisione}
            onChange={handleChange}
            className={errors.scadenza_revisione ? "input-error" : ""}
          />
          {errors.scadenza_revisione && (
            <span className="field-error">{errors.scadenza_revisione}</span>
          )}
        </label>

        <div className="form-actions">
          <button type="submit">Conferma</button>
          <button type="button" onClick={onClose}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}