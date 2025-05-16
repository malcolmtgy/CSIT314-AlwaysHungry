const Service = require('../models/Service');

class getAllServicesController {
  async handle(req, res) {
    try {
      const services = await Service.getAllServices();
      res.json({ services });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getAllServicesController();
