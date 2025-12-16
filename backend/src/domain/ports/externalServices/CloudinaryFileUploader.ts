export interface CloudinaryUploadResponse {
  public_id: string;
  sizeInBytes: number;
}

export interface CloudinaryFileUploader {
  /** Uploads files for sections */
  uploadFilesToSection(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string
  ): Promise<CloudinaryUploadResponse[]>;

  /** Uploads a profile picture */
  uploadProfilePicture(
    file: Express.Multer.File
  ): Promise<CloudinaryUploadResponse>;

  /** Deletes profile picture by its public ID */
  deleteProfilePicture(publicId: string): Promise<void>;

  /**
   * Deletes files from Cloudinary by their public_ids
   * Mainly used in case of rollback when the upload fails
   * or there is not enough space after the initial reservation
   */
  deleteByPublicIds?(publicIds: string[]): Promise<void>;
}
