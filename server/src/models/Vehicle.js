const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "La marca è obbligatoria"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Il modello è obbligatorio"],
      trim: true,
    },
    plate: {
      type: String,
      required: [true, "La targa è obbligatoria"],
      trim: true,
      uppercase: true,
    },
    insuranceExpiry: {
      type: Date,
      required: [true, "La scadenza assicurazione è obbligatoria"],
    },
    taxExpiry: {
      type: Date,
      required: [true, "La scadenza bollo è obbligatoria"],
    },
    inspectionExpiry: {
      type: Date,
      required: [true, "La scadenza revisione è obbligatoria"],
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;