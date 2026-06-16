const daysBeforeExpiry = 30;

export function parseDate(dateString) {
  if (!dateString) return null;
  if (dateString.includes("-")) return new Date(dateString);

  const parts = dateString.split(/[./-]/).map((p) => parseInt(p, 10));
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

export function checkStatus(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = parseDate(dateString);
  if (!expiryDate) return { expired: false, expiring: false };
  if (expiryDate < today) return { expired: true, expiring: false };

  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays <= daysBeforeExpiry) {
    return { expired: false, expiring: true };
  }

  return { expired: false, expiring: false };
}

export function addExpiryFlags(vehicle) {
  const carTax = checkStatus(vehicle.scadenza_bollo);
  const insurance = checkStatus(vehicle.scadenza_assicurazione);
  const revision = checkStatus(vehicle.scadenza_revisione);

  return {
    ...vehicle,
    expired_car_tax: carTax.expired,
    expired_insurance: insurance.expired,
    expired_revision: revision.expired,
    expiring_car_tax: carTax.expiring,
    expiring_insurance: insurance.expiring,
    expiring_revision: revision.expiring,
  };
}