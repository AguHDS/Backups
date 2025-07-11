import { FileRepository } from "../../../domain/ports/repositories/FileRepository.js";
import { UserFile } from "../../../domain/entities/UserFile.js";
import promisePool from "../../../db/database.js";

export class MysqlFileRepository implements FileRepository {
  async save(file: UserFile): Promise<void> {
    const query = `
      INSERT INTO users_files (public_id, url, section_id)
      VALUES (?, ?, ?)`;
    const values = [file.publicId, file.url, file.sectionId];

    try {
      await promisePool.execute(query, values);
    } catch (error) {
      console.error("Error saving file to database:", error);
      throw new Error("Could not save file");
    }
  }

  async findBySectionId(sectionId: number): Promise<UserFile[]> {
    const query = `
      SELECT public_id, url, section_id
      FROM users_files
      WHERE section_id = ?`;

    try {
      const [rows] = await promisePool.execute(query, [sectionId]);
      return (rows as any[]).map(
        (row) => new UserFile(row.public_id, row.url, row.section_id)
      );
    } catch (error) {
      console.error("Error retrieving files by section:", error);
      throw new Error("Could not retrieve files");
    }
  }

  async deleteFilesByPublicIds(publicIds: string[]): Promise<void> {
    if (publicIds.length === 0) return;

    const placeholders = publicIds.map(() => "?").join(", ");
    const query = `
    DELETE FROM users_files
    WHERE public_id IN (${placeholders})`;

    try {
      await promisePool.execute(query, publicIds);
    } catch (error) {
      console.error("Error deleting multiple files:", error);
      throw new Error("Could not delete files");
    }
  }
}
