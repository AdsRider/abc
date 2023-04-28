import 'express-async-errors';
import session from 'express-session';
import express from 'express';
import RedisStore from 'connect-redis';
import crypto from 'crypto';
import { connect } from './database/pool';
import { redisClient } from './database/redis';
import { MainRouter } from './api';
import { ClientError } from './util/error';

const app = express();
const port = 4000;
const globalPrefix = '/api';

const main = async () => {
  const pool = await connect();
  const redis = redisClient;
  await redis.connect();

  const redisStore = new RedisStore({
    client: redis,
    prefix: "adsrider:",
  });

  app.use(session({
    secret: 'cmVkaXJzZGEK', // echo redirsda | base64
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: redisStore,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(globalPrefix, MainRouter(pool));

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json(err.message);
    }

    const uuid = crypto.randomUUID();
    console.log(new Date().toISOString());
    console.log(uuid, err);

    return res.status(500).json({
      code: uuid,
      message: 'internal_server_error',
    });
  });

  const server = app.listen(port, () => {
    console.log(`Server is Listening on PORT ${port}`);
  });

  const gracefulShutdownHandler = (signal: NodeJS.SignalsListener) => {
    console.log(`[${new Date().toISOString()}] ${signal} signal received: closing HTTP server`);
    server.close(() => {
        console.log('HTTP server closed');
    });
  };

  process.on('SIGTERM', gracefulShutdownHandler);
  process.on('SIGINT', gracefulShutdownHandler);
};
main();
