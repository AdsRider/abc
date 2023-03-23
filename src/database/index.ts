import { DatabasePool, sql } from 'slonik';
import { connect } from './pool';

const queryTest = async (pool: DatabasePool) => {
  const result = await pool.any(sql.unsafe`
    SELECT 1
  `);
  console.log(result);
};


const mocked = async () => {
  const pool = await connect();
  await queryTest(pool);

  await pool.end();
};
mocked();
