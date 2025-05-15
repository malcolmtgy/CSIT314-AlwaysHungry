const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

function getWeekRange(dateStr) {
  const date = new Date(dateStr);
  const day = date.getUTCDay(); // Sunday=0
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const format = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${format(monday)} – ${format(sunday)}`;
}

exports.getReport = async (req, res) => {
  const { type } = req.params;

  let groupId;
  if (type === 'daily') {
    groupId = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
  } else if (type === 'weekly') {
    groupId = {
      $dateToString: { format: "%Y-%m-%d", date: "$date" } // will convert later to week range
    };
  } else if (type === 'monthly') {
    groupId = { $dateToString: { format: "%Y-%m", date: "$date" } };
  } else {
    return res.status(400).json({ error: 'Invalid report type' });
  }

  try {
    const results = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: 'users',
          localField: 'service.cleanerId',
          foreignField: '_id',
          as: 'cleaner'
        }
      },
      { $unwind: "$cleaner" },
      {
        $group: {
          _id: {
            period: groupId,
            serviceTitle: "$service.title",
            cleanerName: "$cleaner.name"
          },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          period: "$_id.period",
          serviceTitle: "$_id.serviceTitle",
          cleanerName: "$_id.cleanerName",
          totalBookings: 1
        }
      },
      { $sort: { period: -1 } }
    ]);

    // Transform weekly period field into range like "May 12 – May 18"
    if (type === 'weekly') {
      results.forEach(entry => {
        entry.period = getWeekRange(entry.period);
      });
    }

    res.json({ report: results });
  } catch (err) {
    console.error('Report generation failed:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
