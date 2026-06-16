import "./StateMessage.css";

function StateMessage({
  icon = "ℹ️",
  title = "Informazione",
  description = "",
  type = "info",
}) {
  return (
    <div className={`state-message state-message-${type}`}>
      <div className="state-message-icon">{icon}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default StateMessage;