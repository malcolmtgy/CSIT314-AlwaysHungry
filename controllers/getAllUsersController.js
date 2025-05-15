const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get all user profiles
exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json({ users });
};
