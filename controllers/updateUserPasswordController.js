const User = require('../models/User');

exports.updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Plain text password check 
    const isMatch = currentPassword === user.password;
    if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

    // Save new password as plain text 
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

