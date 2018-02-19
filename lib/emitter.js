const process = require('process');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const promiseCb = (resolve, reject) => (error, data) => error ? reject(error) : resolve(data);

/*
 * promisifies a function of type (error -> result -> ())
 */
const promisify = (fun) => (...args) => {
  return new Promise((resolve, reject) => {
    try {
      return fun(...args, promiseCb(resolve, reject));
    } catch (e) {
      return reject(e);
    }
  });
}

const delay = timeout => promisify(cb => {
  setTimeout(() => cb(null), timeout);
})

const QUEUE = {};

const enqueue = (id, data) => {
  if (QUEUE[id] == null) {
    QUEUE[id] = [];
    if (typeof data === 'function') {
      QUEUE[id] = QUEUE[id].concat(data);
    }
    // async deletes QUEUE[id] if empty...
    runAsync(id);
  } else {
    if (typeof data === 'function') {
      QUEUE[id] = QUEUE[id].concat(data);
    }
  }
}

const dequeue = (id) => {
  if (QUEUE[id] == null || QUEUE[id].length == 0) {
    return null;
  }
  const [data, ...rest] = QUEUE[id];
  QUEUE[id] = rest;
  return data;
} 

const STANDARD_TIMEOUT = 100;

const runAsync = (id) => {
  if (QUEUE[id] != null && QUEUE[id].length > 0) {
    const data = dequeue(id);
    // i think its not necessary... but you never know ;-)
    if (data != null) {
      const dataP = promisify(data);
      const timeoutP = delay(10000); // 10 seconds should be enough for function to execute.. 

      Promise.race([dataP(), timeoutP()])
        .then(_ => setTimeout(() => runAsync(id), STANDARD_TIMEOUT))
        .catch(e => setTimeout(() => runAsync(id), STANDARD_TIMEOUT));
    } else {
      delete QUEUE[id]; 
    }
  } else {
    delete QUEUE[id];
  }
}

const show = () => {
  return Object.keys(QUEUE);
}

module.exports = {
  enqueue,
  show,
  eventEmitter,
}
