import { User } from '../types/user';

declare module 'express-session' {
  export interface SessionData {
    user?: User;
  }
}
