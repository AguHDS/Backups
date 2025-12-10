import { CloudinaryFileUploader } from "@/domain/ports/externalServices/CloudinaryFileUploader.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { UserFile } from "@/domain/entities/UserFile.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

type QuotaErrorPayload = {
  code: "STORAGE_QUOTA_EXCEEDED";
  used?: number;
  limit?: number;
  remaining?: number;
  attempted?: number;
};

// Custom error class to fix rollback situations
class AlreadyRolledBackError extends Error {
  constructor(message: string, public details?: QuotaErrorPayload) {
    super(message);
    this.name = "AlreadyRolledBackError";
  }
}

export class UploadFilesUseCase {
  constructor(
    private readonly cloudinaryUploader: CloudinaryFileUploader,
    private readonly fileRepo: FileRepository,
    private readonly storageUsageRepo: MysqlStorageUsageRepository
  ) {}

  async execute(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string,
    userId: number | string
  ): Promise<UserFile[]> {
    if (!files || files.length === 0) throw new Error("No files provided");

    const numericSectionId = parseInt(sectionId, 10);
    if (isNaN(numericSectionId) || numericSectionId <= 0) {
      throw new Error(
        `Invalid sectionId: "${sectionId}". Must be a positive integer.`
      );
    }

    const numericUserId =
      typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (
      typeof numericUserId !== "number" ||
      isNaN(numericUserId) ||
      numericUserId <= 0
    ) {
      throw new Error(
        `Invalid userId: "${userId}". Must be a positive number.`
      );
    }

    const incomingBytes = files.reduce((sum, f) => sum + (f.size ?? 0), 0);
    if (incomingBytes <= 0) throw new Error("Invalid files payload");

    // Check initial quota
    const remaining = await this.storageUsageRepo.getRemainingStorage(
      numericUserId
    );

    if (incomingBytes > remaining) {
      const used = await this.storageUsageRepo.getUsedStorage(numericUserId);
      const limit = await this.storageUsageRepo.getMaxStorage(numericUserId);

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

    // Reserve initial storage
    const reserved = await this.storageUsageRepo.tryReserveStorage(
      numericUserId,
      incomingBytes
    );

    if (!reserved) {
      const [usedNow, limitNow, remainingNow] = await Promise.all([
        this.storageUsageRepo.getUsedStorage(numericUserId),
        this.storageUsageRepo.getMaxStorage(numericUserId),
        this.storageUsageRepo.getRemainingStorage(numericUserId),
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

    // Upload to Cloudinary
    let uploadedPublicIds: string[] = [];
    let confirmedBytes = 0;

    try {
      const uploaded = await this.cloudinaryUploader.upload(
        files,
        sectionId,
        sectionTitle
      );

      uploadedPublicIds = uploaded.map((f) => f.public_id);
      confirmedBytes = uploaded.reduce(
        (sum, f) => sum + (f.sizeInBytes ?? 0),
        0
      );

      // Handle byte difference
      if (confirmedBytes > incomingBytes) {
        const extra = confirmedBytes - incomingBytes;

        const extraOk = await this.storageUsageRepo.tryReserveStorage(
          numericUserId,
          extra
        );

        if (!extraOk) {
          await this.rollbackUpload(uploadedPublicIds);
          await this.storageUsageRepo.decreaseFromUsedStorage(
            numericUserId,
            incomingBytes
          );

          const [usedNow, limitNow, remainingNow] = await Promise.all([
            this.storageUsageRepo.getUsedStorage(numericUserId),
            this.storageUsageRepo.getMaxStorage(numericUserId),
            this.storageUsageRepo.getRemainingStorage(numericUserId),
          ]);

          const err = new AlreadyRolledBackError(
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
          await this.storageUsageRepo.decreaseFromUsedStorage(
            numericUserId,
            surplus
          );
        }
      }

      // Persist metadata
      const fileEntities = uploaded.map(
        (file) =>
          new UserFile(
            file.public_id,
            file.url,
            numericSectionId,
            file.sizeInBytes,
            numericUserId
          )
      );

      await this.fileRepo.saveMany(fileEntities);
      return fileEntities;
    } catch (e) {
      // Only rollback if it is NOT an AlreadyRolledBackError
      if (!(e instanceof AlreadyRolledBackError)) {
        if (uploadedPublicIds.length > 0) {
          await this.rollbackUpload(uploadedPublicIds);
        }

        // Calculate how many bytes to reverse:
        const bytesToRevert =
          confirmedBytes > 0 ? confirmedBytes : incomingBytes;

        await this.storageUsageRepo.decreaseFromUsedStorage(
          numericUserId,
          bytesToRevert
        );
      }

      throw e;
    }
  }

  private async rollbackUpload(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) return;

    if (typeof this.cloudinaryUploader.deleteByPublicIds === "function") {
      try {
        await this.cloudinaryUploader.deleteByPublicIds(publicIds);
      } catch (cleanupErr) {
        console.warn("Cloudinary cleanup failed", {
          publicIds,
          error:
            cleanupErr instanceof Error ? cleanupErr.message : "Unknown error",
        });
      }
    }
  }
}
