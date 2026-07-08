const express = require("express");
const {
  sendDailyExpiryPushNotifications,
  sendWeeklyExpiryEmails,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/weekly-expiry-email", sendWeeklyExpiryEmails);
router.post("/daily-expiry-push", sendDailyExpiryPushNotifications);

module.exports = router;
