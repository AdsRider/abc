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

  app.listen(port);
};
main();
