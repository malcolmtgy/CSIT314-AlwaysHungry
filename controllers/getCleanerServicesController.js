const Service = require('../models/Service');

exports.getCleanerServices = async (req, res) => {
  try {
    const services = await Service.getCleanerListings(req.user);
    res.json({ services });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
