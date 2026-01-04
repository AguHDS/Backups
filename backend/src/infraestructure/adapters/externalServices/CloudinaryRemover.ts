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
    userId: string | number,
    sectionId: string | number
  ): Promise<void> {
    if (!userId || !sectionId) {
      throw new TypeError("userId and sectionId are required");
    }

    try {
      const userFolderPath = `user_files/user_${userId}`;

      // List all subfolders in the user's folder
      const result = await cloudinary.api.sub_folders(userFolderPath);

      // Filter folders that match the section ID pattern
      const sectionFolders = result.folders.filter((folder: { name: string }) =>
        folder.name.startsWith(`section_${sectionId}`)
      );

      // Delete each matching folder
      for (const folder of sectionFolders) {
        const fullPath = `${userFolderPath}/${folder.name}`;
        try {
          // First, delete ALL resources in the folder recursively
          await this.deleteAllResourcesInFolder(fullPath);

          // Then, delete the empty folder
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
      if (this.isFolderNotFoundError(error)) {
        console.warn(
          `User folder not found for user ${userId}, skipping folder deletion`
        );
        return;
      }

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
   * @param userId - The ID of the user
   */
  async deleteUserFolder(userId: string | number): Promise<void> {
    if (!userId) {
      throw new TypeError("userId is required");
    }

    const userFolderPath = `user_files/user_${userId}`;

    try {
      // First, delete ALL resources in the folder recursively
      await this.deleteAllResourcesInFolder(userFolderPath);

      // Then, delete all subfolders
      await this.deleteEmptySubfoldersRecursively(userFolderPath);

      // Finally, delete the main user folder
      try {
        await cloudinary.api.delete_folder(userFolderPath);
      } catch (error) {
        // If the folder does not exist or is already deleted, it's fine
        if (!this.isFolderNotFoundError(error)) {
          this.logCloudinaryError(
            `Could not delete main user folder: ${userFolderPath}`,
            error
          );
          throw error;
        }
      }
    } catch (error) {
      this.logCloudinaryError(
        `Failed to delete user folder for user ${userId}`,
        error
      );
      // Don't throw - we want user deletion to succeed even if Cloudinary cleanup fails
      console.warn(
        `Cloudinary cleanup failed for user ${userId}, but continuing with user deletion`
      );
    }
  }

  /**
   * Deletes ALL resources (images) in a folder and all its subfolders recursively
   * This is the key method - ensures folders are empty before deletion
   */
  private async deleteAllResourcesInFolder(folderPath: string): Promise<void> {
    try {
      await cloudinary.api.delete_resources_by_prefix(folderPath, {
        resource_type: "image",
        type: "upload",
      });

      await this.delay(1000);

      try {
        const subfolders = await cloudinary.api.sub_folders(folderPath);

        for (const folder of subfolders.folders) {
          const subfolderPath = `${folderPath}/${folder.name}`;
          await this.deleteAllResourcesInFolder(subfolderPath);
        }
      } catch (error) {
        if (!this.isFolderNotFoundError(error)) {
          console.warn(
            `[Cloudinary] Could not list subfolders for ${folderPath}:`,
            error
          );
        }
      }
    } catch (error) {
      if (
        !this.isFolderNotFoundError(error) &&
        !this.isNoResourcesError(error)
      ) {
        this.logCloudinaryError(
          `Could not delete resources from folder: ${folderPath}`,
          error
        );
        throw error;
      }
    }
  }

  /**
   * Deletes empty subfolders recursively (after resources have been deleted)
   */
  private async deleteEmptySubfoldersRecursively(
    folderPath: string
  ): Promise<void> {
    try {
      const subfolders = await cloudinary.api.sub_folders(folderPath);

      for (const folder of subfolders.folders) {
        const subfolderPath = `${folderPath}/${folder.name}`;

        await this.deleteEmptySubfoldersRecursively(subfolderPath);

        try {
          await cloudinary.api.delete_folder(subfolderPath);
          await this.delay(500);
        } catch (error) {
          if (!this.isFolderNotFoundError(error)) {
            await this.deleteAllResourcesInFolder(subfolderPath);
            await cloudinary.api.delete_folder(subfolderPath);
          }
        }
      }
    } catch (error) {
      if (!this.isFolderNotFoundError(error)) {
        console.warn(
          `[Cloudinary] Could not list subfolders for ${folderPath}:`,
          error
        );
      }
    }
  }

  /**
   * Helper method to check if error is "folder not found"
   */
  private isFolderNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return (
        msg.includes("not found") ||
        msg.includes("does not exist") ||
        msg.includes("no such folder") ||
        msg.includes("can't find folder")
      );
    }
    return false;
  }

  /**
   * Helper method to check if error is "no resources"
   */
  private isNoResourcesError(error: unknown): boolean {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return (
        msg.includes("no resources") ||
        msg.includes("no files") ||
        msg.includes("empty")
      );
    }
    return false;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
