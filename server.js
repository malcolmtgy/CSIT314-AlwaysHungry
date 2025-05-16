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
const { registerUser } = require('./controllers/registerUserController');
const { loginUser } = require('./controllers/loginController');
const { getAllUsers } = require('./controllers/getAllUsersController');
const { deleteUser } = require('./controllers/deleteUserController');
const { getCurrentUser } = require('./controllers/getCurrentUserController');
const { updateUserName } = require('./controllers/updateUserNameController');
const { updateUserPassword } = require('./controllers/updateUserPasswordController');
const { updateUserStatus } = require('./controllers/updateUserStatusController');
const { getUserById } = require('./controllers/getUserByIdController');

// User Routes
app.post('/api/users/register', registerUser);
app.post('/api/users/login', loginUser);
app.get('/api/users/admin/users', authenticate, getAllUsers);
app.delete('/api/users/admin/users/:id', authenticate, deleteUser);
app.get('/api/users/me', authenticate, getCurrentUser);
app.put('/api/users/update-name', authenticate, updateUserName);
app.put('/api/users/update-password', authenticate, updateUserPassword);
app.put('/api/users/admin/users/:id/status', authenticate, updateUserStatus);
app.get('/api/users/:id', authenticate, getUserById);
app.get('/api/users/protected', authenticate, (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});

// ===== SERVICE CONTROLLERS =====
const { createService } = require('./controllers/createServiceController');
const { getCleanerServices } = require('./controllers/getCleanerServicesController');
const { updateService } = require('./controllers/updateServiceController');
const { deleteService } = require('./controllers/deleteServiceController');
const { getAllServices } = require('./controllers/getAllServicesController');
const { addToFavourites } = require('./controllers/addToFavouritesController');
const { getFavourites } = require('./controllers/getFavouritesController');
const { removeFromFavourites } = require('./controllers/removeFromFavouritesController');

// Service Routes
app.post('/api/services/create', authenticate, createService);
app.get('/api/services/mine', authenticate, getCleanerServices);
app.put('/api/services/:id', authenticate, updateService);
app.delete('/api/services/:id', authenticate, deleteService);
app.get('/api/services/all', authenticate, getAllServices);
app.post('/api/services/favourite/:id', authenticate, addToFavourites);
app.get('/api/services/favourites/mine', authenticate, getFavourites);
app.delete('/api/services/favourites/:id', authenticate, removeFromFavourites);

// ===== CATEGORY CONTROLLERS =====
const { getCategories } = require('./controllers/getCategoryController');
const { addCategory } = require('./controllers/addCategoryController');
const { deleteCategory } = require('./controllers/deleteCategoryController');
const { updateCategory } = require('./controllers/updateCategoryController')

// Category Routes
app.get('/api/categories', authenticate, getCategories);
app.post('/api/categories', authenticate, addCategory);
app.delete('/api/categories/:id', authenticate, deleteCategory);
app.put('/api/categories/:oldName', authenticate, updateCategory);

// ===== BOOKING CONTROLLERS =====
const { bookService } = require('./controllers/bookServiceController');
const { getMyBookings } = require('./controllers/getMyBookingsController');
const { cancelBooking } = require('./controllers/cancelBookingController');
const { getMyListingsWithFavourites } = require('./controllers/getMyListingsWithFavouritesController');
const { getBookingsForMyListings } = require('./controllers/getBookingsForMyListingsController');
const { getReport } = require('./controllers/getReportController');

// Booking Route
app.post('/api/services/book/:id', authenticate, bookService);
app.get('/api/services/bookings/mine', authenticate, getMyBookings);
app.delete('/api/services/bookings/:id', authenticate, cancelBooking);
app.get('/api/services/mine/favourite-counts', authenticate, getMyListingsWithFavourites);
app.get('/api/services/mine/bookings', authenticate, getBookingsForMyListings);
app.get('/api/reports/:type', authenticate, getReport);

// ===== REQUEST CONTROLLERS =====
const { createRequest } = require('./controllers/createRequestController');
const { getRequestsByService } = require('./controllers/getRequestsByServiceController');
const { getUserRequests } = require('./controllers/getUserRequestsController');
const { getAllRequests } = require('./controllers/getAllRequestsController');

// Request Routes
app.post('/api/requests', authenticate, createRequest);
app.post('/api/services/:serviceId/requests', authenticate, createRequest);
app.get('/api/services/:serviceId/requests', authenticate, getRequestsByService);
app.get('/api/requests', authenticate, getUserRequests);
app.get('/api/all-requests', authenticate, getAllRequests);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
