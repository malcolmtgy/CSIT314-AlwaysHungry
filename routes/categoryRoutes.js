const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); 

const {
  getCategories,
  addCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.get('/', authenticate, getCategories);
router.post('/', authenticate, addCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;

