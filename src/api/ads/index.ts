import express from 'express';
import { DatabasePool } from 'slonik';
import { createAds, getAdsById, getAdsHistroyById, getAdsList } from '../../services/ads';
import { AdsDAO } from '../../types/ads';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';
import { AdsResultRouter } from './result';

const router = express.Router();

export const AdsRouter = (pool: DatabasePool) => {
  const getTotalAdsList = async (req: express.Request, res: express.Response) => {
    const lists = await getAdsList(pool);

    return res.json(lists);
  };

  const getAdsDetailById = async (req: express.Request, res: express.Response) => {
    const ads = await getAdsById(pool, +req.params.id);
    const history = await getAdsHistroyById(pool, +req.params.id);
    return res.json({
      ...ads,
      history: history,
    });
  };

  const saveAds = async (req: express.Request, res: express.Response) => {
    if (req.session.user == null) {
      throw new ClientError(401, 'unauthorized');
    }
    const adsData: AdsDAO = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      reward: req.body.price,
      image_id: req.body.imageId,
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      user_email: req.session.user.email,
    };
    const ads = await pool.transaction(async (conn) => {
      return await createAds(conn, adsData);
    });

    return res.json(ads);
  };

  router.get('/:id', getAdsDetailById);
  router.get('/', getTotalAdsList);
  router.use(loginAuthGuard(pool));
  router.use(AdsResultRouter(pool));
  router.post('/', saveAds);
  router.delete('/');

  return router;
};
