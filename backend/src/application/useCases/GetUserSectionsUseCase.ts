import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { UserProfileSection } from "@/domain/entities/UserProfileSection.js";

/**
 * Gets all sections for a specific user
 * Used by admin to view and manage user sections
 */
export class GetUserSectionsUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  async execute(userId: string | number): Promise<UserProfileSection[]> {
    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    const sections = await this.profileRepo.getSectionsByUserId(userId);
    return sections;
  }
}
