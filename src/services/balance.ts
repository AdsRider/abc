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
  user_email,
  type,
  amount,
  available
`;

const balanceObject = z.object({
  id: z.string(),
  user_email: z.string(),
  type: z.union([z.literal('ADS'), z.literal('ETH'), z.literal('KRW')]),
  amount: z.string(),
  available: z.string(),
});

const createDefaultBalance = async (pool: DatabaseTransactionConnection, userEmail: string) => {
  const values = ['ETH', 'KRW', 'ADS'].map(c => [userEmail, c, '0', '0']);
  const unnsetTypes = Array(4).fill('text');
  return pool.any(sql.type(balanceObject)`
    INSERT INTO balance (
      user_email,
      type,
      amount,
      available
    ) SELECT * FROM ${sql.unnest(values, unnsetTypes)}
  `);
};

const getBalanceByEmail = async (
  pool: DatabasePool | DatabaseTransactionConnection,
  userEmail: string,
) => {
  return pool.any(sql.type(balanceObject)`
    SELECT ${sqlBalanceFragment}
    FROM balance
    WHERE user_email = ${userEmail}
  `);
};


const getCurrencyBalanceByEmail = async (
  pool: DatabasePool | DatabaseTransactionConnection,
  userEmail: string,
  currency: CurrencyType
) => {
  return pool.one(sql.type(balanceObject)`
    SELECT ${sqlBalanceFragment}
    FROM balance
    WHERE user_email = ${userEmail} and currency = ${currency}
  `);
};

const updateBalanceAndAvailable = async (
  pool: DatabaseTransactionConnection,
  userEmail: string,
  currencyType: CurrencyType,
  adjustAmount: BigNumber,
) => {
  const balance = await getCurrencyBalanceByEmail(pool, userEmail, currencyType);
  const updatedBalance = new BigNumber(balance.amount).plus(adjustAmount);
  const updatedAvailable = new BigNumber(balance.available).plus(adjustAmount);

  return pool.one(sql.type(balanceObject)`
    UPDATE balance
      SET amount = ${updatedBalance.toString()},
        available = ${updatedAvailable.toString()}
    WHERE id = ${balance.id}
    RETURNING *
  `);
};

const updateBalance = async (
  pool: DatabaseTransactionConnection,
  userEmail: string,
  currencyType: CurrencyType,
  adjustAmount: BigNumber,
) => {
  const balance = await getCurrencyBalanceByEmail(pool, userEmail, currencyType);
  const updatedBalance = new BigNumber(balance.amount).plus(adjustAmount);

  return pool.one(sql.type(balanceObject)`
    UPDATE balance
      SET amount = ${updatedBalance.toString()}
    WHERE id = ${balance.id}
    RETURNING *
  `);
};

const updateAvailable = async (
  pool: DatabaseTransactionConnection,
  userEmail: string,
  currencyType: CurrencyType,
  adjustAmount: BigNumber,
) => {
  const balance = await getCurrencyBalanceByEmail(pool, userEmail, currencyType);
  const updatedAvailable = new BigNumber(balance.available).plus(adjustAmount);

  return pool.one(sql.type(balanceObject)`
    UPDATE balance
      SET available = ${updatedAvailable.toString()}
    WHERE id = ${balance.id}
    RETURNING *
  `);
};

export {
  createDefaultBalance,
  getBalanceByEmail,
  getCurrencyBalanceByEmail,
  updateBalanceAndAvailable,
  updateBalance,
  updateAvailable,
};
