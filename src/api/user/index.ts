import express from 'express';
import { DatabasePool } from 'slonik';
import { getBalanceByEmail } from '../../services/balance';
import { LoginRouter } from './login';

const router = express.Router();

export const UserRouter = (pool: DatabasePool) => {
  const getBalanceRequestHandler = async (req: express.Request, res: express.Response) => {
    const user = req.session.user;
    if (user == null) {
      throw new Error();
    }
    const balance = await getBalanceByEmail(pool, user.email);

    return res.json(balance);
  };

  const whoami = (req: express.Request, res: express.Response) => {
    const me = req.session.user;

    return res.json(me);
  };

  const logout = (req: express.Request, res: express.Response) => {
    if (req.session) {
      req.session.destroy(() => {
        res.redirect('/')
      });
    } else {
      return res.redirect('/');
    }
  };

  const withdrawalCoin = () => {
  };

  router.get('/balance', getBalanceRequestHandler);
  router.get('/me', whoami);
  router.get('/logout', logout);
  router.post('/withdrawal', withdrawalCoin);

  router.use(LoginRouter(pool));

  return router;
};
