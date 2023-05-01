import { DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';
import { AdsDAO } from '../types/ads';

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

const getAdsById = (conn: DatabasePool | DatabaseTransactionConnection, id: string) =>
  conn.one(sql.type(adsObject)`
    SELECT ${sqlAdsFragment}
    FROM ads
    WHERE id = ${id}
  `);
  // TODO: 상세내역
;

export {
  createAds,
  getAdsList,
  getAdsById,
};
