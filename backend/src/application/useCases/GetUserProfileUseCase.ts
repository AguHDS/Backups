import { UserProfile } from "../../domain/entities/UserProfile.js";
import { FileRepository } from "../../domain/ports/repositories/FileRepository.js";
import { ProfileRepository } from "../../domain/ports/repositories/ProfileRepository.js";

export class GetUserProfileUseCase {
  constructor(private readonly profileRepo: ProfileRepository, private readonly fileRepo: FileRepository) {}

  /**
   * Retrieves a complete user profile by ID, including associated profile sections.
   *
   * @returns A fully populated UserProfile object, or throws if not found.
   */
  async execute(userId: number | string): Promise<UserProfile> {
    const profile = await this.profileRepo.getProfileById(userId);

    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }


    const sections = await this.profileRepo.getSectionsByUserId(userId);

    for (const section of sections) {
      const files = await this.fileRepo.findBySectionId(section.id);
      section.files = files;
    }

    profile.sections = sections;

    return profile;
  }
}
