import promisePool from "../../db/database.js";
import { RowDataPacket } from "mysql2/promise";
import {
  UserProfile,
  UserProfileSection,
} from "../../domain/entities/index.js";
import { ProfileRepository } from "../../domain/repositories/ProfileRepository.js";

export class MysqlProfileRepository implements ProfileRepository {
  async getProfileById(userId: number): Promise<UserProfile | null> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT bio, profile_pic, partner, friends FROM users_profile WHERE fk_users_id = ?",
        [userId]
      );

      if (rows.length === 0) return null;

      const row = rows[0];

      return new UserProfile(
        userId,
        row.bio,
        row.friends,
        row.profile_pic ?? undefined,
        row.partner ?? undefined
      );
    } catch (error) {
      console.error("Error retrieving user from database:", error);
      throw new Error("Database error while fetching user profile");
    }
  }
  async getSectionsByUserId(userId: number): Promise<UserProfileSection[]> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT id, fk_users_id, title, description FROM users_profile_sections WHERE fk_users_id = ?",
        [userId]
      );

      if (rows.length === 0) {
        console.error(`Sections data for id ${userId} not found in users_prfile_sections table`);
        return null;
      }

      return rows.map(
        (row) =>
          new UserProfileSection(
            row.id,
            row.fk_users_id,
            row.title,
            row.description
        )
      );
    } catch (error) {
      console.error("Error retrieving user section data from database:", error);
      throw new Error("Error retrieving user section data from database");
    }
  }
}
