import express from 'express';
import { DatabasePool } from 'slonik';
import { HealthCheckRouter } from './hc';
import { UserRouter } from './user';

export const MainRouter = (pool: DatabasePool) => {
  const router = express.Router();

  router.use('/hc', HealthCheckRouter());
  router.use('/user', UserRouter(pool));

  return router;
};
