const Booking = require('../models/Booking');

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.user.id);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
