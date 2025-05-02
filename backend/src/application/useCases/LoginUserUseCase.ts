import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { JwtUserData, ValidUserData } from "../../shared/dtos/index.js";
import { tokenSign } from "../../utils/handleJwt.js";
import { RefreshTokenRepository } from "../../domain/repositories/RefreshTokenRepository.js";

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly comparePasswords: (a: string, b: string) => Promise<boolean>,
    private readonly saveRefreshToken: RefreshTokenRepository
  ) {}

  async execute(username: string, password: string): Promise<ValidUserData> {
    const user = await this.userRepo.findByUsername(username);

    if (!user) throw new Error("Credentials don't exist");

    const validPassword = await user.isPasswordValid(password, this.comparePasswords);

    if (!validPassword) throw new Error("Invalid credentials");

    const jwtPayload: JwtUserData = {
      name: user.name,
      role: user.role,
      id: user.id,
    };

    const accessToken = await tokenSign(jwtPayload, "access", "30s");
    const refreshToken = await tokenSign(jwtPayload, "refresh", "1m");

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 65);

    //save refresh token to db, will get dependency injected in the controller
    await this.saveRefreshToken.save(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      userData: {
        name: user.name,
        role: user.role,
        id: user.id,
      },
    };
  }
}