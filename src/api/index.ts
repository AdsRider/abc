import express from 'express';
import { DatabasePool } from 'slonik';
import {HealthCheckRouter} from './hc';

export const MainRouter = (pool: DatabasePool) => {
  const router = express.Router();

  router.use('/hc', HealthCheckRouter());

  return router;
};
