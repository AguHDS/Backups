import { UserProfile } from "../../domain/entities/UserProfile.js";
import { ProfileRepository } from "../../domain/repositories/ProfileRepository.js";

export class GetUserProfileUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /**
   * Retrieves a complete user profile by ID, including associated profile sections.
   *
   * @returns A fully populated UserProfile object, or throws if not found.
   */
  async execute(userId: number): Promise<UserProfile> {
    const profile = await this.profileRepo.getProfileById(userId);

    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    const sections = await this.profileRepo.getSectionsByUserId(userId);
    profile.sections = sections;

    return profile;
  }
}
