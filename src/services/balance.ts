import BigNumber from 'bignumber.js';
import {
  sql,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';
import { CurrencyType } from '../types/blockchain';

const sqlBalanceFragment = sql.fragment`
  id,
  user_id,
  type,
  amount,
  available
`;

const getBalance = async (
  pool: DatabasePool | DatabaseTransactionConnection,
  userId: string,
  currencyType: CurrencyType,
) => {
  return pool.one(sql.unsafe`
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
  const balance = await getBalance(pool, userId, currencyType);
  const updatedBalance = new BigNumber(balance.amount).plus(adjustAmount);

  const result = await pool.one(sql.unsafe`
  `);
};
