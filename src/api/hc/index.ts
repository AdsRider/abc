import express from 'express';

const router = express.Router();
let health = true;

export const getHealth = () => health;
export const setHealth = (h: boolean) => health = h;

export const HealthCheckRouter = () => {
  router.get('/', (_, res) => res.json(getHealth()));

  return router;
};
