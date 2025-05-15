const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const serviceId = req.params.serviceId || null;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const newRequest = new Request({
      userId,
      serviceId,
      message: message.trim()
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    console.error('❌ Error creating request:', error); // This is good
    res.status(500).json({ error: 'Server error', detail: error.message }); // <== ADD this
  }
};

exports.getRequestsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const requests = await Request.find({ serviceId }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
};
