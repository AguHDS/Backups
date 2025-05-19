export interface FileData {
  url: string;
  public_id: string;
}

export interface FileUploader {
  upload(files: Express.Multer.File[]): Promise<FileData[]>;
}