const mongoose = require('mongoose');

const ShoppingCard = mongoose.model('ShoppingCards', {
  name: String,
  uuid: String,
  userId: String,
  createdAt: Date,
  items: Array,
});

module.exports = ShoppingCard;
