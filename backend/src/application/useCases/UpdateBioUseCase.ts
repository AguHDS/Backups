import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";

/**
 * Use case that updates only the user bio
 */
export class UpdateBioUseCase {
  constructor(private readonly profileRepo: ProfileRepository) {}

  /**
   * Executes the update operation for the user bio
   */
  async execute(bio: string, userId: string | number): Promise<void> {
    if (!bio || typeof bio !== "string") throw new Error("INVALID_BIO");

    await this.profileRepo.updateBio(bio, userId);
  }
}
