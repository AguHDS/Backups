import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import promisePool from "@/db/database.js";

/**
 * Deletes a user and all associated data (CASCADE DELETE)
 * This will automatically remove:
 * - User sessions
 * - User accounts
 * - User profile sections
 * - User files
 * - User storage limits and usage
 * - All Cloudinary images and folders
 */
export class DeleteUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cloudinaryRemover: CloudinaryRemover
  ) {}

  async execute(userId: number | string): Promise<void> {
    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    // Get user info before deletion (we need username for Cloudinary cleanup)
    const connection = await promisePool.getConnection();
    try {
      const user = await this.userRepo.findById(userId, connection);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      // Delete user from database (CASCADE will handle related records)
      await this.userRepo.deleteUserById(userId);

      // Delete all user files from Cloudinary (profile picture + section images)
      // This happens AFTER DB deletion to ensure we don't leave orphaned DB records
      // If Cloudinary cleanup fails, we log it but don't fail the operation
      try {
        await this.cloudinaryRemover.deleteUserFolder(user.name, userId);
        console.log(`Successfully deleted Cloudinary folder for user ${user.name} (${userId})`);
      } catch (error) {
        console.error(`Failed to delete Cloudinary folder for user ${userId}:`, error);
        // Don't throw - user deletion should succeed even if Cloudinary cleanup fails
      }
    } finally {
      connection.release();
    }
  }
}
