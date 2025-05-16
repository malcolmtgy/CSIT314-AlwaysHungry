const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Category.addCategory(name, req.user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
