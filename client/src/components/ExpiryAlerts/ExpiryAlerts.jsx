import { useMemo } from "react";
import { parseDate } from "../../utils/vehicleDates";
import "./ExpiryAlerts.css";

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

export default function ExpiryAlerts({ vehicles }) {
    const alerts = useMemo(() => buildExpiryAlerts(vehicles), [vehicles]);

    return (
        <section className="expiry-alerts" aria-label="Avvisi scadenze">
            <div className="expiry-alerts-header">
                <div>
                    <span className="expiry-alerts-kicker">Notifiche</span>
                    <h2>Avvisi scadenze</h2>
                </div>

                {alerts.length > 0 && (
                    <span className="expiry-alerts-count">{alerts.length}</span>
                )}
            </div>

            {alerts.length === 0 ? (
                <p className="expiry-alerts-empty">
                    Nessun veicolo scaduto o in scadenza. Tutto sotto controllo.
                </p>
            ) : (
                <ul className="expiry-alerts-list">
                    {alerts.map((alert) => (
                        <li
                            key={alert.id}
                            className={`expiry-alert expiry-alert--${alert.status}`}
                        >
                            <span className="expiry-alert-dot" aria-hidden="true" />

                            <div>
                                <strong>{alert.vehicleName}</strong>
                                <p>{getAlertMessage(alert)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}