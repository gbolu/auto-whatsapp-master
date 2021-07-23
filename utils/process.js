const axios = require("axios").default;
const getAvailableServer = require('./generateServer');
const logger = require('./logger');

const processor = function(job, done) {
    const availableServer = getAvailableServer.next().value;
    axios.post(`${availableServer}/addJob`, job.data)
    .then(_ => {
        logger.info(`Job ${job.id} dispensed to slave: ${availableServer} 🙂 !`);
        done(null);
    })
    .catch(err => {
        logger.error(err.message);
        done(new Error(err.message))
    });
};

module.exports = processor;