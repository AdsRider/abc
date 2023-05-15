import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { AdsDAO, SaveAdsResultDAO } from '../types/ads';

const sqlAdsFragment = sql.fragment`
  id,
  title,
  subtitle,
  reward,
  image_id,
  start_date,
  end_date,
  user_email
`;

const adsObject = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  reward: z.string(),
  image_id: z.number(),
  start_date: z.date(),
  end_date: z.date(),
  user_email: z.string(),
});

const adsResultFragment = sql.fragment`
  id,
  ads_id,
  user_email,
  path,
  meters,
  start_time,
  end_time
`;

const adsResultObject = z.object({
  id: z.string(),
  ads_id: z.number(),
  user_email: z.string(),
  path: z.any(), // TODO https://zod.dev/?id=json-type
  meters: z.number(),
  start_time: z.date(),
  end_time: z.date(),
});

const createAds = async (conn: DatabaseTransactionConnection, adsDAO: AdsDAO) =>
  conn.one(sql.type(adsObject)`
    INSERT INTO ads (
      title,
      subtitle,
      reward,
      image_id,
      start_date,
      end_date,
      user_email
    ) VALUES (
      ${adsDAO.title},
      ${adsDAO.subtitle},
      ${adsDAO.reward},
      ${adsDAO.image_id},
      ${adsDAO.start_date},
      ${adsDAO.end_date},
      ${adsDAO.user_email}
    ) RETURNING *
  `);
;

const getAdsList = (conn: DatabasePool | DatabaseTransactionConnection) =>
  conn.any(sql.type(adsObject)`
    SELECT ${sqlAdsFragment}
    FROM ads
    ORDER BY id
  `);
;

const getAdsById = (conn: DatabasePool | DatabaseTransactionConnection, id: number) =>
  conn.one(sql.type(adsObject)`
    SELECT ${sqlAdsFragment}
    FROM ads
    WHERE id = ${id}
  `);
  // TODO: 상세내역
;

const saveAdsResult = async (conn: DatabaseTransactionConnection, body: SaveAdsResultDAO) => {
  return conn.one(sql.type(adsResultObject)`
    INSERT INTO ads_result (
      ads_id,
      user_email,
      path,
      meters,
      start_time,
      end_time
    ) VALUES (
      ${body.ads_id},
      ${body.user_email},
      ${sql.jsonb(body.path)},
      ${body.meters},
      ${body.start_time},
      ${body.end_time}
    ) RETURNING ${adsResultFragment}
  `);
};

export {
  createAds,
  getAdsList,
  getAdsById,
  saveAdsResult,
};
