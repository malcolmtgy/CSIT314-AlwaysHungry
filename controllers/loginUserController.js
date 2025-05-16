const User = require('../models/User');

class loginUserController {
  async handle(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await User.login(email, password);
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new loginUserController();
