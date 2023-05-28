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
  payment: {
    // 테스트용 공용secret키
    // echo -n 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R' + ':' | base64
    secret: string;
  };
};
