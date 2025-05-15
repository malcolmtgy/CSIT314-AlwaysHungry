const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// DELETE: Delete listing by ID
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
  
        const service = await Service.findById(id);
        if (!service || service.cleanerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this listing' });
        }
  
        await service.deleteOne();
        res.json({ message: 'Listing deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
};