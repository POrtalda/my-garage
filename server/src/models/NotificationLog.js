const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["weekly-expiry-email"],
    },
    periodKey: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    alertCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

notificationLogSchema.index(
  {
    user: 1,
    type: 1,
    periodKey: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("NotificationLog", notificationLogSchema);