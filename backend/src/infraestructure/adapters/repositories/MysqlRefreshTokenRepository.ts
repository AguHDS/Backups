import promisePool from "../../../db/database.js";
import { RefreshTokenRepository } from "../../../domain/ports/repositories/RefreshTokenRepository.js";
import { RowDataPacket, Connection, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";

export class MysqlRefreshTokenRepository implements RefreshTokenRepository {
  async saveRefreshToDB(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      //delete any existing refresh token for this user
      const [existingToken] = await promisePool.execute<RowDataPacket[]>(
        "SELECT * FROM refresh_tokens WHERE user_id = ?",
        [userId]
      );

      if (existingToken.length > 0) {
        await promisePool.execute(
          "UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE user_id = ?",
          [token, expiresAt, userId]
        );
      } else {
        await promisePool.execute(
          "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
          [userId, token, expiresAt]
        );
      }
    } catch (error) {
      console.error("Error saving new refresh token to database:", error);
      throw new Error("Error saving new refresh token to database");
    }
  }

  async findValidToken(refreshToken: string, userId: string): Promise<boolean> {
    const [results] = await promisePool.execute<RowDataPacket[]>(
      "SELECT token, expires_at FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW()",
      [userId]
    );

    if (results.length === 0) return false;

    const storedHashedToken = results[0].token;

    return await bcrypt.compare(refreshToken, storedHashedToken);
  }

  async getExpirationTime(
    userId: number,
    connection: Connection
  ): Promise<Date | null> {
    try {
      const [results] = await connection.execute<RowDataPacket[]>(
        "SELECT expires_at FROM refresh_tokens WHERE user_id = ?",
        [userId]
      );

      if (results.length === 0) return null;

      return results[0].expires_at as Date;
    } catch (error) {
      console.error("Error in getDateTime:", error);
      throw error;
    }
  }

  async getLastRotatedAt(
    userId: number,
    connection: Connection
  ): Promise<Date | null> {
    const [results] = await connection.execute<RowDataPacket[]>(
      "SELECT last_rotated_at FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    if (results.length === 0) return null;

    return results[0].last_rotated_at as Date;
  }

  async updateRefreshTokenWithRotation(
    refreshToken: string,
    userId: number,
    connection: Connection
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await connection.execute(
      "UPDATE refresh_tokens SET token = ?, last_rotated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      [hashedToken, userId]
    );
  }

  async deleteRefreshFromDB(userId: number): Promise<void> {
    try {
      const [deletedRefresh] = await promisePool.execute<ResultSetHeader>(
        "DELETE FROM refresh_tokens WHERE user_id = ?",
        [userId]
      );

      if (deletedRefresh.affectedRows === 0) {
        console.log(`No refresh token found for ${userId}`);
        return;
      }

      console.log("Refresh token successfully deleted from database");
    } catch (error) {
      console.error("Error deleting refresh token from db:", error);
      throw new Error("Error deleting refresh token from the database");
    }
  }

  async searchRefreshToken(userId: number): Promise<boolean> {
    const [results] = await promisePool.execute<RowDataPacket[]>(
      "SELECT user_id FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    return results.length > 0;
  }
}
