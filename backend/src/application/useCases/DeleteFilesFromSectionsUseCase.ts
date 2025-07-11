import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { CloudinaryRemover } from "../../infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { SectionFilesPayload } from "../.:/../../shared/dtos/SectionAndFiles.js";

export class DeleteFilesFromSectionsUseCase {
  constructor(
    private readonly fileRepo: FileRepository,
    private readonly fileRemover: CloudinaryRemover
  ) {}

  /**
   * Deletes selected files from Cloudinary and the database, grouped by section
   */
  async execute(data: SectionFilesPayload[]): Promise<void> {
    for (const { publicIds } of data) {
      if (!publicIds.length) continue;

      // Delete from Cloudinary
      await this.fileRemover.deleteFilesByPublicIds(publicIds);

      // Delete from db
      await this.fileRepo.deleteFilesByPublicIds(publicIds);
    }
  }
}
