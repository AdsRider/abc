import express from 'express';
import { DatabasePool } from 'slonik';
import { getBalanceByEmail } from '../../services/balance';
import { updateExpireDate } from '../../services/users';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';
import { LoginRouter } from './login';
import { WithdrawalRouter } from './withdrawal';

const router = express.Router();

export const UserRouter = (pool: DatabasePool) => {
  const getBalanceRequestHandler = async (req: express.Request, res: express.Response) => {
    const user = req.session.user;
    if (user == null) {
      throw new ClientError(401, 'need_login');
    }
    const balance = await getBalanceByEmail(pool, user.email);

    return res.json(balance);
  };

  const whoami = (req: express.Request, res: express.Response) => {
    const me = req.session.user;

    return res.json(me);
  };

  const buyTicket = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const day = req.body.day as number;
    const expire_date = user.expire_date;
    const extendPeriod = day * 24 * 60 * 60;
    const now = new Date();

    const updatedDate = now < expire_date
      ? new Date(+expire_date + extendPeriod)
      : new Date(+now + extendPeriod);

    const updatedUser = await updateExpireDate(pool, user.email, updatedDate);
    req.session.user = updatedUser;

    return res.json(updatedUser);
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

  router.use(LoginRouter(pool));

  router.use(loginAuthGuard(pool));
  router.get('/balance', getBalanceRequestHandler);
  router.get('/me', whoami);
  router.get('/logout', logout);
  router.use('/withdrawal', WithdrawalRouter(pool));
  router.post('/buyticket', buyTicket);

  return router;
};
