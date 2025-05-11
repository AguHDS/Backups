import { Request } from 'express';

//add custom props to Request object
declare module 'express' {
  interface Request {
    sessionWithId?: {
      id: number;
    },
    validatedUserData?: {
      user: string;
      password: string;
    },
    sessionData?: {
      name: string;
      email: string;
      password: string;
    },
    refreshTokenId?: {
      id: string;
    }
  }
}