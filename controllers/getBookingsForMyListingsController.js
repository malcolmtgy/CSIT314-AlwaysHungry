const Booking = require('../models/Booking');
const Service = require('../models/Service');

exports.getBookingsForMyListings = async (req, res) => {
  try {
    const bookings = await Booking.getForCleanerListings(req.user.id, Service);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
