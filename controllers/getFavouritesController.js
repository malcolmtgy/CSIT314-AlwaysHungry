const User = require('../models/User');

class getFavouritesController {
  async handle(req, res) {
    try {
      const user = await User.findById(req.user.id).populate({
        path: 'favourites',
        populate: { path: 'cleanerId', select: 'name' }
      });
      res.json({ favourites: user.favourites });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getFavouritesController();
