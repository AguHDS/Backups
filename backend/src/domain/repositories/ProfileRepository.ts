import { UserProfile, UserProfileSection } from "../entities/index.js";

export interface ProfileRepository {
  /**
   * Retrieves the user profile data from the database by the given user ID.
   *
   * @returns {Promise<UserProfile | null>} A promise that resolves to a UserProfile if found, or null if not found.
   */
  getProfileById(userId: number): Promise<UserProfile | null>;

  /**
   * Retrieves all profile sections associated with the given user ID from users_profile_sections.
   *
   * @returns {Promise<UserProfileSection[]>} An array of sections; empty if the user has none.
   */
  getSectionsByUserId(userId: number): Promise<UserProfileSection[]>;
}
