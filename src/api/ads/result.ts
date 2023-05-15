import express from 'express';
import { DatabasePool } from 'slonik';
import { saveAdsResult } from '../../services/ads';
import { SaveAdsResultBody, SaveAdsResultDAO } from '../../types/ads';

const router = express.Router();

export const AdsResultRouter = (pool: DatabasePool) => {

  const saveResult = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const body = req.body as SaveAdsResultBody;

    const result = await pool.transaction(async (conn) => {
      const dao: SaveAdsResultDAO = {
        ads_id: body.ads_id,
        path: body.path,
        meters: body.meters,
        start_time: body.start_time,
        end_time: body.end_time,
        user_email: user.email,
      };
      return await saveAdsResult(conn, dao);
    });

    return res.json(result);
  };

  router.post('/result', saveResult);
  return router;
}
