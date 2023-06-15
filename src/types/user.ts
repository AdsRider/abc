export type User = {
  email: string;
  level: '광고주' | '라이더' | '운영자';
  address: string;
  expired_date: Date;
  join_time: Date;
  // TODO: 필요에따라 추가예정
};

export type UserDAO = Pick<User, 'email' | 'address' | 'level'> & {
  password: string;
};
