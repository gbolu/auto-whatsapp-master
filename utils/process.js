const axios = require("axios").default;
const checkAvailableServer = require('../utils/checkAvailableServer');
const logger = require('./logger');

const processor = function(job, done) {
    return checkAvailableServer()
    .then(isAvailable => {
        if(isAvailable !== false){
            axios.post(`${isAvailable}/addJob`, job.data)
            .then(response => {
                logger.info(`Job ${job.id} dispensed to slave: ${isAvailable} 🙂 !`);
                return;
            })
            .catch(err => {
                done(err)
            });
        }

        done(null);
    })
    .catch(err => done(err));
};

module.exports = processor;