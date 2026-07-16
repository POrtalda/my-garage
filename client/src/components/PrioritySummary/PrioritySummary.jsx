import { Link } from "react-router";
import { getPriorityExpiryItems } from "../../utils/vehicleExpirySummary";

export default function PrioritySummary({ vehicles }) {
  const priorityItems = getPriorityExpiryItems(vehicles, 3);

  if (priorityItems.length === 0) {
    return null;
  }

  const hasExpired = priorityItems.some((item) => item.status === "expired");
  const linkTarget = hasExpired ? "/expired" : "/expiring";
  const linkLabel = hasExpired ? "Vedi scaduti" : "Vedi in scadenza";

  return (
    <section className="mx-auto mb-5 w-[min(100%-2rem,1120px)] rounded-[26px] border border-slate-400/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,237,0.9))] p-5 shadow-[0_16px_38px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.98),rgba(41,37,36,0.94))] dark:shadow-[0_18px_42px_rgba(0,0,0,0.34)] max-[768px]:w-[min(100%-1.5rem,600px)] max-[480px]:rounded-[22px] max-[480px]:p-4">
      <div className="mb-4 flex items-center justify-between gap-4 max-[520px]:flex-col max-[520px]:items-start">
        <div>
          <span className="text-[0.74rem] font-black uppercase tracking-[0.1em] text-orange-500">
            Priorità
          </span>

          <h2 className="mt-1 mb-0 text-[clamp(1.2rem,2vw,1.55rem)] tracking-[-0.035em] text-slate-900 dark:text-slate-50">
            Da controllare ora
          </h2>
        </div>

        <Link
          to={linkTarget}
          className="shrink-0 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-[0.82rem] font-black text-orange-700 no-underline transition hover:-translate-y-px hover:bg-orange-500/15 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200 max-[520px]:w-full max-[520px]:text-center motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {linkLabel}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 max-[768px]:grid-cols-1">
        {priorityItems.map((item) => {
          const isExpired = item.status === "expired";

          return (
            <Link
              key={`${item.vehicle.id || item.vehicle._id}-${item.label}`}
              to={`/details/${item.vehicle.id || item.vehicle._id}`}
              className="group flex min-w-0 flex-col gap-2 rounded-[20px] border border-slate-400/20 bg-white/80 p-4 text-slate-900 no-underline shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-50 dark:shadow-[0_12px_26px_rgba(0,0,0,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.06em] ${
                  isExpired
                    ? "bg-red-500/10 text-red-700 dark:bg-red-400/15 dark:text-red-200"
                    : "bg-amber-500/15 text-amber-700 dark:bg-amber-300/15 dark:text-amber-200"
                }`}
              >
                {isExpired ? "Scaduta" : "In scadenza"}
              </span>

              <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] leading-tight">
                {item.vehicleName}
              </strong>

              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.85rem] font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
                {item.formattedDate ? ` · ${item.formattedDate}` : ""}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
