import { FileUploader } from "../../domain/ports/externalServices/FileUploader.js";
import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { UserFile } from "../../domain/entities/UserFile.js";

export class UploadFilesUseCase {
  constructor(
    private readonly uploader: FileUploader,
    private readonly fileRepo: FileRepository
  ) {}

  async execute(files: Express.Multer.File[], sectionId: number): Promise<UserFile[]> {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const uploaded = await this.uploader.upload(files);

    const fileEntities = uploaded.map(
      (file) => new UserFile(file.public_id, file.url, sectionId)
    );

    for (const file of fileEntities) {
      await this.fileRepo.save(file);
    }

    return fileEntities;
  }
}