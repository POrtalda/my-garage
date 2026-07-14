function StateMessage({
  icon = "ℹ️",
  title = "Informazione",
  description = "",
  type = "info",
  actionLabel = "",
  onAction,
}) {
  const messageClassName = [
    "mx-auto my-8 max-w-[520px] rounded-[18px] bg-white p-8 text-center text-slate-900 shadow-lg",
    "dark:bg-[#2f2f42] dark:text-slate-100 dark:shadow-black/35",
    type === "error"
      ? "border border-red-600/25 dark:border-red-300/40"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={messageClassName}>
      <div className="mb-3 text-[2.5rem] leading-none">{icon}</div>

      <h2 className="mb-2 mt-0 text-[1.4rem] font-bold">{title}</h2>

      {description && (
        <p className="m-0 leading-6 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          className="mt-5 cursor-pointer rounded-full border-0 bg-blue-600 px-5 py-3 font-bold text-white transition hover:-translate-y-px hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-600/35 dark:bg-blue-400 dark:text-slate-900"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StateMessage;
