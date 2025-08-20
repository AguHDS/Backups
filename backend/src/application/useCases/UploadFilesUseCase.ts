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

    // pre-check with request size
    const incomingBytes = files.reduce((sum, f) => sum + (f.size ?? 0), 0);
    if (incomingBytes <= 0) throw new Error("Invalid files payload");

    const remaining = await this.storageUsageRepo.getRemainingStorage(userId);
    if (incomingBytes > remaining) {
      const used = await this.storageUsageRepo.getUsedStorage(userId);
      const limit = await this.storageUsageRepo.getMaxStorage(userId);
      const err: Error & { details?: QuotaErrorPayload } = new Error("Storage quota exceeded");
      err.details = {
        code: "STORAGE_QUOTA_EXCEEDED",
        used,
        limit,
        remaining,
        attempted: incomingBytes,
      };
      throw err;
    }

    // atomic reserve
    const reserved = await this.storageUsageRepo.tryReserveStorage(
      userId,
      incomingBytes
    );
    if (!reserved) {
      // reread status to respond with fresh data
      const [usedNow, limitNow, remainingNow] = await Promise.all([
        this.storageUsageRepo.getUsedStorage(userId),
        this.storageUsageRepo.getMaxStorage(userId),
        this.storageUsageRepo.getRemainingStorage(userId),
      ]);
      const err: Error & { details?: QuotaErrorPayload } = new Error("Storage quota exceeded");
      err.details = {
        code: "STORAGE_QUOTA_EXCEEDED",
        used: usedNow,
        limit: limitNow,
        remaining: remainingNow,
        attempted: incomingBytes,
      };
      throw err;
    }

    // upload to Cloudinary
    let uploadedPublicIds: string[] = [];
    try {
      const uploaded = await this.cloudinaryUploader.upload(
        files,
        sectionId,
        sectionTitle
      );

      uploadedPublicIds = uploaded.map((f) => f.public_id);

      // confirmed bytes by Cloudinary
      const confirmedBytes = uploaded.reduce((sum, f) => sum + (f.sizeInBytes ?? 0), 0);

      // adjust if different from reservation
      if (confirmedBytes > incomingBytes) {
        const extra = confirmedBytes - incomingBytes;
        const extraOk = await this.storageUsageRepo.tryReserveStorage(
          userId,
          extra
        );
        if (!extraOk) {
          // there is no quota for the surplus: upload and reserve rollback
          await this.rollbackUpload(uploadedPublicIds);
          await this.storageUsageRepo.decreaseFromUsedStorage(
            userId,
            incomingBytes
          );
          const [usedNow, limitNow, remainingNow] = await Promise.all([
            this.storageUsageRepo.getUsedStorage(userId),
            this.storageUsageRepo.getMaxStorage(userId),
            this.storageUsageRepo.getRemainingStorage(userId),
          ]);
          const err: Error & { details?: QuotaErrorPayload } = new Error("Storage quota exceeded after upload");
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
        // leftover: we return the difference
        const surplus = incomingBytes - confirmedBytes;
        if (surplus > 0) {
          await this.storageUsageRepo.decreaseFromUsedStorage(userId, surplus);
        }
      }

      // persist metadata
      const fileEntities = uploaded.map(
        (file) =>
          new UserFile(
            file.public_id,
            file.url,
            sectionId,
            file.sizeInBytes,
            userId
          )
      );

      await this.fileRepo.saveMany(fileEntities);

      return fileEntities;
    } catch (e) {
      // upload or save failed: delete whatever is in Cloudinary and release the initial reservation
      if (uploadedPublicIds.length > 0) {
        await this.rollbackUpload(uploadedPublicIds);
      }
      // release the reservation made at the beginning
      await this.storageUsageRepo.decreaseFromUsedStorage(
        userId,
        incomingBytes
      );
      throw e;
    }
  }

  private async rollbackUpload(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) return;
    // if the uploader exposes the method, we use its contract
    if (typeof this.cloudinaryUploader.deleteByPublicIds === "function") {
      try {
        await this.cloudinaryUploader.deleteByPublicIds(publicIds);
      } catch (cleanupErr) {
       console.warn("Cloudinary cleanup failed", { publicIds, cleanupErr });
      }
    }
  }
}
