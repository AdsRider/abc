import {
  sql,
  DatabasePool,
  DatabaseTransactionConnection,
} from 'slonik';
import { z } from 'zod';

// TODO 분리
type BlockDAO = {
  hash: string,
  parent_hash: string,
  height: number,
  timestamp: string,
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

const insertBlocks = (pool: DatabaseTransactionConnection, blockData: BlockDAO[]) => {
  const blocksQuery = blockData.map(b => {
    return sql.unsafe`(${b.hash}, ${b.parent_hash}, ${b.height}, ${b.timestamp})`;
  });

  return pool.one(sql.type(blockObject)`
    INSERT INTO block (
      hash,
      block_hash,
      height,
      date
    ) VALUES
    ${sql.join(blocksQuery, sql.fragment`,`)}
    RETURNING *
  `);
};

const getLatestBlockHeight = async (pool: DatabasePool | DatabaseTransactionConnection) => {
  const result = await pool.one(sql.type(z.object({ latest: z.number() }))`
    SELECT max(height) as latest FROM block
  `);

  return result.latest;
};

export {
  insertBlocks,
  getLatestBlockHeight,
}
