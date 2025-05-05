const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// USER
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['homeowner', 'cleaner', 'userAdmin'], required: true },
    status: { type: String, default: 'active' },
    email: { type: String, required: true },
    address: { type: String },
    name: { type: String }
}));

async function seedAdminUsers() {
    const admin1 = await User.findOne({ username: 'dnw' });
    if (!admin1) {
        await User.create({ username: 'dnw', password: 'dnw123', email: 'dnw@csit.314', role: 'userAdmin', status: 'active' });
    }

    const admin2 = await User.findOne({ username: 'czx' });
    if (!admin2) {
        await User.create({ username: 'czx', password: 'czx123', email: 'czx@csit.314', role: 'userAdmin', status: 'active' });
    }
}

mongoose.connect('mongodb://localhost:27017/c2c-cleaning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected.");
    seedAdminUsers();
});

app.post('/users', async (req, res) => {
    const exists = await User.findOne({ username: req.body.username });
    if (exists) return res.status(400).json({ message: 'Username exists' });
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});

app.get('/users', async (req, res) => res.json(await User.find()));

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Invalid user ID' });
    }
});

app.patch('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, password, role: role });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Account is suspended' });
    }

    if (user.status === 'inactive') {
        user.status = 'active';
        await user.save();
    }

    res.json(user);
});

// SERVICE
const Service = mongoose.model('Service', new mongoose.Schema({
    username: String,
    title: String,
    description: String,
    category: String,
    schedule: String
}));

app.post('/services', async (req, res) => {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
});

app.get('/services', async (req, res) => {
    const query = req.query.username ? { username: req.query.username } : {};
    res.json(await Service.find(query));
});

app.get('/services/:id', async (req, res) => {
    const service = await Service.findById(req.params.id);
    res.json(service);
});

app.delete('/services/:id', async (req, res) => {
    await Service.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// FAVORITES
const Favorite = mongoose.model('Favorite', new mongoose.Schema({
    user: String,
    cleaner: String,
    title: String,
    description: String
}));

app.post('/favorites', async (req, res) => {
    const fav = new Favorite(req.body);
    await fav.save();
    res.status(201).json(fav);
});

app.get('/favorites', async (req, res) => {
    const query = req.query.user ? { user: req.query.user } : {};
    res.json(await Favorite.find(query));
});

app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Server running at http://0.0.0.0:3000 (accessible on local network)');
});