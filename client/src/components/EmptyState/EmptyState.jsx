function EmptyState({
  icon = "🚗",
  title = "Nessun elemento trovato",
  description = "Non ci sono elementi da mostrare.",
}) {
  return (
    <div className="mx-auto my-8 max-w-[520px] rounded-[18px] bg-white p-8 text-center text-slate-900 shadow-lg dark:bg-[#2f2f42] dark:text-slate-100 dark:shadow-black/35">
      <div className="mb-3 text-[2.5rem] leading-none">{icon}</div>

      <h2 className="mb-2 mt-0 text-[1.4rem] font-bold">{title}</h2>

      <p className="m-0 leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
