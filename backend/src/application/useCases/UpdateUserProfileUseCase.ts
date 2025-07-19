import { ProfileRepository } from "../../domain/ports/repositories/ProfileRepository.js";
import { UserProfileSection } from "../../domain/entities/UserProfileSection.js";

/**
 * Use case that updates a user profile bio and sections
 */
export class UpdateUserProfileUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /**
   * Executes the update operation for the given user bio and profile sections
   *
   * @param bio - The new biography text
   * @param sections - List of updated profile sections
   * @param userId - The ID of the user to update (usually taken from refreshToken)
   * @returns An object with the temporal and real id from signed in the db, so the frontend can render them properly and prevents Cloudinary errors
   */
  async execute(
    bio: string,
    sections: UserProfileSection[],
    userId: string | number,
    role: "user" | "admin"
  ): Promise<{ newlyCreatedSections: { tempId: number; newId: number }[] }> {
    if (!bio || typeof bio !== "string") throw new Error("INVALID_BIO");
    if (!Array.isArray(sections)) throw new Error("INVALID_SECTIONS");

    if (role === "user" && sections.length > 1) {
      throw new Error("LIMIT_EXCEEDED_FOR_USER_ROLE");
    }

    return await this.profileRepo.updateProfile(bio, sections, userId);
  }
}
