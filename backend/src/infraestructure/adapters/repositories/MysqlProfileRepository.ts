import promisePool from "../../../db/database.js";
import { RowDataPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import {
  UserProfile,
  UserProfileSection,
} from "../../../domain/entities/index.js";
import { ProfileRepository } from "../../../domain/ports/repositories/ProfileRepository.js";

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

      return rows.map(
        (row) => new UserProfileSection(row.id, row.title, row.description)
      );
    } catch (error) {
      console.error("Error retrieving user section data from database:", error);
      throw new Error("Error retrieving user section data from database");
    }
  }
  async getSectionTitlesByIds(
    sectionIds: number[]
  ): Promise<{ id: number; title: string }[]> {
    if (sectionIds.length === 0) return [];

    const placeholders = sectionIds.map(() => "?").join(", ");
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      `SELECT id, title FROM users_profile_sections WHERE id IN (${placeholders})`,
      sectionIds
    );

    return rows.map((row) => ({ id: row.id, title: row.title }));
  }

  async updateProfile(
    bio: string,
    sections: UserProfileSection[],
    userId: string
  ): Promise<{ newlyCreatedSections: { tempId: number; newId: number }[] }> {
    const connection: PoolConnection = await promisePool.getConnection();
    // New created sections with id === 0
    const newlyCreatedSections: { tempId: number; newId: number }[] = [];

    try {
      await connection.beginTransaction();

      // Update bio
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE users_profile SET bio = ? WHERE fk_users_id = ?`,
        [bio, userId]
      );

      if (result.affectedRows === 0)
        throw new Error("No profile found for the given user ID");
      
      // Update sections array
      for (const section of sections) {
        // If id is greater than 0, it means it's an existing section
        if (section.id && section.id > 0) {
          // Update existing section
          const [updateResult] = await connection.execute<ResultSetHeader>(
            "UPDATE users_profile_sections SET title = ?, description = ? WHERE id = ? AND fk_users_id = ?",
            [section.title, section.description, section.id, userId]
          );

          if (updateResult.affectedRows === 0)
            throw new Error(
              `Section with id ${section.id} not found for user ${userId}`
            );
        } else {
          // Insert new section because section.id === 0
          const [insertResult] = await connection.execute<ResultSetHeader>(
            "INSERT INTO users_profile_sections (fk_users_id, title, description) VALUES (?, ?, ?)",
            [userId, section.title, section.description]
          );

          // Save temporal and real id inserted in db
          newlyCreatedSections.push({
            tempId: section.id, // id that came from frontend (always 0)
            newId: insertResult.insertId, // real id signed by db
          });
        }
      }

      await connection.commit();
      return { newlyCreatedSections };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating profile", error);
      throw new Error("Error updating profile");
    } finally {
      connection.release();
    }
  }

  async deleteSectionsByIds(
    sectionIds: number[],
    userId: string
  ): Promise<void> {
    if (sectionIds.length === 0) return;

    const connection: PoolConnection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      const placeholders = sectionIds.map(() => "?").join(", ");

      await connection.execute(
        `DELETE FROM users_profile_sections WHERE id IN (${placeholders}) AND fk_users_id = ?`,
        [...sectionIds, userId]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting profile sections:", error);
      throw new Error("Error deleting profile sections");
    } finally {
      connection.release();
    }
  }
  async getFilesBySectionId(sectionIds: number[]): Promise<string[]> {
    if (sectionIds.length === 0) return [];

    const placeholders = sectionIds.map(() => "?").join(", ");

    const [rows] = await promisePool.execute<RowDataPacket[]>(
      `SELECT public_id FROM users_files WHERE section_id IN (${placeholders})`,
      sectionIds
    );

    return rows.map((row) => row.public_id);
  }
}
