import { RefreshTokenRepository } from "../../domain/ports/repositories/RefreshTokenRepository.js";
import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { JwtUserData, UserSessionWithTokens } from "../../shared/dtos/index.js";
import { Connection } from "mysql2/promise";
import jwt from "jsonwebtoken";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshRepo: RefreshTokenRepository,
    private readonly tokenSign: (
      user: JwtUserData,
      type: "access" | "refresh",
      expiresIn: jwt.SignOptions["expiresIn"]
    ) => Promise<string>
  ) {}

  /**
   * Generates new tokens for the user and its data
   *
   * @param connection - A MySQL connection
   * @returns An object containing new tokens, user data, and time remaining for the refresh token
  */
  async execute(userId: number | string,connection: Connection): Promise<UserSessionWithTokens & { timeRemaining: number; refreshTokenRotated: boolean; }> {
    const user = await this.userRepo.findById(userId, connection);
    if (!user) throw new Error("USER_NOT_FOUND");

    const jwtPayload: JwtUserData = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.tokenSign(jwtPayload, "access", "15m");
    console.log(`[REFRESH] Access token generated for user ${user.id}`);

    const refreshExpiresAt = await this.refreshRepo.getExpirationTime(user.id,connection);
    const lastRotatedAt = await this.refreshRepo.getLastRotatedAt(user.id,connection);

    if (!refreshExpiresAt || !lastRotatedAt) throw new Error("REFRESH_TOKEN_NOT_FOUND");

    const timeRemaining = Math.floor((refreshExpiresAt.getTime() - Date.now()) / 1000);
    const secondsSinceRotation = Math.floor((Date.now() - lastRotatedAt.getTime()) / 1000);

    if (timeRemaining <= 0) throw new Error("REFRESH_TOKEN_EXPIRED");

    // Cooldown for refresh token rotation
    const ROTATION_COOLDOWN_SECONDS = 20;
    const shouldRotateRefresh = secondsSinceRotation > ROTATION_COOLDOWN_SECONDS;

    if (shouldRotateRefresh) {
      const refreshToken = await this.tokenSign(jwtPayload, "refresh", `${timeRemaining}s`);
      await this.refreshRepo.updateRefreshTokenWithRotation(refreshToken, user.id, connection);

      console.log(`[Backend] Token rotation completed for user ${user.id}`);

      return {
        accessToken,
        refreshToken,
        userData: jwtPayload,
        timeRemaining,
        refreshTokenRotated: true,
      };
    } else {
      console.log(`[Backend] Only access token renewed for user ${user.id} (cooldown)`);

      return {
        accessToken,
        refreshToken: "",
        userData: jwtPayload,
        timeRemaining,
        refreshTokenRotated: false,
      };
    }
  }

  async hasRefreshInDB(userId: number): Promise<boolean> {
    return this.refreshRepo.searchRefreshToken(userId);
  }

  async logout(userId: number): Promise<void> {
    await this.refreshRepo.deleteRefreshFromDB(userId);
  }
}
