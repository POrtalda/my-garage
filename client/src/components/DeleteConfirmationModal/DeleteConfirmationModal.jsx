function DeleteConfirmationModal({
  isDarkMode = false,
  vehicleName,
  onCancel,
  onConfirm,
}) {
  const modalClassName = [
    "w-full max-w-[420px] rounded-[18px] p-7 text-center shadow-[0_18px_45px_rgba(0,0,0,0.25)]",
    "max-[600px]:rounded-[18px_18px_14px_14px] max-[600px]:p-[1.35rem]",
    isDarkMode
      ? "bg-slate-800 text-slate-50"
      : "bg-white text-[#213547]",
  ].join(" ");

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/55 p-4 max-[600px]:items-end max-[600px]:p-3"
      role="presentation"
    >
      <div
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="mb-3 text-[2.5rem] leading-none max-[600px]:mb-[0.6rem] max-[600px]:text-[2.2rem]">
          🗑️
        </div>

        <h3
          id="delete-modal-title"
          className="mb-3 mt-0 text-[1.35rem] font-bold max-[600px]:text-[1.2rem]"
        >
          Eliminare questo veicolo?
        </h3>

        <p className="m-0 leading-6 opacity-85 max-[600px]:text-[0.95rem]">
          Stai per eliminare <strong>{vehicleName}</strong>. Questa azione non
          può essere annullata.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 max-[600px]:mt-5 max-[600px]:flex-col-reverse max-[600px]:gap-[0.65rem]">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600/35 max-[600px]:w-full max-[600px]:text-base"
            onClick={onCancel}
          >
            Annulla
          </button>

          <button
            type="button"
            className="rounded-xl border border-red-600 bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600/35 max-[600px]:w-full max-[600px]:text-base"
            onClick={onConfirm}
          >
            Conferma eliminazione
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
