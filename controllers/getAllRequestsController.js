const Request = require('../models/Request');

class getAllRequestsController {
  async handle(req, res) {
    try {
      const requests = await Request.getAllRequests();
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve requests' });
    }
  }
}

module.exports = new getAllRequestsController();
