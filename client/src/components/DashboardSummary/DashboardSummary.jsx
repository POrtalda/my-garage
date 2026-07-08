import { useMemo } from "react";
import { useNavigate } from "react-router";
import "./DashboardSummary.css";

export default function DashboardSummary({ vehicles }) {
  const navigate = useNavigate();

  const goToVehicleList = (path) => {
    navigate(path, { state: { scrollToVehicles: true } });
  };

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

    return {
      total,
      expired,
      expiring,
    };
  }, [vehicles]);

  return (
    <section className="dashboard-summary" aria-label="Riepilogo veicoli">
      <div className="dashboard-summary-grid">
        <button
          type="button"
          className="dashboard-summary-card"
          onClick={() => goToVehicleList("/")}
        >
          <span className="dashboard-summary-label">Veicoli totali</span>
          <strong>{dashboardSummary.total}</strong>
        </button>

        <button
          type="button"
          className="dashboard-summary-card dashboard-summary-card--expired"
          onClick={() => goToVehicleList("/expired")}
        >
          <span className="dashboard-summary-label">Scaduti</span>
          <strong>{dashboardSummary.expired}</strong>
        </button>

        <button
          type="button"
          className="dashboard-summary-card dashboard-summary-card--expiring"
          onClick={() => goToVehicleList("/expiring")}
        >
          <span className="dashboard-summary-label">In scadenza</span>
          <strong>{dashboardSummary.expiring}</strong>
        </button>
      </div>
    </section>
  );
}
