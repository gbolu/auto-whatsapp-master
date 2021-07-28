const mainSlaves = process.env.SLAVE_IPS.split(',').filter(IP => IP !== '');
const backupSlaves = process.env.BACKUP_SLAVE_IPS.split(',').filter(IP => IP !== '');
const axios = require('axios').default;
const logger = require('./logger');

const totalSlaves = [...mainSlaves.map(slave => {
  return {
    type: 'Main',
    server: slave
  }
}), ...backupSlaves.map(slave => {
  return {
    type: 'Backup',
    server: slave
  }
})];

const getAvailableServer = async function*(arr=[]) {
  for(let i = 0; ; i++){        
    if(i < arr.length){      
      try {
        const response = await axios.get(`${arr[i].server}/queue/isAvailable`);
        if(response.data.data && response.data.data.isAvailable){
          yield arr[i].server;
          i = -1;
          continue;
        }
      } catch (error) {
        logger.info(
          `${arr[i].type} Server: ${arr[i].server} is not available at the moment...`
        );
          continue;
      }       
    }

    else {
      i = -1;
    }
  }
}

const serverGenerator = getAvailableServer(totalSlaves);

module.exports = serverGenerator;