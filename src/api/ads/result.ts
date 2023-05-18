import express from 'express';
import { DatabasePool } from 'slonik';
import BigNumber from 'bignumber.js';
import { getAdsById, saveAdsResult } from '../../services/ads';
import { SaveAdsResultBody, SaveAdsResultDAO } from '../../types/ads';
import { withdrawalADScoin } from '../../network/jsonrpc';
import { getSystemAccountByType } from '../../services/address';
import { saveSpecialLog } from '../../services/dw';

const router = express.Router();

export const AdsResultRouter = (pool: DatabasePool) => {

  const saveResult = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const body = req.body as SaveAdsResultBody;

    const result = await pool.transaction(async (conn) => {

      const ads = await getAdsById(conn, body.ads_id);
      // ads.reward는 1000km에 대한 보상
      // 1km보상 = 전체보상 / 1000
      // 1인당 최대 10km를 넘을수없음
      const reward = Math.min(
        new BigNumber(ads.reward).multipliedBy(body.meters).dividedBy(1000 * 1000).toNumber(),
        new BigNumber(ads.reward).dividedBy(100).toNumber(),
      );
      const withdrawalAccount = await getSystemAccountByType(pool, 'SYSTEM_WITHDRAWAL');
      const { address: from, privatekey } = withdrawalAccount;
      const hash = await withdrawalADScoin(from, user.address, new BigNumber(reward).toString(), privatekey);

      const dao: SaveAdsResultDAO = {
        ads_id: body.ads_id,
        path: body.path,
        meters: body.meters,
        start_time: body.start_time,
        end_time: body.end_time,
        user_email: user.email,
        reward: new BigNumber(reward).toString(),
        hash: hash,
      };
      const adsResult = await saveAdsResult(conn, dao);

      const specialLogDAO = {
        memo: ['ads_result', ads.id].join('-'),
        amount: new BigNumber(reward).toString(),
        user_email: user.email,
        address: user.address,
        hash: hash,
      };
      await saveSpecialLog(conn, specialLogDAO);

      return {
        reward: adsResult.reward,
        hash: hash,
      };
    });

    return res.json(result);
  };

  router.post('/result', saveResult);
  return router;
}
