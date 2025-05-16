const Service = require('../models/Service');

class deleteServiceController {
  async handle(req, res) {
    try {
      const result = await Service.deleteServiceById(req.params.id, req.user);
      res.json(result);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
}

module.exports = new deleteServiceController();
