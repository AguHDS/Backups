import { UserProfile, UserProfileSection } from "../../entities/index.js";

export interface ProfileRepository {
  /**
   * Retrieves a user profile by user ID.
   *
   * @param userId - The ID of the user.
   * @returns A UserProfile if found, or null if not found.
   */
  getProfileById(userId: number): Promise<UserProfile | null>;

  /**
   * Retrieves all profile sections associated with a user.
   *
   * @param userId - The ID of the user.
   * @returns An array of profile sections, or an empty array if none exist.
   */
  getSectionsByUserId(userId: number): Promise<UserProfileSection[]>;

  /**
   * Updates the bio and sections of a user profile
   *
   * @param bio - The new biography text
   * @param sections - List of updated profile sections
   * @param userId - The ID of the user to update (usually taken from refresh token)
   */
  updateProfile(bio: string, sections: UserProfileSection[], userId: string): Promise<void>;
}
