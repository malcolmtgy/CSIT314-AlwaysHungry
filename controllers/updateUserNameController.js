const User = require('../models/User');

exports.updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password');

    res.json({ message: 'Name updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
