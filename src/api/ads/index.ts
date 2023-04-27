import express from 'express';
import { DatabasePool } from 'slonik';
import { getAdsById, getAdsList } from '../../services/ads';

const router = express.Router();

export const AdsRouter = (pool: DatabasePool) => {
  const getTotalAdsList = async (req: express.Request, res: express.Response) => {
    const lists = await getAdsList(pool);

    return res.json(lists);
  };

  const getAdsDetailById = async (req: express.Request, res: express.Response) => {
    const ads = await getAdsById(pool, req.params.id);
  };

  router.get('/:id', getAdsDetailById);
  router.get('/', getTotalAdsList);
  router.post('/');
  router.delete('/');

  return router;
};
