import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { CloudinaryRemover } from "../../infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { StorageUsageRepository } from "../../domain/ports/repositories/StorageUsageRepository.js";
import { SectionFilesPayload } from "../../shared/dtos/SectionAndFiles.js"

export class DeleteFilesFromSectionsUseCase {
  constructor(
    private readonly fileRepo: FileRepository,
    private readonly fileCloudinaryRemover: CloudinaryRemover,
    private readonly storageUsageRepo: StorageUsageRepository
  ) {}

  /**
   * Deletes selected files from Cloudinary and the database, grouped by section
   * Updates user_storage_usage by subtracting deleted bytes
   */
  async execute(userId: number | string, data: SectionFilesPayload[]): Promise<void> {
    let totalBytesToSubtract = 0;

    for (const { publicIds } of data) {
      if (!publicIds.length) continue;

      // Get file metadata before deletion
      const deletedFiles = await this.fileRepo.deleteFilesByPublicIds(publicIds);

      // Delete from Cloudinary
      await this.fileCloudinaryRemover.deleteFilesByPublicIds(publicIds);

      // Accumulate total bytes (only from the current user’s files)
      for (const file of deletedFiles) {
        if (file.userId === userId) {
          totalBytesToSubtract += file.sizeInBytes;
        }
      }
    }

    if (totalBytesToSubtract > 0) {
      await this.storageUsageRepo.decreaseFromUsedStorage(userId, totalBytesToSubtract);
    }
  }
}
