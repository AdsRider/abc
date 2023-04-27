import { DatabaseConnection, DatabaseTransactionConnection, sql } from 'slonik';
import { z } from 'zod';

const sqlImageFragment = sql.fragment`
  id,
  filename,
  originalname,
  mimetype,
  size
`;

const imageObject = z.object({
  id: z.string(),
  filename: z.string(),
  originalname: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

const insertImage = (
  pool: DatabaseTransactionConnection,
  file: Express.Multer.File,
) => {
  return pool.one(sql.type(imageObject)`
    INSERT INTO image (
      filename,
      originalname,
      mimetype,
      size
    ) VALUES (
      ${file.filename},
      ${file.originalname},
      ${file.mimetype},
      ${file.size}
    ) RETURNING *
  `);
};

const findImage = (pool: DatabaseConnection, id: number) =>
  pool.one(sql.type(imageObject)`
    SELECT ${sqlImageFragment}
    FROM image
    WHERE id = ${id}
  `);
;

export {
  insertImage,
  findImage,
};
