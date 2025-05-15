const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  _id: String  // The category name (e.g. "standard", "deep", "moveout")
});

module.exports = mongoose.model('Category', CategorySchema);
