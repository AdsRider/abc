import express from 'express';
import { DatabasePool, NotFoundError } from 'slonik';
import argon2 from 'argon2';
import { generateAddress } from '../network/jsonrpc';
import { addAddress } from '../services/address';
import { getUsersByEmail, createUser } from '../services/users';
import { UserDAO } from '../types/user';
import { ClientError } from '../util/error';
import { config } from '../config';

const DEV_USER_EMAIL = 'DEV_SAMPLE_USER';

const generateDevUser = async (pool: DatabasePool) => {
  const user = pool.transaction(async (conn) => {
    const address = await generateAddress();
    await addAddress(conn, [address]);
    const userDAO: UserDAO = {
      email: DEV_USER_EMAIL,
      password: await argon2.hash(''),
      address: address.address,
      level: '라이더',
    };

    return await createUser(conn, userDAO);
  });

  return user;
};

const DevModeSkipLoginGuard = async (pool: DatabasePool, req: express.Request) => {
  try {
    const user = await getUsersByEmail(pool, DEV_USER_EMAIL);
    req.session.user = user;
    return user;
  } catch (error) {
    if (error instanceof NotFoundError) {
      await generateDevUser(pool);
      await DevModeSkipLoginGuard(pool, req);
    }
  }
};

const loginAuthGuard = (pool: DatabasePool) => {
  const loginMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = req.session.user;

    if (user == null) {
      if (config.NODE_ENV === 'dev') {
        await DevModeSkipLoginGuard(pool, req);
        return next();
      }
      throw new ClientError(401, 'need_login');
    }

    const updatedUser = await getUsersByEmail(pool, user.email);

    req.session.user = updatedUser;

    return next();
  };

  return loginMiddleware;
};

export {
  loginAuthGuard,
};
