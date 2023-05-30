import express from 'express';
import { DatabasePool } from 'slonik';
import BigNumber from 'bignumber.js';
import { getBalanceByEmail, getCurrencyBalanceByEmail, updateBalanceAndAvailable } from '../../services/balance';
import { updateExpireDate } from '../../services/users';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';
import { LoginRouter } from './login';
import { DwRouter } from './dw';
import { saveSpecialLog } from '../../services/dw';

const router = express.Router();

type TicketDay = 1 | 30 | 365

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
    const day = req.body.day as TicketDay;
    const expired_date = user.expired_date;
    const extendPeriod = +day * 24 * 60 * 60 * 1000;
    const now = new Date();

    const dayPriceTable = {
      1: '2000',
      30: '7000',
      365: '30000',
    };

    if (!Object.keys(dayPriceTable).includes(day.toString())) {
      throw new ClientError(400, 'bad_day_param');
    }
    const price = dayPriceTable[day];

    const updatedUser = await pool.transaction(async (conn) => {
      const balance = await getCurrencyBalanceByEmail(conn, user.email, 'ADS');
      if (new BigNumber(price).gt(new BigNumber(balance.available))) {
        throw new ClientError(400, 'not_enough_balance');
      }

      await updateBalanceAndAvailable(conn, user.email, 'ADS', new BigNumber(price).negated());
      await saveSpecialLog(conn, {
        memo: '아용권구매',
        amount: price,
        user_email: user.email,
        address: user.address,
        hash: '',
      });
      const updatedDate = now < expired_date
        ? new Date(+expired_date + extendPeriod)
        : new Date(+now + extendPeriod);

      const updatedUser = await updateExpireDate(conn, user.email, updatedDate);
      return updatedUser;
    });
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
  router.post('/buyticket', buyTicket);
  router.use(DwRouter(pool));

  return router;
};
