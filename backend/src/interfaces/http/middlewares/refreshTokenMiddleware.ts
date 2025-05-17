import { Request, Response, NextFunction } from "express";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/MysqlRefreshTokenRepository.js";

const mysqlRefreshTokenRepository = new MysqlRefreshTokenRepository();

/** Validates refresh token received in cookies by the client */
export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get refresh from cookies manually because we need it for the SQL query
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("NO_REFRESH_TOKEN");
    const refreshToken = cookies.refreshToken;

    const decoded = decodeRefreshToken(req);

    const { id } = decoded;

    const tokenData = await mysqlRefreshTokenRepository.findValidToken(refreshToken, id);
    if (!tokenData) {
      console.error("Refresh token not found (db), doesn't match user or expired");
      res.status(403).json({ message: "Refresh token not found (db), doesn't match user or expired" });
      return;
    }

    //if the token is valid, add the id to request object
    req.refreshTokenId = { id };

    next();
  } catch (error) {
    if(error instanceof Error) console.error("Error in updateProfileMiddleware:", error);

    switch (error.message) {
      case "NO_REFRESH_TOKEN":
        res.status(401).json({ message: "No refresh token in cookies" });
        return;
      case "INVALID_REFRESH_TOKEN":
        res.status(403).json({ message: "Invalid or expired refresh token" });
        return;
      default:
        res.status(500).json({ message: "Internal server error" });
        return;
    }
  }
};
