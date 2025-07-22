import promisePool from "../../../db/database.js";
import { RowDataPacket } from "mysql2/promise";
import { StorageUsageRepository } from "../../../domain/ports/repositories/StorageUsageRepository.js";

export class  MysqlStorageUsageRepository implements StorageUsageRepository {
  async addToUsedStorage(userId: number | string, delta: number): Promise<void> {
    const query = `
      INSERT INTO user_storage_usage (user_id, total_bytes)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_bytes = total_bytes + VALUES(total_bytes)`;
    await promisePool.execute(query, [userId, delta]);
  }

  async decreaseFromUsedStorage (userId: number | string, delta: number): Promise<void> {
    const query = `
      UPDATE user_storage_usage
      SET total_bytes = GREATEST(total_bytes - ?, 0)
      WHERE user_id = ?`;
    await promisePool.execute(query, [delta, userId]);
  }

  async getUsedStorage(userId: number | string): Promise<number> {
    const query = `SELECT total_bytes FROM user_storage_usage WHERE user_id = ?`;
    const [rows] = await promisePool.execute<RowDataPacket[]>(query, [userId]);
    return rows.length > 0 ? Number((rows as any)[0].total_bytes) : 0;
  }
}
