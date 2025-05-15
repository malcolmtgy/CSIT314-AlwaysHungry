const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User login controller
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    if (user.password !== password)
      return res.status(401).json({ error: 'Incorrect password' });

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended.' });
    }

    // 4. Auto-activate inactive accounts
    if (user.status === 'inactive') {
      user.status = 'active';
      await user.save(); // save updated status
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};