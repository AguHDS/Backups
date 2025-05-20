import config from "../../../infraestructure/config/environmentVars.js";
import { Request, Response } from "express";
import { LoginUserUseCase } from "../../../application/useCases/LoginUserUseCase.js";
import { MysqlRefreshTokenRepository, MysqlUserRepository } from "../../../infraestructure/adapters/repositories/index.js";
import { compare } from "../../../infraestructure/auth/handlePassword.js";

//dependency injection
const loginUserUseCase = new LoginUserUseCase(
  new MysqlUserRepository(),
  compare,
  new MysqlRefreshTokenRepository()
);

/** Send new tokens and user data */
export const loginController = async (req: Request, res: Response) => {
  const { user, password } = req.userAndPassword;

  try {
    const { accessToken, refreshToken, userData } = await loginUserUseCase.execute(user, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production", //use secure cookies only in production
      maxAge: 65 * 1000, //65 seconds
      sameSite: config.nodeEnv === "production" ? "none" : "lax", //adjust for cross-site requests in production
    });

    res.status(200).json({ accessToken, userData });
  }catch(err) {
    console.error("Error in loginController");
    res.status(401).json({ message: err instanceof Error ? err.message : "Unauthorized" });
  }
}