const express = require("express");
const {
  getVapidPublicKey,
  savePushSubscription,
  deletePushSubscription,
  sendTestPushNotification,
} = require("../controllers/pushSubscriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/vapid-public-key", protect, getVapidPublicKey);
router.post("/push-subscriptions", protect, savePushSubscription);
router.delete("/push-subscriptions", protect, deletePushSubscription);
router.post("/test-push", protect, sendTestPushNotification);

module.exports = router;
