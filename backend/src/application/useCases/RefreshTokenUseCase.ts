import { RefreshTokenRepository } from "../../domain/ports/repositories/RefreshTokenRepository.js";
import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { JwtUserData, UserSessionWithTokens } from "../../shared/dtos/index.js";
import { Connection } from "mysql2/promise";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshRepo: RefreshTokenRepository,
    private readonly tokenSign: (user: JwtUserData,type: "access" | "refresh",expiresIn: string) => Promise<string>
  ) {}

  /**
   * Generates new tokens for the user and its data
   *
   * @param connection - A MySQL connection
   * @returns An object containing new tokens, user data, and time remaining for the refresh token
   */

  async execute(userId: number | string, connection: Connection): Promise<UserSessionWithTokens & { timeRemaining: number }> {
    const user = await this.userRepo.findById(userId, connection);
    if (!user) throw new Error("USER_NOT_FOUND");

    const jwtPayload: JwtUserData = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.tokenSign(jwtPayload, "access", "30s");

    const refreshExpiresAt = await this.refreshRepo.getExpirationTime(user.id, connection);

    if (!refreshExpiresAt) throw new Error("REFRESH_TOKEN_NOT_FOUND");

    const timeRemaining = Math.floor((refreshExpiresAt.getTime() - Date.now()) / 1000);

    if (timeRemaining <= 0) throw new Error("REFRESH_TOKEN_EXPIRED");

    //with the calculated time remaining, create a new refresh token
    const refreshToken = await this.tokenSign(jwtPayload, "refresh", `${timeRemaining}s`);

    await this.refreshRepo.updateRefreshTokenFromDB(refreshToken, user.id, connection);

    return {
      accessToken,
      refreshToken,
      userData: jwtPayload,
      timeRemaining,
    };
  }

  async hasRefreshInDB(userId: number): Promise<boolean> {
    return this.refreshRepo.searchRefreshToken(userId);
  }

  async logout(userId: number): Promise<void> {
    await this.refreshRepo.deleteRefreshFromDB(userId);
  }
}
