import express from 'express';
import { DatabasePool } from 'slonik';
import { AdsRouter } from './ads';
import { HealthCheckRouter } from './hc';
import { UserRouter } from './user';

export const MainRouter = (pool: DatabasePool) => {
  const router = express.Router();

  router.use('/hc', HealthCheckRouter());
  router.use('/user', UserRouter(pool));
  router.use('/ads', AdsRouter(pool));

  return router;
};
