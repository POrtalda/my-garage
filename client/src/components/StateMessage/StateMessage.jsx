import "./StateMessage.css";

function StateMessage({
  icon = "ℹ️",
  title = "Informazione",
  description = "",
  type = "info",
  actionLabel = "",
  onAction,
}) {
  return (
    <div className={`state-message state-message-${type}`}>
      <div className="state-message-icon">{icon}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      {actionLabel && onAction && (
        <button type="button" className="state-message-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StateMessage;