import express from 'express';
import { DatabasePool } from 'slonik';

const router = express.Router();

export const AdsRouter = (pool: DatabasePool) => {
  router.get('/:id')
  router.get('/');
  router.post('/');
  router.delete('/');

  return router;
};
