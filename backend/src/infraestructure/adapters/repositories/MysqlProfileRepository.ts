import promisePool from "../../../db/database.js";
import { RowDataPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import {
  UserProfile,
  UserProfileSection,
} from "../../../domain/entities/index.js";
import { ProfileRepository } from "../../../domain/ports/repositories/ProfileRepository.js";

export class MysqlProfileRepository implements ProfileRepository {
  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        `SELECT u.id AS userId, up.bio, up.profile_pic, up.level
      FROM users u
      JOIN users_profile up ON up.fk_users_id = u.id
      WHERE u.namedb = ?`,
        [username]
      );

      if (rows.length === 0) return null;

      const row = rows[0];

      return new UserProfile(
        row.userId,
        row.bio,
        row.level,
        row.profile_pic ?? undefined
      );
    } catch (error) {
      console.error("Error retrieving profile by username:", error);
      throw new Error("Database error while fetching profile by username");
    }
  }
  async getProfileById(userId: number): Promise<UserProfile | null> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT bio, profile_pic, level FROM users_profile WHERE fk_users_id = ?",
        [userId]
      );

      if (rows.length === 0) return null;

      const row = rows[0];

      return new UserProfile(
        userId,
        row.bio,
        row.level,
        row.profile_pic ?? undefined
      );
    } catch (error) {
      console.error("Error retrieving user from database:", error);
      throw new Error("Database error while fetching user profile");
    }
  }
  async getSectionsByUserId(
    userId: number,
    onlyPublic = false
  ): Promise<UserProfileSection[]> {
    try {
      const baseQuery =
        "SELECT id, fk_users_id, title, description, is_public FROM users_profile_sections WHERE fk_users_id = ?";
      const query = onlyPublic
        ? `${baseQuery} AND is_public = true`
        : baseQuery;

      const [rows] = await promisePool.execute<RowDataPacket[]>(query, [
        userId,
      ]);

      return rows.map(
        (row) =>
          new UserProfileSection(
            row.id,
            row.title,
            row.description,
            undefined, // files aren't asigned yet
            row.is_public === 1
          )
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
        if (section.id && section.id > 0) {
          // Update existing section including visibility
          const [updateResult] = await connection.execute<ResultSetHeader>(
            `UPDATE users_profile_sections
           SET title = ?, description = ?, is_public = ?
           WHERE id = ? AND fk_users_id = ?`,
            [
              section.title,
              section.description,
              section.isPublic,
              section.id,
              userId,
            ]
          );

          if (updateResult.affectedRows === 0)
            throw new Error(
              `Section with id ${section.id} not found for user ${userId}`
            );
        } else {
          // Insert new section including visibility
          const [insertResult] = await connection.execute<ResultSetHeader>(
            `INSERT INTO users_profile_sections (fk_users_id, title, description, is_public)
           VALUES (?, ?, ?, ?)`,
            [userId, section.title, section.description, section.isPublic]
          );

          // Save temporal and real id inserted in db (if id is 0 it means it's a new section)
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
      throw error;
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

  async updateProfilePicture(
    userId: number,
    profilePicPublicId: string
  ): Promise<void> {
    try {
      const [result] = await promisePool.execute<ResultSetHeader>(
        `UPDATE users_profile 
     SET profile_pic = ?
     WHERE fk_users_id = ?`,
        [profilePicPublicId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error("No profile found for the given user ID");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw new Error("Database error while updating profile picture");
    }
  }
}
