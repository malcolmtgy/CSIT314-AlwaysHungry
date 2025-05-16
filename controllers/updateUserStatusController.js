const User = require('../models/User');

class updateUserStatusController {
  async handle(req, res) {
    try {
      const result = await User.updateStatus(req.params.id, req.body.status);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new updateUserStatusController();
