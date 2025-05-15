const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get my favourites
exports.getFavourites = async (req, res) => {
    const user = await User.findById(req.user.id).populate({
        path: 'favourites',
        populate: { path: 'cleanerId', select: 'name' }
    });
    res.json({ favourites: user.favourites });
};