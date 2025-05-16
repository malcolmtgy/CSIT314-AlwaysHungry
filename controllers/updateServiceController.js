const Service = require('../models/Service');

class updateServiceController {
  async handle(req, res) {
    try {
      const service = await Service.updateServiceById(req.params.id, req.body, req.user);
      res.json({ message: 'Listing updated successfully', service });
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
}

module.exports = new updateServiceController();
