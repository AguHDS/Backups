import { UserProfile } from "@/domain/entities/UserProfile.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";

export class GetUserProfileUseCase {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly fileRepo: FileRepository
  ) {}

  /**
   * Retrieves a complete user profile by username, including sections
   * @returns All sections if the requester is the owner or admin, otherwise only public ones
   */
  async executeByUsername(
    username: string,
    requesterId?: string,
    requesterRole?: string
  ): Promise<{
    profile: UserProfile;
    isOwner: boolean;
    isAdmin: boolean;
  }> {
    const profile = await this.profileRepo.getProfileByUsername(username);
    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    // Compare as strings since BetterAuth uses string IDs
    const isOwner = requesterId
      ? String(requesterId) === String(profile.userId)
      : false;
    const isAdmin = requesterRole === "admin";

    // If requester is admin, show all sections regardless of ownership
    const showOnlyPublic = !isOwner && !isAdmin;

    const sections = await this.profileRepo.getSectionsByUserId(
      profile.userId,
      showOnlyPublic
    );

    for (const section of sections) {
      const files = await this.fileRepo.findBySectionId(section.id);
      section.files = files;
    }

    profile.sections = sections;

    return { profile, isOwner, isAdmin };
  }
}
