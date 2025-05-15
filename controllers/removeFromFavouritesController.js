const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Remove from favourites
exports.removeFromFavourites = async (req, res) => {
    const user = await User.findById(req.user.id);
    user.favourites = user.favourites.filter(
        favId => favId.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Removed from favourites' });
};