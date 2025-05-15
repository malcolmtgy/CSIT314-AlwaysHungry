const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User registration controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    const validRoles = ['homeowner', 'cleaner', 'admin', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create and save user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

