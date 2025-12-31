import { Connection } from "mysql2/promise";
import { User } from "../../entities/User.js";

/** Represents the result of checking if username or email are taken */
export interface NameAndEmailCheckResult {
  isTaken: boolean;
  userTaken: string | null;
  emailTaken: string | null;
}

/** Interface for interacting with user data in the database */
export interface UserRepository {
  /** Searches user in the database by username */

  findByUsername(username: string): Promise<User | null>;

  /**
   * Search a user in the database by id
   *
   * @param connection - A MySQL connection
   */

  findById(id: number | string, connection: Connection): Promise<User | null>;

  /**
   * Checks if username or email are already taken in the database
   *
   * @returns A promise that resolves to an object indicating which values are taken
   */
  
  isNameOrEmailTaken(username: string, email: string): Promise<NameAndEmailCheckResult>;

  /**
   * Deletes a user from the database by ID
   * This will cascade delete all related data (sessions, files, sections, etc.)
   */
  deleteUserById(userId: number | string): Promise<void>;

  /**
   * Retrieves all users from the database
   * Used by admin to list and manage users
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Updates username and/or email for a user
   * @param userId - The ID of the user to update
   * @param username - New username (optional)
   * @param email - New email (optional)
   */
  updateUserCredentials(
    userId: string | number,
    username?: string,
    email?: string
  ): Promise<void>;

  /**
   * Updates password for a user in the account table
   * @param userId - The ID of the user
   * @param hashedPassword - The new hashed password
   */
  updateUserPassword(userId: string | number, hashedPassword: string): Promise<void>;
}
