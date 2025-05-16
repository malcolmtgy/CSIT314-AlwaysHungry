const Category = require('../models/Category');

exports.updateCategory = async (req, res) => {
  try {
    const { oldName } = req.params;
    const { newName } = req.body;

    const result = await Category.updateCategory(oldName, newName, req.user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
