import { FileRepository } from "../../../domain/ports/repositories/FileRepository.js";
import { UserFile } from "../../../domain/entities/UserFile.js";
import promisePool from "../../../db/database.js";

export class MysqlFileRepository implements FileRepository {
  async save(file: UserFile): Promise<void> {
    const query = `
    INSERT INTO users_files (public_id, url, section_id, size_in_bytes, user_id)
    VALUES (?, ?, ?, ?, ?)`;
    const values = [
      file.publicId,
      file.url,
      file.sectionId,
      file.sizeInBytes,
      file.userId,
    ];

    try {
      await promisePool.execute(query, values);
    } catch (error) {
      console.error("Error saving file to database:", error);
      throw new Error("Could not save file");
    }
  }

  async saveMany(files: UserFile[]): Promise<void> {
    if (files.length === 0) return;

    const query = `
    INSERT INTO users_files (public_id, url, section_id, size_in_bytes, user_id)
    VALUES ?`;

    const values = files.map((file) => [
      file.publicId,
      file.url,
      file.sectionId,
      file.sizeInBytes,
      file.userId,
    ]);

    try {
      await promisePool.query(query, [values]);
    } catch (error) {
      console.error("Error saving multiple files to database:", error);
      throw new Error("Could not save files");
    }
  }

  async findBySectionId(sectionId: number): Promise<UserFile[]> {
    const query = `
    SELECT public_id, url, section_id, size_in_bytes, user_id
    FROM users_files
    WHERE section_id = ?`;

    try {
      const [rows] = await promisePool.execute(query, [sectionId]);

      return (rows as any[]).map(
        (row) =>
          new UserFile(
            row.public_id,
            row.url,
            row.section_id,
            row.size_in_bytes,
            row.user_id
          )
      );
    } catch (error) {
      console.error("Error retrieving files by section:", error);
      throw new Error("Could not retrieve files");
    }
  }

  async deleteFilesByPublicIds(publicIds: string[]): Promise<UserFile[]> {
    if (publicIds.length === 0) return [];

    const placeholders = publicIds.map(() => "?").join(", ");

    const selectQuery = `
    SELECT public_id, url, section_id, size_in_bytes, user_id
    FROM users_files
    WHERE public_id IN (${placeholders})`;

    const deleteQuery = `
    DELETE FROM users_files
    WHERE public_id IN (${placeholders})`;

    try {
      const [rows] = await promisePool.execute(selectQuery, publicIds);

      await promisePool.execute(deleteQuery, publicIds);

      return (rows as any[]).map(
        (row) =>
          new UserFile(
            row.public_id,
            row.url,
            row.section_id,
            row.size_in_bytes,
            row.user_id
          )
      );
    } catch (error) {
      console.error("Error deleting files:", error);
      throw new Error("Could not delete files");
    }
  }
}
