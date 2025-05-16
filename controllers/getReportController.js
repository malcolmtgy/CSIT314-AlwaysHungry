const Booking = require('../models/Booking');

class getReportController {
  getWeekRange(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDay(); // Sunday = 0
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    const format = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${format(monday)} – ${format(sunday)}`;
  }

  async handle(req, res) {
    try {
      const { type } = req.params;
      const report = await Booking.getReportBy(type);
      if (type === 'weekly') {
        report.forEach(r => {
          r.period = this.getWeekRange(r.period);
        });
      }
      res.json({ report });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new getReportController();
