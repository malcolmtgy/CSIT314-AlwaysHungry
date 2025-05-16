const User = require('../models/User');

class deleteUserController {
  async handle(req, res) {
    try {
      const result = await User.deleteById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new deleteUserController();
