import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

/** Dashboard summary for authenticated user */
export class DashboardSummaryUseCase {
  constructor(private readonly storageRepo: StorageUsageRepository) {}

  async execute(userId: string): Promise<{
    used: bigint;
    totalFiles: number;
    maxStorage: bigint;
  }> {
    const [used, totalFiles, maxStorage] = await Promise.all([
      this.storageRepo.getUsedStorage(userId),
      this.storageRepo.getTotalFilesCount(userId),
      this.storageRepo.getMaxStorage(userId),
    ]);

    return {
      used,
      totalFiles,
      maxStorage,
    };
  }
}
