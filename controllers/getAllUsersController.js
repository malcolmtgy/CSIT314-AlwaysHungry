const User = require('../models/User');

class getAllUsersController {
  async handle(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getAllUsersController();
