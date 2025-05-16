const mongoose = require('mongoose');
const User = require('./User');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  cleanerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Create a new service listing
serviceSchema.statics.createService = async function(title, description, price, category, user) {
  if (user.role !== 'cleaner') throw new Error('Only cleaners can create listings');
  const service = new this({ title, description, price, category, cleanerId: user.id });
  await service.save();
  return service;
};

// ✅ Get all listings by the current cleaner
serviceSchema.statics.getCleanerListings = async function(user) {
  if (user.role !== 'cleaner') throw new Error('Only cleaners can view their listings');
  return await this.find({ cleanerId: user.id });
};

// ✅ Update a service by ID
serviceSchema.statics.updateServiceById = async function(id, updates, user) {
  const service = await this.findById(id);
  if (!service || service.cleanerId.toString() !== user.id)
    throw new Error('Not authorized to update this listing');
  Object.assign(service, updates);
  await service.save();
  return service;
};

// ✅ Delete a service by ID
serviceSchema.statics.deleteServiceById = async function(id, user) {
  const service = await this.findById(id);
  if (!service || service.cleanerId.toString() !== user.id)
    throw new Error('Not authorized to delete this listing');
  await service.deleteOne();
  return { message: 'Listing deleted successfully' };
};

// ✅ Get all available services (populated with cleaner info)
serviceSchema.statics.getAllServices = async function() {
  return await this.find().populate('cleanerId', 'name');
};

// ✅ Get the current user's favourites
serviceSchema.statics.getUserFavourites = async function(userId) {
  const user = await User.findById(userId).populate({
    path: 'favourites',
    populate: { path: 'cleanerId', select: 'name' }
  });
  return user.favourites;
};

// ✅ Remove a service from user's favourites
serviceSchema.statics.removeFromFavourites = async function(userId, serviceId) {
  const user = await User.findById(userId);
  user.favourites = user.favourites.filter(favId => favId.toString() !== serviceId);
  await user.save();
  return { message: 'Removed from favourites' };
};

// ✅ Get cleaner's listings with favourite count
serviceSchema.statics.getMyListingsWithFavourites = async function(userId) {
  const listings = await this.find({ cleanerId: userId });
  const users = await User.find({ favourites: { $exists: true, $ne: [] } });
  const listingFavCounts = {};

  users.forEach(user => {
    user.favourites.forEach(serviceId => {
      const idStr = serviceId.toString();
      listingFavCounts[idStr] = (listingFavCounts[idStr] || 0) + 1;
    });
  });

  return listings.map(l => ({
    ...l.toObject(),
    favouriteCount: listingFavCounts[l._id.toString()] || 0
  }));
};

module.exports = mongoose.model('Service', serviceSchema);
