import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { connect } from './pool';

const queryTest = async (pool: DatabasePool) => {
  const result = await pool.any(sql.unsafe`
    SELECT 1
  `);
  console.log(result);
};

// TODO: address type 추가
const addAddress = async (pool: DatabaseTransactionConnection, addresses: {address: string, privatekey: string}[]) => {
  const values = addresses.map(a => sql.fragment`(${a.address}, ${a.privatekey})`)
  const result = await pool.one(sql.type(z.number())`
    insert into address
    values ${sql.join(values, sql.fragment`, `)}
    returning count(*) as count
  `);

  return result;
};

const mocked = async () => {
  const pool = await connect();
  await queryTest(pool);

  await pool.end();
};
mocked();
