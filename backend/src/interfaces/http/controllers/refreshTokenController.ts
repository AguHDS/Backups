import config from "../../../infraestructure/config/environmentVars.js";
import promisePool from "../../../db/database.js";
import { Request, Response } from "express";
import { tokenSign } from "../../../infraestructure/auth/handleJwt.js";
import { RefreshTokenUseCase } from "../../../application/useCases/RefreshTokenUseCase.js";
import { MysqlUserRepository, MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/index.js";

//dependency injection
const refreshTokenUseCase = new RefreshTokenUseCase(
  new MysqlUserRepository(),
  new MysqlRefreshTokenRepository(),
  tokenSign
);

/** Send new tokens and user data */
export const refreshTokenController = async ( req: Request, res: Response): Promise<void> => {
  const connection = await promisePool.getConnection();

  try {
    //begin a new transaction to ensure all db transactions are atomic to cancel them if one fails
    await connection.beginTransaction();

    //alias destructuring and use id from previous refreshToken
    const { id: userId } = req.refreshTokenId;

    const { accessToken, refreshToken, userData, timeRemaining } = await refreshTokenUseCase.execute(userId, connection);

    //commit the db transaction once all steps succeed
    await connection.commit();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production", //use secure cookies only in production
      maxAge: timeRemaining * 1000, //set calculated time remaining
      sameSite: config.nodeEnv === "production" ? "none" : "lax", //adjust for cross-site requests in production
    });

    console.log("sending new access token and updating refresh token");

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
