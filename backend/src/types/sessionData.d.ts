import { Request } from 'express';

declare module 'express' {
  interface Request {
    activeSessionData?: {
      id: number;
      hasRefreshCookie: boolean;
    };
  }
}