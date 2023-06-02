import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { transactionObject } from './blockchain';

export type SaveSpecialLogDao = {
  memo: string;
  amount: string;
  user_email: string;
  address: string;
  hash: string;
};

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
  "from",
  "to",
  amount,
  type,
  block_hash,
  timestamp
`;

const specialLogObject = z.object({
  id: z.string(),
  memo: z.string(),
  amount: z.string(),
  hash: z.string(),
  user_email: z.string(),
  address: z.string(),
  timestamp: z.date(),
});

const specialLogFragment = sql.fragment`
  id,
  memo,
  amount,
  hash,
  user_email,
  address,
  timestamp
`;

const saveWithdrawalHistory = (conn: DatabaseTransactionConnection, address: string, user_email: string, amount: string, hash: string) => {
  return conn.one(sql.type(withdrawalObject)`
    INSERT INTO withdrawal (
      address,
      user_email,
      amount,
      hash
    ) VALUES (
      ${address.toLowerCase()},
      ${user_email},
      ${amount},
      ${hash}
    ) RETURNING ${withdrawalFragment}
  `);
};

const saveSpecialLog = (conn: DatabaseTransactionConnection, saveSpecialLogDao: SaveSpecialLogDao) => {
  return conn.one(sql.type(specialLogObject)`
    INSERT INTO special_log (
      memo,
      amount,
      user_email,
      address,
      hash
    ) VALUES (
      ${saveSpecialLogDao.memo},
      ${saveSpecialLogDao.amount},
      ${saveSpecialLogDao.user_email},
      ${saveSpecialLogDao.address},
      ${saveSpecialLogDao.hash}
    ) RETURNING ${specialLogFragment}
  `);
};

const getHistoryByUser = async (pool: DatabasePool, email: string, address: string) => {
  const specialLog = await pool.any(sql.type(specialLogObject)`
    SELECT ${specialLogFragment}
    FROM special_log
    WHERE user_email = ${email} and LOWER(address) = ${address.toLowerCase()}
    ORDER BY timestamp
  `);
  const specialLogHashList = specialLog.map(x => x.hash);
  const withdrawal = await pool.any(sql.type(withdrawalObject)`
    SELECT ${withdrawalFragment}
    FROM withdrawal
    WHERE user_email = ${email} and LOWER(address) = ${address}
      AND hash not in (${sql.join(specialLogHashList, sql.fragment`, `)})
    ORDER BY timestamp
  `);
  const deposit = await pool.any(sql.type(transactionObject)`
    SELECT ${depositHistoryFragment}
    FROM transaction
    WHERE LOWER("to") = ${address.toLowerCase()}
      AND hash not in (${sql.join(specialLogHashList, sql.fragment`, `)})
    ORDER BY timestamp
  `);

  const history = [
    ...withdrawal.map(w => ({
      // transaction의 amount값에는 +-가 존재하지 않기때문에
      // withdrawal로그 가져올시 hardcoding함
      amount: '-' + w.amount,
      hash: w.hash,
      timestamp: w.timestamp,
      type: '출금',
    })),
    ...deposit.map(d => ({
      amount: d.amount,
      hash: d.hash,
      timestamp: d.timestamp,
      type: '입금',
    })),
    ...specialLog.map(s => ({
      amount: s.amount,
      hash: s.hash,
      timestamp: s.timestamp,
      type: s.memo,
    })),
  ];

  return history.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
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
  saveSpecialLog,
  getHistoryByUser,
  getWithdrawalByHash,
  updateWithdrawalStatus,
};
