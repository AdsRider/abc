import { DatabasePool } from 'slonik';
import express from 'express';
import axios from 'axios';
import { config } from '../../config';
import { updateBalanceAndAvailable } from '../../services/balance';
import BigNumber from 'bignumber.js';
import { loginAuthGuard } from '../common';
import { ClientError } from '../../util/error';
import { saveSpecialLog } from '../../services/dw';

const router = express.Router();

export const PaymentRouter = (pool: DatabasePool) => {
  const successHandler = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const {paymentType, orderId, paymentKey, amount} = req.body;
    // 아래 approve 절차를 거쳐야하지만, 실제 key가 아니기때문에 결제는 이루어지지않음
    // const approvePayment = await axios.post('https://api.tosspayments.com/v1/payments/confirm', {
    //   paymentKey,
    //   amount,
    //   orderId,
    // }, {
    //   headers: {
    //     'Authorization': `Basic ${config.payment.secret}`,
    //     'Content-Type': 'application/json',
    //   }
    // });
    // if (approvePayment 실패) {
    //   throw new ClientError(400, 'invalid_payment');
    // }

    if (amount == null || typeof amount !== 'string') {
      throw new ClientError(400, 'invalid_amount');
    }

    const result = await pool.transaction(async (conn) => {
      const balance = await updateBalanceAndAvailable(pool, user.email, 'ADS', new BigNumber(amount));
      await saveSpecialLog(conn, {
        address: user.address,
        user_email: user.email,
        hash: '',
        amount: amount,
        memo: '코인구매',
      });

      return balance;
    });

    return res.json(result);
  };

  router.use(loginAuthGuard(pool));
  router.post('/success', successHandler);

  return router;
};
