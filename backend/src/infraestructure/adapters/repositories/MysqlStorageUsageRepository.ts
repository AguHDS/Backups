import promisePool from "@/db/database.js";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

const DEFAULT_MAX_STORAGE = 104857600; // 100MB

interface UsedStorageRow extends RowDataPacket {
  total_bytes: number;
  profile_pic_size: number;
}

interface MaxStorageRow extends RowDataPacket {
  max_bytes: number;
}

export class MysqlStorageUsageRepository implements StorageUsageRepository {
  async addToUsedStorage(
    userId: number | string,
    delta: number
  ): Promise<void> {
    const query = `
      INSERT INTO user_storage_usage (user_id, total_bytes)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_bytes = total_bytes + VALUES(total_bytes)
    `;
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
      WHERE user_id = ?
    `;
    await promisePool.execute(query, [delta, userId]);
  }

  async getUsedStorage(userId: number | string): Promise<number> {
    const query = `
      SELECT total_bytes
      FROM user_storage_usage
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<UsedStorageRow[]>(query, [userId]);
    return rows.length > 0 ? rows[0].total_bytes : 0;
  }

  async getMaxStorage(userId: number | string): Promise<number> {
    const query = `
      SELECT max_bytes
      FROM user_storage_limits
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<MaxStorageRow[]>(query, [userId]);
    return rows.length > 0 ? rows[0].max_bytes : DEFAULT_MAX_STORAGE;
  }

  async getRemainingStorage(userId: number | string): Promise<number> {
    const [used, max] = await Promise.all([
      this.getUsedStorage(userId),
      this.getMaxStorage(userId),
    ]);

    const remaining = max - used;
    return remaining > 0 ? remaining : 0;
  }

  async getProfilePictureSize(userId: number | string): Promise<number> {
    const query = `
      SELECT profile_pic_size
      FROM user_storage_usage
      WHERE user_id = ?
    `;

    const [rows] = await promisePool.execute<UsedStorageRow[]>(query, [userId]);
    return rows.length > 0 ? rows[0].profile_pic_size : 0;
  }

  async updateProfilePictureSize(
    userId: number | string,
    newSize: number,
    oldSize: number = 0
  ): Promise<void> {
    const connection = await promisePool.getConnection();

    try {
      await connection.beginTransaction();

      // Verify if record exists
      const [currentRows] = await connection.execute<UsedStorageRow[]>(
        `SELECT total_bytes, profile_pic_size 
         FROM user_storage_usage 
         WHERE user_id = ?`,
        [userId]
      );

      const exists = currentRows.length > 0;
      const currentProfileSize = exists ? currentRows[0].profile_pic_size : 0;

      // If the oldSize passed does not match the db, use the value from the db
      if (exists && currentProfileSize !== oldSize) {
        oldSize = currentProfileSize;
      }

      if (!exists) {
        await connection.execute(
          `INSERT INTO user_storage_usage (user_id, total_bytes, profile_pic_size)
           VALUES (?, ?, ?)`,
          [userId, newSize, newSize]
        );
      } else {
        // update profile_pic_size
        await connection.execute(
          `UPDATE user_storage_usage 
           SET profile_pic_size = ?
           WHERE user_id = ?`,
          [newSize, userId]
        );

        // calculate difference and update total_bytes
        const sizeDifference = newSize - oldSize;

        if (sizeDifference > 0) {
          // if new picture is larger - add to total_bytes
          await connection.execute(
            `UPDATE user_storage_usage 
             SET total_bytes = total_bytes + ?
             WHERE user_id = ?`,
            [sizeDifference, userId]
          );
        } else if (sizeDifference < 0) {
          // if new picture is smaller - subtract from total_bytes
          const decreaseAmount = Math.abs(sizeDifference);
          await connection.execute(
            `UPDATE user_storage_usage 
             SET total_bytes = GREATEST(total_bytes - ?, 0)
             WHERE user_id = ?`,
            [decreaseAmount, userId]
          );
        }
        // file size is the same - no change to total_bytes
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
    delta: number
  ): Promise<boolean> {
    const query = `
      UPDATE user_storage_usage u
      JOIN user_storage_limits l ON l.user_id = u.user_id
      SET u.total_bytes = u.total_bytes + ?
      WHERE u.user_id = ?
        AND (u.total_bytes + ?) <= l.max_bytes
    `;

    const [result] = await promisePool.execute<ResultSetHeader>(query, [
      delta,
      userId,
      delta,
    ]);

    return (result.affectedRows ?? 0) > 0;
  }
}
