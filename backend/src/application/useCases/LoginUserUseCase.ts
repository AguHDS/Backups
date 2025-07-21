import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { JwtUserData, UserSessionWithTokens } from "../../shared/dtos/index.js";
import { tokenSign } from "../../infraestructure/auth/handleJwt.js";
import { RefreshTokenRepository } from "../../domain/ports/repositories/RefreshTokenRepository.js";
import bcrypt from "bcrypt";

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly comparePasswords: (pass: string, hash: string) => Promise<boolean>,
    private readonly saveRefreshToken: RefreshTokenRepository
  ) {}

  /** Send new tokens and save refresh token to db
   * 
   * @returns An object with new tokens and user data 
   */
  async execute(username: string, password: string): Promise<UserSessionWithTokens> {
    const user = await this.userRepo.findByUsername(username);

    if (!user) throw new Error("Credentials don't exist");

    const validPassword = await user.isPasswordValid(password, this.comparePasswords);

    if (!validPassword) throw new Error("Invalid credentials");

    //structure needed to create token
    const jwtPayload: JwtUserData = {
      name: user.name,
      role: user.role,
      id: user.id,
    };

    // Tokens para pruebas: access 10s, refresh 20s
    const accessToken = await tokenSign(jwtPayload, "access", "15m");
    const refreshToken = await tokenSign(jwtPayload, "refresh", "30d");

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.saveRefreshToken.saveRefreshToDB(user.id, hashedRefreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      userData: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      },
    };
  }
}