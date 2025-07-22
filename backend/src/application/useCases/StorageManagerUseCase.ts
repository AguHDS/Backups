import { MysqlStorageUsageRepository } from "../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

/** Manage amount of storage for files uploaded for authenticated user */
export class StorageManagerUseCase  {
  constructor(private readonly storageUsageRepo: MysqlStorageUsageRepository) {}

  async execute(userId: number | string): Promise<{ totalBytesUsed: number }> {
    const total = await this.storageUsageRepo.getUsedStorage(userId);
    return { totalBytesUsed: total };
  }
}
