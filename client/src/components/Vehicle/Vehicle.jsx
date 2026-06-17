import { useContext } from 'react';
import './Vehicle.css';
import ThemeContext from '../../context/ThemeContext';
import { Link } from 'react-router';

export default function Vehicle({ vehicle }) {
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

  const vehicleStatus = getVehicleStatus(vehicle);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? 'card-vehicle card-vehicle_dark' : 'card-vehicle card-vehicle_light'}>
      <Link to={`/details/${vehicle.id}`} className="card-vehicle-link">
        <div className="card-vehicle-info">
          <h2>{vehicle.brand}</h2>
          <h3>{vehicle.model}</h3>
        </div>

        <div className="card-traffic-img-light">
          <img src={vehicle.img_url} alt={vehicle.model} />

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