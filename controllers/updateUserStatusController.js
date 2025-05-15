const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;

        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: `Status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};