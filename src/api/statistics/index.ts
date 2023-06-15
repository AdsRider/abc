import express from 'express';
import { DatabasePool } from 'slonik';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';

const router = express.Router();

export const StatisticsRouter = (pool: DatabasePool) => {

  const getStatistics = async (req: express.Request, res: express.Response) => {

  };

  router.use(loginAuthGuard(pool));
  router.get('/', getStatistics);

  return router;
};
