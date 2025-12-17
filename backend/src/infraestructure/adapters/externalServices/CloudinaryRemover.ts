import { v2 as cloudinary } from "cloudinary";

export class CloudinaryRemover {
  /**
   * Deletes multiple files from Cloudinary using their public IDs
   *
   * @param publicIds - An array of public IDs of the files to delete
   * @throws Error if input is invalid or Cloudinary fails unexpectedly
   */
  async deleteFilesByPublicIds(publicIds: string[]): Promise<void> {
    if (!Array.isArray(publicIds)) {
      throw new TypeError("publicIds must be an array");
    }

    if (publicIds.length === 0) {
      return;
    }

    const results = await Promise.allSettled(
      publicIds.map((publicId) => this.deleteSingleFile(publicId))
    );

    const failed = results.filter((result) => result.status === "rejected");

    if (failed.length > 0) {
      throw new Error(`Failed to delete ${failed.length} Cloudinary file(s)`);
    }
  }

  /**
   * Deletes a single file from Cloudinary
   */
  private async deleteSingleFile(publicId: string): Promise<void> {
    if (!publicId || typeof publicId !== "string") {
      throw new TypeError("publicId must be a non-empty string");
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Unexpected Cloudinary response: ${result.result}`);
      }
    } catch (error) {
      this.logCloudinaryError(
        `Failed to delete Cloudinary image: ${publicId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Deletes a folder and all its contents from Cloudinary
   *
   * @param folderPath - The path of the folder to delete
   */
  async deleteFolder(folderPath: string): Promise<void> {
    if (!folderPath || typeof folderPath !== "string") {
      throw new TypeError("folderPath must be a non-empty string");
    }

    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      this.logCloudinaryError(
        `Could not delete Cloudinary folder: ${folderPath}`,
        error
      );
      throw error;
    }
  }

  /**
   * Centralized Cloudinary error logging
   */
  private logCloudinaryError(context: string, error: unknown): void {
    if (error instanceof Error) {
      console.error(context, {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error(context, { error });
    }
  }
}
