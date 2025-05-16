const User = require('../models/User');

class addToFavouritesController {
  async handle(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user.favourites.includes(req.params.id)) {
        user.favourites.push(req.params.id);
        await user.save();
      }
      res.json({ message: 'Added to favourites' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new addToFavouritesController();
