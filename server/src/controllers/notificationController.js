const PushSubscription = require("../models/PushSubscription");
const { sendPushNotification } = require("../utils/pushNotifications");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const NotificationLog = require("../models/NotificationLog");
const { sendEmail } = require("../utils/email");
const {
  buildExpiryAlertsForVehicles,
  getAlertText,
} = require("../utils/expiryAlerts");

const WEEKLY_EXPIRY_EMAIL_TYPE = "weekly-expiry-email";

const sendWeeklyPushNotifications = async (user, alerts, summary) => {
  const subscriptions = await PushSubscription.find({
    user: user._id,
    isActive: true,
  });

  if (subscriptions.length === 0) {
    summary.pushSkippedNoSubscription += 1;
    return;
  }

  const expiredCount = alerts.filter(
    (alert) => alert.status === "expired"
  ).length;

  const expiringCount = alerts.filter(
    (alert) => alert.status === "expiring"
  ).length;

  const bodyParts = [];

  if (expiredCount > 0) {
    bodyParts.push(`${expiredCount} scadenze già scadute`);
  }

  if (expiringCount > 0) {
    bodyParts.push(`${expiringCount} scadenze in arrivo`);
  }

  const payload = {
    title: "My Garage - Scadenze veicoli",
    body:
      bodyParts.length > 0
        ? `Hai ${bodyParts.join(" e ")} da controllare.`
        : "Hai scadenze veicoli da controllare.",
    url: "/",
  };

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await sendPushNotification(subscription, payload);

        subscription.lastUsedAt = new Date();
        await subscription.save();

        summary.pushSent += 1;
      } catch (error) {
        summary.pushFailed += 1;

        const statusCode = error.statusCode || error.status;

        summary.failures.push({
          user: user.email,
          channel: "push",
          endpoint: subscription.endpoint,
          statusCode,
          message: error.message,
        });

        if (statusCode === 404 || statusCode === 410) {
          subscription.isActive = false;
          await subscription.save();
          summary.pushDisabledSubscriptions += 1;
        }
      }
    })
  );
};

function getCurrentWeekKey(date = new Date()) {
  const currentDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const dayNumber = currentDate.getUTCDay() || 7;
  currentDate.setUTCDate(currentDate.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);

  return `${currentDate.getUTCFullYear()}-W${String(weekNumber).padStart(
    2,
    "0"
  )}`;
}

function buildWeeklyEmailText({ user, alerts }) {
  const alertLines = alerts.map((alert) => `- ${getAlertText(alert)}`);

  return [
    `Ciao ${user.name},`,
    "",
    "ecco il riepilogo settimanale delle scadenze da controllare su My Garage:",
    "",
    ...alertLines,
    "",
    "Accedi a My Garage per controllare e aggiornare le tue scadenze.",
    "",
    "Se non vuoi più ricevere queste email, puoi disattivarle dalle impostazioni del tuo account.",
    "",
    "A presto,",
    "My Garage",
  ].join("\n");
}

function checkCronSecret(req, res) {
  const configuredSecret = process.env.INTERNAL_CRON_SECRET;
  const headerSecret = req.get("x-cron-secret");
  const authorizationHeader = req.get("authorization");

  const bearerSecret = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.replace("Bearer ", "").trim()
    : null;

  const requestSecret = headerSecret || bearerSecret;

  if (!configuredSecret) {
    res.status(500).json({
      message: "INTERNAL_CRON_SECRET non configurato.",
    });
    return false;
  }

  if (!requestSecret || requestSecret !== configuredSecret) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return false;
  }

  return true;
}

async function sendWeeklyExpiryEmails(req, res) {
  if (!checkCronSecret(req, res)) {
    return;
  }

  try {
    const periodKey = getCurrentWeekKey();

    const users = await User.find().select("name email notifications");

    const summary = {
      periodKey,
      usersChecked: users.length,
      emailsSent: 0,
      skippedNoAlerts: 0,
      skippedAlreadySent: 0,
      skippedDisabled: 0,
      failed: 0,
      pushSent: 0,
      pushFailed: 0,
      pushSkippedNoSubscription: 0,
      pushDisabledSubscriptions: 0,
      failures: [],
    };

    for (const user of users) {
      const weeklyEmailEnabled =
        user.notifications?.weeklyExpiryEmail?.enabled !== false;

      if (!weeklyEmailEnabled) {
        summary.skippedDisabled += 1;
        continue;
      }

      const vehicles = await Vehicle.find({ user: user._id });
      const alerts = buildExpiryAlertsForVehicles(vehicles);

      if (alerts.length === 0) {
        summary.skippedNoAlerts += 1;
        continue;
      }

      const existingLog = await NotificationLog.findOne({
        user: user._id,
        type: WEEKLY_EXPIRY_EMAIL_TYPE,
        periodKey,
      });

      if (existingLog) {
        summary.skippedAlreadySent += 1;
        continue;
      }

      try {
        await sendEmail({
          to: user.email,
          subject: "My Garage - riepilogo scadenze veicoli",
          text: buildWeeklyEmailText({ user, alerts }),
        });

        await sendWeeklyPushNotifications(user, alerts, summary);

        await NotificationLog.create({
          user: user._id,
          type: WEEKLY_EXPIRY_EMAIL_TYPE,
          periodKey,
          alertCount: alerts.length,
        });

        summary.emailsSent += 1;
      } catch (error) {
        summary.failed += 1;
        summary.failures.push({
          userId: user._id,
          email: user.email,
          channel: "weekly-expiry-notification",
          message: error.message,
        });
      }
    }

    res.json({
      message: "Controllo notifiche settimanali completato.",
      summary,
    });
  } catch (error) {
    console.error("Errore notifiche settimanali:", error);

    res.status(500).json({
      message: "Errore durante l'invio delle notifiche settimanali.",
    });
  }
}

module.exports = {
  sendWeeklyExpiryEmails,
};
