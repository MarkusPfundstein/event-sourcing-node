const R = require('ramda');
const eventEmitter = require('./emitter');

const reducers = {};
const deciders = {};

const printStates = () => {
  R.toPairs(reducers).forEach(([id, { state }]) => {
    console.log(id);
    console.log(JSON.stringify(state, null, 2));
  });
}

const setReducer = (id, reducer) => {
  reducers[id] = {
    reducer,
  };
}

const setDecider = (reducerId, decider) => {
  deciders[reducerId] = {
    decider,
  };
}

const getState = () => {
  return R.map(R.prop('state'), reducers);
}

// called whenever an event happens. In a production system, this data would
// come from Kafka or RabbitMq
eventEmitter.on('event', data => {
  R.toPairs(reducers).forEach(([id, { reducer, state }]) => {
    // decide if we handle the event. 
    if (deciders[id] && !deciders[id].decider(state, data)) {
      return;
    }
    // reduce to next state
    reducers[id].state = reducer(state, data);
  }, reducers);
  console.log('>----------->');
  printStates();
});

module.exports = {
  setReducer,
  setDecider,
  getState,
};
