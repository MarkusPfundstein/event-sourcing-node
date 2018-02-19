const R = require('ramda');
const { eventEmitter, enqueue } = require('../emitter');

const reducers = {};
const deciders = {};

const printStates = () => {
  R.toPairs(reducers).forEach(([id, { state }]) => {
    console.log(id);
    console.log(JSON.stringify(state, null, 2));
  });
}

const setReducer = (id, reducer, getState) => {
  reducers[id] = {
    reducer,
    getState,
  };
}

const setDecider = (reducerId, decider, getState) => {
  deciders[reducerId] = {
    decider,
    getState,
  };
}

const getState = () => {
  return R.map(
    R.compose(
      getState => getState(),
      R.prop('getState')
    ),
    reducers);
}

const reduce = async (data) => {
  const iter = R.toPairs(reducers);
  for (let [id, { reducer, getState }] of iter) {
    // decide if we handle the event. 
    if (deciders[id]) {
      const ok = await deciders[id].decider(getState, data);
      if (!ok) {
        continue;
      }
    }
    // compute next state
    await reducer(getState, data);
  }
}

// called whenever an event happens. In a production system, this data would
// come from Kafka or RabbitMq
const scheduleQueueFn = (data) => (callback) => {
  reduce(data)
    .then(() => {
      callback();
    })
    .catch(err => {
      console.error(erro);
      callback(error);
    });
}

eventEmitter.on('event', data => {
  enqueue('EVENT_QUEUE', scheduleQueueFn(data));
});

module.exports = {
  setReducer,
  setDecider,
  getState,
};
