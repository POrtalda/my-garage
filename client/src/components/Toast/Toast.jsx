function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  const toastClassName = [
    "fixed bottom-6 right-6 z-[1000] flex w-[calc(100%-2rem)] max-w-[360px] items-start justify-between gap-[0.9rem] rounded-[18px] border px-[1.1rem] py-4 shadow-[0_18px_40px_rgba(15,23,42,0.22)]",
    "motion-safe:animate-[toast-slide-in_0.25s_ease-out]",
    "max-[600px]:bottom-4 max-[600px]:right-4 max-[600px]:max-w-none",
    toast.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
      : "",
    toast.type === "error"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200"
      : "",
    toast.type === "info"
      ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-200"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={toastClassName} role="status" aria-live="polite">
      <div>
        <strong className="mb-1 block text-[0.95rem]">{toast.title}</strong>

        {toast.message && (
          <p className="m-0 text-[0.9rem] leading-[1.4]">{toast.message}</p>
        )}
      </div>

      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0 text-[1.4rem] leading-none text-inherit"
        onClick={onClose}
        aria-label="Chiudi notifica"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
