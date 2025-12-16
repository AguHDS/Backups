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
    userId: number
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

    const incomingBytes = file.size;

    if (incomingBytes <= 0) {
      throw new Error("Invalid file");
    }

    // 1. Get current profile to check if a profile picture already exists
    const currentProfile = await this.profileRepository.getProfileById(userId);
    const oldPublicId = currentProfile?.profilePic || null;

    // 2. Check storage quota
    const remaining = await this.storageUsageRepo.getRemainingStorage(userId);

    if (incomingBytes > remaining) {
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
        attempted: incomingBytes,
      };
      throw err;
    }

    // 3. Reserve storage
    const reserved = await this.storageUsageRepo.tryReserveStorage(
      userId,
      incomingBytes
    );

    if (!reserved) {
      const [usedNow, limitNow, remainingNow] = await Promise.all([
        this.storageUsageRepo.getUsedStorage(userId),
        this.storageUsageRepo.getMaxStorage(userId),
        this.storageUsageRepo.getRemainingStorage(userId),
      ]);

      const err: Error & { details?: QuotaErrorPayload } = new Error(
        "Storage quota exceeded"
      );
      err.details = {
        code: "STORAGE_QUOTA_EXCEEDED",
        used: usedNow,
        limit: limitNow,
        remaining: remainingNow,
        attempted: incomingBytes,
      };
      throw err;
    }

    let newPublicId: string = "";
    let confirmedBytes = 0;

    try {
      // 4. Upload the new profile picture to Cloudinary using a unique public_id
      const uploaded = await this.cloudinaryUploader.uploadProfilePicture(file);

      newPublicId = uploaded.public_id;
      confirmedBytes = uploaded.sizeInBytes;

      // 5. Handle byte difference between expected and confirmed size
      await this.handleByteDifference(
        userId,
        incomingBytes,
        confirmedBytes,
        newPublicId
      );

      // 6. Delete the old profile picture if it exists
      if (oldPublicId && oldPublicId.trim() !== "") {
        try {
          await this.cloudinaryUploader.deleteProfilePicture(oldPublicId);
        } catch {
          // If the old image cannot be deleted, rollback everything to avoid having two active profile pictures
          throw new Error("Failed to delete old profile picture");
        }
      }

      // 7. Only now update the database with the new public_id
      await this.profileRepository.updateProfilePicture(userId, newPublicId);

      return { public_id: newPublicId };
    } catch (error) {
      // Rollback in case of error
      await this.rollbackUpload(
        userId,
        newPublicId,
        confirmedBytes,
        incomingBytes,
        oldPublicId
      );
      throw error;
    }
  }

  private async handleByteDifference(
    userId: number,
    incomingBytes: number,
    confirmedBytes: number,
    newPublicId: string
  ): Promise<void> {
    if (confirmedBytes > incomingBytes) {
      const extra = confirmedBytes - incomingBytes;

      const extraOk = await this.storageUsageRepo.tryReserveStorage(
        userId,
        extra
      );

      if (!extraOk) {
        await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
        await this.storageUsageRepo.decreaseFromUsedStorage(
          userId,
          incomingBytes
        );

        const [usedNow, limitNow, remainingNow] = await Promise.all([
          this.storageUsageRepo.getUsedStorage(userId),
          this.storageUsageRepo.getMaxStorage(userId),
          this.storageUsageRepo.getRemainingStorage(userId),
        ]);

        const err: Error & { details?: QuotaErrorPayload } = new Error(
          "Storage quota exceeded after upload"
        );
        err.details = {
          code: "STORAGE_QUOTA_EXCEEDED",
          used: usedNow,
          limit: limitNow,
          remaining: remainingNow,
          attempted: confirmedBytes,
        };
        throw err;
      }
    } else if (confirmedBytes < incomingBytes) {
      const surplus = incomingBytes - confirmedBytes;
      if (surplus > 0) {
        await this.storageUsageRepo.decreaseFromUsedStorage(userId, surplus);
      }
    }
  }

  private async rollbackUpload(
    userId: number,
    newPublicId: string,
    confirmedBytes: number,
    incomingBytes: number,
    oldPublicId?: string | null
  ): Promise<void> {
    // 1. Delete the newly uploaded image if it exists
    if (newPublicId) {
      try {
        await this.cloudinaryUploader.deleteProfilePicture(newPublicId);
      } catch {
        // Ignore rollback deletion errors
      }
    }

    // 2. Revert storage usage
    const bytesToRevert = confirmedBytes > 0 ? confirmedBytes : incomingBytes;

    try {
      await this.storageUsageRepo.decreaseFromUsedStorage(
        userId,
        bytesToRevert
      );
    } catch {
      // Ignore storage rollback errors
    }

    // 3. Restore the old public_id in the database if it existed
    // This ensures the user keeps the previous profile picture if the upload fails
    if (oldPublicId && oldPublicId.trim() !== "") {
      try {
        await this.profileRepository.updateProfilePicture(userId, oldPublicId);
      } catch {
        // Critical, but do not throw to avoid hiding the original error
      }
    }
  }
}
