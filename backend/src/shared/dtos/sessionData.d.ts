import { Request } from 'express';

//add custom props to Request object
declare module 'express' {
  interface Request {
    activeSessionData?: {
      id: number;
      hasRefreshCookie: boolean;
    };
  }
}