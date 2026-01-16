import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";

/** Get user online/offline status */
export class GetUserOnlineStatusUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<{
    isOnline: boolean;
    lastActiveAt: Date | null;
  }> {
    if (!userId) {
      return { isOnline: false, lastActiveAt: null };
    }

    try {
      return await this.userRepo.getUserOnlineStatus(userId);
    } catch (error) {
      console.error("Error getting user online status:", error);
      return { isOnline: false, lastActiveAt: null };
    }
  }
}
