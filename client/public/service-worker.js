self.addEventListener("push", (event) => {
  let payload = {
    title: "My Garage",
    body: "Hai nuove notifiche sulle scadenze dei tuoi veicoli.",
    url: "/",
  };

  if (event.data) {
    try {
      payload = {
        ...payload,
        ...event.data.json(),
      };
    } catch (error) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: "/vite.svg",
    badge: "/vite.svg",
    data: {
      url: payload.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "My Garage", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});
