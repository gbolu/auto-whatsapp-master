const dispenserQueue = require("./dispenserQueue");

const cleanDispenserQueue = async () => {
  await Promise.all([dispenserQueue.empty(), 
  dispenserQueue.clean(0, "active"), 
  dispenserQueue.clean(0, "completed"),
  dispenserQueue.clean(0, "delayed"),
  dispenserQueue.clean(0, "failed"), 
  dispenserQueue.clean(0, "wait"), 
  dispenserQueue.clean(0, "wait")
]);
};

module.exports = cleanDispenserQueue;