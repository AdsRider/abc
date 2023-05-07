import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { Address } from '../types/database';

const addressFragment = sql.fragment`
  address,
  priavtekey,
  type
`;

const addressObject = z.object({
  address: z.string(),
  privatekey: z.string(),
  type: z.string(),
});

const addAddress = async (pool: DatabaseTransactionConnection, addresses: Address[]) => {
  const values = addresses.map(a => sql.fragment`(${a.address}, ${a.privatekey})`)

  const result = await pool.any(sql.type(addressObject)`
    INSERT INTO address
    VALUES ${sql.join(values, sql.fragment`, `)}
    RETURNING *
  `);

  return result;
};

const getAddressByType = async (pool: DatabasePool, type: string) => {
  return pool.any(sql.type(addressObject)`
    SELECT ${addressFragment}
    FROM address
    WHERE type = ${type}
  `)
};

export {
  addAddress,
  getAddressByType,
};
