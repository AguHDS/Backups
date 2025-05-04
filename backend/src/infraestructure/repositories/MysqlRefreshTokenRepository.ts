import { RefreshTokenRepository } from "../../domain/repositories/RefreshTokenRepository.js";
import promisePool from "../../db/database.js";
import { RowDataPacket } from "mysql2/promise";

//save or update refreshToken from DB
export class MysqlRefreshTokenRepository implements RefreshTokenRepository {
  async saveRefreshToDB(userId: number, token: string, expiresAt: Date): Promise<void> {
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
}
