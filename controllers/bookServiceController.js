const Booking = require('../models/Booking');

class bookServiceController {
  async handle(req, res) {
    try {
      const { date } = req.body;
      const booking = await Booking.book(req.params.id, req.user.id, date);
      res.json({ message: 'Booking confirmed', booking });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new bookServiceController();
