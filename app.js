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

  const queueCount = await dispenserQueue.count();

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