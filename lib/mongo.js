const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const initMongo = (config) => {
  const host = config.mongo.host || 'localhost';
  const port = config.mongo.port || 27017;
  const database = config.mongo.database;
  if (!database) {
    throw new Error('no database provided');
  }

  const opts = { 
    server: { 
      auto_reconnect: true
    }, 
    user: config.mongo.user || '', 
    pass: config.mongo.password || '',
  };

  if (config.mongo.debug === true) {
    mongoose.set('debug', true);
  }

  mongoose.connect(`mongodb://${host}:${port}/${database}`);  
};

module.exports = {
  initMongo,
  mongoose,
}
