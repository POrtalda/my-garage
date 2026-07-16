import { Link } from "react-router";
import { getMostRelevantVehicleExpiry } from "../../utils/vehicleExpirySummary";

const nextExpiryStyles = {
  expired:
    "bg-[var(--color-danger-soft)] text-[var(--color-danger-text)] dark:bg-red-500/20 dark:text-red-200",
  expiring:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning-text)] dark:bg-amber-500/20 dark:text-amber-200",
  ok:
    "bg-[var(--color-success-soft)] text-[var(--color-success-text)] dark:bg-green-500/20 dark:text-green-200",
  missing:
    "bg-slate-500/10 text-[var(--color-text-muted)] dark:bg-white/10 dark:text-slate-200",
};

const expiryReasonStyles = {
  expired:
    "border-red-600/20 bg-red-100/80 dark:border-red-400/30 dark:bg-red-500/15",
  expiring:
    "border-amber-500/25 bg-amber-100/80 dark:border-amber-300/30 dark:bg-amber-500/15",
};

const trafficDotStyles = {
  red:
    "bg-[var(--color-danger)] shadow-[0_0_0_4px_rgba(220,38,38,0.16),0_0_14px_rgba(220,38,38,0.72)]",
  orange:
    "bg-[var(--color-warning)] shadow-[0_0_0_4px_rgba(245,158,11,0.16),0_0_14px_rgba(245,158,11,0.72)]",
  green:
    "bg-[var(--color-success)] shadow-[0_0_0_4px_rgba(22,163,74,0.16),0_0_14px_rgba(22,163,74,0.72)]",
};

function getVehicleStatus(vehicle) {
  if (
    vehicle.expired_car_tax ||
    vehicle.expired_insurance ||
    vehicle.expired_revision
  ) {
    return "red";
  }

  if (
    vehicle.expiring_car_tax ||
    vehicle.expiring_insurance ||
    vehicle.expiring_revision
  ) {
    return "orange";
  }

  return "green";
}

function getExpiryReasons(vehicle, view) {
  if (view === "expired") {
    return [
      vehicle.expired_car_tax && "Bollo",
      vehicle.expired_insurance && "Assicurazione",
      vehicle.expired_revision && "Revisione",
    ].filter(Boolean);
  }

  if (view === "expiring") {
    return [
      vehicle.expiring_car_tax && "Bollo",
      vehicle.expiring_insurance && "Assicurazione",
      vehicle.expiring_revision && "Revisione",
    ].filter(Boolean);
  }

  return [];
}

