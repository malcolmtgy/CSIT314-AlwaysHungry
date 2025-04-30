const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

async function seedAdminUsers() {
    const existingAdmins = await User.find({ role: 'userAdmin' });
    if (!existingAdmins.find(u => u.username === 'admin1')) {
        await User.create({ username: 'dnw', password: 'dnw123', role: 'userAdmin', status: 'active' });
    }
    if (!existingAdmins.find(u => u.username === 'admin2')) {
        await User.create({ username: 'czx', password: 'czx123', role: 'userAdmin', status: 'active' });
    }
}


// USER
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    status: { type: String, default: 'active' }
}));

mongoose.connect('mongodb://localhost:27017/c2c-cleaning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected.");
    seedAdminUsers(); // <- insert admins once connected
});

app.post('/users', async (req, res) => {
    const exists = await User.findOne({ username: req.body.username });
    if (exists) return res.status(400).json({ message: 'Username exists' });
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
});

app.get('/users', async (req, res) => res.json(await User.find()));
app.patch('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});
app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
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

//app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Server running at http://0.0.0.0:3000 (accessible on local network)');
});

