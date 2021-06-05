const Queue = require("bull");
const axios = require("axios").default;
const checkAvailableServer = require('../utils/checkAvailableServer');

const dispenserQueue = new Queue("dispenser", {
  redis: { port: process.env.REDIS_PORT || 6379, host: "127.0.0.1" },
  limiter: {
    max: 10,
  },
});

dispenserQueue.process(async(job) => new Promise((resolve, reject) => {
    const isAvailable = await checkAvailableServer();

    if(isAvailable !== false){
        try {
            await axios.post(`${isAvailable}/addJob`, job.data);
            resolve(true);
        } catch (error) {
            console.error(error);
        }
    }

    if(isAvailable === false && job.attemptsMade === 2){
        await dispenserQueue.add(job.data);
        await dispenserQueue.removeJobs(job.id);
    }

    reject(false);
}));

module.exports = dispenserQueue;