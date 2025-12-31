import {
  CloudinaryFileUploader,
  CloudinaryUploadResponse,
} from "../../../domain/ports/externalServices/CloudinaryFileUploader.js";
import { cloudinary } from "../../../services/cloudinary.js";
import streamifier from "streamifier";

export class CloudinaryUploader implements CloudinaryFileUploader {
  constructor(
    private readonly username: string,
    private readonly userId: string | number
  ) {}

  // Upload files for sections
  async uploadFilesToSection(
    files: Express.Multer.File[],
    sectionId: string,
    sectionTitle: string
  ): Promise<CloudinaryUploadResponse[]> {
    const folder = `user_files/${this.username} (id: ${this.userId})/section: ${sectionTitle} (id: ${sectionId})`;

    const uploadPromises = files.map((file) => {
      return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              return reject(
                new Error(`Cloudinary upload failed: ${error.message}`)
              );
            }

            if (!result) {
              return reject(
                new Error("Cloudinary upload failed: No result returned")
              );
            }

            if (!result.public_id || result.bytes === undefined) {
              return reject(
                new Error("Cloudinary upload failed: Incomplete result data")
              );
            }

            resolve({
              public_id: result.public_id,
              url: result.secure_url,
              sizeInBytes: result.bytes,
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    return Promise.all(uploadPromises);
  }

  // Upload profile picture
  async uploadProfilePicture(
    file: Express.Multer.File
  ): Promise<CloudinaryUploadResponse> {
    const folder = `user_files/${this.username} (id: ${this.userId})/profile_picture`;

    // Generate unique public_id
    const timestamp = Date.now();
    const uniquePublicId = `profile_pic_${timestamp}`;

    return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: uniquePublicId,
          overwrite: false,
          invalidate: true,
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
          resource_type: "image",
          // Context for tracking (optional)
          context: `uploaded=${timestamp}|user=${this.userId}`,
        },
        (error, result) => {
          if (error) {
            console.error(
              `[Cloudinary] Upload failed for user ${this.userId}:`,
              error
            );
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`)
            );
          }

          if (!result) {
            console.error(
              `[Cloudinary] No result returned for user ${this.userId}`
            );
            return reject(
              new Error("Cloudinary upload failed: No result returned")
            );
          }

          if (!result.public_id || result.bytes === undefined) {
            console.error(
              `[Cloudinary] Incomplete result for user ${this.userId}:`,
              result
            );
            return reject(
              new Error("Cloudinary upload failed: Incomplete result data")
            );
          }

          const fullPublicId = result.public_id;
          const compressedSize = result.bytes;

          resolve({
            public_id: fullPublicId,
            url: result.secure_url,
            sizeInBytes: compressedSize, // real size after Cloudinary compression
          });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  // Delete specific profile picture
  async deleteProfilePicture(publicId: string): Promise<void> {
    if (!publicId || publicId.trim() === "") {
      return;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "not found" || result.result !== "ok") {
        console.warn(
          `[Cloudinary] Profile picture not found or already deleted: ${publicId}`
        );
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (
        errorMessage.includes("Not found") ||
        errorMessage.includes("does not exist") ||
        errorMessage.includes("invalid")
      ) {
        console.warn(
          `[Cloudinary] Profile picture already deleted: ${publicId}`
        );
        return;
      }

      console.error(
        `[Cloudinary] Failed to delete profile picture ${publicId}:`,
        error
      );
      throw new Error(`Failed to delete profile picture: ${errorMessage}`);
    }
  }

  // Delete multiple resources
  async deleteByPublicIds(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;

    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error(`[Cloudinary] Failed to delete resources:`, error);
      throw new Error(
        `Failed to delete files from Cloudinary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
