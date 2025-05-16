const User = require('../models/User');

class registerUserController {
  async handle(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const user = await User.register(name, email, password, role);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new registerUserController();
