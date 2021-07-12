const axios = require("axios").default;
const checkAvailableServer = require('../utils/checkAvailableServer');

const processor = function(job, done) {
    return checkAvailableServer()
    .then(isAvailable => {
        if(isAvailable !== false){
            axios.post(`${isAvailable}/addJob`, job.data)
            .then(response => {
                console.log(`Job dispensed to slave: ${isAvailable}!`);
                return;
            })
            .catch(err => {
                done(err)
            });
        }

        console.log("Reached!");
        done(null);
    })
    .catch(err => done(err));
};

module.exports = processor;