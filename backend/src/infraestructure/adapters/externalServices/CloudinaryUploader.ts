import { CloudinaryFileUploader, CloudinaryUploadResponse } from "../../../domain/ports/externalServices/CloudinaryFileUploader.js";
import { cloudinary } from "../../../services/cloudinary.js";
import streamifier from "streamifier";

export class CloudinaryUploader implements CloudinaryFileUploader {
  constructor(
    private readonly username: string,
    private readonly userId: string | number
  ) {}

  async upload(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string
  ): Promise<CloudinaryUploadResponse[]> {
    // cada usuario tiene su carpeta en Cloudinary
    const folder = `user_files/${this.username} (id: ${this.userId})/section: ${sectionTitle} (id: ${sectionId})`;

    const uploadPromises = files.map((file) => {
      return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              sizeInBytes: result.bytes,
            });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    return await Promise.all(uploadPromises);
  }

  /**
   * For rollback of files when upload fails or not enough space
   */
  async deleteByPublicIds(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;
    await cloudinary.api.delete_resources(publicIds);
  }
}
