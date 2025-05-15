const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Basic route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});


// Hook up routes (next step will define them)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use(express.static('public'));
const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);
const requestRoutes = require('./routes/requestRoutes');
app.use('/api', requestRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

