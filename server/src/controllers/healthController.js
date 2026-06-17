function getHealth(req, res) {
  res.status(200).json({
    status: "ok",
    message: "My Garage API running",
  });
}

module.exports = {
  getHealth,
};