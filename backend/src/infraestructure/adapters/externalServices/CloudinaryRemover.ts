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
   * Deletes all folders matching a section ID pattern
   * Used to delete all versions of a section folder when the title was changed
   */
  async deleteFoldersBySectionId(
    username: string,
    userId: string | number,
    sectionId: string | number
  ): Promise<void> {
    if (!username || !userId || !sectionId) {
      throw new TypeError("username, userId, and sectionId are required");
    }

    try {
      const userFolderPath = `user_files/${username} (id: ${userId})`;

      // List all subfolders in the user's folder
      const result = await cloudinary.api.sub_folders(userFolderPath);

      // Filter folders that match the section ID pattern
      const sectionFolders = result.folders.filter((folder: { name: string }) =>
        folder.name.includes(`(id: ${sectionId})`)
      );

      // Delete each matching folder
      for (const folder of sectionFolders) {
        const fullPath = `${userFolderPath}/${folder.name}`;
        try {
          await cloudinary.api.delete_folder(fullPath);
        } catch (error) {
          // Log but continue with other folders
          this.logCloudinaryError(
            `Could not delete folder: ${fullPath}`,
            error
          );
        }
      }
    } catch (error) {
      this.logCloudinaryError(
        `Could not delete folders for section ${sectionId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Deletes the entire user folder from Cloudinary
   * This removes all profile pictures, section images, and subfolders
   * 
   * @param username - The username of the user
   * @param userId - The ID of the user
   */
  async deleteUserFolder(
    username: string,
    userId: string | number
  ): Promise<void> {
    if (!username || !userId) {
      throw new TypeError("username and userId are required");
    }

    try {
      const userFolderPath = `user_files/${username} (id: ${userId})`;

      // First, delete all resources (images) in all subfolders recursively
      try {
        await cloudinary.api.delete_resources_by_prefix(userFolderPath, {
          resource_type: "image",
        });
      } catch (error) {
        this.logCloudinaryError(
          `Could not delete resources in folder: ${userFolderPath}`,
          error
        );
      }

      // Then, delete all subfolders recursively
      await this.deleteSubfoldersRecursively(userFolderPath);

      // Finally, delete the main user folder
      try {
        await cloudinary.api.delete_folder(userFolderPath);
      } catch (error) {
        // If folder doesn't exist or is already deleted, that's fine
        this.logCloudinaryError(
          `Could not delete main user folder: ${userFolderPath}`,
          error
        );
      }
    } catch (error) {
      this.logCloudinaryError(
        `Failed to delete user folder for user ${userId}`,
        error
      );
      // Don't throw - we want user deletion to succeed even if Cloudinary cleanup fails
      console.warn(`Cloudinary cleanup failed for user ${userId}, but continuing with user deletion`);
    }
  }

  /**
   * Recursively deletes all subfolders in a given path
   */
  private async deleteSubfoldersRecursively(folderPath: string): Promise<void> {
    try {
      const result = await cloudinary.api.sub_folders(folderPath);

      for (const folder of result.folders) {
        const subfolderPath = `${folderPath}/${folder.name}`;
        
        // Delete resources in subfolder
        try {
          await cloudinary.api.delete_resources_by_prefix(subfolderPath, {
            resource_type: "image",
          });
        } catch (error) {
          this.logCloudinaryError(
            `Could not delete resources in subfolder: ${subfolderPath}`,
            error
          );
        }

        // Recursively delete deeper subfolders
        await this.deleteSubfoldersRecursively(subfolderPath);

        // Delete the subfolder itself
        try {
          await cloudinary.api.delete_folder(subfolderPath);
        } catch (error) {
          this.logCloudinaryError(
            `Could not delete subfolder: ${subfolderPath}`,
            error
          );
        }
      }
    } catch (error) {
      // If folder doesn't exist or has no subfolders, that's fine
      this.logCloudinaryError(
        `Could not list subfolders for: ${folderPath}`,
        error
      );
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
