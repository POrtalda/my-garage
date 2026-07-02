const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const DEMO_EMAIL = "demo@mygarage.dev";
const DEMO_PASSWORD = "Demo123!";

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
}

const demoVehicles = [
  {
    brand: "Fiat",
    model: "Panda",
    plate: "DEMO001",
    taxExpiry: addDays(-15),
    insuranceExpiry: addDays(12),
    inspectionExpiry: addDays(180),
  },
  {
    brand: "Ford",
    model: "Transit Camper",
    plate: "DEMO002",
    taxExpiry: addDays(25),
    insuranceExpiry: addDays(-8),
    inspectionExpiry: addDays(90),
  },
];

async function seedDemo() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI non configurata.");
  }

  if (process.env.DEMO_MODE !== "true") {
    throw new Error(
      "Seed demo bloccato: imposta DEMO_MODE=true per eseguire questo script."
    );
  }

  await mongoose.connect(mongoUri);

  console.log("Connesso a MongoDB demo.");

  const existingDemoUser = await User.findOne({ email: DEMO_EMAIL });

  if (existingDemoUser) {
    await Vehicle.deleteMany({ user: existingDemoUser._id });
    await User.deleteOne({ _id: existingDemoUser._id });
    console.log("Account demo precedente rimosso.");
  }

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const demoUser = await User.create({
    name: "Demo User",
    email: DEMO_EMAIL,
    password: hashedPassword,
    notifications: {
      weeklyExpiryEmail: {
        enabled: false,
      },
    },
  });

  const vehicles = await Vehicle.insertMany(
    demoVehicles.map((vehicle) => ({
      ...vehicle,
      user: demoUser._id,
    }))
  );

  console.log("Seed demo completato.");
  console.log(`Account demo: ${DEMO_EMAIL}`);
  console.log(`Password demo: ${DEMO_PASSWORD}`);
  console.log(`Veicoli creati: ${vehicles.length}`);
}

seedDemo()
  .catch((error) => {
    console.error("Errore seed demo:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
  