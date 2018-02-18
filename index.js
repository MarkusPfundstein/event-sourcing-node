const { json, send } = require('micro');
const { router, post, get } = require('microrouter')
const { comparePassword } = require('./bcrypt');
const config = require('./config');
// library functions that we need to setup
// everything
const { initMongo } = require('./lib/mongo');
const {
  setReducer,
  setDecider,
  getState,
} = require('./lib/projection');
const {
  replayAll,
  persist,
} = require('./lib/command');

// commands
const {
  createUserAction,
  confirmUserAction,
  createShoppingCardAction,
} = require('./actions');

// views
const {
  userReducer,
  shoppingCardReducer,
} = require('./reducers');
const {
  userDecider,
  shoppingCardDecider,
} = require('./deciders');

// commands
const newUser = async (req, res) => {
  const data = await json(req);

  const actionData = await createUserAction(data);
  await persist(actionData);

  send(res, 201);
};

const confirmUser = async (req, res) => {
  const uuid = req.params.uuid;

  const actionData = confirmUserAction(uuid);
  await persist(actionData);

  send(res, 201);
};

const createShoppingCard = async (req, res) => {
  // TO-DO: dont use route here. in production we would call view service
  // or some other stuff
  const { name } = await json(req);
  const user = await viewUser(req, res);
  if (!user) {
    return send(res, 404);
  }

  const shoppingCardAction = createShoppingCardAction(user.uuid, name);   

  await persist(shoppingCardAction);

  send(res, 201);
};

// views -> in production system this would be a
// different instance (same as the one that runs the
// reducers)
const viewUser = async (req, res) => {
  const uuid = req.params.uuid;
  
  const userState = getState().userReducer;
  const user = userState[uuid];
  if (!user) {
    return send(res, 404);
  }
  if (!await comparePassword('125', user.password)) {
    return send(res, 401);
  }

  return user;
};

// init our stuff and setup router
initMongo(config);
setReducer('userReducer', userReducer);
setDecider('userReducer', userDecider);

setReducer('shoppingCardReducer', shoppingCardReducer);
setDecider('shoppingCardReducer', shoppingCardDecider);

replayAll().then(() => console.log('replay done'));

module.exports = router(
  get('/users/:uuid', viewUser),
  post('/users', newUser),
  post('/users/:uuid/confirm', confirmUser),
  post('/users/:uuid/cards', createShoppingCard),
);
  

