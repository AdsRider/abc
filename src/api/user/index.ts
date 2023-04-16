import express from 'express';
import { DatabasePool } from 'slonik';
import { getBalanceById } from '../../services/balance';
import { User } from '../../types/user';

const router = express.Router();

export const UserRouter = (pool: DatabasePool) => {

  const getBalanceRequestHandler = async (req: express.Request, res: express.Response) => {
    const user = req.user;
    const balance = await getBalanceById(pool, user.id, 'ADS');

    res.json(balance);
  };

  router.get('/', (_, res) => res.json());
  router.get('/:id/balance', getBalanceRequestHandler);

  return router;
};
