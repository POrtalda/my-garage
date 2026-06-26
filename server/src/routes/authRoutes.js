const express = require("express");
const {
  registerUser,
  loginUser,
  getNotificationPreferences,
  updateNotificationPreferences,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/me/notification-preferences",
  protect,
  getNotificationPreferences
);

router.patch(
  "/me/notification-preferences",
  protect,
  updateNotificationPreferences
);

module.exports = router;
