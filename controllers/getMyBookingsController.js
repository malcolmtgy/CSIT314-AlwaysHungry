const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get my bookings
exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ homeownerId: req.user.id }).populate({
        path: 'serviceId',
        populate: { path: 'cleanerId', select: 'name' }
    });
    res.json({ bookings });
};