import { DatabasePool, DatabaseTransactionConnection, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import { UserDAO } from '../types/user';

const sqlUserFragment = sql.fragment`
  email,
  level,
  address,
  expire_date,
  join_time
`;

const userObject = z.object({
  email: z.string(),
  level: z.string(),
  address: z.string(),
  expire_date: z.date(),
  join_time: z.date(),
});

const createUser = (pool: DatabaseTransactionConnection, userDAO: UserDAO) =>
  pool.one(sql.type(userObject)`
    INSERT INTO "user" (
      email,
      password,
      address
    ) VALUES (
      ${userDAO.email},
      ${userDAO.password},
      ${userDAO.address}
    ) RETURNING ${sqlUserFragment}
  `);
;

const getUsersByEmail = (pool: DatabasePool, email: string) =>
  pool.one(sql.type(userObject)`
    SELECT ${sqlUserFragment}
    FROM "user"
    WHERE email = ${email}
  `);
;

const updateExpireDate = (pool: DatabasePool, email: string, expire_date: Date) =>
  pool.one(sql.type(userObject)`
    UPDATE "user"
      SET expired_date = ${expire_date.toISOString()}
    WHERE email = ${email}
    RETURNING ${sqlUserFragment}
  `);

// login 전용
const findUser = async (pool: DatabasePool, email: string) => {
  const findUserObject = userObject.extend({ password: z.string() });
  return await pool.one(sql.type(findUserObject)`
    SELECT ${sqlUserFragment}, password
    FROM "user"
    WHERE email = ${email}
  `);
};

const getUserByAddress = async (pool: DatabasePool | DatabaseTransactionConnection, address: string) => {
  return pool.one(sql.type(userObject)`
    SELECT ${sqlUserFragment}
    FROM "user"
    WHERE address = ${address}
  `);
};

export {
  createUser,
  findUser,
  getUsersByEmail,
  getUserByAddress,
  updateExpireDate
};
