import { ProfileRepository } from "../../domain/ports/repositories/ProfileRepository.js";
import { CloudinaryRemover } from "../../infraestructure/adapters/externalServices/CloudinaryRemover.js";

/**
 * Use case that delete sections for a user
 */
export class DeleteSectionsUseCase {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly fileRemover: CloudinaryRemover
  ) {}

  /**
   * Executes the delete sections operation for the given user
   *
   * @param sectionIds - List of sections ids to delete
   * @param userId - The ID of the user to update (usually taken from refreshToken)
   */
  async execute(sectionIds: number[], userId: string | number, username: string): Promise<void> {
    if (sectionIds.length === 0) throw new Error("NO_SECTIONS_ID");

    const publicIds = await this.profileRepo.getFilesBySectionId(sectionIds);
    await this.fileRemover.deleteMany(publicIds);

    const sectionInfos = await this.profileRepo.getSectionTitlesByIds(sectionIds);

    for (const { id, title } of sectionInfos) {
      const folderPath = `user_files/${username} (id: ${userId})/section: ${title} (id: ${id})`;
      await this.fileRemover.deleteFolder(folderPath);
    }

    await this.profileRepo.deleteSectionsByIds(sectionIds, userId);
  }
}
