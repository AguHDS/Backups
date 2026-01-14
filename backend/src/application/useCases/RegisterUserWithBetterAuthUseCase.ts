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

const DEFAULT_MAX_STORAGE = 104857600n; // 100 MB

export class RegisterUserWithBetterAuthUseCase {
  constructor(
    private readonly userRepository: MysqlUserRepository,
    private readonly storageRepository: MysqlStorageUsageRepository,
    private readonly profileRepository: MysqlProfileRepository
  ) {}

  async execute(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResult> {
    const checkResult = await this.userRepository.isNameOrEmailTaken(
      name,
      email
    );

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

    try {
      const response = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
        asResponse: true, // avoid auto-login
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw {
          body: errorData,
          statusCode: response.status,
        };
      }

      const result = await response.json();

      if (!result?.user?.id) {
        throw new Error("REGISTRATION_FAILED");
      }

      const userId = result.user.id;

      // Initialize storage + profile (BIGINT)
      await this.storageRepository.addToUsedStorage(userId, 0n);
      await this.storageRepository.setMaxStorage(userId, DEFAULT_MAX_STORAGE);
      await this.profileRepository.createProfile(userId);

      return {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "body" in error &&
        "statusCode" in error
      ) {
        throw error;
      }

      throw new Error("REGISTRATION_FAILED");
    }
  }
}
