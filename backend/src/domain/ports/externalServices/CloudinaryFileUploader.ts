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

  /**
   * Deletes files from Cloudinary by their public_ids
   * it's mainly used in case of rollback when the upload fails
   * or there is not enough space after the initial reservation
   */
  deleteByPublicIds?(publicIds: string[]): Promise<void>;
}
