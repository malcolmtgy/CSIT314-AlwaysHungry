const Booking = require('../models/Booking');

exports.cancelBooking = async (req, res) => {
  try {
    const result = await Booking.cancel(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
