const Booking = require('../models/Booking');

class getReportController {
  async handle(req, res) {
    try {
      const { type } = req.params;

      // Get already-formatted report directly from Booking model
      const report = await Booking.getReportBy(type);

      // No need to process weekly periods — it's pre-formatted from aggregation
      res.json({ report });

    } catch (err) {
      console.error('Report generation error:', err);
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new getReportController();
