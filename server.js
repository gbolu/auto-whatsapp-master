require('dotenv').config();
const { createServer } = require('http');
const app = require('./app');
const cleanDispenserQueue = require('./utils/cleanDispenserQueue');
const logger = require('./utils/logger');

// HANDLING UNCAUGHT EXCEPTION ERRORS
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 🙄 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 4000;

const server = createServer(app);

(async () => {
  cleanDispenserQueue()
  .then(() => logger.info("Dispenser Queue Cleaned!"))
  .catch(err => console.error(err));
})()

server.listen(port, () => {
  logger.info(`Master Server is listening on port: ${port}`);
})

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  logger.error('UNHANDLED REJECTION! 😞 Shutting down Server...');
  server.close(() => {
    process.exit(1);
  });
});
