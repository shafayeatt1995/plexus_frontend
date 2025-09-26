const events = {};

const eventBus = {
  on: (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push(callback);
  },

  off: (name) => {
    if (events[name]) delete events[name];
  },

  emit: (name, data) => {
    if (events[name]) events[name].forEach((callback) => callback(data));
  },
};

export default eventBus;
