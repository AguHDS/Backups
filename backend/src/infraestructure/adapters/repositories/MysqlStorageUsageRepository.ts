import promisePool from "@/db/database.js";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

const DEFAULT_MAX_STORAGE = 104857600; // 100MB

export class MysqlStorageUsageRepository implements StorageUsageRepository {
  async addToUsedStorage(
    userId: number | string,
    delta: number
  ): Promise<void> {
    const query = `
      INSERT INTO user_storage_usage (user_id, total_bytes)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_bytes = total_bytes + VALUES(total_bytes)`;
    await promisePool.execute(query, [userId, delta]);
  }

  async setMaxStorage(
    userId: number | string,
    maxBytes: number
  ): Promise<void> {
    const query = `
    INSERT INTO user_storage_limits (user_id, max_bytes)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE max_bytes = VALUES(max_bytes)
  `;
    await promisePool.execute(query, [userId, maxBytes]);
  }

  async decreaseFromUsedStorage(
    userId: number | string,
    delta: number
  ): Promise<void> {
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

  async getMaxStorage(userId: number | string): Promise<number> {
    const query = `SELECT max_bytes FROM user_storage_limits WHERE user_id = ?`;
    const [rows] = await promisePool.execute<RowDataPacket[]>(query, [userId]);
    return rows.length > 0
      ? Number((rows as any)[0].max_bytes)
      : DEFAULT_MAX_STORAGE;
  }

  async getRemainingStorage(userId: number | string): Promise<number> {
    const [used, max] = await Promise.all([
      this.getUsedStorage(userId),
      this.getMaxStorage(userId),
    ]);
    const remaining = max - used;
    return remaining > 0 ? remaining : 0;
  }

  async tryReserveStorage(
    userId: number | string,
    delta: number
  ): Promise<boolean> {
    const updateQuery = `
    UPDATE user_storage_usage u
    JOIN user_storage_limits l ON l.user_id = u.user_id
    SET u.total_bytes = u.total_bytes + ?
    WHERE u.user_id = ?
      AND (u.total_bytes + ?) <= l.max_bytes
  `;
    const [result] = await promisePool.execute<ResultSetHeader>(updateQuery, [
      delta,
      userId,
      delta,
    ]);

    return (result.affectedRows ?? 0) > 0;
  }
}
