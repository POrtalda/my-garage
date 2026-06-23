import "./Toast.css";

function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <div className="toast-content">
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Chiudi notifica"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;