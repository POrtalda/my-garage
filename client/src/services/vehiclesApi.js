const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const storedAuth = localStorage.getItem("my-garage-auth");

  if (!storedAuth) {
    return {};
  }

  try {
    const auth = JSON.parse(storedAuth);

    if (!auth.token) {
      return {};
    }

    return {
      Authorization: `Bearer ${auth.token}`,
    };
  } catch (error) {
    console.error("Errore lettura token auth:", error);
    return {};
  }
}

function toFrontendVehicle(vehicle) {
  return {
    ...vehicle,
    id: vehicle.id || vehicle._id,
    scadenza_bollo: vehicle.scadenza_bollo || vehicle.taxExpiry,
    scadenza_assicurazione:
      vehicle.scadenza_assicurazione || vehicle.insuranceExpiry,
    scadenza_revisione: vehicle.scadenza_revisione || vehicle.inspectionExpiry,
    img_url: vehicle.img_url || vehicle.imgUrl || "",
  };
}

function toApiVehicle(vehicle) {
  return {
    brand: vehicle.brand,
    model: vehicle.model,
    plate: vehicle.plate || "N/D",
    imgUrl: vehicle.img_url || "",
    taxExpiry: vehicle.scadenza_bollo,
    insuranceExpiry: vehicle.scadenza_assicurazione,
    inspectionExpiry: vehicle.scadenza_revisione,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Errore durante la richiesta API");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getVehicles() {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = await handleResponse(response);

  return result.data.map((vehicle) => toFrontendVehicle(vehicle));
}

export async function getVehicleById(id) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = await handleResponse(response);

  return toFrontendVehicle(result.data);
}

export async function createVehicle(vehicleData) {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(toApiVehicle(vehicleData)),
  });

  const result = await handleResponse(response);

  return toFrontendVehicle(result.data);
}

export async function updateVehicle(id, vehicleData) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(toApiVehicle(vehicleData)),
  });

  const result = await handleResponse(response);

  return toFrontendVehicle(result.data);
}

export async function deleteVehicle(id) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}
