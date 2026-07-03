require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
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

async function fileToDataUrl(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    let mimeType = "image/jpeg";

    if (extension === ".png") {
        mimeType = "image/png";
    } else if (extension === ".webp") {
        mimeType = "image/webp";
    } else if (extension === ".jpg" || extension === ".jpeg") {
        mimeType = "image/jpeg";
    }

    return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

const demoVehicleDefinitions = [
    {
        brand: "Fiat",
        model: "Panda",
        plate: "DEMO001",
        taxExpiry: addDays(-15),
        insuranceExpiry: addDays(12),
        inspectionExpiry: addDays(180),
        imageFileName: "fiat-panda-demo.jpg",
    },
    {
        brand: "Ford",
        model: "Transit Camper",
        plate: "DEMO002",
        taxExpiry: addDays(25),
        insuranceExpiry: addDays(-8),
        inspectionExpiry: addDays(90),
        imageFileName: "ford-transit-camper-demo.jpg",
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

    const demoVehicles = await Promise.all(
        demoVehicleDefinitions.map(async (vehicle) => {
            const imagePath = path.join(
                __dirname,
                "demo-assets",
                vehicle.imageFileName
            );

            const imgUrl = await fileToDataUrl(imagePath);

            return {
                brand: vehicle.brand,
                model: vehicle.model,
                plate: vehicle.plate,
                taxExpiry: vehicle.taxExpiry,
                insuranceExpiry: vehicle.insuranceExpiry,
                inspectionExpiry: vehicle.inspectionExpiry,
                imgUrl,
                user: demoUser._id,
            };
        })
    );

    const vehicles = await Vehicle.insertMany(demoVehicles);

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
