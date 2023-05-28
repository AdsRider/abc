import { DatabasePool } from 'slonik';
import express from 'express';

const router = express.Router();

export const PaymentRouter = (pool: DatabasePool) => {
  const successHandler = async (req: express.Request, res: express.Response) => {

  };

  const failHandler = async (req: express.Request, res: express.Response) => {

  };

  router.post('/success', successHandler);
  router.post('/fail', failHandler);

  return router;
};
