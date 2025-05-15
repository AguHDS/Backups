import { UserProfile, UserProfileSection } from "../entities/index.js";

export interface ProfileRepository {
  /** Get user profile data from users_profile table */
  getProfileById(userId: number): Promise<UserProfile | null>;

  /** Get user profile sections data from users_profile_sections table */
  getSectionsByUserId(userId: number): Promise<UserProfileSection[]>;
}
