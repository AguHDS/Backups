import { Connection } from "mysql2/promise";
import { User } from "../entities/User.js";

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

  /** Inserts a new user into the database */
  
  insertNewUser(name: string, email: string, pass: string, role: string): Promise<void>;
}
