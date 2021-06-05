const axios = require("axios").default;
const checkAvailableServer = require('../utils/checkAvailableServer');

const processor = async job => {
    const isAvailable = await checkAvailableServer();

    if(isAvailable !== false){
        try {
            await axios.post(`${isAvailable}/addJob`, job.data);
            return Promise.resolve(true);
        } catch (error) {
            console.error(error);
        }
    }

    return Promise.reject(false);
};

module.exports = processor;