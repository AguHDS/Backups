import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../../infraestructure/auth/handleJwt.js";
import { JwtPayload } from "jsonwebtoken";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/MysqlRefreshTokenRepository.js";

interface DecodedToken extends JwtPayload {
  id: string;
}

const mysqlRefreshTokenRepository = new MysqlRefreshTokenRepository();

/** Validates refresh token received in cookies by the client */
export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      console.log("Autocheck: No refresh found in the cookies (refreshTokenMiddleware)");
      res.status(401).json({ message: "No refresh token in cookies" });
      return;
    }

    const refreshToken = cookies.refreshToken;

    const decodedRefreshToken = verifyToken(refreshToken, "refresh") as DecodedToken;

    if (!decodedRefreshToken) {
      console.error("Invalid or expired refresh token detected.");
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }

    const { id } = decodedRefreshToken;

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
    if (error instanceof Error) {
      console.error("Error during token validation (refreshTokenMidddleware):", error.message);
    }

    res.status(401).json({ message: "Error during token validation, Unauthorized " });
    return;
  }
};
