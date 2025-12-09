import { Request, Response, NextFunction } from "express";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/adapters/repositories/MysqlRefreshTokenRepository.js";

const mysqlRefreshTokenRepository = new MysqlRefreshTokenRepository();

/** Validates refresh token received in cookies by the client */
export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      console.log("No refresh token in cookies (refreshTokenMiddleware)");
      res.status(401).json({ message: "No refresh token in cookies" });
      return;
    }

    const refreshToken = cookies.refreshToken;
    const decoded = decodeRefreshToken(req);
    const { id } = decoded;

    const tokenData = await mysqlRefreshTokenRepository.findValidToken(
      refreshToken,
      id
    );

    if (!tokenData) {
      console.error(
        "Refresh token not found, doesn't match, it's invalid or expired"
      );
      res
        .status(403)
        .json({
          message:
            "Refresh token not found, doesn't match, it's invalid or expired",
        });
      return;
    }

    req.refreshTokenId = { id };

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error in refreshTokenMiddleware:", error);

    switch (errorMessage) {
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
