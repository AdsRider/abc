export type Config = {
  node_url: string;
  database: {
    host: string;
    username: string;
    password: string;
    db: string;
    port: string;
  };
};
