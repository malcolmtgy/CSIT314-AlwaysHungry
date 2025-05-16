const Service = require('../models/Service');
const User = require('../models/User');

// Save favourite
exports.addToFavourites = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user.favourites.includes(req.params.id)) {
        user.favourites.push(req.params.id);
        await user.save();
    }
    res.json({ message: 'Added to favourites' });
};