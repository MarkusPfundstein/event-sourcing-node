const R = require('ramda');
const {
  EVENT_NEW_USER,
  EVENT_USER_CONFIRMED,
  EVENT_SHOPPING_CARD_CREATED,
} = require('./events');
const initialState = require('./initialState');

// memory store for user domain. for production we would want to abstract this and use reddis or mongo for this.
const userReducer = (state = initialState.userReducer, action) => {
  switch (action.type) {
    case EVENT_NEW_USER:
      return {
        ...state,
        [action.data.uuid]: {
          ...action.data,
        },
      };
    case EVENT_USER_CONFIRMED: return {
        ...state,
        [action.data.uuid]: {
          ...state[action.data.uuid],
          confirmed: true,
          confirmedAt: action.data.confirmedAt,
        },
      };
    default:
      return state;
  }
}

const shoppingCardReducer = (state = initialState.shoppingCardReducer, action) => {
  switch (action.type) {
    case EVENT_SHOPPING_CARD_CREATED:
      return {
        ...state,
        [action.data.uuid]: {
          ...action.data,
        },
      };
    default:
      return state;
  }
}

module.exports = {
  userReducer,
  shoppingCardReducer,
};
