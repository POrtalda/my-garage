const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class PlateLookupApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "PlateLookupApiError";
    this.status = status;
    this.data = data;
  }
}

const getAuthToken = () => {
  const storedAuth = localStorage.getItem("my-garage-auth");

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth).token;
  } catch (error) {
    return null;
  }
};

export const lookupVehicleByPlate = async (plate) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/vehicles/lookup-by-plate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ plate }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new PlateLookupApiError(
      data.message || "Errore durante la ricerca dati da targa.",
      response.status,
      data
    );
  }

  return data;
};
