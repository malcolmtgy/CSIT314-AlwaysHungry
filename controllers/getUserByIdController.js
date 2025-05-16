const User = require('../models/User');

class getUserByIdController {
  async handle(req, res) {
    try {
      const result = await User.getRawById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new getUserByIdController();
