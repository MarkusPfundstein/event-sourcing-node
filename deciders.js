const R = require('ramda');
const {
  EVENT_NEW_USER,
  EVENT_USER_CONFIRMED,
  EVENT_SHOPPING_CARD_CREATED,
} = require('./events');
const initialState = require('./initialState');

const userDecider = (state = initialState.userReducer, action) => {
  switch (action.type) {
    case EVENT_NEW_USER:
      return R.find(
        R.propEq('email', action.data.email),
        R.values(state)
      ) == null;
    case EVENT_USER_CONFIRMED:
      return (action.data.uuid in state);
    default:
      return false;
  }
}

const shoppingCardDecider = (state = initialState.shoppingCardReducer, action) => {
  switch (action.type) {
    case EVENT_SHOPPING_CARD_CREATED:
      return R.find(
        R.allPass([
          R.propEq('name', action.data.name),
          R.propEq('userId', action.data.userId),
        ]),
        R.values(state)
      ) == null;
    default:
      return false;
  }
}

module.exports = {
  userDecider,
  shoppingCardDecider,
};
