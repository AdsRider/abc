import { createClient } from 'redis';
import { config } from '../config';

export const redisClient = createClient({
  socket: {
    host: config.redis.host || 'localhost',
    port: parseInt(config.redis.port) || 6379,
  },
});
