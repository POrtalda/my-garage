const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const pushSubscriptionRoutes = require("./routes/pushSubscriptionRoutes");

const app = express();

const allowedOrigins = [
  "https://my-garage-expiration.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "10mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notifications", pushSubscriptionRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = app;
