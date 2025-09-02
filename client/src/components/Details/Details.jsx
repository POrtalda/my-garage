import { useState, useEffect } from "react";

function Details({ vehicle, onUpdate }) {
  // state per le date
  const [revision, setRevision] = useState(vehicle.scadenza_revisione);
  const [bollo, setBollo] = useState(vehicle.scadenza_bollo);
  const [insurance, setInsurance] = useState(vehicle.scadenza_assicurazione);

  // se cambia il veicolo, aggiorna i campi
  useEffect(() => {
    setRevision(vehicle.scadenza_revisione);
    setBollo(vehicle.scadenza_bollo);
    setInsurance(vehicle.scadenza_assicurazione);
  }, [vehicle]);

  // funzione di aggiornamento
  const handleRenew = () => {
    const updatedVehicle = {
      ...vehicle,
      scadenza_revisione: revision,
      scadenza_bollo: bollo,
      scadenza_assicurazione: insurance,
      // reset dei flag (puoi ricalcolarli in base alle nuove date)
      expired_revision: false,
      expired_car_tax: false,
      expired_insurance: false,
      expiring_revision: false,
      expiring_car_tax: false,
      expiring_insurance: false,
    };

    // prendo tutti i veicoli dal localStorage
    let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

    // sostituisco quello aggiornato
    vehicles = vehicles.map(v =>
      v.id === vehicle.id ? updatedVehicle : v
    );

    // salvo nel localStorage
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    // callback per aggiornare lo state del padre
    if (onUpdate) onUpdate(updatedVehicle);

    alert("✅ Scadenze aggiornate!");
  };

  return (
    <div className="details-card">
      <h2>{vehicle.brand} {vehicle.model}</h2>
      <img src={vehicle.img_url} alt={vehicle.model} width="200" />

      <div>
        <label>Scadenza revisione:</label>
        <input
          type="date"
          value={revision}
          onChange={e => setRevision(e.target.value)}
        />
      </div>

      <div>
        <label>Scadenza bollo:</label>
        <input
          type="date"
          value={bollo}
          onChange={e => setBollo(e.target.value)}
        />
      </div>

      <div>
        <label>Scadenza assicurazione:</label>
        <input
          type="date"
          value={insurance}
          onChange={e => setInsurance(e.target.value)}
        />
      </div>

      <button onClick={handleRenew}>💾 Salva modifiche</button>
    </div>
  );
}

export default Details;
