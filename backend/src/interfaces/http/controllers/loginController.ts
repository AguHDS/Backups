import { Request, Response } from "express";
import { LoginUserUseCase } from "../../../application/useCases/LoginUserUseCase.js";
import { MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/MysqlRefreshTokenRepository.js";
import { MysqlUserRepository } from "../../../infraestructure/repositories/MysqlUserRepository.js";
import { compare } from "../../../infraestructure/auth/handlePassword.js";
import config from "../../../infraestructure/config/environmentVars.js";

//dependency injection for the useCase
const loginUserUseCase = new LoginUserUseCase(
  new MysqlUserRepository(),
  compare,
  new MysqlRefreshTokenRepository()
);

export const loginController = async (req: Request, res: Response) => {
  if (!req.validatedUserData) {
    res.status(500).json({ message: "Missing user validated data" });
    return;
  }

  const { user, password } = req.validatedUserData;

  try {
    //on login successful, get tokens and user data
    const { accessToken, refreshToken, userData } = await loginUserUseCase.execute(user, password);

    //send refresh token as a cookie
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