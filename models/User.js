const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['homeowner', 'cleaner', 'admin', 'manager'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  createdAt: { type: Date, default: Date.now }
});

// 🔐 LOGIN
userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw new Error('Email and password are required');

  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.password !== password) throw new Error('Incorrect password');
  if (user.status === 'suspended') throw new Error('Your account has been suspended.');

  if (user.status === 'inactive') {
    user.status = 'active';
    await user.save();
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};

// 👤 REGISTER
userSchema.statics.register = async function (name, email, password, role) {
  const validRoles = ['homeowner', 'cleaner', 'admin', 'manager'];
  if (!validRoles.includes(role)) throw new Error('Invalid user role');

  const existingUser = await this.findOne({ email });
  if (existingUser) throw new Error('Email already registered');

  const newUser = new this({ name, email, password, role });
  await newUser.save();

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
};

// 📋 GET ALL USERS (excluding passwords)
userSchema.statics.getAllUsers = async function () {
  return await this.find().select('-password');
};

// ❌ DELETE USER
userSchema.statics.deleteById = async function (userId) {
  const user = await this.findByIdAndDelete(userId);
  if (!user) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};

// 👤 GET CURRENT USER
userSchema.statics.getById = async function (id) {
  const user = await this.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

// ✏️ UPDATE NAME
userSchema.statics.updateName = async function (id, name) {
  if (!name) throw new Error('Name is required');
  const user = await this.findByIdAndUpdate(id, { name }, { new: true }).select('-password');
  return { message: 'Name updated', user };
};

// 🔒 UPDATE PASSWORD (basic plaintext comparison)
userSchema.statics.updatePassword = async function (id, currentPassword, newPassword) {
  const user = await this.findById(id);
  if (!user) throw new Error('User not found');
  if (user.password !== currentPassword) throw new Error('Incorrect current password');

  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

// 🚫 UPDATE STATUS
userSchema.statics.updateStatus = async function (userId, status) {
  const validStatuses = ['active', 'inactive', 'suspended'];
  if (!validStatuses.includes(status)) throw new Error('Invalid status value');

  const user = await this.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) throw new Error('User not found');

  return { message: `Status updated to ${status}`, user };
};

// 🔍 GET USER BY ID (raw)
userSchema.statics.getRawById = async function (id) {
  const user = await this.findById(id);
  if (!user) throw new Error('User not found');
  return { user };
};

module.exports = mongoose.model('User', userSchema);
