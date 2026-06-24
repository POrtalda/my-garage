const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Accesso non autorizzato. Effettua il login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Utente non trovato. Effettua di nuovo il login.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Errore autenticazione:", error);

    return res.status(401).json({
      status: "fail",
      message: "Sessione non valida o scaduta. Effettua di nuovo il login.",
    });
  }
}

module.exports = {
  protect,
};
