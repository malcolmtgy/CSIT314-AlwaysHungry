const Category = require('../models/Category');

class getCategoriesController {
  async handle(req, res) {
    try {
      const categories = await Category.getAllCategories();
      res.json({ categories });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new getCategoriesController();
