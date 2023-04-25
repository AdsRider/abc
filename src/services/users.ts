import { DatabasePool, DatabaseTransactionConnection, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import { UserDAO } from '../types/user';

const sqlUserFragment = sql.fragment`
  email,
  level,
  address,
  join_time
`;

const userObject = z.object({
  email: z.string(),
  level: z.string(),
  address: z.string(),
  join_time: z.date(),
});

const createUser = (pool: DatabaseTransactionConnection, userDAO: UserDAO) =>
  pool.one(sql.type(userObject)`
    INSERT INTO user (
      email,
      password,
    ) VALUES (
      ${userDAO.email},
      ${userDAO.password}
    ) RETURNING ${sqlUserFragment}
  `);
;

const getUsers = (pool: DatabasePool) =>
  // TODO: Remove unsafe
  pool.any(sql.type(userObject)`
    SELECT ${sqlUserFragment}
    FROM "user"
    ORDER BY email
  `);
;

const findUser = async (pool: DatabasePool, email: string) => {
  /*
    웹서버 뿐만아니라 블록체인 모듈에서 사용할수도있음 => client에러가 아님
    추후 작업에 의해 validation이 service단에서 벗어날수있음
    clientError정리 및 구조확정이후 다시고려
  */
  try {
    return await pool.one(sql.type(userObject.extend({ password: z.string() }))`
      SELECT ${sqlUserFragment}, password
      FROM "user"
      WHERE email = ${email}
    `);
  } catch (err) {
    if (err instanceof NotFoundError) {
        // TODO: Throw client Error
    }

    throw err;
  }
};

export {
  createUser,
  findUser,
  getUsers,
};
