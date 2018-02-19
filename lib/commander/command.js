const { Event } = require('./event');
const { eventEmitter } = require('../emitter');

const persist = async (actionData) => {
  const modelData = new Event({
    type: actionData.type,
    data: actionData.data,
  });
  const saved = await modelData.save();

  eventEmitter.emit('event', modelData);

  return actionData;
};

const replayAll = async () => {
  const events = await Event.find({}).sort({ created: 1 });
  events.forEach(data => {
    eventEmitter.emit('event', data);
  });
};

module.exports = {
  persist,
  replayAll,
};
