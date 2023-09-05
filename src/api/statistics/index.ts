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

    // 2023-09-05 관리자일경우 from to를 제거하는 방안으로 정함
    const from = level === '광고주'
      ? new Date().toISOString()
      : new Date(stringFilter(req.query.from)).toISOString();
    const to = level === '광고주'
      ? new Date().toISOString()
      : new Date(stringFilter(req.query.to)).toISOString();

    if (Number.isNaN(from) || Number.isNaN(to)) {
      throw new ClientError(400, 'invalid query');
    }

    const levelFucntionMap = {
      '광고주': getAdvertiserStatistics,
      '라이더': getNormalUserStatistics,
      '운영자': getAdminStatistics,
    } as const;

    const result = await levelFucntionMap[user.level as keyof typeof levelFucntionMap](pool, user.email, from, to);

    return res.json(result);
  };

  router.use(loginAuthGuard(pool));
  router.get('/', getStatistics);

  return router;
};
