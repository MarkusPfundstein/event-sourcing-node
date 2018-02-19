const mongoose = require('mongoose');

const User = mongoose.model('users', {
  password: String,
  email: String,
  uuid: String,
  confirmed: { type: Boolean, default: false },
  createdAt: Date,
  confirmedAt: Date,
});

module.exports = User;
