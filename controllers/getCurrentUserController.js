const User = require('../models/User');

class getCurrentUserController {
  async handle(req, res) {
    try {
      const user = await User.getById(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new getCurrentUserController();
