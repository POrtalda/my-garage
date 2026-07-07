import { Link } from "react-router";
import { getPriorityExpiryItems } from "../../utils/vehicleExpirySummary";
import "./PrioritySummary.css";

export default function PrioritySummary({ vehicles }) {
  const priorityItems = getPriorityExpiryItems(vehicles, 3);

  if (priorityItems.length === 0) {
    return null;
  }

  const hasExpired = priorityItems.some((item) => item.status === "expired");
  const linkTarget = hasExpired ? "/expired" : "/expiring";
  const linkLabel = hasExpired ? "Vedi scaduti" : "Vedi in scadenza";

  return (
    <section className="priority-summary">
      <div className="priority-summary-header">
        <div>
          <span className="priority-summary-eyebrow">Priorità</span>
          <h2>Da controllare ora</h2>
        </div>

        <Link to={linkTarget} className="priority-summary-link">
          {linkLabel}
        </Link>
      </div>

      <div className="priority-summary-list">
        {priorityItems.map((item) => (
          <Link
            key={`${item.vehicle.id || item.vehicle._id}-${item.label}`}
            to={`/details/${item.vehicle.id || item.vehicle._id}`}
            className={`priority-summary-item priority-summary-item_${item.status}`}
          >
            <span className="priority-summary-status">
              {item.status === "expired" ? "Scaduta" : "In scadenza"}
            </span>

            <strong>{item.vehicleName}</strong>

            <span>
              {item.label}
              {item.formattedDate ? ` · ${item.formattedDate}` : ""}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
