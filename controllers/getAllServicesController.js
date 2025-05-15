const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get all services
exports.getAllServices = async (req, res) => {
    const services = await Service.find().populate('cleanerId', 'name');
    res.json({ services });
}; 