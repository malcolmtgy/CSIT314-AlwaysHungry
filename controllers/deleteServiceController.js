const Service = require('../models/Service');

exports.deleteService = async (req, res) => {
  try {
    const result = await Service.deleteServiceById(req.params.id, req.user);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
