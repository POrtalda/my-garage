import { parseDate } from "./vehicleDates";

const expiryFields = [
  {
    label: "Bollo",
    dateField: "scadenza_bollo",
    expiredField: "expired_car_tax",
    expiringField: "expiring_car_tax",
  },
  {
    label: "Assicurazione",
    dateField: "scadenza_assicurazione",
    expiredField: "expired_insurance",
    expiringField: "expiring_insurance",
  },
  {
    label: "Revisione",
    dateField: "scadenza_revisione",
    expiredField: "expired_revision",
    expiringField: "expiring_revision",
  },
];

function formatDate(dateString) {
  const date = parseDate(dateString);

  if (!date) {
    return "";
  }

  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDaysFromToday(dateString) {
  const date = parseDate(dateString);

  if (!date) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function getVehicleName(vehicle) {
  return [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
}

export function getVehicleExpiryItems(vehicle) {
  return expiryFields
    .map((field) => {
      const dateValue = vehicle[field.dateField];
      const daysFromToday = getDaysFromToday(dateValue);
      const isExpired = Boolean(vehicle[field.expiredField]);
      const isExpiring = Boolean(vehicle[field.expiringField]);

      let status = "ok";

      if (isExpired) {
        status = "expired";
      } else if (isExpiring) {
        status = "expiring";
      }

      return {
        label: field.label,
        date: dateValue,
        formattedDate: formatDate(dateValue),
        daysFromToday,
        status,
        vehicle,
        vehicleName: getVehicleName(vehicle),
      };
    })
    .filter((item) => item.date);
}

export function getMostRelevantVehicleExpiry(vehicle) {
  const items = getVehicleExpiryItems(vehicle);

  if (items.length === 0) {
    return {
      status: "missing",
      text: "Scadenze non inserite",
    };
  }

  const sortedItems = [...items].sort((itemA, itemB) => {
    const priorityA =
      itemA.status === "expired" ? 0 : itemA.status === "expiring" ? 1 : 2;
    const priorityB =
      itemB.status === "expired" ? 0 : itemB.status === "expiring" ? 1 : 2;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return itemA.daysFromToday - itemB.daysFromToday;
  });

  const firstItem = sortedItems[0];

  if (firstItem.status === "expired") {
    return {
      status: "expired",
      text: `Scaduta: ${firstItem.label}`,
    };
  }

  if (firstItem.status === "expiring") {
    return {
      status: "expiring",
      text: `In scadenza: ${firstItem.label} · ${firstItem.formattedDate}`,
    };
  }

  return {
    status: "ok",
    text: `Prossima scadenza: ${firstItem.label} · ${firstItem.formattedDate}`,
  };
}

export function getPriorityExpiryItems(vehicles, limit = 3) {
  return vehicles
    .flatMap((vehicle) =>
      getVehicleExpiryItems(vehicle).filter(
        (item) => item.status === "expired" || item.status === "expiring"
      )
    )
    .sort((itemA, itemB) => {
      const priorityA = itemA.status === "expired" ? 0 : 1;
      const priorityB = itemB.status === "expired" ? 0 : 1;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return itemA.daysFromToday - itemB.daysFromToday;
    })
    .slice(0, limit);
}
