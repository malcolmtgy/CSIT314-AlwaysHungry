const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Book a service
exports.bookService = async (req, res) => {
  const { date } = req.body;
  const booking = new Booking({
    homeownerId: req.user.id,
    serviceId: req.params.id,
    date
  });
  await booking.save();
  res.json({ message: 'Booking confirmed', booking });
};