import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { JwtUserData, UserSessionWithTokens } from "../../shared/dtos/index.js";
import { tokenSign } from "../../infraestructure/auth/handleJwt.js";
import { RefreshTokenRepository } from "../../domain/ports/repositories/RefreshTokenRepository.js";

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

    const accessToken = await tokenSign(jwtPayload, "access", "30s");
    const refreshToken = await tokenSign(jwtPayload, "refresh", "1m");

    //set expiration date for refresh token to 65 seconds from now (65 seconds for testing)
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 500);

    await this.saveRefreshToken.saveRefreshToDB(user.id, refreshToken, expiresAt);

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