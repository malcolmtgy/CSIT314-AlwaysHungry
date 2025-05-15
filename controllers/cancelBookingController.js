const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Cancel booking
exports.cancelBooking = async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
};