const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false  // allow null for global requests
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Create a request
requestSchema.statics.createRequest = async function(userId, serviceId, message) {
  if (!message || message.trim() === '') {
    throw new Error('Message is required');
  }

  const newRequest = new this({
    userId,
    serviceId: serviceId || null,
    message: message.trim()
  });

  await newRequest.save();
  return newRequest;
};

// ✅ Get requests for a specific service
requestSchema.statics.getByService = async function(serviceId) {
  return await this.find({ serviceId }).sort({ createdAt: -1 });
};

// ✅ Get all requests by the logged-in user
requestSchema.statics.getByUser = async function(userId) {
  return await this.find({ userId }).sort({ createdAt: -1 });
};

// ✅ Get all requests (admin view)
requestSchema.statics.getAllRequests = async function() {
  return await this.find()
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');
};

module.exports = mongoose.model('Request', requestSchema);
