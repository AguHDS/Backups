import { ProfileRepository } from "../../domain/repositories/ProfileRepository.js";
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
   */
  async execute(bio: string, sections: UserProfileSection[], userId: string): Promise<void> {
    if (!bio || typeof bio !== "string") throw new Error("INVALID_BIO");
    if (!Array.isArray(sections)) throw new Error("INVALID_SECTIONS");

    await this.profileRepo.updateProfile(bio, sections, userId);
  } 
}
