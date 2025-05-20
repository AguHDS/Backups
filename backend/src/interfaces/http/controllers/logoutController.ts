import { Response, Request } from "express";
import { RefreshTokenUseCase } from "../../../application/useCases/RefreshTokenUseCase.js";
import { MysqlUserRepository, MysqlRefreshTokenRepository } from "../../../infraestructure/adapters/repositories/index.js";
import { tokenSign } from "../../../infraestructure/auth/handleJwt.js";

//dependency injection
const refreshTokenUseCase = new RefreshTokenUseCase(
  new MysqlUserRepository(),
  new MysqlRefreshTokenRepository(),
  tokenSign
);

/** Deletes refresh token from database to logout a user */
export const logoutController = async (req: Request, res: Response) => {
  try {
    const { id } = req.userId!;

    res.clearCookie("refreshToken", { httpOnly: true });

    await refreshTokenUseCase.logout(id);
    console.log("logout successfull");
    
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller:", error);

    res.status(500).json({ message: "Logout failed" });
  }
};