import { CloudinaryFileUploader } from "@/domain/ports/externalServices/CloudinaryFileUploader.js";
import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

type QuotaErrorPayload = {
  code: "STORAGE_QUOTA_EXCEEDED";
  used?: bigint;
  limit?: bigint;
  remaining?: bigint;
  attempted?: bigint;
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
      await this.storageUsageRepo.getProfilePictureSize(userId); // bigint

    // Upload first (Cloudinary is source of truth)
    const uploaded = await this.cloudinaryUploader.uploadProfilePicture(file);

    const newPublicId = uploaded.public_id;
    const cloudinaryBytes = BigInt(uploaded.sizeInBytes); // 🔑

    const storageChange = cloudinaryBytes - currentProfilePicSize;

    // Quota check only if picture grows
    if (storageChange > 0n) {
      const remaining = await this.storageUsageRepo.getRemainingStorage(userId);

      if (storageChange > remaining) {
        // Rollback cloudinary upload
        try {
          await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
        } catch (rollbackError) {
          console.warn(
            `[ProfilePicture] Rollback warning: failed to delete image`,
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
      await this.storageUsageRepo.updateProfilePictureSize(
        userId,
        cloudinaryBytes,
        currentProfilePicSize
      );

      await this.profileRepository.updateProfilePicture(userId, newPublicId);

      // Delete old picture
      if (oldPublicId && oldPublicId.trim() !== "") {
        try {
          await this.cloudinaryUploader.deleteProfilePicture(oldPublicId);
        } catch (deleteError) {
          console.warn(
            `[ProfilePicture] Could not delete old picture`,
            deleteError
          );
        }
      }

      return { public_id: newPublicId };
    } catch (error) {
      console.error(`[ProfilePicture] Error during update`, error);

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
    newFileSize: bigint,
    oldPublicId?: string | null,
    oldFileSize?: bigint
  ): Promise<void> {
    if (newPublicId) {
      try {
        await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
      } catch (error) {
        console.error(
          `[ProfilePicture] Rollback: failed to delete new image`,
          error
        );
      }
    }

    if (oldFileSize !== undefined) {
      try {
        await this.storageUsageRepo.updateProfilePictureSize(
          userId,
          oldFileSize,
          newFileSize
        );
      } catch (error) {
        console.error(
          `[ProfilePicture] Rollback: failed to revert storage`,
          error
        );
      }
    }
  }
}
