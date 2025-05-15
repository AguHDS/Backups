import { Request } from "express";
import { RefreshTokenId } from "./jwtUserData.ts";
import {
  UserSession,
  UserAndPassword,
  BaseUserData,
  UserId,
} from "./userDto.ts";

//add custom props to Request object
declare module "express" {
  interface Request {
    userId?: UserId;
    userAndPassword?: UserAndPassword;
    userSession?: UserSession;
    refreshTokenId?: RefreshTokenId;
    baseUserData?: BaseUserData;
  }
}
