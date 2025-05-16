const Booking = require('../models/Booking');

class getMyBookingsController {
  async handle(req, res) {
    try {
      const bookings = await Booking.getByUser(req.user.id);
      res.json({ bookings });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getMyBookingsController();
