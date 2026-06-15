import { useMemo } from "react";
import "./DashboardSummary.css";

export default function DashboardSummary({ vehicles }) {
  const dashboardSummary = useMemo(() => {
    const total = vehicles?.length ?? 0;

    const expired =
      vehicles?.filter(
        (vehicle) =>
          vehicle.expired_car_tax ||
          vehicle.expired_insurance ||
          vehicle.expired_revision
      ).length ?? 0;

    const expiring =
      vehicles?.filter(
        (vehicle) =>
          vehicle.expiring_car_tax ||
          vehicle.expiring_insurance ||
          vehicle.expiring_revision
      ).length ?? 0;

    const ok =
      vehicles?.filter(
        (vehicle) =>
          !vehicle.expired_car_tax &&
          !vehicle.expired_insurance &&
          !vehicle.expired_revision &&
          !vehicle.expiring_car_tax &&
          !vehicle.expiring_insurance &&
          !vehicle.expiring_revision
      ).length ?? 0;

    return {
      total,
      expired,
      expiring,
      ok,
    };
  }, [vehicles]);

  return (
    <section className="dashboard-summary" aria-label="Riepilogo veicoli">
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
    </section>
  );
}