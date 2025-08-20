import { UserRepository } from "../../domain/ports/repositories/UserRepository.js";
import { StorageUsageRepository } from "../../domain/ports/repositories/StorageUsageRepository.js";

/** Get storage status for username in the params */
export class GetStorageUsageUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly storageRepo: StorageUsageRepository
  ) {}

  async execute(
    username: string
  ): Promise<{ used: number; limit: number; remaining: number }> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) throw new Error("USER_NOT_FOUND");

    const [used, limit] = await Promise.all([
      this.storageRepo.getUsedStorage(user.id),
      this.storageRepo.getMaxStorage(user.id),
    ]);

    const remaining = Math.max(limit - used, 0);
    return { used, limit, remaining };
  }
}
