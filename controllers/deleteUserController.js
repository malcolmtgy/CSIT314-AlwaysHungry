const User = require('../models/User');

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
