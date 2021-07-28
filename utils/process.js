const axios = require("axios").default;
const getAvailableServer = require('./generateServer');
const logger = require('./logger');

const processor = function(job, done) {
    let availableServer;

    availableServer = new Promise(async (resolve, reject) => {
        let nextVal; 
        try {
            nextVal = await getAvailableServer.next();
            resolve(nextVal.value);
        } catch (error) {
            reject(error);
        }
    })
    .then(availableServer => 
        axios.post(`${availableServer}/addJob`, job.data)
        .then(_ => {
            logger.info(`Job ${job.id} dispensed to slave: ${availableServer} 🙂 !`);
            done(null);
        }))
    .catch(error => {
        logger.error(error.message)
        done(new Error(error.message))
    });
};

module.exports = processor;