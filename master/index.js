const express = require('express');
const {Response} = require('http-status-codez');
const dispenserQueue = require('../utils/dispenserQueue');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const {message, phone_number, id} = req.body;

    if(!message || !phone_number || !id)
    return res.status(Response.HTTP_BAD_REQUEST).json({
        code: res.statusCode,
        status: 'fail',
        message: 'One or more of the required fields: id, message, phone_number is not provided.',
        data: null 
    })

    try {
        await dispenserQueue.add({message, phone_number, id}, {attempts: 2});
    } catch (error) {
        console.error(error);
        return res.status(Response.HTTP_INTERNAL_SERVER_ERROR).json({
          code: res.statusCode,
          status: "fail",
          message:
            "An error occurred while adding this job to the queue.",
          data: null,
        });
    }

    return res.status(Response.HTTP_OK).json({
      code: res.statusCode,
      message: `Message to ${phone_number} queued successfully.`,
      status: "success",
      data: null,
    });
})

app.listen(80, () => {
    console.log('Master server is listening...')
})
