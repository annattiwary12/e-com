const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: String, // optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true, index: true },
  displayName: String, // For Google OAuth users
  avatar: { type: String, default: 'https://example.com/default-avatar.png' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

