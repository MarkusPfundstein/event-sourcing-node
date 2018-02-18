const uuidv1 = require('uuid/v1');
const { encryptPassword } = require('./bcrypt');
const {
  EVENT_NEW_USER,
  EVENT_USER_CONFIRMED,
  EVENT_SHOPPING_CARD_CREATED,
} = require('./events');

const createUserAction = async (user) => ({
  type: EVENT_NEW_USER,
  data: {
    ...user,
    password: await encryptPassword(user.password),
    uuid: uuidv1(),
    confirmed: false,
    createdAt: new Date(),
  },
});

const confirmUserAction = (uuid) => ({
  type: EVENT_USER_CONFIRMED,
  data: {
    uuid,
    confirmedAt: new Date(),
  },
});

const createShoppingCardAction = (userId, name) => ({
  type: EVENT_SHOPPING_CARD_CREATED,
  data: {
    name,
    uuid: uuidv1(),
    userId: userId,
    createdAt: new Date(),
    items: [],
  },
});

module.exports = {
  createUserAction,
  confirmUserAction,
  createShoppingCardAction,
};
