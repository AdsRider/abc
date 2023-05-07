import BigNumber from 'bignumber.js';
import express from 'express';
import { DatabasePool } from 'slonik';
import { withdrawalADScoin } from '../../network/jsonrpc';
import { getSystemAccountByType } from '../../services/address';
import { getBalanceByEmail, updateAvailable } from '../../services/balance';
import { ClientError } from '../../util/error';

const router = express.Router();

type WithdrawalBody = {
  amount: string;
  to: string;
}

export const WithdrawalRouter = (pool: DatabasePool) => {
  const withdrawalCoin = async (req: express.Request, res: express.Response) => {
    const user = req.session.user;
    if (user == null) {
      throw new ClientError(401, 'need_login');
    }

    const body = req.body as WithdrawalBody;
    const amount = new BigNumber(body.amount);
    const to = body.to;
    if (amount.isNaN()) {
      throw new ClientError(400, 'invalid_params');
    }
    // TODO: check is valid address

    const result = await pool.transaction(async(conn) => {
      const userBalance = await getBalanceByEmail(pool, user.email);
      const adsBalance = userBalance.filter(x => x.type === 'ADS')[0];

      if (new BigNumber(adsBalance.available).lt(amount)) {
        throw new ClientError(400, 'invalid_request');
      }

      const withdrawalAccount = await getSystemAccountByType(pool, 'SYSTEM_WITHDRAWAL');
      const { address: from, privatekey } = withdrawalAccount;

      // 출금
      const txHash = await withdrawalADScoin(from, to, amount.toString(), privatekey);

      // 변경된 잔고사항 반영
      const updatedBalance = await updateAvailable(pool, user.email, 'ADS', amount.negated());

      return txHash;
    });

    return res.json(result);
  };

  router.post('/', withdrawalCoin);

  return router;
};
