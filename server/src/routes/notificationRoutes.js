const express = require("express");
const {
  sendWeeklyExpiryEmails,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/weekly-expiry-email", sendWeeklyExpiryEmails);

module.exports = router;
