import express from 'express';
import { DatabasePool } from 'slonik';
import { AdsRouter } from './ads';
import { HealthCheckRouter } from './hc';
import { ImageRouter } from './image';
import { UserRouter } from './user';
import { PaymentRouter } from './payment';
import { StatisticsRouter } from './statistics';

export const MainRouter = (pool: DatabasePool) => {
  const router = express.Router();

  router.use('/hc', HealthCheckRouter());
  router.use('/user', UserRouter(pool));
  router.use('/ads', AdsRouter(pool));
  router.use('/image', ImageRouter(pool));
  router.use('/payment', PaymentRouter(pool));
  router.use('/statistics', StatisticsRouter(pool));

  return router;
};
