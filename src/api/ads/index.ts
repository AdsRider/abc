import BigNumber from 'bignumber.js';
import express from 'express';
import { DatabasePool } from 'slonik';
import { createAds, getAdsById, getAdsHistoryById, getAdsHistoryByAdsId, getAdsList } from '../../services/ads';
import { getCurrencyBalanceByEmail, updateBalanceAndAvailable } from '../../services/balance';
import { saveSpecialLog } from '../../services/dw';
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
    const history = await getAdsHistoryByAdsId(pool, +req.params.id);
    return res.json({
      ...ads,
      history: history,
    });
  };

  const saveAds = async (req: express.Request, res: express.Response) => {
    if (req.session.user == null) {
      throw new ClientError(401, 'unauthorized');
    }
    const user = req.session.user;
    const adsData: AdsDAO = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      reward: req.body.price,
      image_id: req.body.imageId,
      start_date: req.body.startDate,
      end_date: req.body.endDate,
      user_email: user.email,
    };
    const ads = await pool.transaction(async (conn) => {
      const balance = await getCurrencyBalanceByEmail(conn, user.email, 'ADS');
      if (new BigNumber(adsData.reward).gt(new BigNumber(balance.available))) {
        throw new ClientError(400, 'not_enough_balance');
      }

      await updateBalanceAndAvailable(conn, user.email, 'ADS', new BigNumber(adsData.reward).negated());
      await saveSpecialLog(conn, {
        memo: 'enroll_ads',
        amount: adsData.reward,
        user_email: user.email,
        address: user.address,
        hash: '',
      });
      return await createAds(conn, adsData);
    });

    return res.json(ads);
  };

  const getAdsHistory = async (req: express.Request, res: express.Response) => {
    const adsId = +req.params.adsId;
    const historyId = req.params.historyId;
    const result = await getAdsHistoryById(pool, historyId);

    return res.json(result);
  };

  router.get('/:adsId/:historyId', getAdsHistory)
  router.get('/:id', getAdsDetailById);
  router.get('/', getTotalAdsList);
  router.use(loginAuthGuard(pool));
  router.use(AdsResultRouter(pool));
  router.post('/', saveAds);
  router.delete('/');

  return router;
};
