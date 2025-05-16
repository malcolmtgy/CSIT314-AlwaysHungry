const Booking = require('../models/Booking');

class cancelBookingController {
  async handle(req, res) {
    try {
      const result = await Booking.cancel(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new cancelBookingController();
