const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function registerUser(req, res) {
  try {
    if (
      process.env.DEMO_MODE === "true" &&
      process.env.DEMO_REGISTRATION_ENABLED !== "true"
    ) {
      return res.status(403).json({
        message:
          "La registrazione è disabilitata nell'ambiente demo. Usa l'account demo fornito.",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e password sono obbligatori.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La password deve contenere almeno 6 caratteri.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Esiste già un utente con questa email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Registrazione completata.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Errore registrazione:", error);

    return res.status(500).json({
      message: "Errore durante la registrazione.",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e password sono obbligatorie.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Credenziali non valide.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Credenziali non valide.",
      });
    }

    const token = createToken(user._id);

    return res.json({
      message: "Login completato.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Errore login:", error);

    return res.status(500).json({
      message: "Errore durante il login.",
    });
  }
}

async function getNotificationPreferences(req, res) {
  res.json({
    notifications: req.user.notifications || {
      weeklyExpiryEmail: {
        enabled: true,
      },
    },
  });
}

async function updateNotificationPreferences(req, res) {
  const { weeklyExpiryEmail } = req.body;

  if (!weeklyExpiryEmail || typeof weeklyExpiryEmail.enabled !== "boolean") {
    return res.status(400).json({
      message: "Preferenza notifiche non valida.",
    });
  }

  req.user.notifications = {
    weeklyExpiryEmail: {
      enabled: weeklyExpiryEmail.enabled,
    },
  };

  await req.user.save();

  res.json({
    message: "Preferenze notifiche aggiornate.",
    notifications: req.user.notifications,
  });
}

module.exports = {
  registerUser,
  loginUser,
  getNotificationPreferences,
  updateNotificationPreferences
};
