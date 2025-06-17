export interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
}

export interface FileUploader {
  /** Upload to Cloudinary */
  upload(files: Express.Multer.File[]): Promise<CloudinaryUploadResponse[]>;
}