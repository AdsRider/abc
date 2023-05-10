import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { transactionObject } from './blockchain';

const withdrawalFragment = sql.fragment`
  id,
  address,
  user_email,
  amount,
  hash,
  timestamp,
  status
`;

const withdrawalObject = z.object({
  id: z.string(),
  address: z.string(),
  user_email: z.string(),
  amount: z.string(),
  hash: z.string(),
  timestamp: z.date(),
  status: z.string(),
});

const depositHistoryFragment = sql.fragment`
  hash,
  from,
  to,
  amount,
  type,
  block_hash,
  timestamp,
`;

const saveWithdrawalHistory = (conn: DatabaseTransactionConnection, address: string, user_email: string, amount: string, hash: string) => {
  return conn.one(sql.type(withdrawalObject)`
    INSERT INTO withdrawal (
      address,
      user_email,
      amount,
      hash
    ) VALUES (
      ${address},
      ${user_email},
      ${amount},
      ${hash}
    ) RETURNING ${withdrawalFragment}
  `);
};

const getHistoryByUser = async (pool: DatabasePool, email: string, address: string) => {
  const withdrawal = await pool.any(sql.type(withdrawalObject)`
    SELECT ${withdrawalFragment}
    FROM withdrawal
    WHERE user_email = ${email} and address = ${address}
    ORDER BY timestamp
  `);
  const deposit = await pool.any(sql.type(transactionObject)`
    SELECT ${depositHistoryFragment}
    FROM transaction
    WHERE to = ${address}
  `);

  const history = [
    ...withdrawal.map(w => ({
      amount: w.amount,
      hash: w.hash,
      timestamp: w.timestamp,
    })),
    ...deposit.map(d => ({
      amount: d.amount,
      hash: d.hash,
      timestamp: d.timestamp,
    })),
  ];

  return history.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
};

const getWithdrawalByHash = async (conn: DatabaseTransactionConnection, hash: string) => {
  return conn.maybeOne(sql.type(withdrawalObject)`
    SELECT ${withdrawalFragment}
    FROM withdrawal
    WHERE hash = ${hash}
  `);
};

const updateWithdrawalStatus = async (conn: DatabaseTransactionConnection, hash: string, status: string) => {
  return conn.one(sql.type(withdrawalObject)`
    UPDATE withdrawal
    SET status = ${status}
    WHERE hash = ${hash}
    RETURNING ${withdrawalFragment}
  `);
};

export {
  saveWithdrawalHistory,
  getHistoryByUser,
  getWithdrawalByHash,
  updateWithdrawalStatus,
}
