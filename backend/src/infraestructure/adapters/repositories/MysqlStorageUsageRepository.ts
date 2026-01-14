import promisePool from "@/db/database.js";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

const DEFAULT_MAX_STORAGE = 104857600n; // 100MB

interface UsedStorageRow extends RowDataPacket {
  total_bytes: string | number;
  profile_pic_size: string | number;
}

interface MaxStorageRow extends RowDataPacket {
  max_bytes: string | number;
}

export class MysqlStorageUsageRepository implements StorageUsageRepository {
  async addToUsedStorage(
    userId: number | string,
    delta: bigint
  ): Promise<void> {
    const query = `
      INSERT INTO user_storage_usage (user_id, total_bytes)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_bytes = total_bytes + VALUES(total_bytes)
    `;

    await promisePool.execute(query, [userId, delta.toString()]);
  }

  async setMaxStorage(
    userId: number | string,
    maxBytes: bigint
  ): Promise<void> {
    const query = `
      INSERT INTO user_storage_limits (user_id, max_bytes)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE max_bytes = VALUES(max_bytes)
    `;

    await promisePool.execute(query, [userId, maxBytes.toString()]);
  }

  async decreaseFromUsedStorage(
    userId: number | string,
    delta: bigint
  ): Promise<void> {
    const query = `
      UPDATE user_storage_usage
      SET total_bytes = GREATEST(total_bytes - ?, 0)
      WHERE user_id = ?
    `;

    await promisePool.execute(query, [delta.toString(), userId]);
  }

  async getUsedStorage(userId: number | string): Promise<bigint> {
    const query = `
      SELECT total_bytes
      FROM user_storage_usage
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<UsedStorageRow[]>(query, [userId]);
    return rows.length > 0 ? BigInt(rows[0].total_bytes) : 0n;
  }

  async getTotalFilesCount(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) AS total_files
      FROM users_files
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<RowDataPacket[]>(query, [userId]);
    return rows.length > 0 ? Number(rows[0].total_files) : 0;
  }

  async getMaxStorage(userId: number | string): Promise<bigint> {
    const query = `
      SELECT max_bytes
      FROM user_storage_limits
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<MaxStorageRow[]>(query, [userId]);
    return rows.length > 0 ? BigInt(rows[0].max_bytes) : DEFAULT_MAX_STORAGE;
  }

  async getRemainingStorage(userId: number | string): Promise<bigint> {
    const [used, max] = await Promise.all([
      this.getUsedStorage(userId),
      this.getMaxStorage(userId),
    ]);

    const remaining = max - used;
    return remaining > 0n ? remaining : 0n;
  }

  async getProfilePictureSize(userId: number | string): Promise<bigint> {
    const query = `
      SELECT profile_pic_size
      FROM user_storage_usage
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<UsedStorageRow[]>(query, [userId]);
    return rows.length > 0 ? BigInt(rows[0].profile_pic_size) : 0n;
  }

  async updateProfilePictureSize(
    userId: number | string,
    newSize: bigint,
    oldSize: bigint = 0n
  ): Promise<void> {
    const connection = await promisePool.getConnection();

    try {
      await connection.beginTransaction();

      const [currentRows] = await connection.execute<UsedStorageRow[]>(
        `SELECT total_bytes, profile_pic_size
         FROM user_storage_usage
         WHERE user_id = ?`,
        [userId]
      );

      const exists = currentRows.length > 0;
      const currentProfileSize = exists
        ? BigInt(currentRows[0].profile_pic_size)
        : 0n;

      if (exists && currentProfileSize !== oldSize) {
        oldSize = currentProfileSize;
      }

      if (!exists) {
        await connection.execute(
          `INSERT INTO user_storage_usage (user_id, total_bytes, profile_pic_size)
           VALUES (?, ?, ?)`,
          [userId, newSize.toString(), newSize.toString()]
        );
      } else {
        await connection.execute(
          `UPDATE user_storage_usage
           SET profile_pic_size = ?
           WHERE user_id = ?`,
          [newSize.toString(), userId]
        );

        const sizeDifference = newSize - oldSize;

        if (sizeDifference > 0n) {
          await connection.execute(
            `UPDATE user_storage_usage
             SET total_bytes = total_bytes + ?
             WHERE user_id = ?`,
            [sizeDifference.toString(), userId]
          );
        } else if (sizeDifference < 0n) {
          await connection.execute(
            `UPDATE user_storage_usage
             SET total_bytes = GREATEST(total_bytes - ?, 0)
             WHERE user_id = ?`,
            [(-sizeDifference).toString(), userId]
          );
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async tryReserveStorage(
    userId: number | string,
    delta: bigint
  ): Promise<boolean> {
    const query = `
      UPDATE user_storage_usage u
      JOIN user_storage_limits l ON l.user_id = u.user_id
      SET u.total_bytes = u.total_bytes + ?
      WHERE u.user_id = ?
        AND (u.total_bytes + ?) <= l.max_bytes
    `;

    const [result] = await promisePool.execute<ResultSetHeader>(query, [
      delta.toString(),
      userId,
      delta.toString(),
    ]);

    return (result.affectedRows ?? 0) > 0;
  }
}