export default function Vehicle({
  vehicle,
  expiryView = "",
  showNextExpiry = false,
}) {
  const vehicleStatus = getVehicleStatus(vehicle);
  const expiryReasons = getExpiryReasons(vehicle, expiryView);
  const nextExpiry = getMostRelevantVehicleExpiry(vehicle);
  const expiryLabel = expiryView === "expired" ? "Scaduto" : "In scadenza";

  return (
    <article className="group relative isolate m-0 flex w-full flex-col items-stretch justify-between gap-4 overflow-hidden rounded-[var(--radius-xl)] border border-slate-400/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94)),var(--color-surface)] p-4 text-[var(--color-text)] shadow-[var(--shadow-md),inset_0_1px_0_rgba(255,255,255,0.78)] transition-[transform,box-shadow,border-color] duration-[var(--transition-base)] before:absolute before:-right-[20%] before:-top-[35%] before:-z-10 before:h-[180px] before:w-[180px] before:rounded-full before:bg-blue-600/10 before:content-[''] before:transition-[transform,opacity] before:duration-[var(--transition-base)] hover:-translate-y-[5px] hover:border-blue-600/20 hover:shadow-[var(--shadow-lg),inset_0_1px_0_rgba(255,255,255,0.9)] hover:before:scale-[1.12] hover:before:opacity-95 dark:border-slate-400/15 dark:bg-[linear-gradient(145deg,rgba(30,41,59,0.98),rgba(15,23,42,0.96)),#0f172a] dark:text-slate-50 dark:shadow-[0_18px_38px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] dark:before:bg-blue-400/10 dark:hover:border-blue-300/20 dark:hover:shadow-[0_26px_52px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] motion-safe:animate-[vehicle-card-in_0.35s_ease_both] motion-reduce:transition-none motion-reduce:before:transition-none max-[600px]:gap-3 max-[600px]:rounded-[20px] max-[600px]:p-[0.9rem] max-[600px]:shadow-[0_10px_24px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] max-[600px]:hover:translate-y-0 max-[380px]:rounded-[18px] max-[380px]:p-[0.8rem]">
      <Link
        to={`/details/${vehicle.id || vehicle._id}`}
        className="flex h-full flex-col justify-between text-inherit no-underline"
      >
        <div className="relative z-10 text-center max-[600px]:w-full">
          <h2 className="m-0 text-center text-[1.35rem] leading-[1.2] font-bold tracking-[-0.03em] text-inherit max-[600px]:text-[1.18rem] max-[380px]:text-[1.08rem]">
            {vehicle.brand}
          </h2>

          <h3 className="mt-1 mb-0 text-center text-[0.95rem] leading-normal font-extrabold tracking-[0.04em] text-[var(--color-text-muted)] uppercase dark:text-slate-300 max-[600px]:mt-[0.2rem] max-[600px]:text-[0.8rem] max-[600px]:leading-[1.35]">
            {vehicle.model}
          </h3>

          {showNextExpiry && (
            <p
              className={`mt-3 mb-0 rounded-full px-[0.65rem] py-2 text-[0.8rem] leading-[1.25] font-extrabold max-[600px]:mt-[0.65rem] max-[600px]:px-[0.58rem] max-[600px]:py-[0.45rem] max-[600px]:text-[0.75rem] ${
                nextExpiryStyles[nextExpiry.status] ||
                "bg-slate-900/5 text-[var(--color-text-soft)] dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {nextExpiry.text}
            </p>
          )}

          {expiryReasons.length > 0 && (
            <div
              className={`mt-[0.85rem] flex flex-col items-center gap-[0.45rem] rounded-[var(--radius-lg)] border px-3 py-[0.65rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[600px]:mt-[0.65rem] max-[600px]:gap-[0.35rem] max-[600px]:rounded-2xl max-[600px]:px-[0.6rem] max-[600px]:py-[0.55rem] ${
                expiryReasonStyles[expiryView] ||
                "border-slate-400/20 bg-white/70 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <span className="text-[0.72rem] font-extrabold tracking-[0.08em] text-[var(--color-text-soft)] uppercase dark:text-slate-200 max-[600px]:text-[0.66rem]">
                {expiryLabel}
              </span>

              <div className="flex flex-wrap justify-center gap-[0.35rem]">
                {expiryReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-white/90 px-[0.55rem] py-[0.28rem] text-[0.78rem] font-extrabold text-[var(--color-text)] shadow-[0_4px_10px_rgba(15,23,42,0.08)] dark:bg-white/10 dark:text-slate-50 max-[600px]:px-[0.48rem] max-[600px]:py-[0.24rem] max-[600px]:text-[0.72rem]"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-[0.85rem] flex w-full flex-col items-center justify-center max-[600px]:mt-[0.7rem]">
          {vehicle.img_url ? (
            <img
              className="h-40 w-full max-w-60 rounded-[var(--radius-lg)] border border-slate-400/20 object-cover shadow-[0_10px_22px_rgba(15,23,42,0.12)] transition-[transform,box-shadow] duration-[var(--transition-base)] group-hover:scale-[1.015] group-hover:shadow-[0_14px_28px_rgba(15,23,42,0.16)] dark:border-white/10 dark:shadow-[0_12px_26px_rgba(0,0,0,0.34)] motion-reduce:transition-none motion-reduce:group-hover:scale-100 max-[600px]:h-40 max-[600px]:max-w-full max-[600px]:rounded-[15px] max-[380px]:h-[145px]"
              src={vehicle.img_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />
          ) : (
            <div className="flex min-h-40 w-full max-w-60 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-slate-500/40 bg-[linear-gradient(145deg,rgba(248,250,252,0.92),rgba(241,245,249,0.76))] text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/15 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] dark:text-slate-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[600px]:h-40 max-[600px]:min-h-40 max-[600px]:max-w-full max-[600px]:rounded-[15px] max-[380px]:h-[145px] max-[380px]:min-h-[145px]">
              <span
                className="text-[2.7rem] drop-shadow-[0_6px_10px_rgba(15,23,42,0.12)]"
                aria-hidden="true"
              >
                {"\u{1F697}"}
              </span>
            </div>
          )}

          <div
            className="mt-[0.9rem] flex w-fit min-w-[46px] flex-row items-center justify-center gap-[7px] rounded-full bg-[linear-gradient(145deg,#334155,#1e293b)] px-[0.7rem] py-[0.55rem] shadow-[inset_0_2px_5px_rgba(255,255,255,0.08),inset_0_-3px_8px_rgba(0,0,0,0.28),0_8px_18px_rgba(15,23,42,0.16)] max-[600px]:mt-3 max-[600px]:px-[0.62rem] max-[600px]:py-[0.48rem] max-[380px]:gap-[6px] max-[380px]:px-[0.62rem] max-[380px]:py-2"
            aria-label={`Stato veicolo: ${vehicleStatus}`}
          >
            {["red", "orange", "green"].map((status) => (
              <span
                key={status}
                className={`h-[14px] w-[14px] rounded-full border border-white/20 bg-[#20242c] shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)] max-[380px]:h-[13px] max-[380px]:w-[13px] ${
                  vehicleStatus === status ? trafficDotStyles[status] : ""
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
