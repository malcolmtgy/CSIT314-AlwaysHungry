const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// PUT: Update listing by ID
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
  
        const service = await Service.findById(id);
        if (!service || service.cleanerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this listing' });
        }
  
        Object.assign(service, updates);
        await service.save();
  
        res.json({ message: 'Listing updated successfully', service });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
};