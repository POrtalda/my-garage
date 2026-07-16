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
    "border-red-600/15 bg-red-50/90 dark:border-red-400/20 dark:bg-red-500/10",
  expiring:
    "border-amber-500/20 bg-amber-50/90 dark:border-amber-300/20 dark:bg-amber-500/10",
};

const trafficDotStyles = {
  red:
    "bg-[var(--color-danger)] shadow-[0_0_0_4px_rgba(220,38,38,0.14),0_0_12px_rgba(220,38,38,0.58)]",
  orange:
    "bg-[var(--color-warning)] shadow-[0_0_0_4px_rgba(245,158,11,0.14),0_0_12px_rgba(245,158,11,0.58)]",
  green:
    "bg-[var(--color-success)] shadow-[0_0_0_4px_rgba(22,163,74,0.14),0_0_12px_rgba(22,163,74,0.58)]",
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
    <article className="group relative isolate flex w-full overflow-hidden rounded-[24px] border border-slate-300/20 bg-white/90 text-[var(--color-text)] shadow-[0_14px_34px_rgba(15,23,42,0.09)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-[0_20px_44px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-slate-900/88 dark:text-slate-50 dark:shadow-[0_16px_38px_rgba(0,0,0,0.34)] dark:hover:border-blue-300/15 dark:hover:shadow-[0_22px_48px_rgba(0,0,0,0.44)] motion-safe:animate-[vehicle-card-in_0.35s_ease_both] motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[600px]:rounded-[20px]">
      <Link
        to={`/details/${vehicle.id || vehicle._id}`}
        className="flex h-full w-full flex-col text-inherit no-underline"
      >
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-950/50">
          {vehicle.img_url ? (
            <img
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100 max-[380px]:h-40"
              src={vehicle.img_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(226,232,240,0.8))] text-slate-400 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] dark:text-slate-500 max-[380px]:h-40">
              <span className="text-5xl" aria-hidden="true">
                {"\u{1F697}"}
              </span>
            </div>
          )}

          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/72 px-2.5 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.22)] backdrop-blur-md"
            aria-label={`Stato veicolo: ${vehicleStatus}`}
          >
            {["red", "orange", "green"].map((status) => (
              <span
                key={status}
                className={`size-2.5 rounded-full bg-slate-600 ${
                  vehicleStatus === status ? trafficDotStyles[status] : ""
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 max-[380px]:p-3.5">
          <div>
            <span className="text-[0.7rem] font-black uppercase tracking-[0.09em] text-blue-600 dark:text-blue-300">
              Veicolo
            </span>

            <h2 className="mt-1 mb-0 text-[1.3rem] font-black leading-tight tracking-[-0.035em]">
              {vehicle.brand}
            </h2>

            <h3 className="mt-1 mb-0 text-[0.9rem] font-extrabold uppercase tracking-[0.04em] text-[var(--color-text-muted)] dark:text-slate-400">
              {vehicle.model}
            </h3>
          </div>

          {showNextExpiry && (
            <p
              className={`mt-3 mb-0 rounded-2xl px-3 py-2.5 text-[0.8rem] font-extrabold leading-[1.35] ${
                nextExpiryStyles[nextExpiry.status] ||
                "bg-slate-900/5 text-[var(--color-text-soft)] dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {nextExpiry.text}
            </p>
          )}

          {expiryReasons.length > 0 && (
            <div
              className={`mt-3 rounded-2xl border p-3 ${expiryReasonStyles[expiryView]}`}
            >
              <span className="block text-[0.68rem] font-black uppercase tracking-[0.08em] text-[var(--color-text-soft)] dark:text-slate-300">
                {expiryLabel}
              </span>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {expiryReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-white/85 px-2.5 py-1 text-[0.75rem] font-extrabold text-slate-700 shadow-[0_4px_10px_rgba(15,23,42,0.06)] dark:bg-white/10 dark:text-slate-100"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1.5 text-[0.82rem] font-black text-blue-600 transition-transform duration-200 group-hover:translate-x-1 dark:text-blue-300 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
              Apri dettagli
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
