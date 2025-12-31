import { auth } from "@/lib/auth.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

interface LoginResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  headers?: Headers;
}

export class LoginUserWithBetterAuthUseCase {
  constructor(private readonly userRepository: MysqlUserRepository) {}

  async execute(username: string, password: string, requestHeaders: Headers): Promise<LoginResult> {
    // Find user by username to get their email
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    try {
      // Use BetterAuth to sign in with email, passing headers for cookie management
      const response = await auth.api.signInEmail({
        body: {
          email: user.email,
          password,
        },
        headers: requestHeaders,
        asResponse: true,
      });

      // Parse the response body
      const result = await response.json();

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
        headers: response.headers,
      };
    } catch (error) {
      // Re-throw BetterAuth errors to preserve their structure
      throw error;
    }
  }
}
