import express from 'express';
import { DatabasePool } from 'slonik';
import { getBalanceById } from '../../services/balance';
import { LoginRouter } from './login';

const router = express.Router();

export const UserRouter = (pool: DatabasePool) => {
  const getBalanceRequestHandler = async (req: express.Request, res: express.Response) => {
    const user = req.user;
    if (user == null) {
      throw new Error();
    }
    const balance = await getBalanceById(pool, user.id, 'ADS');

    return res.json(balance);
  };

  router.get('/balance', getBalanceRequestHandler);
  router.get('/', (_, res) => res.json());

  router.use(LoginRouter(pool));

  return router;
};
