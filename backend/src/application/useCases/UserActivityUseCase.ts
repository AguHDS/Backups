import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";

/** Set user online/offline status based on activity */
export class UpdateUserActivityUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId) return;
    
    try {
      await this.userRepo.updateLastActiveAt(userId);
    } catch (error) {
      console.error("Error updating user activity:", error);
    }
  }
}