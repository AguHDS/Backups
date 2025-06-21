export interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
}

export interface FileUploader {
  /** Upload to Cloudinary */
  upload(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string
  ): Promise<CloudinaryUploadResponse[]>;
}
