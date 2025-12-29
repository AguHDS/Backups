import { ProfileRepository } from "../../domain/ports/repositories/ProfileRepository.js";
import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { CloudinaryRemover } from "../../infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { StorageUsageRepository } from "../../domain/ports/repositories/StorageUsageRepository.js";

/**
 * Deletes sections and their associated files for a user, updating storage usage accordingly
 */
export class DeleteSectionsUseCase {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly fileRepo: FileRepository,
    private readonly fileCloudinaryRemover: CloudinaryRemover,
    private readonly storageUsageRepo: StorageUsageRepository
  ) {}
  async execute(
    sectionIds: number[],
    userId: string | number,
    username: string
  ): Promise<void> {
    if (sectionIds.length === 0) throw new Error("NO_SECTIONS_ID");

    const files = await this.fileRepo.getFilesWithSizeBySectionId(sectionIds);

    // Get files public IDs to delete from Cloudinary
    const publicIds = files.map((file) => file.public_id);

    const totalBytesToSubtract = files.reduce(
      (sum, file) => sum + file.size_in_bytes,
      0
    );

    // Delete files from Cloudinary
    await this.fileCloudinaryRemover.deleteFilesByPublicIds(publicIds);

    // Delete all folders from Cloudinary (including old title versions)
    for (const sectionId of sectionIds) {
      await this.fileCloudinaryRemover.deleteFoldersBySectionId(
        username,
        userId,
        sectionId
      );
    }

    // Delete sections from db
    await this.profileRepo.deleteSectionsByIds(sectionIds, userId);

    // Update user's storage usage
    if (totalBytesToSubtract > 0) {
      await this.storageUsageRepo.decreaseFromUsedStorage(
        userId,
        totalBytesToSubtract
      );
    }
  }
}
