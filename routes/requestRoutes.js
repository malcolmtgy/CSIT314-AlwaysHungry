const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createRequest, getRequestsByService } = require('../controllers/requestController');
const { getUserRequests } = require('../controllers/getUserRequestsController');
const { getAllRequests } = require('../controllers/getAllRequestsController');

router.post('/requests', authenticate, createRequest);
router.post('/services/:serviceId/requests', authenticate, createRequest);
router.get('/services/:serviceId/requests', authenticate, getRequestsByService);
router.get('/requests', authenticate, getUserRequests);
router.get('/all-requests', authenticate, getAllRequests);

module.exports = router;
