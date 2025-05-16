const User = require('../models/User');

exports.updateUserStatus = async (req, res) => {
  try {
    const result = await User.updateStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
