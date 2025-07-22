import { CloudinaryFileUploader } from "../../domain/ports/externalServices/CloudinaryFileUploader.js";
import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { UserFile } from "../../domain/entities/UserFile.js";
import { MysqlStorageUsageRepository } from "../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

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

    const uploaded = await this.cloudinaryUploader.upload(files, sectionId, sectionTitle);

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

    const totalBytes = fileEntities.reduce((sum, f) => sum + f.sizeInBytes, 0);
    await this.storageUsageRepo.addToUsedStorage(userId, totalBytes);

    return fileEntities;
  }
}
