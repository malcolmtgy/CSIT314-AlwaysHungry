const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Book a service
bookingSchema.statics.book = async function(serviceId, userId, date) {
  const booking = new this({ homeownerId: userId, serviceId, date });
  await booking.save();
  return booking;
};

// ✅ Cancel a booking by ID
bookingSchema.statics.cancel = async function(bookingId) {
  await this.findByIdAndDelete(bookingId);
  return { message: 'Booking cancelled' };
};

// ✅ Get all bookings made by a specific user
bookingSchema.statics.getByUser = async function(userId) {
  return await this.find({ homeownerId: userId }).populate({
    path: 'serviceId',
    populate: { path: 'cleanerId', select: 'name' }
  });
};

// ✅ Get all bookings made for a cleaner’s listings
bookingSchema.statics.getForCleanerListings = async function(cleanerId, ServiceModel) {
  const listings = await ServiceModel.find({ cleanerId }).select('_id');
  const listingIds = listings.map(l => l._id);

  return await this.find({ serviceId: { $in: listingIds } })
    .populate('homeownerId', 'name email')
    .populate('serviceId');
};

// ✅ Get booking report by period
bookingSchema.statics.getReportBy = async function(type) {
  let groupId;
  if (type === 'daily') {
    groupId = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
  } else if (type === 'weekly') {
    groupId = { $dateToString: { format: "%Y-%m-%d", date: "$date" } }; // convert to week later
  } else if (type === 'monthly') {
    groupId = { $dateToString: { format: "%Y-%m", date: "$date" } };
  } else {
    throw new Error('Invalid report type');
  }

  const results = await this.aggregate([
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

  return results;
};

module.exports = mongoose.model('Booking', bookingSchema);
