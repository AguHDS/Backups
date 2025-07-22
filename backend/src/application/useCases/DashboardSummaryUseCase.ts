import { StorageUsageRepository } from "../../domain/ports/repositories/StorageUsageRepository.js";

/** Dashboard summary for authenticated user */
export class DashboardSummaryUseCase {
  constructor(private readonly storageRepo: StorageUsageRepository) {}

  async execute(userId: number | string): Promise<{
    used: number;
  }> {
    const used = await this.storageRepo.getUsedStorage(userId);
    return {
      used,
    };
  }
}
