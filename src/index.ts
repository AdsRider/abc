import 'express-async-errors';
import express from 'express';
import { connect } from './database/pool';
import { MainRouter } from './api';

const app = express();
const port = 3000;
const globalPrefix = '/api';

const main = async () => {
  const pool = await connect();

  app.use(globalPrefix, MainRouter(pool));

  const server = app.listen(port, () => {
    console.log(`Server is Listening on PORT ${port}`);
  });

  const gracefulShutdownHandler = (signal: NodeJS.SignalsListener) => {
    console.log(`[${new Date().toISOString()}] ${signal} signal received: closing HTTP server`);
    server.close(() => {
        console.log('HTTP server closed');
    });
  };

  process.on('SIGTERM', gracefulShutdownHandler);
  process.on('SIGINT', gracefulShutdownHandler);
};
main();
