import "./EmptyState.css";

function EmptyState({
  icon = "🚗",
  title = "Nessun elemento trovato",
  description = "Non ci sono elementi da mostrare.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;