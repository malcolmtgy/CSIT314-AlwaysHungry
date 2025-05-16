const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Redirect to login page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// MIDDLEWARE
const { authenticate } = require('./middleware/auth');

// ===== USER CONTROLLERS =====
const registerUserController = require('./controllers/registerUserController');
const loginUserController = require('./controllers/loginUserController');
const getAllUsersController = require('./controllers/getAllUsersController');
const deleteUserController = require('./controllers/deleteUserController');
const getCurrentUserController = require('./controllers/getCurrentUserController');
const updateUserNameController = require('./controllers/updateUserNameController');
const updateUserPasswordController = require('./controllers/updateUserPasswordController');
const updateUserStatusController = require('./controllers/updateUserStatusController');
const getUserByIdController = require('./controllers/getUserByIdController');

// User Routes
app.post('/api/users/register', registerUserController.handle);
app.post('/api/users/login', loginUserController.handle);
app.get('/api/users/admin/users', authenticate, getAllUsersController.handle);
app.delete('/api/users/admin/users/:id', authenticate, deleteUserController.handle);
app.get('/api/users/me', authenticate, getCurrentUserController.handle);
app.put('/api/users/update-name', authenticate, updateUserNameController.handle);
app.put('/api/users/update-password', authenticate, updateUserPasswordController.handle);
app.put('/api/users/admin/users/:id/status', authenticate, updateUserStatusController.handle);
app.get('/api/users/:id', authenticate, getUserByIdController.handle);
app.get('/api/users/protected', authenticate, (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});

// ===== SERVICE CONTROLLERS =====
const createServiceController = require('./controllers/createServiceController');
const getCleanerServicesController = require('./controllers/getCleanerServicesController');
const updateServiceController = require('./controllers/updateServiceController');
const deleteServiceController = require('./controllers/deleteServiceController');
const getAllServicesController = require('./controllers/getAllServicesController');
const addToFavouritesController = require('./controllers/addToFavouritesController');
const getFavouritesController = require('./controllers/getFavouritesController');
const removeFromFavouritesController = require('./controllers/removeFromFavouritesController');

// Service Routes
app.post('/api/services/create', authenticate, createServiceController.handle);
app.get('/api/services/mine', authenticate, getCleanerServicesController.handle);
app.put('/api/services/:id', authenticate, updateServiceController.handle);
app.delete('/api/services/:id', authenticate, deleteServiceController.handle);
app.get('/api/services/all', authenticate, getAllServicesController.handle);
app.post('/api/services/favourite/:id', authenticate, addToFavouritesController.handle);
app.get('/api/services/favourites/mine', authenticate, getFavouritesController.handle);
app.delete('/api/services/favourites/:id', authenticate, removeFromFavouritesController.handle);

// ===== CATEGORY CONTROLLERS =====
const getCategoryController = require('./controllers/getCategoryController');
const addCategoryController = require('./controllers/addCategoryController');
const deleteCategoryController = require('./controllers/deleteCategoryController');
const updateCategoryController = require('./controllers/updateCategoryController');

// Category Routes
app.get('/api/categories', authenticate, getCategoryController.handle);
app.post('/api/categories', authenticate, addCategoryController.handle);
app.delete('/api/categories/:id', authenticate, deleteCategoryController.handle);
app.put('/api/categories/:oldName', authenticate, updateCategoryController.handle);

// ===== BOOKING CONTROLLERS =====
const bookServiceController = require('./controllers/bookServiceController');
const getMyBookingsController = require('./controllers/getMyBookingsController');
const cancelBookingController = require('./controllers/cancelBookingController');
const getMyListingsWithFavouritesController = require('./controllers/getMyListingsWithFavouritesController');
const getBookingsForMyListingsController = require('./controllers/getBookingsForMyListingsController');
const getReportController = require('./controllers/getReportController');

// Booking Routes
app.post('/api/services/book/:id', authenticate, bookServiceController.handle);
app.get('/api/services/bookings/mine', authenticate, getMyBookingsController.handle);
app.delete('/api/services/bookings/:id', authenticate, cancelBookingController.handle);
app.get('/api/services/mine/favourite-counts', authenticate, getMyListingsWithFavouritesController.handle);
app.get('/api/services/mine/bookings', authenticate, getBookingsForMyListingsController.handle);
app.get('/api/reports/:type', authenticate, getReportController.handle);

// ===== REQUEST CONTROLLERS =====
const createRequestController = require('./controllers/createRequestController');
const getRequestsByServiceController = require('./controllers/getRequestsByServiceController');
const getUserRequestsController = require('./controllers/getUserRequestsController');
const getAllRequestsController = require('./controllers/getAllRequestsController');

// Request Routes
app.post('/api/requests', authenticate, createRequestController.handle);
app.post('/api/services/:serviceId/requests', authenticate, createRequestController.handle);
app.get('/api/services/:serviceId/requests', authenticate, getRequestsByServiceController.handle);
app.get('/api/requests', authenticate, getUserRequestsController.handle);
app.get('/api/all-requests', authenticate, getAllRequestsController.handle);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
