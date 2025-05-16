const User = require('../models/User');

class updateUserNameController {
  async handle(req, res) {
    try {
      const result = await User.updateName(req.user.id, req.body.name);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new updateUserNameController();
