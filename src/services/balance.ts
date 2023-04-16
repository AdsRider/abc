import BigNumber from 'bignumber.js';
import {
  sql,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';
import { z } from 'zod';
import { CurrencyType } from '../types/blockchain';

const sqlBalanceFragment = sql.fragment`
  id,
  user_id,
  type,
  amount,
  available
`;

const balanceObject = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.union([z.literal('ADS'), z.literal('ETH')]),
  amount: z.string(),
  available: z.string(),
});

const getBalanceById = async (
  pool: DatabasePool | DatabaseTransactionConnection,
  userId: string,
  currencyType: CurrencyType,
) => {
  return pool.one(sql.type(balanceObject)`
    SELECT ${sqlBalanceFragment}
    FROM balance
    WHERE id = ${userId} and type = ${currencyType}
  `);
};

const updateBalance = async (
  pool: DatabaseTransactionConnection,
  userId: string,
  currencyType: CurrencyType,
  adjustAmount: BigNumber,
) => {
  const balance = await getBalanceById(pool, userId, currencyType);
  const updatedBalance = new BigNumber(balance.amount).plus(adjustAmount);

  const result = await pool.one(sql.unsafe`
  `);
};

export {
  getBalanceById,
  updateBalance,
};
