import { v2 as cloudinary } from "cloudinary";

export class CloudinaryRemover {
  /**
   * Deletes multiple files from Cloudinary using their public IDs
   *
   * @param publicIds - An array of public IDs of the files to delete
   * @returns A promise that resolves when all deletions are complete
   */
  async deleteFilesByPublicIds(publicIds: string[]): Promise<void> {
    await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error(
            `Failed to delete Cloudinary image: ${publicId}`,
            error
          );
        }
      })
    );
  }

  /**
   * Deletes a folder and all its contents from Cloudinary
   *
   * @param folderPath - The path of the folder to delete
   * @returns A promise that resolves when the folder deletion is complete
   */
  async deleteFolder(folderPath: string): Promise<void> {
    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      console.warn(`Could not delete folder ${folderPath}:`, error.message);
    }
  }
}
