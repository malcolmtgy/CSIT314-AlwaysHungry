const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
