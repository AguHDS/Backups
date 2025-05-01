import { Request } from "express";
import { verifyToken } from "./handleJwt.js";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  name: string;
  role: string;
  id: number;
  iat: number;
  exp: number;
}

export const decodeRefreshToken = (req: Request): DecodedToken => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) throw new Error("No refresh found in the cookies (decodedRefreshToken)");

  const refreshToken = cookies.refreshToken;
  const decodedRefreshToken = verifyToken(refreshToken, "refresh");
  
  if (!decodedRefreshToken) throw new Error("Invalid or expired refresh token (decodedRefreshToken)");

  return decodedRefreshToken as DecodedToken;
}