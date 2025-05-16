const Service = require('../models/Service');

class createServiceController {
  async handle(req, res) {
    try {
      const { title, description, price, category } = req.body;
      const service = await Service.createService(title, description, price, category, req.user);
      res.status(201).json({ message: 'Service listing created successfully', service });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new createServiceController();
