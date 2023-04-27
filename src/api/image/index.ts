import express from 'express';
import { DatabasePool, NotFoundError } from 'slonik';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ClientError } from '../../util/error';
import { findImage, insertImage } from '../../services/image';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },

  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpg'
    || file.mimetype ==='image/jpeg'
    || file.mimetype ===  'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new ClientError(400, 'Image uploaded is not of type jpg/jpeg or png'), false);
  }
};

const upload = multer({storage: storage, fileFilter: fileFilter});

export const ImageRouter = (pool: DatabasePool) => {
  const saveFile = async (req: express.Request, res: express.Response) => {
    if (req.file == null) {
      throw new ClientError(400, 'invalid_request');
    }

    const fileData = req.file as Express.Multer.File;
    const insertedFile = await pool.transaction(async (conn) => {
      return await insertImage(conn, fileData);
    });

    return res.json(insertedFile);
  }

  const sendImage = async (req: express.Request, res: express.Response) => {
    try {
      const id = req.params.id;
      const fileData = await findImage(pool, parseInt(id));
      const file = fs.readFileSync(path.join(__dirname, '/../../../uploads', fileData.filename));
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(file);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new ClientError(400, 'inavlid_request');
      }

      throw e;
    }
  };

  router.get('/:id', sendImage);
  router.post('/', upload.single('file'), saveFile);

  return router;
};
