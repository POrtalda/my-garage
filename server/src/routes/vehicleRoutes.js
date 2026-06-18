const express = require("express");

const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

router.route("/").get(getVehicles).post(createVehicle);

router
  .route("/:id")
  .get(getVehicleById)
  .patch(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;