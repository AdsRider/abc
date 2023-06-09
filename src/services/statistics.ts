import BigNumber from 'bignumber.js';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { transactionObject } from './blockchain';
import {
  withdrawalObject,
  specialLogObject,
  depositHistoryFragment,
  specialLogFragment,
  withdrawalFragment,
} from './dw';

const UserStatisticsObject = z.object({
  user_email: z.string(),
  meters: z.number(),
  date: z.string(),
  reward: z.string(),
});

const getNormalUserStatistics = async (pool: DatabasePool, email: string, from: string, to: string) => {
  // reward의 타입이 text라 database에서 sum하기 어려움
  const data = await pool.any(sql.type(UserStatisticsObject)`
    SELECT user_email, meters, reward, date(end_time)
    FROM ads_result
    WHERE user_email = ${email}
      AND end_time BETWEEN ${from} AND ${to}
  `);

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const map = new Map<string, {meters: number, reward: string}>();
  const defaultData = {
    meters: 0,
    reward: '0',
  };

  for (const date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    map.set(dateString, defaultData);
  }

  data.forEach(x => {
    const item = map.get(x.date);

    const meters = item != null
      ? item.meters + x.meters
      : x.meters;
    const reward = item != null
      ? new BigNumber(item.reward).plus(new BigNumber(x.reward)).toFixed()
      : x.reward;

    map.set(x.date, { meters, reward });
  });

  const mapEntries = map.entries();
  const result = Array.from(mapEntries).map(x => ({
    date: x[0],
    meters: x[1].meters,
    reward: x[1].reward,
  }));

  return result;
};

const AdvertiserStatisticsObject = z.object({ result: z.any() });
const getAdvertiserStatistics = async (pool: DatabasePool, email: string, from: string, to: string) => {
  const ads = await pool.one(sql.type(AdvertiserStatisticsObject)`
    SELECT row_to_json(j) as result FROM (
      SELECT a.id, a.title, a.subtitle, a.reward, a.image_id, a.start_date, a.end_date, a.user_email,
        json_agg(json_build_object(
          'id', r.id,
          'ads_id', r.ads_id,
          'path', r.path,
          'meters', r.meters,
          'reward', r.reward,
          'hash', r.hash,
          'start_time', r.start_time,
          'end_time', r.end_time
        )) AS data
      FROM ads a
      LEFT JOIN ads_result as r
        ON a.id = r.ads_id
      WHERE a.user_email = ${email}
      GROUP BY a.id
    ) j
  `);

  return ads.result;
};

const getAdminStatistics = async (pool: DatabasePool, email: string, from: string, to: string) => {
  const specialLog = await pool.any(sql.type(specialLogObject)`
    SELECT ${specialLogFragment}
    FROM special_log
    WHERE timestamp BETWEEN ${from} AND ${to}
    ORDER BY timestamp
  `);

  const specialLogHashList = specialLog.map(x => x.hash);
  const additionalWhereQuery = specialLogHashList.length > 0
    ? sql.unsafe`AND hash not in (${sql.join(specialLogHashList, sql.fragment`, `)})`
    : sql.unsafe``;

  const withdrawal = await pool.any(sql.type(withdrawalObject)`
    SELECT ${withdrawalFragment}
    FROM withdrawal
    WHERE timestamp BETWEEN ${from} AND ${to}
    ${additionalWhereQuery}
    ORDER BY timestamp
  `);
  const deposit = await pool.any(sql.type(transactionObject)`
    SELECT ${depositHistoryFragment}
    FROM transaction
    WHERE timestamp BETWEEN ${from} AND ${to}
    ${additionalWhereQuery}
    ORDER BY timestamp
  `);

  const history = [
    ...withdrawal.map(w => ({
      // transaction의 amount값에는 +-가 존재하지 않기때문에
      // withdrawal로그 가져올시 hardcoding함
      amount: '-' + w.amount,
      hash: w.hash,
      timestamp: w.timestamp,
      type: '출금',
    })),
    ...deposit.map(d => ({
      amount: d.amount,
      hash: d.hash,
      timestamp: d.timestamp,
      type: '입금',
    })),
    ...specialLog.map(s => ({
      amount: s.amount,
      hash: s.hash,
      timestamp: s.timestamp,
      type: s.memo,
    })),
  ];

  return history.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
};

export {
  getNormalUserStatistics,
  getAdvertiserStatistics,
  getAdminStatistics,
};
