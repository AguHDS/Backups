import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
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

  async execute(sectionIds: number[], userId: string): Promise<void> {
    if (!sectionIds.length) throw new Error("NO_SECTIONS_ID");

    const files = await this.fileRepo.getFilesWithSizeBySectionId(sectionIds);

    const publicIds = files.map((file) => file.publicId);

    const totalBytesToSubtract = files.reduce<bigint>(
      (sum, file) => sum + file.sizeInBytes,
      0n
    );

    if (publicIds.length > 0) {
      await this.fileCloudinaryRemover.deleteFilesByPublicIds(publicIds);
    }

    for (const sectionId of sectionIds) {
      await this.fileCloudinaryRemover.deleteFoldersBySectionId(
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
  }
}
