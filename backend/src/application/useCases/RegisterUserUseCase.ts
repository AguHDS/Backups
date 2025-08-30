import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import { NameAndEmailCheckResult } from "@/domain/ports/repositories/UserRepository.js";

const DEFAULT_MAX_STORAGE = 104857600; // 100MB

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly storageRepo: StorageUsageRepository,
    private readonly encrypt: (passwordPlain: string) => Promise<string>
  ) {}

  /** Register new user into the db */
  async execute(user: string, email: string, password: string): Promise<void> {
    const hashedPassword = await this.encrypt(password);
    const userData = { user, email, hashedPassword };

    const nameAndEmail: NameAndEmailCheckResult =
      await this.userRepo.isNameOrEmailTaken(userData.user, userData.email);

    if (nameAndEmail.isTaken) {
      if (nameAndEmail.userTaken && !nameAndEmail.emailTaken) {
        throw new Error("USERNAME_TAKEN");
      }
      if (!nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        throw new Error("EMAIL_TAKEN");
      }
      if (nameAndEmail.userTaken && nameAndEmail.emailTaken) {
        throw new Error("USERNAME_AND_EMAIL_TAKEN");
      }
    }

    // Insert user and get its ID
    const userId = await this.userRepo.insertNewUser(
      userData.user,
      userData.email,
      userData.hashedPassword,
      "user"
    );

    // Initialize storage and limnits usage
    await this.storageRepo.addToUsedStorage(userId, 0);
    await this.storageRepo.setMaxStorage(userId, DEFAULT_MAX_STORAGE);
  }
}
