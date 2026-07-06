import { useContext } from 'react';
import './Vehicle.css';
import ThemeContext from '../../context/ThemeContext';
import { Link } from 'react-router';

export default function Vehicle({ vehicle, expiryView = '' }) {
  function getVehicleStatus(vehicle) {
    if (
      vehicle.expired_car_tax ||
      vehicle.expired_insurance ||
      vehicle.expired_revision
    ) {
      return 'red';
    }

    if (
      vehicle.expiring_car_tax ||
      vehicle.expiring_insurance ||
      vehicle.expiring_revision
    ) {
      return 'orange';
    }

    return 'green';
  }

  function getExpiryReasons(vehicle, view) {
    if (view === 'expired') {
      return [
        vehicle.expired_car_tax && 'Bollo',
        vehicle.expired_insurance && 'Assicurazione',
        vehicle.expired_revision && 'Revisione',
      ].filter(Boolean);
    }

    if (view === 'expiring') {
      return [
        vehicle.expiring_car_tax && 'Bollo',
        vehicle.expiring_insurance && 'Assicurazione',
        vehicle.expiring_revision && 'Revisione',
      ].filter(Boolean);
    }

    return [];
  }

  const vehicleStatus = getVehicleStatus(vehicle);
  const expiryReasons = getExpiryReasons(vehicle, expiryView);
  const expiryLabel = expiryView === 'expired' ? 'Scaduto' : 'In scadenza';
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? 'card-vehicle card-vehicle_dark' : 'card-vehicle card-vehicle_light'}>
      <Link to={`/details/${vehicle.id}`} className="card-vehicle-link">
        <div className="card-vehicle-info">
          <h2>{vehicle.brand}</h2>
          <h3>{vehicle.model}</h3>

          {expiryReasons.length > 0 && (
            <div className={`expiry-reasons expiry-reasons_${expiryView}`}>
              <span className="expiry-reasons-label">{expiryLabel}</span>

              <div className="expiry-reasons-list">
                {expiryReasons.map((reason) => (
                  <span key={reason} className="expiry-reason-chip">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-traffic-img-light">
          {vehicle.img_url ? (
            <img src={vehicle.img_url} alt={`${vehicle.brand} ${vehicle.model}`} />
          ) : (
            <div className="vehicle-image-placeholder">
              <span>🚗</span>
            </div>
          )}

          <div className="traffic-light" aria-label={`Stato veicolo: ${vehicleStatus}`}>
            <span className={`traffic-dot traffic-dot-red ${vehicleStatus === 'red' ? 'active' : ''}`}></span>
            <span className={`traffic-dot traffic-dot-orange ${vehicleStatus === 'orange' ? 'active' : ''}`}></span>
            <span className={`traffic-dot traffic-dot-green ${vehicleStatus === 'green' ? 'active' : ''}`}></span>
          </div>
        </div>
      </Link>
    </div>
  );
}
