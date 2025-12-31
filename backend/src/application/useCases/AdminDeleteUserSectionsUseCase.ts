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

  async execute(
    userId: string | number,
    sectionIds: number[]
  ): Promise<number> {
    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    if (!sectionIds || sectionIds.length === 0) {
      throw new Error("MISSING_SECTION_IDS");
    }

    // Get user info (need username for Cloudinary paths)
    const connection = await promisePool.getConnection();
    try {
      const user = await this.userRepo.findById(userId, connection);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      // Get files from these sections to calculate storage reduction
      const files = await this.fileRepo.getFilesWithSizeBySectionId(sectionIds);

      // Get public IDs to delete from Cloudinary
      const publicIds = files.map((file) => file.public_id);

      // Calculate total bytes to subtract from storage
      const totalBytesToSubtract = files.reduce(
        (sum, file) => sum + file.size_in_bytes,
        0
      );

      // Delete files from Cloudinary
      if (publicIds.length > 0) {
        await this.cloudinaryRemover.deleteFilesByPublicIds(publicIds);
      }

      // Delete section folders from Cloudinary (all versions)
      for (const sectionId of sectionIds) {
        await this.cloudinaryRemover.deleteFoldersBySectionId(
          user.name,
          userId,
          sectionId
        );
      }

      // Delete sections from database (CASCADE will delete associated files)
      await this.profileRepo.deleteSectionsByIds(sectionIds, userId);

      // Update user's storage usage
      if (totalBytesToSubtract > 0) {
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
