import { auth } from "@/lib/auth.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

interface RegisterResult {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class RegisterUserWithBetterAuthUseCase {
  constructor(
    private readonly userRepository: MysqlUserRepository,
    private readonly storageRepository: MysqlStorageUsageRepository
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

    // Use BetterAuth to create the user
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!result || !result.user) {
      throw new Error("REGISTRATION_FAILED");
    }

    // Initialize user storage usage (0 bytes)
    try {
      await this.storageRepository.addToUsedStorage(result.user.id, 0);
      console.log(`User: ${name} registered successfully with storage initialized`);
    } catch (storageError) {
      console.error("Error initializing user storage:", storageError);
      // Continue anyway, storage can be created later
    }

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    };
  }
}
