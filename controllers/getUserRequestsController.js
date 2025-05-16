const Request = require('../models/Request');

class getUserRequestsController {
  async handle(req, res) {
    try {
      const userId = req.user._id;
      const requests = await Request.getByUser(userId);
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user requests' });
    }
  }
}

module.exports = new getUserRequestsController();
