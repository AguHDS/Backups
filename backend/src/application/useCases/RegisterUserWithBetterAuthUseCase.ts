import { auth } from "@/lib/auth.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";

interface RegisterResult {
  user: {
    id: string;
    name: string;
    email: string;
  };
  headers?: Headers;
}

export class RegisterUserWithBetterAuthUseCase {
  constructor(
    private readonly userRepository: MysqlUserRepository,
    private readonly storageRepository: MysqlStorageUsageRepository,
    private readonly profileRepository: MysqlProfileRepository
  ) {}

  async execute(name: string, email: string, password: string): Promise<RegisterResult> {
    // Check if user already exists
    const checkResult = await this.userRepository.isNameOrEmailTaken(name, email);

    if (checkResult.isTaken) {
      if (checkResult.userTaken && checkResult.emailTaken) {
        throw new Error("USERNAME_AND_EMAIL_TAKEN");
      }
      if (checkResult.userTaken) {
        throw new Error("USERNAME_TAKEN");
      }
      if (checkResult.emailTaken) {
        throw new Error("EMAIL_TAKEN");
      }
    }

    // Use BetterAuth to create the user WITHOUT auto-login
    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      // No headers = no session cookies
      asResponse: true,
    });

    // Parse the response body
    const result = await response.json();

    if (!result || !result.user) {
      throw new Error("REGISTRATION_FAILED");
    }

    const userId = result.user.id;

    // Initialize user storage usage
    await this.storageRepository.addToUsedStorage(userId, 0);
    await this.storageRepository.setMaxStorage(userId, 104857600);

    // Create user profile with default values
    await this.profileRepository.createProfile(userId);
    console.log(`User: ${name} profile created`);
    console.log(`User: ${name} registered successfully`);

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      // No headers = no session cookies set
    };
  }
}
