import { useMemo } from "react";
import { useNavigate } from "react-router";

export default function DashboardSummary({ vehicles }) {
  const navigate = useNavigate();

  const goToVehicleList = (path) => {
    navigate(path, { state: { scrollToVehicles: true } });
  };

  const dashboardSummary = useMemo(() => {
    const safeVehicles = vehicles ?? [];
    const total = safeVehicles.length;

    const expired = safeVehicles.filter(
      (vehicle) =>
        vehicle.expired_car_tax ||
        vehicle.expired_insurance ||
        vehicle.expired_revision
    ).length;

    const expiring = safeVehicles.filter(
      (vehicle) =>
        vehicle.expiring_car_tax ||
        vehicle.expiring_insurance ||
        vehicle.expiring_revision
    ).length;

    return {
      total,
      expired,
      expiring,
    };
  }, [vehicles]);

  const cardClassName = (type = "total") =>
    [
      "relative isolate flex min-h-[92px] cursor-pointer flex-col justify-between gap-[0.55rem] overflow-hidden rounded-[20px] border border-slate-900/8 border-l-[6px] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,254,255,0.94))] px-4 py-[0.9rem] text-left font-[inherit] text-[#15313b] shadow-[0_12px_26px_rgba(0,105,92,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] transition-[transform,box-shadow,border-color] duration-200",
      "before:absolute before:-top-1/2 before:left-[54%] before:-z-10 before:h-[135px] before:w-[135px] before:rounded-full before:content-[''] before:transition-[transform,opacity] before:duration-200",
      "hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] hover:before:scale-110 hover:before:opacity-95",
      "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-teal-500/35",
      "dark:border-white/8 dark:bg-[linear-gradient(135deg,rgba(47,47,66,0.98),rgba(37,39,55,0.94))] dark:text-slate-50 dark:shadow-[0_14px_30px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.06)]",
      "dark:hover:shadow-[0_18px_38px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)]",
      "max-[560px]:min-h-0 max-[560px]:items-center max-[560px]:border-l-0 max-[560px]:border-t-[5px] max-[560px]:text-center",
      "max-[480px]:min-h-[86px] max-[480px]:rounded-[17px] max-[480px]:p-[0.8rem] max-[480px]:hover:translate-y-0",
      "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:before:transition-none",
      type === "expired"
        ? "border-l-red-500 before:bg-red-500/16 dark:border-l-red-300 max-[560px]:border-t-red-700 dark:max-[560px]:border-t-red-300"
        : "",
      type === "expiring"
        ? "border-l-orange-500 before:bg-orange-500/18 dark:border-l-amber-300 max-[560px]:border-t-amber-500 dark:max-[560px]:border-t-amber-300"
        : "",
      type === "total"
        ? "border-l-cyan-500 before:bg-teal-500/14 dark:border-l-teal-300 max-[560px]:border-t-teal-500 dark:max-[560px]:border-t-teal-300"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

  const labelClassName =
    "relative z-10 text-[0.78rem] font-extrabold uppercase leading-[1.25] tracking-[0.01em] text-slate-600 dark:text-[#b7c3cf] max-[480px]:text-[0.68rem]";

  const valueClassName =
    "relative z-10 text-[clamp(1.65rem,3vw,2.05rem)] leading-none tracking-[-0.04em] max-[480px]:text-[1.65rem]";

  return (
    <section
      className="mx-auto mb-4 mt-[0.35rem] w-full max-w-[1040px] px-4 motion-safe:animate-[dashboard-fade-up_0.35s_ease_both] max-[768px]:mt-[0.4rem] max-[768px]:max-w-[600px] max-[480px]:px-3"
      aria-label="Riepilogo veicoli"
    >
      <div className="grid grid-cols-3 gap-[0.85rem] max-[768px]:gap-[0.8rem] max-[560px]:grid-cols-1 max-[480px]:gap-[0.7rem]">
        <button
          type="button"
          className={cardClassName("total")}
          onClick={() => goToVehicleList("/")}
        >
          <span className={labelClassName}>Veicoli totali</span>
          <strong className={valueClassName}>{dashboardSummary.total}</strong>
        </button>

        <button
          type="button"
          className={cardClassName("expired")}
          onClick={() => goToVehicleList("/expired")}
        >
          <span className={labelClassName}>Scaduti</span>
          <strong className={valueClassName}>
            {dashboardSummary.expired}
          </strong>
        </button>

        <button
          type="button"
          className={cardClassName("expiring")}
          onClick={() => goToVehicleList("/expiring")}
        >
          <span className={labelClassName}>In scadenza</span>
          <strong className={valueClassName}>
            {dashboardSummary.expiring}
          </strong>
        </button>
      </div>
    </section>
  );
}
