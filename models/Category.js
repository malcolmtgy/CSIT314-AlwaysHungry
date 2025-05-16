const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  _id: String // The category name (e.g. "standard", "deep", "moveout")
});

// ✅ Get all categories
CategorySchema.statics.getAllCategories = async function () {
  return await this.find({});
};

// ✅ Add a new category (manager only)
CategorySchema.statics.addCategory = async function (name, user) {
  if (user.role !== 'manager') throw new Error('Unauthorized');
  if (!name) throw new Error('Name is required');

  await this.create({ _id: name.toLowerCase() });
  return { message: 'Category added' };
};

// ✅ Delete a category by ID (manager only)
CategorySchema.statics.deleteCategoryById = async function (id, user) {
  if (user.role !== 'manager') throw new Error('Unauthorized');
  await this.deleteOne({ _id: id });
  return { message: 'Category deleted' };
};

// ✅ Update a category name (manager only)
CategorySchema.statics.updateCategory = async function (oldId, newId, user) {
  if (user.role !== 'manager') throw new Error('Unauthorized');
  if (!newId) throw new Error('New category name is required');

  const existing = await this.findById(oldId);
  if (!existing) throw new Error('Category not found');

  // Create new category and delete old one
  await this.create({ _id: newId.toLowerCase() });
  await this.deleteOne({ _id: oldId });

  return { message: `Category renamed from "${oldId}" to "${newId}"` };
};

module.exports = mongoose.model('Category', CategorySchema);
