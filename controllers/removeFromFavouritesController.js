const User = require('../models/User');

exports.removeFromFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favourites = user.favourites.filter(
      favId => favId.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
