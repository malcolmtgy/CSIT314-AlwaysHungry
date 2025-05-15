const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get bookings for cleaner service listings
exports.getBookingsForMyListings = async (req, res) => {
    const myListings = await Service.find({ cleanerId: req.user.id }).select('_id');
    const listingIds = myListings.map(l => l._id);
  
    const bookings = await Booking.find({ serviceId: { $in: listingIds } })
        .populate('homeownerId', 'name email')
        .populate('serviceId');
  
    res.json({ bookings });
};