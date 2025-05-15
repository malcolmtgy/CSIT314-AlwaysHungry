const Request = require('../models/Request');

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
};
