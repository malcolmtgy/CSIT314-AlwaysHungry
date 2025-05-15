const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getReport } = require('../controllers/getReportController');

router.get('/:type', authenticate, getReport);

module.exports = router;
