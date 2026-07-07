import { parseDate } from "./vehicleDates";

export function getVehicleUrgencyRank(vehicle) {
  if (
    vehicle.expired_car_tax ||
    vehicle.expired_insurance ||
    vehicle.expired_revision
  ) {
    return 0;
  }

  if (
    vehicle.expiring_car_tax ||
    vehicle.expiring_insurance ||
    vehicle.expiring_revision
  ) {
    return 1;
  }

  const hasAnyDeadline =
    vehicle.scadenza_bollo ||
    vehicle.scadenza_assicurazione ||
    vehicle.scadenza_revisione;

  return hasAnyDeadline ? 2 : 3;
}

export function getNearestDeadlineTime(vehicle) {
  const deadlineDates = [
    vehicle.scadenza_bollo,
    vehicle.scadenza_assicurazione,
    vehicle.scadenza_revisione,
  ]
    .map((date) => parseDate(date))
    .filter(Boolean)
    .map((date) => date.getTime());

  if (deadlineDates.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.min(...deadlineDates);
}

export function sortVehiclesByUrgency(vehiclesToSort) {
  return [...vehiclesToSort].sort((vehicleA, vehicleB) => {
    const urgencyDiff =
      getVehicleUrgencyRank(vehicleA) - getVehicleUrgencyRank(vehicleB);

    if (urgencyDiff !== 0) {
      return urgencyDiff;
    }

    const deadlineDiff =
      getNearestDeadlineTime(vehicleA) - getNearestDeadlineTime(vehicleB);

    if (deadlineDiff !== 0) {
      return deadlineDiff;
    }

    const brandA = vehicleA.brand || "";
    const brandB = vehicleB.brand || "";
    const brandDiff = brandA.localeCompare(brandB, "it", {
      sensitivity: "base",
    });

    if (brandDiff !== 0) {
      return brandDiff;
    }

    const modelA = vehicleA.model || "";
    const modelB = vehicleB.model || "";

    return modelA.localeCompare(modelB, "it", { sensitivity: "base" });
  });
}
