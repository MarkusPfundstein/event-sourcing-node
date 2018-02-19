const mongoose = require('mongoose');
const R = require('ramda');

R.keys(mongoose.connection.models).forEach(key => {
  delete mongoose.connection.models[key];
});

const EventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  created: { type: Date, default: Date.now },
  ref: { type: String },
});

const Event = mongoose.model('Events', EventSchema);

module.exports = {
  Event,
};


