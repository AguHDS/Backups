import { UserProfile, UserProfileSection } from "../../entities/index.js";

export interface ProfileRepository {
  /**
   * Retrieves bio, profile_pic, partner, friends by username.
   *
   * @param username - The unique username (e.g. from route param)
   * @returns A UserProfile object including its internal userId, or null if not found
   */
  getProfileByUsername(username: string): Promise<UserProfile | null>;

  /**
   * Retrieves profile sections associated with a user.
   *
   * @param userId - The ID of the user.
   * @param onlyPublic - If true, only returns public sections.
   */
  getSectionsByUserId(userId: number | string, onlyPublic?: boolean): Promise<UserProfileSection[]>;

  /**
   * Retrieves titles of sections by their IDs
   *
   * @param sectionIds - An array of section IDs to retrieve titles for
   * @returns A promise that resolves to an array of objects containing section ID and title
  */
  getSectionTitlesByIds(sectionIds: number[]): Promise<{ id: number; title: string }[]>

  /**
   * Updates the bio and sections of a user profile
   *
   * @param bio - The new biography text
   * @param sections - List of updated profile sections
   * @param userId - The ID of the user to update (usually taken from refresh token)
   * @returns An object with the temporal and real id from signed in the db, so the frontend can render them properly and prevents Cloudinary errors
  */
  updateProfile(bio: string, sections: UserProfileSection[], userId: string | number): Promise<{ newlyCreatedSections: { tempId: number; newId: number }[] }>;

  /**
   * Deletes multiple user profile sections based on their IDs
   *
   * @param sectionIds - An array of section IDs to be deleted
   * @param userId - The ID of the user to whom the sections belong (for verification)
  */
  deleteSectionsByIds(sectionIds: number[], userId: string | number): Promise<void>;

  /**
   * Retrieves public ids of files associated with specific section to delete them from Cloudinary
   *
   * @param sectionIds - An array of section IDs to retrieve files for.
   * @returns A promise that resolves to an array of public ids
  */
  getFilesBySectionId(sectionIds: number[]): Promise<string[]>;
}
