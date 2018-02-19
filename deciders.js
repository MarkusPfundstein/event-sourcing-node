const R = require('ramda');
const {
  EVENT_NEW_USER,
  EVENT_USER_CONFIRMED,
  EVENT_SHOPPING_CARD_CREATED,
} = require('./events');

const userDecider = async (getState, action) => {
  const User = getState();
  switch (action.type) {
    case EVENT_NEW_USER:
      return await User.count(
        { email: action.data.email }
      ) === 0;
    case EVENT_USER_CONFIRMED:
      return await User.count(
        { uuid: action.data.uuid, confirmed: false }
      ) > 0;
    default:
      return false;
  }
}

const shoppingCardDecider = async (getState, action) => {
  const ShoppingCard = getState();
  switch (action.type) {
    case EVENT_SHOPPING_CARD_CREATED:
      return await ShoppingCard.count({
        name: action.data.name,
        userId: action.data.userId,
      }) === 0;
    default:
      return false;
  }
}

module.exports = {
  userDecider,
  shoppingCardDecider,
};
