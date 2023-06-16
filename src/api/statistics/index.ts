import express, { query } from 'express';
import { DatabasePool } from 'slonik';
import { getAdminStatistics, getAdvertiserStatistics, getNormalUserStatistics } from '../../services/statistics';
import { ClientError } from '../../util/error';
import { loginAuthGuard } from '../common';

const router = express.Router();

const stringFilter = (value: any) => {
  if (typeof value === 'string') {
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  throw new ClientError(400, 'invalid value');
}

export const StatisticsRouter = (pool: DatabasePool) => {

  const getStatistics = async (req: express.Request, res: express.Response) => {
    const user = req.session.user!;
    const level = user.level;

    if (!['광고주', '라이더', '운영자'].includes(level)) {
      throw new ClientError(400, 'unexpected user');
    }

    const from = +new Date(stringFilter(req.query.from));
    const to = +new Date(stringFilter(req.query.to));

    if (Number.isNaN(from) || Number.isNaN(to)) {
      throw new ClientError(400, 'invalid query');
    }

    const levelFucntionMap = {
      '광고주': getAdvertiserStatistics,
      '라이더': getNormalUserStatistics,
      '운영자': getAdminStatistics,
    } as const;

    const result = levelFucntionMap[user.level as keyof typeof levelFucntionMap](pool, user.email, from, to);

    return res.json(result);
  };

  router.use(loginAuthGuard(pool));
  router.get('/', getStatistics);

  return router;
};
