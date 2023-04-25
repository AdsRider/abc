export type User = {
  id: string;
  email: string;
  level: string;
  address: string;
  join_time: Date;
  // TODO: 필요에따라 추가예정
};

export type UserDAO = Pick<User, 'email'> & {
  password: string;
};
