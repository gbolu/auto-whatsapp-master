const Queue = require('bull');
require('dotenv').config();
const processor = require('./process');

const dispenserQueue = new Queue("Dispenser", {
  redis: { port: process.env.REDIS_PORT || 6379, host: "127.0.0.1" },
  settings: {
    drainDelay: 10,
    guardInterval: 100,
    stalledInterval: 100,
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

  // const failHandler = handler.failHandler || handleFailure;
  // const completedHandler = handler.completedHandler || handleCompleted;

  // here are samples of listener events : "failed","completed","stalled", the other events will be ignored
  queue.on("failed", async(job, err) => {
    try {
      logger.error(err);
      await queue.removeJobs(job.id);
      
      if(await queue.isPaused())
      await queue.resume()

      await queue.add(job.data, {delay: 2000});
    } catch (error) {
      console.log(error.message)
    }
  });

  queue.on("completed", async (job) => {
    logger.info(
      `Job: ${job.id} sent for processing.`
    );
    await job.remove();

    if(await queue.isPaused())
    await queue.resume();
  });

  queue.on("stalled", async(job) => {
    console.log(`Dispenser Queue is stalled on job: ${job.id}`);
    
    if(!await job.isActive())
    await job.remove();

    if(await queue.isPaused())
    await queue.resume();
  })

  queue.on("waiting", async (job) => {
    console.log("Waiting at the moment on job: " + job);
    if(await queue.isPaused())
    await queue.resume();
  });

  queue.on("active", async (job) => {
    console.log(`Job: ${job.id} has started.`);
    await queue.pause();
  });

  queue.on("paused", () => console.log(`Dispenser Queue has paused.`));
  queue.on("resumed", () => console.log("Dispenser Queue has resumed."));

  queue.on("error", (err) => {
    console.log(`Something happened!`)
  });

  // queue.on("global:resumed", () => console.log("Dispenser Queue has resumed"));
  queue.process(processor); // link the correspondant processor/worker

  logger.info(`Processing ${queue.name}...`);
});

module.exports = dispenserQueue;