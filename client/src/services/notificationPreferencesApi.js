const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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
    localStorage.removeItem("my-garage-auth");
    return {};
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new ApiError(
      errorData?.message || "Errore durante la richiesta API",
      response.status
    );
  }

  return response.json();
}

export async function getNotificationPreferences() {
  const response = await fetch(
    `${API_BASE_URL}/auth/me/notification-preferences`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(response);
}

export async function updateNotificationPreferences({ weeklyExpiryEmail }) {
  const response = await fetch(
    `${API_BASE_URL}/auth/me/notification-preferences`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        weeklyExpiryEmail,
      }),
    }
  );

  return handleResponse(response);
}
