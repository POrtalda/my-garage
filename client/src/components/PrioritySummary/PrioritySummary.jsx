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

  const itemClassName = (status) =>
    [
      "flex min-w-0 flex-col gap-1 rounded-[18px] border border-slate-900/8 bg-white/75 p-[0.85rem] text-slate-800 no-underline shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-200",
      "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]",
      "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      "dark:border-white/8 dark:bg-white/6 dark:text-slate-50 dark:shadow-[0_10px_22px_rgba(0,0,0,0.28)]",
      status === "expired"
        ? "[&_.priority-status]:bg-red-500/12 [&_.priority-status]:text-red-700 dark:[&_.priority-status]:text-red-300"
        : "[&_.priority-status]:bg-orange-500/14 [&_.priority-status]:text-orange-700 dark:[&_.priority-status]:text-orange-300",
    ].join(" ");

  return (
    <section className="mx-auto mb-[1.35rem] w-full max-w-[1040px] rounded-3xl border border-slate-900/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,247,237,0.9))] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.76)] dark:border-white/8 dark:bg-[linear-gradient(135deg,rgba(47,47,66,0.98),rgba(41,38,51,0.94))] dark:shadow-[0_16px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.06)] max-[768px]:mb-[1.15rem] max-[768px]:w-[calc(100%-2rem)] max-[480px]:w-[calc(100%-1.5rem)] max-[480px]:rounded-[20px] max-[480px]:p-[0.9rem]">
      <div className="mb-[0.85rem] flex items-center justify-between gap-4 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3">
        <div>
          <span className="text-[0.74rem] font-black uppercase tracking-[0.1em] text-orange-500">
            Priorità
          </span>

          <h2 className="mb-0 mt-[0.2rem] text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.15] tracking-[-0.03em] text-slate-800 dark:text-slate-50">
            Da controllare ora
          </h2>
        </div>

        <Link
          to={linkTarget}
          className="shrink-0 rounded-full bg-orange-500/12 px-[0.8rem] py-[0.55rem] text-[0.82rem] font-black text-orange-700 no-underline dark:bg-amber-300/14 dark:text-amber-300 max-[480px]:w-full max-[480px]:text-center"
        >
          {linkLabel}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 max-[768px]:grid-cols-1">
        {priorityItems.map((item) => (
          <Link
            key={`${item.vehicle.id || item.vehicle._id}-${item.label}`}
            to={`/details/${item.vehicle.id || item.vehicle._id}`}
            className={itemClassName(item.status)}
          >
            <span className="priority-status w-fit rounded-full px-2 py-[0.22rem] text-[0.68rem] font-black uppercase tracking-[0.06em]">
              {item.status === "expired" ? "Scaduta" : "In scadenza"}
            </span>

            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.98rem] leading-[1.2]">
              {item.vehicleName}
            </strong>

            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.85rem] font-bold text-slate-500 dark:text-[#b7c3cf]">
              {item.label}
              {item.formattedDate ? ` · ${item.formattedDate}` : ""}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
