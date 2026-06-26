import {
  deletePushSubscription,
  getVapidPublicKey,
  savePushSubscription,
} from "../services/pushNotificationsApi";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
};

export const isPushSupported = () => {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
};

export const getCurrentPushSubscription = async () => {
  if (!isPushSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration();

  if (!registration) {
    return null;
  }

  return registration.pushManager.getSubscription();
};

export const enablePushNotifications = async () => {
  if (!isPushSupported()) {
    throw new Error("Le notifiche push non sono supportate da questo browser.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permesso notifiche non concesso.");
  }

  const registration = await navigator.serviceWorker.register("/service-worker.js");

  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    await savePushSubscription(existingSubscription.toJSON());
    return existingSubscription;
  }

  const { publicKey } = await getVapidPublicKey();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await savePushSubscription(subscription.toJSON());

  return subscription;
};

export const disablePushNotifications = async () => {
  const subscription = await getCurrentPushSubscription();

  if (!subscription) {
    return;
  }

  await deletePushSubscription(subscription.endpoint);
  await subscription.unsubscribe();
};
