import { DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { Address } from '../types/database';

export const addAddress = async (pool: DatabaseTransactionConnection, addresses: Address[]) => {
  const values = addresses.map(a => sql.fragment`(${a.address}, ${a.privatekey})`)

  const result = await pool.any(sql.type(z.string())`
    INSERT INTO address
    VALUES ${sql.join(values, sql.fragment`, `)}
    RETURNING address
  `);

  return result;
};

// const mocked = async () => {
//   const pool = await connect();

//   await pool.transaction(async (connection) => {
//     const testData = [
//       {address: 'a', privatekey: 'b'},
//       {address: 'c', privatekey: 'd'},
//       {address: 'e', privatekey: 'f'},
//     ];
//     const result = await addAddress(connection, testData);
//     console.log(result);
//   });
//   await pool.end();
// };
// mocked();
