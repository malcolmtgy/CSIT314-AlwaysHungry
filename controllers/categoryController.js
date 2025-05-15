const Category = require('../models/Category');

// GET all categories
exports.getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json({ categories });
};

// POST a new category
exports.addCategory = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ error: 'Unauthorized' });

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  await Category.create({ _id: name.toLowerCase() });
  res.json({ message: 'Category added' });
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ error: 'Unauthorized' });

  await Category.deleteOne({ _id: req.params.id });
  res.json({ message: 'Category deleted' });
};
