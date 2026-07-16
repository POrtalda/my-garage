import { useMemo } from "react";
import { parseDate } from "../../utils/vehicleDates";

const expiryFields = [
    {
        key: "scadenza_bollo",
        label: "Bollo",
        expiredFlag: "expired_car_tax",
        expiringFlag: "expiring_car_tax",
    },
    {
        key: "scadenza_assicurazione",
        label: "Assicurazione",
        expiredFlag: "expired_insurance",
        expiringFlag: "expiring_insurance",
    },
    {
        key: "scadenza_revisione",
        label: "Revisione",
        expiredFlag: "expired_revision",
        expiringFlag: "expiring_revision",
    },
];

function getVehicleName(vehicle) {
    return [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Veicolo";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function getDaysDifference(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(date);
    expiryDate.setHours(0, 0, 0, 0);

    return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
}

function buildExpiryAlerts(vehicles = []) {
    return vehicles
        .flatMap((vehicle) =>
            expiryFields
                .map((field) => {
                    const date = parseDate(vehicle[field.key]);

                    if (!date) {
                        return null;
                    }

                    const isExpired = Boolean(vehicle[field.expiredFlag]);
                    const isExpiring = Boolean(vehicle[field.expiringFlag]);

                    if (!isExpired && !isExpiring) {
                        return null;
                    }

                    const daysDifference = getDaysDifference(date);

                    return {
                        id: `${vehicle.id || vehicle._id}-${field.key}`,
                        vehicleName: getVehicleName(vehicle),
                        type: field.label,
                        date,
                        daysDifference,
                        status: isExpired ? "expired" : "expiring",
                    };
                })
                .filter(Boolean)
        )
        .sort((alertA, alertB) => {
            if (alertA.status !== alertB.status) {
                return alertA.status === "expired" ? -1 : 1;
            }

            return alertA.date - alertB.date;
        })
        .slice(0, 5);
}

function getAlertMessage(alert) {
    if (alert.status === "expired") {
        return `${alert.type} scaduta il ${formatDate(alert.date)}`;
    }

    if (alert.daysDifference === 0) {
        return `${alert.type} in scadenza oggi`;
    }

    if (alert.daysDifference === 1) {
        return `${alert.type} in scadenza domani`;
    }

    return `${alert.type} in scadenza tra ${alert.daysDifference} giorni`;
}

const alertStyles = {
    expired: {
        item: "border-l-[5px] border-l-[#d32f2f]",
        dot: "bg-[#d32f2f]",
    },
    expiring: {
        item: "border-l-[5px] border-l-[#f9a825]",
        dot: "bg-[#f9a825]",
    },
};

export default function ExpiryAlerts({ vehicles }) {
    const alerts = useMemo(() => buildExpiryAlerts(vehicles), [vehicles]);

    if (alerts.length === 0) {
        return null;
    }

    return (
        <section
            className="mx-auto mb-6 w-[min(100%,960px)] rounded-[18px] bg-white p-[1.2rem] text-[#222] shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:bg-[#2f2f42] dark:text-[#f5f5f5] dark:shadow-[0_6px_16px_rgba(0,0,0,0.35)] max-[768px]:w-[calc(100%-1.5rem)] max-[768px]:max-w-[560px] max-[768px]:p-4 max-[480px]:rounded-[14px]"
            aria-label="Avvisi scadenze"
        >
            <div className="mb-4 flex items-center justify-between gap-4 max-[768px]:items-start">
                <div>
                    <span className="mb-0.5 block text-[0.8rem] font-bold uppercase tracking-[0.08em] opacity-65">
                        Notifiche
                    </span>

                    <h2 className="m-0 text-[1.35rem] font-bold max-[480px]:text-[1.15rem]">
                        Avvisi scadenze
                    </h2>
                </div>

                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#fdecea] px-[0.6rem] font-extrabold text-[#b71c1c] dark:bg-[rgba(211,47,47,0.2)] dark:text-[#ff8a80]">
                    {alerts.length}
                </span>
            </div>

            <ul className="m-0 grid list-none gap-3 p-0">
                {alerts.map((alert) => {
                    const styles = alertStyles[alert.status];

                    return (
                        <li
                            key={alert.id}
                            className={`grid grid-cols-[auto_1fr] items-start gap-3 rounded-[14px] bg-[#f7f8fb] p-[0.9rem] dark:bg-[#252536] max-[480px]:p-[0.8rem] ${styles.item}`}
                        >
                            <span
                                className={`mt-[0.35rem] h-3 w-3 rounded-full ${styles.dot}`}
                                aria-hidden="true"
                            />

                            <div>
                                <strong className="mb-[0.15rem] block">
                                    {alert.vehicleName}
                                </strong>

                                <p className="m-0 leading-[1.45] opacity-80 dark:text-[#d7d7e5] dark:opacity-100">
                                    {getAlertMessage(alert)}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
