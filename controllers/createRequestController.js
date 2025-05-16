const Request = require('../models/Request');

class createRequestController {
  async handle(req, res) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.serviceId || null;
      const { message } = req.body;

      const request = await Request.createRequest(userId, serviceId, message);
      res.status(201).json({ message: 'Request submitted successfully', request });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new createRequestController();
