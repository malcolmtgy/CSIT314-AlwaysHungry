const User = require('../models/User');

class removeFromFavouritesController {
  async handle(req, res) {
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
  }
}

module.exports = new removeFromFavouritesController();
