import type { Request } from "express";
import type { RefreshTokenId } from "./jwtUserData.ts";
import type {
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
