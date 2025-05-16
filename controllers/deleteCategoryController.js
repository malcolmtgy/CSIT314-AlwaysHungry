const Category = require('../models/Category');

exports.deleteCategory = async (req, res) => {
  try {
    const result = await Category.deleteCategoryById(req.params.id, req.user);
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
