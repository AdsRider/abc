import express from 'express';
import { DatabasePool } from 'slonik';
import { findUser } from '../services/users';
import { ClientError } from '../util/error';

const loginAuthGuard = (pool: DatabasePool) => {
  const loginMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = req.session.user;

    if (user == null) {
      throw new ClientError(401, 'need_login');
    }

    const updatedUser = await findUser(pool, user.email);

    req.session.user = updatedUser;

    next();
  };

  return loginMiddleware;
}

export {
  loginAuthGuard,
};
