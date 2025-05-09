import { RefreshTokenRepository } from "../../domain/repositories/RefreshTokenRepository.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import {
  JwtUserData,
  UserSessionWithTokens,
} from "../../shared/dtos/index.js";
import { Connection } from "mysql2/promise";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshRepo: RefreshTokenRepository,
    private readonly tokenSign: (
      user: JwtUserData,
      type: "access" | "refresh",
      expiresIn: string
    ) => Promise<string>
  ) {}

  async execute(userId: number | string, connection: Connection): Promise<UserSessionWithTokens & { timeRemaining: number }> {
    const user = await this.userRepo.findById(userId, connection);
    if (!user) throw new Error("USER_NOT_FOUND");

    const jwtPayload: JwtUserData = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.tokenSign(jwtPayload, "access", "30s");

    const expiresAt = await this.refreshRepo.getExpirationTime(
      user.id,
      connection
    );
    if (!expiresAt) throw new Error("REFRESH_TOKEN_NOT_FOUND");

    const timeRemaining = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    if (timeRemaining <= 0) throw new Error("REFRESH_TOKEN_EXPIRED");

    const refreshToken = await this.tokenSign(
      jwtPayload,
      "refresh",
      `${timeRemaining}s`
    );
    await this.refreshRepo.updateRefreshTokenFromDB(
      refreshToken,
      user.id,
      connection
    );

    return {
      accessToken,
      refreshToken,
      userData: jwtPayload,
      timeRemaining,
    };
  }
}
