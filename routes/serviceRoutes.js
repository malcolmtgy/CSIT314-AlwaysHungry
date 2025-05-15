const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Named imports for each controller
const { createService } = require('../controllers/createServiceController');
const { getCleanerServices } = require('../controllers/getCleanerServicesController');
const { updateService } = require('../controllers/updateServiceController');
const { deleteService } = require('../controllers/deleteServiceController');
const { getAllServices } = require('../controllers/getAllServicesController');
const { addToFavourites } = require('../controllers/addToFavouritesController');
const { bookService } = require('../controllers/bookServiceController');
const { getFavourites } = require('../controllers/getFavouritesController');
const { getMyBookings } = require('../controllers/getMyBookingsController');
const { removeFromFavourites } = require('../controllers/removeFromFavouritesController');
const { cancelBooking } = require('../controllers/cancelBookingController');
const { getMyListingsWithFavourites } = require('../controllers/getMyListingsWithFavouritesController');
const { getBookingsForMyListings } = require('../controllers/getBookingsForMyListingsController');


router.post('/create', authenticate, createService);
router.get('/mine', authenticate, getCleanerServices);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);
router.get('/all', authenticate, getAllServices);
router.post('/favourite/:id', authenticate, addToFavourites);
router.post('/book/:id', authenticate, bookService);
router.get('/favourites/mine', authenticate, getFavourites);
router.get('/bookings/mine', authenticate, getMyBookings);
router.delete('/favourites/:id', authenticate, removeFromFavourites);
router.delete('/bookings/:id', authenticate, cancelBooking);
router.get('/mine/favourite-counts', authenticate, getMyListingsWithFavourites);
router.get('/mine/bookings', authenticate, getBookingsForMyListings);




module.exports = router;
