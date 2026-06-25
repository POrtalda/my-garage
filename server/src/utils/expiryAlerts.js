const DAYS_BEFORE_EXPIRY = 30;

const expiryFields = [
  {
    key: "taxExpiry",
    label: "Bollo",
  },
  {
    key: "insuranceExpiry",
    label: "Assicurazione",
  },
  {
    key: "inspectionExpiry",
    label: "Revisione",
  },
];

function normalizeDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getDaysDifference(date) {
  const today = getToday();
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function getVehicleName(vehicle) {
  return [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Veicolo";
}

function buildExpiryAlertsForVehicle(vehicle) {
  return expiryFields
    .map((field) => {
      const date = normalizeDate(vehicle[field.key]);

      if (!date) {
        return null;
      }

      const daysDifference = getDaysDifference(date);
      const isExpired = daysDifference < 0;
      const isExpiring =
        daysDifference >= 0 && daysDifference <= DAYS_BEFORE_EXPIRY;

      if (!isExpired && !isExpiring) {
        return null;
      }

      return {
        vehicleId: vehicle._id,
        vehicleName: getVehicleName(vehicle),
        plate: vehicle.plate,
        type: field.label,
        date,
        daysDifference,
        status: isExpired ? "expired" : "expiring",
      };
    })
    .filter(Boolean);
}

function buildExpiryAlertsForVehicles(vehicles = []) {
  return vehicles
    .flatMap((vehicle) => buildExpiryAlertsForVehicle(vehicle))
    .sort((alertA, alertB) => {
      if (alertA.status !== alertB.status) {
        return alertA.status === "expired" ? -1 : 1;
      }

      return alertA.date - alertB.date;
    });
}

function formatDateIt(date) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getAlertText(alert) {
  if (alert.status === "expired") {
    return `${alert.vehicleName} - ${alert.type} scaduta il ${formatDateIt(
      alert.date
    )}`;
  }

  if (alert.daysDifference === 0) {
    return `${alert.vehicleName} - ${alert.type} in scadenza oggi`;
  }

  if (alert.daysDifference === 1) {
    return `${alert.vehicleName} - ${alert.type} in scadenza domani`;
  }

  return `${alert.vehicleName} - ${alert.type} in scadenza tra ${alert.daysDifference} giorni`;
}

module.exports = {
  buildExpiryAlertsForVehicles,
  getAlertText,
};
