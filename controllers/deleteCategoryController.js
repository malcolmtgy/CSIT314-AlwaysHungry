const Category = require('../models/Category');

class deleteCategoryController {
  async handle(req, res) {
    try {
      const result = await Category.deleteCategoryById(req.params.id, req.user);
      res.json(result);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
}

module.exports = new deleteCategoryController();
