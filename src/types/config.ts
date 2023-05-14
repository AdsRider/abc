export type Config = {
  node_url: string;
  NODE_ENV: 'dev' | 'prod';
  database: {
    host: string;
    username: string;
    password: string;
    db: string;
    port: string;
  };
  redis: {
    host: string;
    port: string;
  };
};
