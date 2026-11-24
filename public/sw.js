self.addEventListener("push", (event) => {
  let payload = { title: "Honey", body: "Whenever you are ready, a gentle check-in is waiting." };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // keep defaults
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "Honey", {
      body: payload.body,
      icon: "/favicon.ico",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/today"));
});
