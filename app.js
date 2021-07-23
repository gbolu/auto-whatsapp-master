const { default: axios } = require('axios');
const express = require('express');
const dispenserQueue = require('./utils/dispenserQueue');

const app = express();

app.use(express.json());

app.post('/', async(req, res, next) => {
  if(!req.body.message || !req.body.phone_number){
    return res.status(400).json({
        code: res.statusCode,
        status: 'fail',
        message: 'The message and phone number are required fields.',
        data: null 
    })
  }

  const { id, message, phone_number } = req.body;

  try {
    await dispenserQueue.add({ id, message, phone_number });
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }

  let queueCount = 0;

  let slaveServers = process.env.SLAVE_IPS.split(',').filter(IP => (IP != '') || IP != ' ');
  let slaveServerQueueCountPromises = slaveServers.map(IP => {
    return new Promise(async (resolve) => {
      let count;
      try {
        let response = await axios.get(`${IP}/queue/count`);
        count = response.data.count;
      } catch (error) {
        console.log(error.message);
      }
      
      resolve(count);
    })
  });
  
  let countResults = await Promise.all(slaveServerQueueCountPromises);
  queueCount = countResults.reduce((acc, curr) => {    
    if(curr)
    return acc + curr;

    return acc;
  });
  console.log(queueCount);

  res.status(200).json({
    code: res.statusCode,
    message: `Message to ${phone_number} queued successfully.`,
    status: "success",
    data: {
      id,
      queueCount,
      message,
      phone_number,
    },
  });
});

module.exports = app