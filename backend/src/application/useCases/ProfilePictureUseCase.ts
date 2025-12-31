import { CloudinaryFileUploader } from "@/domain/ports/externalServices/CloudinaryFileUploader.js";
import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

type QuotaErrorPayload = {
  code: "STORAGE_QUOTA_EXCEEDED";
  used?: number;
  limit?: number;
  remaining?: number;
  attempted?: number;
};

export class UpdateProfilePictureUseCase {
  constructor(
    private readonly cloudinaryUploader: CloudinaryFileUploader,
    private readonly profileRepository: ProfileRepository,
    private readonly storageUsageRepo: MysqlStorageUsageRepository
  ) {}

  async execute(
    file: Express.Multer.File,
    userId: number | string
  ): Promise<{ public_id: string }> {
    if (!file) {
      throw new Error("No file provided");
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type. Only images are allowed");
    }

    if (file.size <= 0) {
      throw new Error("Invalid file");
    }

    const currentProfile = await this.profileRepository.getProfileById(userId);
    const oldPublicId = currentProfile?.profilePic || null;

    const currentProfilePicSize =
      await this.storageUsageRepo.getProfilePictureSize(userId);

    // upload to Cloudinary first before verifying quota
    const uploaded = await this.cloudinaryUploader.uploadProfilePicture(file);

    const newPublicId = uploaded.public_id;
    const cloudinaryBytes = uploaded.sizeInBytes;

    // calculate size with real size from Cloudinary
    const storageChange = cloudinaryBytes - currentProfilePicSize;

    // verify quota only if size is bigger
    if (storageChange > 0) {
      const remaining = await this.storageUsageRepo.getRemainingStorage(userId);

      if (storageChange > remaining) {
        // Rollback: delete uploaded image from Cloudinary
        try {
          await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
        } catch (rollbackError) {
          console.warn(
            `[ProfilePicture] Rollback warning: failed to delete image:`,
            rollbackError
          );
        }

        const [used, limit] = await Promise.all([
          this.storageUsageRepo.getUsedStorage(userId),
          this.storageUsageRepo.getMaxStorage(userId),
        ]);

        const err: Error & { details?: QuotaErrorPayload } = new Error(
          "Storage quota exceeded"
        );
        err.details = {
          code: "STORAGE_QUOTA_EXCEEDED",
          used,
          limit,
          remaining,
          attempted: storageChange,
        };
        throw err;
      }
    }

    try {
      // Update storage in DB using Cloudinary size
      await this.storageUsageRepo.updateProfilePictureSize(
        userId,
        cloudinaryBytes, // real size from Cloudinary
        currentProfilePicSize // old size from db
      );

      await this.profileRepository.updateProfilePicture(userId, newPublicId);

      // deletes old picture if exists
      if (oldPublicId && oldPublicId.trim() !== "") {
        try {
          await this.cloudinaryUploader.deleteProfilePicture(oldPublicId);
        } catch (deleteError) {
          console.warn(
            `[ProfilePicture] Could not delete old picture:`,
            deleteError
          );
        }
      }

      return { public_id: newPublicId };
    } catch (error) {
      console.error(`[ProfilePicture] Error during update:`, error);

      // Rollback
      await this.rollbackUpload(
        userId,
        newPublicId,
        cloudinaryBytes,
        oldPublicId,
        currentProfilePicSize
      );

      throw error;
    }
  }

  private async rollbackUpload(
    userId: number | string,
    newPublicId: string,
    newFileSize: number,
    oldPublicId?: string | null,
    oldFileSize?: number
  ): Promise<void> {
    // Deletes new uploaded image
    if (newPublicId) {
      try {
        await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
      } catch (error) {
        console.error(
          `[ProfilePicture] Rollback: failed to delete new image:`,
          error
        );
      }
    }

    if (oldFileSize !== undefined) {
      try {
        await this.storageUsageRepo.updateProfilePictureSize(
          userId,
          oldFileSize, // restores old size
          newFileSize // remove new size
        );
      } catch (error) {
        console.error(
          `[ProfilePicture] Rollback: failed to revert storage:`,
          error
        );
      }
    }
  }
}
