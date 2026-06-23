const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function requestAuth(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Errore durante l'autenticazione.");
  }

  return result;
}

export function registerUser(userData) {
  return requestAuth("register", userData);
}

export function loginUser(credentials) {
  return requestAuth("login", credentials);
}