const nodemailer = require("nodemailer");

function getSmtpConfig() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_SECURE,
    SMTP_TIMEOUT_MS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("Configurazione SMTP incompleta.");
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: Number(SMTP_TIMEOUT_MS || 10000),
    greetingTimeout: Number(SMTP_TIMEOUT_MS || 10000),
    socketTimeout: Number(SMTP_TIMEOUT_MS || 10000),
    from: SMTP_FROM,
  };
}

function createTransporter() {
  const smtpConfig = getSmtpConfig();

  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: smtpConfig.auth,
    connectionTimeout: smtpConfig.connectionTimeout,
    greetingTimeout: smtpConfig.greetingTimeout,
    socketTimeout: smtpConfig.socketTimeout,
  });
}

async function sendEmail({ to, subject, text }) {
  const smtpConfig = getSmtpConfig();
  const transporter = createTransporter();

  return transporter.sendMail({
    from: smtpConfig.from,
    to,
    subject,
    text,
  });
}

module.exports = {
  sendEmail,
};
