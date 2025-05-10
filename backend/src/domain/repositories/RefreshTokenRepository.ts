import { Connection, ResultSetHeader } from "mysql2/promise";

/**
 * Interface for managing refresh tokens in the database
 */
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
   * Verifies whether the given refresh token exists and is still valid for the specified user
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
   * Updates the refresh token stored in the database for a given user
   *
   * @param refreshToken - The new refresh token to store
   * @param userId - The ID of the user
   * @param connection - A MySQL connection
   * @returns A promise that resolves to the result of the SQL update operation
   */
  updateRefreshTokenFromDB(refreshToken: string, userId: number, connection: Connection): Promise<ResultSetHeader>;
}
