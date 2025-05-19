import { FileUploader, FileData } from "../../domain/ports/FileUploader.js";

export class UploadFilesUseCase {
  constructor(private readonly uploader: FileUploader) {}

  async execute(files: Express.Multer.File[]): Promise<FileData[]> {
    
    if (!files || files.length === 0) throw new Error("No files were provided");

    return this.uploader.upload(files);
  }
}
