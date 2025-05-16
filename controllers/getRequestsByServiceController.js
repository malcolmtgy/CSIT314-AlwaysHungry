const Request = require('../models/Request');

class getRequestsByServiceController {
  async handle(req, res) {
    try {
      const { serviceId } = req.params;
      const requests = await Request.getByService(serviceId);
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve requests' });
    }
  }
}

module.exports = new getRequestsByServiceController();
