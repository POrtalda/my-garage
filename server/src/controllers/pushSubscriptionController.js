const PushSubscription = require("../models/PushSubscription");
const {
  getPublicVapidKey,
  sendPushNotification,
} = require("../utils/pushNotifications");

const getVapidPublicKey = (req, res) => {
  try {
    res.json({
      publicKey: getPublicVapidKey(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Configurazione notifiche push non disponibile.",
    });
  }
};

const savePushSubscription = async (req, res) => {
  const { endpoint, keys } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({
      message: "Subscription push non valida.",
    });
  }

  const subscription = await PushSubscription.findOneAndUpdate(
    { endpoint },
    {
      user: req.user._id,
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      userAgent: req.headers["user-agent"] || "",
      isActive: true,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    message: "Notifiche push attivate su questo dispositivo.",
    subscription: {
      id: subscription._id,
      endpoint: subscription.endpoint,
      isActive: subscription.isActive,
    },
  });
};

const deletePushSubscription = async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({
      message: "Endpoint subscription mancante.",
    });
  }

  await PushSubscription.findOneAndUpdate(
    {
      user: req.user._id,
      endpoint,
    },
    {
      isActive: false,
    }
  );

  res.json({
    message: "Notifiche push disattivate su questo dispositivo.",
  });
};

const sendTestPushNotification = async (req, res) => {
  const subscriptions = await PushSubscription.find({
    user: req.user._id,
    isActive: true,
  });

  if (subscriptions.length === 0) {
    return res.status(404).json({
      message: "Nessuna subscription push attiva trovata per questo utente.",
    });
  }

  const payload = {
    title: "My Garage",
    body: "Notifica di test attiva: il tuo dispositivo può ricevere avvisi.",
    url: "/impostazioni",
  };

  const summary = {
    subscriptionsFound: subscriptions.length,
    sent: 0,
    failed: 0,
    disabled: 0,
    failures: [],
  };

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await sendPushNotification(subscription, payload);

        subscription.lastUsedAt = new Date();
        await subscription.save();

        summary.sent += 1;
      } catch (error) {
        summary.failed += 1;

        const statusCode = error.statusCode || error.status;

        summary.failures.push({
          endpoint: subscription.endpoint,
          statusCode,
          message: error.message,
        });

        if (statusCode === 404 || statusCode === 410) {
          subscription.isActive = false;
          await subscription.save();
          summary.disabled += 1;
        }
      }
    })
  );

  res.json({
    message: "Test notifiche push completato.",
    summary,
  });
};

module.exports = {
  getVapidPublicKey,
  savePushSubscription,
  deletePushSubscription,
  sendTestPushNotification,
};
