const express = require('express');
const whatsappQueue = require('../utils/whatsappQueue');

const app = express();

app.use(express.json());

app.get('/isAvailable', async(req, res, next) => {
  let isAvailable = false;

  if((await whatsappQueue.count()) === 0)
  isAvailable = true;

  return res.status(200).json({
      status: 'success',
      code: res.statusCode,
      data: {isAvailable},
      message: 'Server is available for processing.'
  });
})

app.post('/addJob', async(req, res, next) => {
    const { id, message, phone_number } = req.body;

    try {
      await whatsappQueue.add({ id, message, phone_number }, { attempts: 2 });
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }

    res.status(200).end();
});

app.listen(80, () => console.log("Slave server listening..."));