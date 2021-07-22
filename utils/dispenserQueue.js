const Queue = require('bull');
require('dotenv').config();
const processor = require('./process');
const generateServer = require('./generateServer');

const dispenserQueue = new Queue("Dispenser", {
  redis: { port: process.env.REDIS_PORT || 6379, host: "127.0.0.1" },
  settings: {
    drainDelay: 10,
    guardInterval: 100,
    stalledInterval: 0,
    maxStalledCount: 0
  }
});

// Increase the max listeners to get rid of the warning below
// MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 
// 11 global:completed listeners added. Use emitter.setMaxListeners() to increase limit
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 50;

const logger = require("./logger");

const activeQueues = [
  {
    queue: dispenserQueue,
    processor: processor
  }
];

activeQueues.forEach((handler) => {
  const queue = handler.queue;
  const processor = handler.processor;
  queue.process(processor); 

  queue.on("failed", (job, err) => {
    logger.error(err);
    
    job.remove()
    .then(async () => {
      await queue.add(job.data, {lifo: true});
    })
    .catch(err => logger.error(err));
  })

  logger.info(`Processing ${queue.name}...`);
});

module.exports = dispenserQueue;