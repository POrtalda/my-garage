const Vehicle = require("../models/Vehicle");

async function getVehicles(req, res) {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: vehicles,
  });
}

async function getVehicleById(req, res) {
  const vehicle = await Vehicle.findById(req.params.id);

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
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    status: "success",
    data: vehicle,
  });
}

async function updateVehicle(req, res) {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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

async function deleteVehicle(req, res) {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

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