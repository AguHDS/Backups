import promisePool from "../../db/database.js";
import { RefreshTokenRepository } from "../../domain/repositories/RefreshTokenRepository.js";
import { RowDataPacket, Connection, ResultSetHeader } from "mysql2/promise";

//save or update refreshToken from DB
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
    try {
      const [results] = await promisePool.execute<RowDataPacket[]>(
        "SELECT token, user_id, expires_at FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()",
        [refreshToken, userId]
      );

      return results.length > 0;
    } catch (error) {
      console.error("Error finding valid refresh token in database:", error);
      throw error;
    }
  }

  async getExpirationTime(userId: number, connection: Connection): Promise<Date | null> {
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

  async updateRefreshTokenFromDB(refreshToken: string, userId: number, connection: Connection): Promise<ResultSetHeader> {
    try {
      const [results] = await connection.execute<ResultSetHeader>(
        "UPDATE refresh_tokens SET token = ? WHERE user_id = ?",
        [refreshToken, userId]
      );

      if (results.affectedRows === 0) {
        throw new Error("Failed to update refresh token");
      }

      return results;
    } catch (error) {
      console.error("Error in updateRefreshTokenFromDB:", error);
      throw error;
    }
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
