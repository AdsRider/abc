import express from 'express';
import { DatabasePool } from 'slonik';
import BigNumber from 'bignumber.js';
import { getBalanceByEmail, getCurrencyBalanceByEmail, updateBalanceAndAvailable } from '../../services/balance';
import { updateExpireDate } from '../../services/users';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';
import { LoginRouter } from './login';
import { DwRouter } from './dw';

const router = express.Router();

type TicketDay = '10' | '40' | '200'

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
      10: '2000',
      40: '7000',
      200: '30000',
    };

    if (Object.keys(dayPriceTable).includes(day)) {
      throw new ClientError(400, 'bad_day_param');
    }
    const price = new BigNumber(dayPriceTable[day]);
    const balance = await getCurrencyBalanceByEmail(pool, user.email, 'ADS');

    if (price.gt(new BigNumber(balance.available))) {
      throw new ClientError(400, 'not_enough_balance');
    }

    await updateBalanceAndAvailable(pool, user.email, 'ADS', new BigNumber(price).negated());

    const updatedDate = now < expired_date
      ? new Date(+expired_date + extendPeriod)
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
  router.post('/buyticket', buyTicket);
  router.use(DwRouter(pool));

  return router;
};
