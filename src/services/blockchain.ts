import {
  sql,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';
import { z } from 'zod';
import { BlockDAO, TransactionDAO } from '../types/blockchain';

const sqlBlockFragment = sql.fragment`
  hash,
  parent_hash,
  height,
  timestamp
`;

const blockObject = z.object({
  hash: z.string(),
  parent_hash: z.string(),
  height: z.number(),
  timestamp: z.date(),
});

export const transactionObject = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.string(),
  type: z.union([z.literal('ADS'), z.literal('ETH'), z.literal('KRW')]),
  block_hash: z.string(),
  timestamp: z.date(),
});

const insertBlocks = (pool: DatabaseTransactionConnection, blockData: BlockDAO[]) => {
  const blocksQuery = blockData.map(b => {
    return sql.unsafe`
      (${b.hash}, ${b.parent_hash}, ${b.height}, ${b.timestamp})
    `;
  });

  return pool.any(sql.type(blockObject)`
    INSERT INTO block (
      hash,
      parent_hash,
      height,
      timestamp
    ) VALUES
    ${sql.join(blocksQuery, sql.fragment`,`)}
    RETURNING *
  `);
};

const getLatestBlockHeight = async (pool: DatabasePool | DatabaseTransactionConnection) => {
  const maxHeightObject = z.object({ latest: z.number() });
  const result = await pool.one(sql.type(maxHeightObject)`
    SELECT max(height) as latest FROM block
  `);

  return result.latest;
};

const insertTransactions = async (pool: DatabaseTransactionConnection, transactionData: TransactionDAO[]) => {
  const transactionQuery = transactionData.map((tx) => {
    return sql.unsafe`
      (${tx.hash}, ${tx.from}, ${tx.to}, ${tx.amount}, ${tx.type}, ${tx.block_hash}, ${tx.timestamp})
    `;
  });


  return pool.any(sql.type(transactionObject)`
    INSERT INTO transaction (
      hash,
      "from",
      "to",
      amount,
      type,
      block_hash,
      timestamp
    ) VALUES
    ${sql.join(transactionQuery, sql.fragment`,`)}
    RETURNING *
  `);
};

export {
  insertBlocks,
  getLatestBlockHeight,
  insertTransactions,
}
