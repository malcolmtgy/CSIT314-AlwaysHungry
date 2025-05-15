const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET all listings by logged-in cleaner
exports.getCleanerServices = async (req, res) => {
    try {
      if (req.user.role !== 'cleaner') {
        return res.status(403).json({ error: 'Only cleaners can view their listings' });
      }
  
      const services = await Service.find({ cleanerId: req.user.id });
      res.json({ services });
    } catch (err) {
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
};