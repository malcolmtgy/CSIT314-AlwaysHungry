const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getMyListingsWithFavourites = async (req, res) => {
    const listings = await Service.find({ cleanerId: req.user.id });
    const users = await User.find({ favourites: { $exists: true, $ne: [] } });
    const listingFavCounts = {};
  
    // Count how many users have favourited each listing
    users.forEach(user => {
        user.favourites.forEach(serviceId => {
            const idStr = serviceId.toString();
            listingFavCounts[idStr] = (listingFavCounts[idStr] || 0) + 1;
        });
    });
  
    // Attach count to each of cleaner's listings
    const enrichedListings = listings.map(l => ({
        ...l.toObject(),
        favouriteCount: listingFavCounts[l._id.toString()] || 0
    }));
  
    res.json({ listings: enrichedListings });
};