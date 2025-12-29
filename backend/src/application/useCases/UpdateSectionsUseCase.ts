import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { UserProfileSection } from "@/domain/entities/UserProfileSection.js";

/**
 * Use case that updates only user profile sections
 */
export class UpdateSectionsUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /**
   * Executes the update operation for profile sections
   *
   * @param sections - List of updated profile sections
   * @param userId - The ID of the user to update
   * @param role - The role of the user (for validation)
   * @returns An object with the temporal and real id from signed in the db
   */
  async execute(
    sections: UserProfileSection[],
    userId: string | number,
    role: "user" | "admin"
  ): Promise<{ newlyCreatedSections: { tempId: number; newId: number }[] }> {
    if (!Array.isArray(sections)) throw new Error("INVALID_SECTIONS");

    if (role === "user" && sections.length > 1) {
      throw new Error("LIMIT_EXCEEDED_FOR_USER_ROLE");
    }

    return await this.profileRepo.updateSections(sections, userId);
  }
}
