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
    // each user has a folder in Cloudinary
    const folder = `user_files/${this.username} (id: ${this.userId})/section: ${sectionTitle} (id: ${sectionId})`;

    const uploadPromises = files.map((file) => {
      return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              return reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            
            if (!result) {
              return reject(new Error("Cloudinary upload failed: No result returned"));
            }

            if (!result.secure_url || !result.public_id || result.bytes === undefined) {
              return reject(new Error("Cloudinary upload failed: Incomplete result data"));
            }

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
    
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error("Failed to delete resources from Cloudinary:", error);
      throw new Error(`Failed to delete files from Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}