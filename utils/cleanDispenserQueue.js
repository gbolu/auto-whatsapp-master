const dispenserQueue = require("./dispenserQueue");

const cleanDispenserQueue = async () => {
  await Promise.all([dispenserQueue.empty(), 
  dispenserQueue.clean(10, "active"), 
  dispenserQueue.clean(10, "completed"),
  dispenserQueue.clean(10, "wait"), 
  dispenserQueue.clean(10, "failed")]);
};

module.exports = cleanDispenserQueue;