import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";

/**
 * Deletes a user and all associated data (CASCADE DELETE)
 * This will automatically remove:
 * - User sessions
 * - User accounts
 * - User profile sections
 * - User files
 * - User storage limits and usage
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number | string): Promise<void> {
    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    await this.userRepo.deleteUserById(userId);
  }
}
