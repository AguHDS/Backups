import type { RefreshTokenId } from "./jwtUserData.ts";
import type {
  UserSession,
  UserAndPassword,
  BaseUserData,
  UserId,
} from "./userDto.ts";

// add custom props to Request object
declare module "express" {
  interface Request {
    requesterData?: {
      id: string;
      role: string;
    };

    userId?: UserId;
    userAndPassword?: UserAndPassword;
    userSession?: UserSession;
    refreshTokenId?: RefreshTokenId;
    baseUserData?: BaseUserData;

    // BetterAuth user from session
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}
