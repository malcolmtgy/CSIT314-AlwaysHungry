const Category = require('../models/Category');

class updateCategoryController {
  async handle(req, res) {
    try {
      const { oldName } = req.params;
      const { newName } = req.body;

      const result = await Category.updateCategory(oldName, newName, req.user);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new updateCategoryController();
