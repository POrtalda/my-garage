import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({
  isDarkMode = false,
  vehicleName,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="delete-modal-backdrop" role="presentation">
      <div
        className={isDarkMode ? "delete-modal dark" : "delete-modal light"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="delete-modal-icon">🗑️</div>

        <h3 id="delete-modal-title">Eliminare questo veicolo?</h3>

        <p>
          Stai per eliminare <strong>{vehicleName}</strong>. Questa azione non
          può essere annullata.
        </p>

        <div className="delete-modal-actions">
          <button type="button" onClick={onCancel}>
            Annulla
          </button>
          <button type="button" className="btn-delete" onClick={onConfirm}>
            Conferma eliminazione
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;