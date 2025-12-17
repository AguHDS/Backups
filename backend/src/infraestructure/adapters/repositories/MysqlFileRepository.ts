import { FileRepository } from "../../../domain/ports/repositories/FileRepository.js";
import { UserFile } from "../../../domain/entities/UserFile.js";
import promisePool from "../../../db/database.js";
import type { RowDataPacket } from "mysql2";

// Definir tipo para las filas de la base de datos
interface UserFileRow {
  public_id: string;
  section_id: number;
  size_in_bytes: number;
  user_id: number;
}

// Helper para transformar las filas de la base de datos
function mapRowToUserFile(row: UserFileRow): UserFile {
  return new UserFile(
    row.public_id,
    row.section_id,
    row.size_in_bytes,
    row.user_id
  );
}

export class MysqlFileRepository implements FileRepository {
  async save(file: UserFile): Promise<void> {
    const query = `
    INSERT INTO users_files (public_id, section_id, size_in_bytes, user_id)
    VALUES (?, ?, ?, ?, ?)`;
    const values = [
      file.publicId,
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
    INSERT INTO users_files (public_id, section_id, size_in_bytes, user_id)
    VALUES ?`;

    const values = files.map((file) => [
      file.publicId,
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
    SELECT public_id, section_id, size_in_bytes, user_id
    FROM users_files
    WHERE section_id = ?`;

    try {
      // Usar aserción de tipo específica en lugar de any
      const [rows] = await promisePool.execute(query, [sectionId]);

      // Asegurar que rows es un array de UserFileRow
      const fileRows = rows as UserFileRow[];

      return fileRows.map(mapRowToUserFile);
    } catch (error) {
      console.error("Error retrieving files by section:", error);
      throw new Error("Could not retrieve files");
    }
  }

  async deleteFilesByPublicIds(publicIds: string[]): Promise<UserFile[]> {
    if (publicIds.length === 0) return [];

    const placeholders = publicIds.map(() => "?").join(", ");

    const selectQuery = `
    SELECT public_id, section_id, size_in_bytes, user_id
    FROM users_files
    WHERE public_id IN (${placeholders})`;

    const deleteQuery = `
    DELETE FROM users_files
    WHERE public_id IN (${placeholders})`;

    try {
      const [rows] = await promisePool.execute(selectQuery, publicIds);

      // Asegurar que rows es un array de UserFileRow
      const fileRows = rows as UserFileRow[];

      await promisePool.execute(deleteQuery, publicIds);

      return fileRows.map(mapRowToUserFile);
    } catch (error) {
      console.error("Error deleting files:", error);
      throw new Error("Could not delete files");
    }
  }

  async getFilesWithSizeBySectionId(
    sectionIds: number[]
  ): Promise<{ public_id: string; size_in_bytes: number }[]> {
    if (sectionIds.length === 0) return [];

    const placeholders = sectionIds.map(() => "?").join(", ");

    const [rows] = await promisePool.execute<RowDataPacket[]>(
      `SELECT public_id, size_in_bytes FROM users_files WHERE section_id IN (${placeholders})`,
      sectionIds
    );

    return rows.map((row) => ({
      public_id: row.public_id,
      size_in_bytes: row.size_in_bytes,
    }));
  }
}
