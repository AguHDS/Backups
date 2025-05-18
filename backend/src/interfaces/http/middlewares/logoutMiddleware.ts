import { Response, Request, NextFunction } from "express";
import { RefreshTokenUseCase } from "../../../application/useCases/RefreshTokenUseCase.js";
import { MysqlUserRepository, MysqlRefreshTokenRepository } from "../../../infraestructure/repositories/index.js";
import { tokenSign } from "../../../infraestructure/auth/handleJwt.js";

//dependency injection
const refreshTokenUseCase = new RefreshTokenUseCase(
  new MysqlUserRepository(),
  new MysqlRefreshTokenRepository(),
  tokenSign
);

export const logoutMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    if (!id) {
      console.log("No id in the logout request");
      res.status(401).json({ message: "No user id for logout request" });
      return;
    }

    const hasRefresh = await refreshTokenUseCase.hasRefreshInDB(id);

    if (!hasRefresh) {
      console.log("user has no refresh token in the db");
      res.status(401).json({ message: "User has no refresh token in the db" });
      return;
    }
    
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      console.log("No refresh token in cookies (logout middleware)");
      res.status(401).json({ message: "User has no refresh token in cookies" });
      return;
    }
    
    req.userId = { id };
    next();
  } catch (error) {
    console.log("error in logout middleware ", error);
    res.status(500).json({ message: "Error trying to logout" });
  }
};
