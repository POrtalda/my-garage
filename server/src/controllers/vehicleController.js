const Vehicle = require("../models/Vehicle");

async function getVehicles(req, res) {
  const vehicles = await Vehicle.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: vehicles,
  });
}

async function getVehicleById(req, res) {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!vehicle) {
    return res.status(404).json({
      status: "fail",
      message: "Veicolo non trovato",
    });
  }

  res.status(200).json({
    status: "success",
    data: vehicle,
  });
}

async function createVehicle(req, res) {
  if (process.env.DEMO_MODE === "true") {
    const demoMaxVehicles = Number(process.env.DEMO_MAX_VEHICLES || 5);
    const vehicleCount = await Vehicle.countDocuments({
      user: req.user._id,
    });

    if (vehicleCount >= demoMaxVehicles) {
      return res.status(403).json({
        status: "fail",
        message: `Limite demo raggiunto: puoi creare al massimo ${demoMaxVehicles} veicoli.`,
      });
    }
  }
  const vehicle = await Vehicle.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: vehicle,
  });
}

async function updateVehicle(req, res) {
  const vehicle = await Vehicle.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!vehicle) {
    return res.status(404).json({
      status: "fail",
      message: "Veicolo non trovato",
    });
  }

  res.status(200).json({
    status: "success",
    data: vehicle,
  });
}

async function deleteVehicle(req, res) {
  const vehicle = await Vehicle.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!vehicle) {
    return res.status(404).json({
      status: "fail",
      message: "Veicolo non trovato",
    });
  }

  res.status(204).send();
}

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
