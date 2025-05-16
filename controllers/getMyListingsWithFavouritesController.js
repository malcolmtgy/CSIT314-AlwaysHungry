const User = require('../models/User');
const Service = require('../models/Service');

class getMyListingsWithFavouritesController {
  async handle(req, res) {
    try {
      const listings = await Service.find({ cleanerId: req.user.id });
      const users = await User.find({ favourites: { $exists: true, $ne: [] } });
      const listingFavCounts = {};

      users.forEach(user => {
        user.favourites.forEach(serviceId => {
          const idStr = serviceId.toString();
          listingFavCounts[idStr] = (listingFavCounts[idStr] || 0) + 1;
        });
      });

      const enrichedListings = listings.map(l => ({
        ...l.toObject(),
        favouriteCount: listingFavCounts[l._id.toString()] || 0
      }));

      res.json({ listings: enrichedListings });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getMyListingsWithFavouritesController();
