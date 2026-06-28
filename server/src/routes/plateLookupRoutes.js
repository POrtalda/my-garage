const express = require("express");
const { lookupVehicleByPlate } = require("../controllers/plateLookupController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/lookup-by-plate", protect, lookupVehicleByPlate);

module.exports = router;
