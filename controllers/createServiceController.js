const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const user = req.user;

    // Only cleaners can post services
    if (user.role !== 'cleaner') {
      return res.status(403).json({ error: 'Only cleaners can create listings' });
    }

    const newService = new Service({
      title,
      description,
      price,
      category,
      cleanerId: user.id
    });

    await newService.save();
    res.status(201).json({ message: 'Service listing created successfully', service: newService });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

 