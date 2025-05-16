const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAllServices();
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
