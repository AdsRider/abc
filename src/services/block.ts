import {
  sql,
  DatabasePool,
  DatabaseTransactionConnection,
  DatabaseConnection,
} from 'slonik';
import { z } from 'zod';

// TODO 분리
type BlockDAO = {
  hash: string,
  parent_hash: string,
  height: number,
  date: Date,
};

const sqlBlockFragment = sql.fragment`
  hash,
  parent_hash,
  height,
  date
`;

const blockObject = z.object({
  hash: z.string(),
  parent_hash: z.string(),
  height: z.number(),
  date: z.date(),
});

const insertBlock = (pool: DatabaseTransactionConnection, blockData: BlockDAO) => {
  return pool.one(sql.type(blockObject)`
    INSERT INTO block (
      hash,
      block_hash,
      height,
      date
    ) VALUES (
      ${blockData.hash},
      ${blockData.parent_hash},
      ${blockData.height},
      ${blockData.date.toISOString()}
    ) RETURNING *
  `);
};

const getLatestBlockHeight = async (pool: DatabasePool | DatabaseTransactionConnection) => {
  const result = await pool.one(sql.type(z.object({ latest: z.number() }))`
    SELECT max(height) as latest FROM block
  `);

  return result.latest;
};

export {
  insertBlock,
  getLatestBlockHeight,
}
