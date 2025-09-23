import { useState } from "react";
import "./NewVehicle.css";

export default function NewVehicle({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    img_url: "",
    scadenza_bollo: "",
    scadenza_assicurazione: "",
    scadenza_revisione: ""
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now() });
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Aggiungi Veicolo</h2>
        <form onSubmit={handleSubmit} className="form-new-vehicle">
          <input type="text" name="brand" placeholder="Marca" value={formData.brand} onChange={handleChange} required />
          <input type="text" name="model" placeholder="Modello" value={formData.model} onChange={handleChange} required />
          <input type="text" name="img_url" placeholder="URL Immagine" value={formData.img_url} onChange={handleChange} required />
          <label>Scadenza Bollo</label>
          <input type="date" name="scadenza_bollo" value={formData.scadenza_bollo} onChange={handleChange} />
          <label>Scadenza Assicurazione</label>
          <input type="date" name="scadenza_assicurazione" value={formData.scadenza_assicurazione} onChange={handleChange} />
          <label>Scadenza Revisione</label>
          <input type="date" name="scadenza_revisione" value={formData.scadenza_revisione} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit">Conferma</button>
            <button type="button" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
}
