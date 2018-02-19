const R = require('ramda');
const {
  EVENT_NEW_USER,
  EVENT_USER_CONFIRMED,
  EVENT_SHOPPING_CARD_CREATED,
} = require('./events');

// memory store for user domain. for production we would want to abstract this and use reddis or mongo for this.
const userReducer = async (getState, action) => {
  const User = getState();
  switch (action.type) {
    case EVENT_NEW_USER:
      return User.findOneAndUpdate(
        { uuid: action.data.uuid }, 
        action.data,
        { upsert: true },
      );
    case EVENT_USER_CONFIRMED: 
      return User.findOneAndUpdate(
        { uuid: action.data.uuid },
        {
          confirmed: true,
          confirmedAt: action.data.confirmedAt,
        },
      );
    default:
      return;
  }
}

const shoppingCardReducer = async (getState, action) => {
  const ShoppingCard = getState();
  switch (action.type) {
    case EVENT_SHOPPING_CARD_CREATED:
      return ShoppingCard.findOneAndUpdate(
        { uuid: action.data.uuid },
        action.data,
        { upsert: true },
      );
    default:
      return;
  }
}

module.exports = {
  userReducer,
  shoppingCardReducer,
};
