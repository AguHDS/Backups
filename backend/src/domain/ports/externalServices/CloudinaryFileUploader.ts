export interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
  sizeInBytes: number;
}

export interface CloudinaryFileUploader {
  upload(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string
  ): Promise<CloudinaryUploadResponse[]>;
}
