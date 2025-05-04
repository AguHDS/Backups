import { Request } from 'express';

//add custom props to Request object
declare module 'express' {
  interface Request {
    activeSessionData?: {
      id: number;
      hasRefreshCookie: boolean;
    },
    validatedUserData?: {
      user: string;
      password: string;
    },
    sessionData?: {
      name: string;
      email: string;
      password: string;
    }
  }
}