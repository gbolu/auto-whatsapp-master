const axios = require('axios').default;
const logger = require('./logger');
const slaves = process.env.SLAVE_IPS.split(',').filter(IP => IP !== '');
// 35.190.201.121

console.log(slaves);

const checkAvailableServer = () => new Promise(async(resolve, reject) => {
    let index = 0;

    let isAvailable = false;
    
    while(isAvailable === false){
        let response;

        if(index === slaves.length){
            index = 0;
        }

        try {
            logger.info(`Trying slave: ${slaves[index]}`)
            response = await axios.get(`${slaves[index]}/isAvailable`)
        } catch (error) {
            logger.warn(error.message);
        }

        if(response && response.data.data.isAvailable === true)
        {
            isAvailable = (slaves[index]);
            index = 0;
            break;
        }

        logger.info(`Slave Server : ${slaves[index]} is not available ...`)
        index += 1;
    }

    resolve(isAvailable);
});

module.exports = checkAvailableServer;