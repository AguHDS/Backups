import { ProfileRepository } from "../../domain/ports/repositories/ProfileRepository.js";

/**
 * Use case that delete sections for a user
 */
export class DeleteSectionsUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /**
   * Executes the delete sections operation for the given user
   *
   * @param sectionIds - List of sections ids to delete
   * @param userId - The ID of the user to update (usually taken from refreshToken)
   */
  async execute(sectionIds: number[], userId: string): Promise<void> {
    if (sectionIds.length === 0) throw new Error("NO_SECTIONS_ID");;
    await this.profileRepo.deleteSectionsByIds(sectionIds, userId);
  }
}