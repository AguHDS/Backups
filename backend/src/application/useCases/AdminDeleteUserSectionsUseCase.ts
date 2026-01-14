import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import promisePool from "@/db/database.js";
/**
 * Deletes sections from any user
 */
export class AdminDeleteUserSectionsUseCase {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly fileRepo: FileRepository,
    private readonly userRepo: UserRepository,
    private readonly cloudinaryRemover: CloudinaryRemover,
    private readonly storageUsageRepo: StorageUsageRepository
  ) {}

  async execute(userId: string, sectionIds: number[]): Promise<number> {
    if (!userId) throw new Error("MISSING_USER_ID");
    if (!sectionIds.length) throw new Error("MISSING_SECTION_IDS");

    const connection = await promisePool.getConnection();

    try {
      const user = await this.userRepo.findById(userId, connection);
      if (!user) throw new Error("USER_NOT_FOUND");

      const files = await this.fileRepo.getFilesWithSizeBySectionId(sectionIds);

      const publicIds = files.map((file) => file.publicId);

      const totalBytesToSubtract = files.reduce<bigint>(
        (sum, file) => sum + file.sizeInBytes,
        0n
      );

      if (publicIds.length > 0) {
        await this.cloudinaryRemover.deleteFilesByPublicIds(publicIds);
      }

      for (const sectionId of sectionIds) {
        await this.cloudinaryRemover.deleteFoldersBySectionId(
          userId,
          sectionId
        );
      }

      await this.profileRepo.deleteSectionsByIds(sectionIds, userId);

      if (totalBytesToSubtract > 0n) {
        await this.storageUsageRepo.decreaseFromUsedStorage(
          userId,
          totalBytesToSubtract
        );
      }

      return sectionIds.length;
    } finally {
      connection.release();
    }
  }
}
