import config from "../../../infraestructure/config/environmentVars.js";
import promisePool from "../../../db/database.js";
import { Request, Response } from "express";
import { tokenSign } from "../../../infraestructure/auth/handleJwt.js";
import { RefreshTokenUseCase } from "../../../application/useCases/RefreshTokenUseCase.js";
import { MysqlUserRepository, MysqlRefreshTokenRepository } from "../../../infraestructure/adapters/repositories/index.js";

// Dependency injection
const refreshTokenUseCase = new RefreshTokenUseCase(
  new MysqlUserRepository(),
  new MysqlRefreshTokenRepository(),
  tokenSign
);

/** Send new tokens and user data */
export const refreshTokenController = async (req: Request, res: Response) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    if(!req.refreshTokenId) {
      res.status(400).json({ message: "Refresh token ID is missing in the request" });
      return;
    }
    const { id } = req.refreshTokenId;
    const { accessToken, refreshToken, userData, timeRemaining, refreshTokenRotated } = await refreshTokenUseCase.execute(id, connection);

    await connection.commit();

    if (refreshTokenRotated) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production", // Secure cookies only in production
        maxAge: timeRemaining * 1000,
        sameSite: config.nodeEnv === "production" ? "none" : "lax",
      });
    }

    res.status(200).json({ accessToken, userData, refreshTokenRotated });
  } catch (error) {
    await connection.rollback();

    if (error instanceof Error) {
      console.error(`Error trying to update the token. ${error.message}`);

      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found in the database" });
          return;
        case "REFRESH_TOKEN_NOT_FOUND":
          res.status(404).json({ message: "Refresh token not found for the user in db" });
          return;
        case "REFRESH_TOKEN_EXPIRED":
          res.status(403).json({ message: "Refresh token has expired" });
          return;
        default:
          break;
      }
    }

    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};
