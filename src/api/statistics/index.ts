import express from 'express';
import { DatabasePool } from 'slonik';
import { getAdminStatistics, getAdvertiserStatistics, getNormalUserStatistics } from '../../services/statistics';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';

type StatisticsBody = {
  from: Date,
  to: Date,
};

const router = express.Router();

export const StatisticsRouter = (pool: DatabasePool) => {

  const getStatistics = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const level = user.level;

    if (!['광고주', '라이더', '운영자'].includes(level)) {
      throw new ClientError(400, 'unexpected user');
    }

    const body = req.body as StatisticsBody;
    const from = +new Date(body.from);
    const to = +new Date(body.to);

    if (Number.isNaN(from) || Number.isNaN(to)) {
      throw new ClientError(400, 'invalid body');
    }

    const levelFucntionMap = {
      '광고주': getAdvertiserStatistics,
      '라이더': getNormalUserStatistics,
      '관리자': getAdminStatistics,
    } as const;

    const result = levelFucntionMap[user.level as keyof typeof levelFucntionMap](pool, user.email, from, to);

    return res.json(result);
  };

  router.use(loginAuthGuard(pool));
  router.get('/', getStatistics);

  return router;
};
