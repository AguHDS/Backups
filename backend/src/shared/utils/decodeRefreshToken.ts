import { Request } from "express";
import { verifyToken } from "../../infraestructure/auth/handleJwt.js";
import { JwtPayload } from "jsonwebtoken";

export interface DecodedRefresh extends JwtPayload {
  name?: string;
  role?: string;
  id: string;
  iat: number;
  exp: number;
}

/**
 * Extracts and verifies the refresh token from cookies in the request
 *
 * @param req - Express request object containing cookie
 * @returns The decoded payload of refresh token
 * @throw Error for switch cases
 */
export const decodeRefreshToken = (req: Request): DecodedRefresh => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) throw new Error("NO_REFRESH_TOKEN");

  const refreshToken = cookies.refreshToken;
  const decoded = verifyToken(refreshToken, "refresh");

  if (!decoded) throw new Error("INVALID_REFRESH_TOKEN");

  return decoded as DecodedRefresh;
};
