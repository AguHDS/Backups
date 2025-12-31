import { auth } from "@/lib/auth.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

interface LoginResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class LoginUserWithBetterAuthUseCase {
  constructor(private readonly userRepository: MysqlUserRepository) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    // Find user by username to get their email
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Use BetterAuth to sign in with email (BetterAuth uses email by default)
    const result = await auth.api.signInEmail({
      body: {
        email: user.email,
        password,
      },
    });

    if (!result || !result.user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: user.role,
      },
    };
  }
}
