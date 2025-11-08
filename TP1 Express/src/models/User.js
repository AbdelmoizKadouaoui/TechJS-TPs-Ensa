const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true },
  password: { type: String, required: true }, // hashé
});

module.exports = mongoose.model('User', userSchema); // <-- bien "exports"
