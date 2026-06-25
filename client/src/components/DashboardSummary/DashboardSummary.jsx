import { useMemo } from "react";
import { parseDate } from "../../utils/vehicleDates";
import "./DashboardSummary.css";

const expiryFields = [
  {
    key: "scadenza_bollo",
    label: "Bollo",
  },
  {
    key: "scadenza_assicurazione",
    label: "Assicurazione",
  },
  {
    key: "scadenza_revisione",
    label: "Revisione",
  },
];

function formatDate(date) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getVehicleName(vehicle) {
  return [vehicle.marca, vehicle.modello].filter(Boolean).join(" ") || "Veicolo";
}

function getNextExpiry(vehicles = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiries = vehicles.flatMap((vehicle) =>
    expiryFields
      .map((field) => {
        const date = parseDate(vehicle[field.key]);

        if (!date) {
          return null;
        }

        date.setHours(0, 0, 0, 0);

        return {
          vehicle,
          type: field.label,
          date,
          isExpired: date < today,
        };
      })
      .filter(Boolean)
  );

  if (expiries.length === 0) {
    return null;
  }

  return expiries.sort((expiryA, expiryB) => expiryA.date - expiryB.date)[0];
}

export default function DashboardSummary({ vehicles }) {
  const dashboardSummary = useMemo(() => {
    const safeVehicles = vehicles ?? [];
    const total = safeVehicles.length;

    const expired = safeVehicles.filter(
      (vehicle) =>
        vehicle.expired_car_tax ||
        vehicle.expired_insurance ||
        vehicle.expired_revision
    ).length;

    const expiring = safeVehicles.filter(
      (vehicle) =>
        vehicle.expiring_car_tax ||
        vehicle.expiring_insurance ||
        vehicle.expiring_revision
    ).length;

    const ok = safeVehicles.filter(
      (vehicle) =>
        !vehicle.expired_car_tax &&
        !vehicle.expired_insurance &&
        !vehicle.expired_revision &&
        !vehicle.expiring_car_tax &&
        !vehicle.expiring_insurance &&
        !vehicle.expiring_revision
    ).length;

    const nextExpiry = getNextExpiry(safeVehicles);

    return {
      total,
      expired,
      expiring,
      ok,
      nextExpiry,
    };
  }, [vehicles]);

  return (
    <section className="dashboard-summary" aria-label="Riepilogo veicoli">
      <div className="dashboard-summary-grid">
        <div className="dashboard-summary-card">
          <span className="dashboard-summary-label">Veicoli totali</span>
          <strong>{dashboardSummary.total}</strong>
        </div>

        <div className="dashboard-summary-card dashboard-summary-card--expired">
          <span className="dashboard-summary-label">Scaduti</span>
          <strong>{dashboardSummary.expired}</strong>
        </div>

        <div className="dashboard-summary-card dashboard-summary-card--expiring">
          <span className="dashboard-summary-label">In scadenza</span>
          <strong>{dashboardSummary.expiring}</strong>
        </div>

        <div className="dashboard-summary-card dashboard-summary-card--ok">
          <span className="dashboard-summary-label">Tutto ok</span>
          <strong>{dashboardSummary.ok}</strong>
        </div>
      </div>

      <article className="dashboard-next-expiry">
        <div>
          <span className="dashboard-summary-label">Prossima scadenza</span>

          {dashboardSummary.nextExpiry ? (
            <>
              <h2>{getVehicleName(dashboardSummary.nextExpiry.vehicle)}</h2>
              <p>
                {dashboardSummary.nextExpiry.type} ·{" "}
                {formatDate(dashboardSummary.nextExpiry.date)}
              </p>
            </>
          ) : (
            <>
              <h2>Nessuna scadenza da mostrare</h2>
              <p>
                Aggiungi un veicolo per iniziare a monitorare bollo,
                assicurazione e revisione.
              </p>
            </>
          )}
        </div>

        {dashboardSummary.nextExpiry && (
          <span
            className={
              dashboardSummary.nextExpiry.isExpired
                ? "dashboard-next-expiry-badge dashboard-next-expiry-badge--expired"
                : "dashboard-next-expiry-badge"
            }
          >
            {dashboardSummary.nextExpiry.isExpired ? "Scaduta" : "Da controllare"}
          </span>
        )}
      </article>
    </section>
  );
}
