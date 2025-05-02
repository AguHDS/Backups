import { RequestHandler } from "express";
import { validationResult, ValidationError, matchedData } from "express-validator";
import { LoginUserUseCase } from "../../../application/useCases/LoginUserUseCase.js";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/MysqlRefreshTokenRepository.js";
import { MysqlUserRepository } from "../../../infraestructure/repositories/MysqlUserRepository.js";
import { compare } from "../../../utils/handlePassword.js";


import config from "../../../infraestructure/config/environmentVars.js";
import { getUserByName } from "../../../db/queries/index.js";
import { RowDataPacket } from "mysql2/promise";

import { tokenSign } from "../../../utils/handleJwt.js";
import { JwtUserData, ValidUserData } from "../../../shared/dtos/index.js";

//dependency injection for the use case
const loginUserUseCase = new LoginUserUseCase(
  new MysqlUserRepository,
  compare,
  new MysqlRefreshTokenRepository
);

export const loginController: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, password } = matchedData(req);

  try {
    //on login successful, get tokens and user data
    const { accessToken, refreshToken, userData } = await loginUserUseCase.execute(user, password);

    //set refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 65 * 1000,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    });

    res.status(200).json({ accessToken, userData });
  }catch(err) {
    console.error("Error in loginController");
    res.status(401).json({ message: err instanceof Error ? err.message : "Unauthorized" });
  }
}