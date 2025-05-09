import config from "../../../infraestructure/config/environmentVars.js";
import { Request, Response } from "express";
import { tokenSign } from "../../../infraestructure/auth/handleJwt.js";
import promisePool from "../../../db/database.js";
import { JwtUserData } from "../../../shared/dtos/index.js";
import { RefreshTokenUseCase } from "../../../application/useCases/RefreshTokenUseCase.js";
import { MysqlUserRepository } from "../../../infraestructure/repositories/MysqlUserRepository.js";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/MysqlRefreshTokenRepository.js";

const refreshTokenUseCase = new RefreshTokenUseCase(
  new MysqlUserRepository(),
  new MysqlRefreshTokenRepository(),
  tokenSign
);

//send new access token if everything was validated correctly
export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    //use alias destructuring and use id from previous refreshToken to get user from database
    const { id: userId } = req.refreshTokenId;
    const { accessToken, refreshToken, userData, timeRemaining } =
      await refreshTokenUseCase.execute(userId, connection);

    await connection.commit();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: timeRemaining * 1000,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    });

    console.log("sending new access token and updating refresh token... (refreshTokenController)");
    res.status(200).json({ accessToken, userData });
    return;
  } catch (error) {
    await connection.rollback();

    if (error instanceof Error) {
      console.error(`Error trying to update the token. ${error.message}`);

      switch (error.message) {
        case "USER_NOT_FOUND":
          res.status(404).json({ message: "User not found in the database" });
          return;
        case "REFRESH_TOKEN_NOT_FOUND":
          res
            .status(404)
            .json({ message: "Refresh token not found for the user in db" });
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
