const Request = require('../models/Request');

exports.getRequestsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const requests = await Request.getByService(serviceId);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
};
