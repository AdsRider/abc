import express from 'express';
import { DatabasePool } from 'slonik';
import { getBalanceByEmail } from '../../services/balance';
import { updateExpireDate } from '../../services/users';
import { loginAuthGuard } from '../common';
import { LoginRouter } from './login';
import { WithdrawalRouter } from './withdrawal';

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

  const buyTicket = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const { day }: BuyTicketBody = req.body;
    const expire_date = user.expire_date;

    expire_date.setDate(expire_date.getDate() + day);

    const updatedUser = await updateExpireDate(pool, user.email, user.expire_date)

    if (updatedUser.expire_date != expire_date) {
      throw new Error('날짜 변경 오류');
    }
    return res.json(user.expire_date.toISOString);
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
  router.use('/buyticket', buyTicket);

  return router;
};

interface BuyTicketBody {
  day: number;
}