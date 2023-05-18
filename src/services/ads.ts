import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { AdsDAO, SaveAdsResultDAO } from '../types/ads';
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

const sqlAdsFragment = sql.fragment`
  id,
  title,
  subtitle,
  reward,
  image_id,
  start_date,
  end_date
`;

const adsObject = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  reward: z.string(),
  image_id: z.number(),
  start_date: z.date(),
  end_date: z.date(),
  // user_email: z.string(),
});

const adsResultFragment = sql.fragment`
  id,
  ads_id,
  path::jsonb,
  meters,
  hash,
  reward,
  start_time,
  end_time
`;

const adsResultObject = z.object({
  id: z.string(),
  ads_id: z.number(),
  hash: z.string(),
  path: jsonSchema,
  meters: z.number(),
  reward: z.string(),
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
    ORDER BY id
  `);
  // TODO: 상세내역
;

const getAdsHistoryByAdsId = (conn: DatabasePool, id: number) => {
  return conn.any(sql.type(adsResultObject)`
    SELECT ${adsResultFragment}
    FROM ads_result
    WHERE ads_id = ${id}
    ORDER BY end_time
  `);
};

const getAdsHistoryById = (conn: DatabasePool, id: string) => {
  return conn.one(sql.type(adsResultObject)`
    SELECT ${adsResultFragment}
    FROM ads_result
    WHERE id = ${id}
  `);
};

const saveAdsResult = async (conn: DatabaseTransactionConnection, body: SaveAdsResultDAO) => {
  return conn.one(sql.type(adsResultObject)`
    INSERT INTO ads_result (
      ads_id,
      user_email,
      path,
      meters,
      reward,
      start_time,
      end_time
    ) VALUES (
      ${body.ads_id},
      ${body.user_email},
      ${sql.jsonb(body.path)},
      ${body.meters},
      ${body.reward},
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
  getAdsHistoryById,
  getAdsHistoryByAdsId,
};
