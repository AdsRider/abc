import express from 'express';
import * as argon2 from 'argon2';
import { DatabasePool, NotFoundError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { createUser, findUser } from '../../services/users';
import { UserDAO } from '../../types/user';
import { generateAddress } from '../../network/jsonrpc';
import { addAddress } from '../../services/address';
import { ClientError } from '../../util/error';

const router = express.Router();

export const LoginRouter = (pool: DatabasePool) => {
  const login = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    try {
      const user = await findUser(pool, email);

      if (await argon2.verify(user.password, password)) {
        return res.json('OK')
      } else {
        throw new ClientError(400, 'invalid_id_or_password');
      }
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new ClientError(400, 'invalid_id_or_password');
      }

      throw e;
    }
  };

  const signIn = async (req: express.Request, res: express.Response) => {
    const body = req.body;

    // TODO: catch email unique constraint error
    const user = await pool.transaction(async (conn) => {
      try {
        const address = await generateAddress();
        await addAddress(conn, [address]);
        const userDAO: UserDAO = {
          email: body.email,
          password: await argon2.hash(body.password),
          address: address.address,
        };

        return await createUser(conn, userDAO);
      } catch (e) {
        if (e instanceof UniqueIntegrityConstraintViolationError) {
          throw new ClientError(400, 'email_already_exist');
        }

        throw e;
      }
    });

    return res.json(user);
  };

  router.post('/login', login);
  router.post('/signin', signIn);

  return router;
};
