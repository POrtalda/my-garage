const webPush = require("web-push");

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT = "mailto:myGarage-Not@hotmail.com",
} = process.env;

const isPushConfigured = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

if (isPushConfigured) {
  webPush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

const getPublicVapidKey = () => {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error("VAPID_PUBLIC_KEY non configurata.");
  }

  return VAPID_PUBLIC_KEY;
};

const sendPushNotification = async (subscription, payload) => {
  if (!isPushConfigured) {
    throw new Error("Web Push non configurato.");
  }

  return webPush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
    JSON.stringify(payload)
  );
};

module.exports = {
  getPublicVapidKey,
  sendPushNotification,
};
