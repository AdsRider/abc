import { DatabasePool, NotFoundError, sql } from 'slonik';
import { z } from 'zod';

const sqlUserFragment = sql.fragment`
  id,
  email,
  level,
  address,
  join_time
`;

const userObject = z.object({
  id: z.string(),
  email: z.string(),
  level: z.string(),
  address: z.string(),
  join_time: z.date(),
});

const getUsers = (pool: DatabasePool) =>
  // TODO: Remove unsafe
  pool.any(sql.type(userObject)`
    SELECT ${sqlUserFragment}
    FROM "user"
    ORDER BY id
  `);
;

const getUserById = async (pool: DatabasePool, id: string) => {
  /*
    웹서버 뿐만아니라 블록체인 모듈에서 사용할수도있음 => client에러가 아님
    추후 작업에 의해 validation이 service단에서 벗어날수있음
    clientError정리 및 구조확정이후 다시고려
  */
  try {
    return await pool.one(sql.type(userObject)`
      SELECT ${sqlUserFragment}
      FROM "user"
      WHERE id = ${id}
    `);
  } catch (err) {
    if (err instanceof NotFoundError) {
        // TODO: Throw client Error
    }

    throw err;
  }
};

export {
  getUsers,
  getUserById,
};
