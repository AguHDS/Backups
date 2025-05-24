import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { NameAndEmailCheckResult } from "../../domain/ports/repositories/UserRepository.js";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encrypt: (passwordPlain: string) => Promise<string>,
  ) {}

  /** Register new user into the db */
  async execute(user: string, email: string, password: string): Promise<void> {
    const hashedPassword = await this.encrypt(password);
    const userData = { user, email, hashedPassword };

    const nameAndEmail: NameAndEmailCheckResult = await this.userRepo.isNameOrEmailTaken(userData.user, userData.email);

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

    await this.userRepo.insertNewUser(userData.user, userData.email, userData.hashedPassword, "user");
  }
}
