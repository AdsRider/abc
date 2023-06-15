import { DatabasePool, DatabaseTransactionConnection, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import { UserDAO } from '../types/user';

const sqlUserFragment = sql.fragment`
  email,
  level,
  address,
  expired_date,
  join_time
`;

const userObject = z.object({
  email: z.string(),
  level: z.union([z.literal('광고주'), z.literal('라이더'), z.literal('운영자')]),
  address: z.string(),
  expired_date: z.date(),
  join_time: z.date(),
});

const createUser = (pool: DatabaseTransactionConnection, userDAO: UserDAO) =>
  pool.one(sql.type(userObject)`
    INSERT INTO "user" (
      email,
      password,
      level,
      address
    ) VALUES (
      ${userDAO.email},
      ${userDAO.password},
      ${userDAO.level},
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

const updateExpireDate = (pool: DatabaseTransactionConnection, email: string, expired_date: Date) =>
  pool.one(sql.type(userObject)`
    UPDATE "user"
      SET expired_date = ${expired_date.toISOString()}
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
  const lowerAddress = address.toLowerCase();
  return pool.one(sql.type(userObject)`
    SELECT ${sqlUserFragment}
    FROM "user"
    WHERE LOWER(address) = ${lowerAddress}
  `);
};

export {
  createUser,
  findUser,
  getUsersByEmail,
  getUserByAddress,
  updateExpireDate
};
