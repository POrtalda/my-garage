import { useMemo } from "react";
import { useNavigate } from "react-router";

const cards = {
  total: {
    label: "Veicoli totali",
    caption: "Registrati nel garage",
    icon: "\u{1F697}",
    bar: "from-blue-500 to-cyan-400",
    iconBox:
      "bg-blue-500/12 text-blue-700 dark:bg-blue-400/16 dark:text-blue-200",
    border:
      "border-blue-500/15 hover:border-blue-500/30 dark:border-blue-400/15 dark:hover:border-blue-300/25",
  },
  expired: {
    label: "Scaduti",
    caption: "Richiedono attenzione",
    icon: "\u26A0\uFE0F",
    bar: "from-red-500 to-orange-400",
    iconBox:
      "bg-red-500/12 text-red-700 dark:bg-red-400/16 dark:text-red-200",
    border:
      "border-red-500/15 hover:border-red-500/30 dark:border-red-400/15 dark:hover:border-red-300/25",
  },
  expiring: {
    label: "In scadenza",
    caption: "Da controllare presto",
    icon: "\u23F3",
    bar: "from-amber-500 to-yellow-400",
    iconBox:
      "bg-amber-500/14 text-amber-700 dark:bg-amber-300/16 dark:text-amber-200",
    border:
      "border-amber-500/20 hover:border-amber-500/35 dark:border-amber-300/15 dark:hover:border-amber-300/25",
  },
};

export default function DashboardSummary({ vehicles }) {
  const navigate = useNavigate();

  const goToVehicleList = (path) => {
    navigate(path, { state: { scrollToVehicles: true } });
  };

  const dashboardSummary = useMemo(() => {
    const safeVehicles = vehicles ?? [];

    return {
      total: safeVehicles.length,
      expired: safeVehicles.filter(
        (vehicle) =>
          vehicle.expired_car_tax ||
          vehicle.expired_insurance ||
          vehicle.expired_revision
      ).length,
      expiring: safeVehicles.filter(
        (vehicle) =>
          vehicle.expiring_car_tax ||
          vehicle.expiring_insurance ||
          vehicle.expiring_revision
      ).length,
    };
  }, [vehicles]);

  const items = [
    { type: "total", value: dashboardSummary.total, path: "/" },
    { type: "expired", value: dashboardSummary.expired, path: "/expired" },
    {
      type: "expiring",
      value: dashboardSummary.expiring,
      path: "/expiring",
    },
  ];

  return (
    <section
      className="mx-auto mb-4 w-[min(100%-2rem,1120px)] motion-safe:animate-[dashboard-fade-up_0.35s_ease_both] max-[768px]:w-[min(100%-1.5rem,600px)]"
      aria-label="Riepilogo veicoli"
    >
      <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1">
        {items.map(({ type, value, path }) => {
          const card = cards[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => goToVehicleList(path)}
              className={[
                "group relative overflow-hidden rounded-[22px] border p-4 text-left transition-[transform,box-shadow,border-color] duration-200",
                "!bg-white !text-slate-900 shadow-[0_14px_32px_rgba(15,23,42,0.09)]",
                "hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(15,23,42,0.14)]",
                "dark:!bg-slate-900/90 dark:!text-slate-50 dark:shadow-[0_16px_36px_rgba(0,0,0,0.32)] dark:hover:shadow-[0_22px_46px_rgba(0,0,0,0.42)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                card.border,
              ].join(" ")}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.bar}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[0.74rem] font-black uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                    {card.label}
                  </span>

                  <strong className="mt-2 block text-[2.2rem] leading-none tracking-[-0.05em] text-slate-900 dark:text-white">
                    {value}
                  </strong>

                  <span className="mt-2 block text-[0.85rem] font-semibold text-slate-600 dark:text-slate-400">
                    {card.caption}
                  </span>
                </div>

                <span
                  className={`inline-flex size-11 items-center justify-center rounded-2xl text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${card.iconBox}`}
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
