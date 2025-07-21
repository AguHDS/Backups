import { Connection } from "mysql2/promise";

export interface RefreshTokenRepository {
  /**
   * Stores a new refresh token in the database
   *
   * @param userId - ID of the user the token is associated with
   * @param token - The refresh token string
   * @param expiresAt - The expiration date and time of the token
  */
  saveRefreshToDB(userId: number, token: string, expiresAt: Date): Promise<void>;

  /**
   * Verifies whether the given refresh token exists and is valid for the specified user
   *
   * @param refreshToken - The token to verify
   * @param userId - The user ID associated with the token (foreign key to users table)
   * @returns A promise that resolves to true if the token is valid, false otherwise
  */
  findValidToken(refreshToken: string, userId: string): Promise<boolean>;

  /**
   * Retrieves the expiration time remaining of the refresh token associated with the given user
   *
   * @param userId - The ID of the user
   * @param connection - A MySQL connection
   * @returns A promise that resolves with a expiration date, or null if no token exists
  */
  getExpirationTime(userId: number, connection: Connection): Promise<Date | null>;

  /**
   * Retrieves the date and time when the refresh token was last rotated
   *
   * @param userId - The ID of the user
   * @param connection - A MySQL connection
   * @returns A promise that resolves with the last rotation date, or null if no token exists
  */
  getLastRotatedAt(userId: number, connection: Connection): Promise<Date | null>;

  /**
 * Updates the stored refresh token and sets a new rotation timestamp
 *
 * @param refreshToken - The new refresh token string to store (will be hashed)
 * @param userId - The ID of the user associated with the token
 * @param connection - A MySQL connection
 * @returns A promise that resolves when the update is complete
 */
  updateRefreshTokenWithRotation(refreshToken: string, userId: number, connection: Connection): Promise<void>

  /**
   * Checks if a refresh token exists for the specified user
   *
   * @param userId - The ID of the user
   * @returns A promise that resolves to true if a token exists, false otherwise
  */
  searchRefreshToken(userId: number): Promise<boolean>;

  /**
   * Deletes the refresh token associated with the specified user from the database
   *
   * @param userId - The ID of the user
   * @returns A promise that resolves when the token is deleted
  */
  deleteRefreshFromDB(userId: number): Promise<void>;
}
