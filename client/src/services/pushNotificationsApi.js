const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class PushNotificationApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "PushNotificationApiError";
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

const request = async (path, options = {}) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new PushNotificationApiError(
      data.message || "Errore durante la gestione delle notifiche push.",
      response.status,
      data
    );
  }

  return data;
};

export const getVapidPublicKey = () => {
  return request("/notifications/vapid-public-key");
};

export const savePushSubscription = (subscription) => {
  return request("/notifications/push-subscriptions", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
};

export const deletePushSubscription = (endpoint) => {
  return request("/notifications/push-subscriptions", {
    method: "DELETE",
    body: JSON.stringify({ endpoint }),
  });
};
