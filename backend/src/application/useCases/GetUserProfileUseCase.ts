import { UserProfile } from "@/domain/entities/UserProfile.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";

export class GetUserProfileUseCase {
  constructor(private readonly profileRepo: ProfileRepository, private readonly fileRepo: FileRepository) {}

  /**
   * Retrieves a complete user profile by username, including sections
   * @returns All sections if the requester is the owner, otherwise only public ones
   */
  async executeByUsername(username: string, requesterId?: number | string): Promise<{ profile: UserProfile; isOwner: boolean }> {
    const profile = await this.profileRepo.getProfileByUsername(username);
    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    // Compare as strings since BetterAuth uses string IDs
    const isOwner = requesterId ? String(requesterId) === String(profile.userId) : false;

    const sections = await this.profileRepo.getSectionsByUserId(profile.userId, !isOwner);

    for (const section of sections) {
      const files = await this.fileRepo.findBySectionId(section.id);
      section.files = files;
    }

    profile.sections = sections;

    return { profile, isOwner };
  }
}
