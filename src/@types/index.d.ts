import { User } from '../types/user';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
