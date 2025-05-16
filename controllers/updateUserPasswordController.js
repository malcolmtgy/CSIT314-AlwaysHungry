const User = require('../models/User');

class updateUserPasswordController {
  async handle(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await User.updatePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new updateUserPasswordController();
