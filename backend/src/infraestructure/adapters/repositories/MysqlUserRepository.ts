import promisePool from "../../../db/database.js";
import { User } from "../../../domain/entities/User.js";
import {
  UserRepository,
  NameAndEmailCheckResult,
} from "../../../domain/ports/repositories/UserRepository.js";
import { RowDataPacket, Connection } from "mysql2/promise";

interface UserRow extends RowDataPacket {
  namedb: string;
  emaildb: string;
}

export class MysqlUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT id, namedb, emaildb, role FROM users WHERE namedb = ?",
        [username]
      );

      if (rows.length === 0) {
        console.error("Username not found in database");
        return null;
      }

      const row = rows[0];

      return new User(row.id, row.namedb, row.emaildb, row.role);
    } catch (error) {
      console.error("Error retrieving username from database:", error);
      throw new Error("Error retrieving username from database");
    }
  }
  async findById(id: number | string, connection: Connection): Promise<User | null> {
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT id, namedb, emaildb, role FROM users WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];

      return new User(row.id, row.namedb, row.emaildb, row.role);
    } catch (error) {
      console.error("Error retrieving user from database:", error);
      throw new Error("Error retrieving user from database");
    }
  }
  async isNameOrEmailTaken(
    username: string,
    email: string
  ): Promise<NameAndEmailCheckResult> {
    try {
      const [results] = await promisePool.execute<UserRow[]>(
        "SELECT namedb, emaildb FROM users WHERE namedb = ? OR emaildb = ?",
        [username, email]
      );

      if (results.length > 0) {
        console.error("User or email already exists in the database");

        //check which specific values are taken
        const userTaken = results.some((row) => row.namedb === username)
          ? username
          : null;
        const emailTaken = results.some((row) => row.emaildb === email)
          ? email
          : null;

        return {
          isTaken: true,
          userTaken,
          emailTaken,
        };
      } else {
        return {
          isTaken: false,
          userTaken: null,
          emailTaken: null,
        };
      }
    } catch (error) {
      console.error("Error checking user or email existence", error);
      throw new Error("Error checking user existence in database");
    }
  }

  async deleteUserById(userId: number | string): Promise<void> {
    try {
      const [result] = await promisePool.execute(
        "DELETE FROM users WHERE id = ?",
        [userId]
      );

      const affectedRows = (result as { affectedRows: number }).affectedRows;

      if (affectedRows === 0) {
        throw new Error("USER_NOT_FOUND");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw error;
      }
      console.error("Error deleting user from database:", error);
      throw new Error("Error deleting user from database");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT id, namedb, emaildb, role FROM users ORDER BY id ASC"
      );

      return rows.map(
        (row) => new User(row.id, row.namedb, row.emaildb, row.role)
      );
    } catch (error) {
      console.error("Error retrieving all users from database:", error);
      throw new Error("Error retrieving all users from database");
    }
  }

  async updateUserCredentials(
    userId: string | number,
    username?: string,
    email?: string
  ): Promise<void> {
    if (!username && !email) {
      return; // Nothing to update
    }

    try {
      const updates: string[] = [];
      const values: (string | number)[] = [];

      if (username) {
        updates.push("namedb = ?");
        values.push(username);
      }

      if (email) {
        updates.push("emaildb = ?");
        values.push(email);
      }

      values.push(userId);

      const query = `UPDATE users SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ?`;

      const [result] = await promisePool.execute(query, values);

      const affectedRows = (result as { affectedRows: number }).affectedRows;

      if (affectedRows === 0) {
        throw new Error("USER_NOT_FOUND");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw error;
      }
      console.error("Error updating user credentials:", error);
      throw new Error("Error updating user credentials");
    }
  }

  async updateUserPassword(
    userId: string | number,
    hashedPassword: string
  ): Promise<void> {
    try {
      // Update password in account table where provider_id is 'credential'
      const query = `
        UPDATE account 
        SET password = ?, updated_at = CURRENT_TIMESTAMP(3) 
        WHERE user_id = ? AND provider_id = 'credential'
      `;

      const [result] = await promisePool.execute(query, [hashedPassword, userId]);

      const affectedRows = (result as { affectedRows: number }).affectedRows;

      if (affectedRows === 0) {
        throw new Error("ACCOUNT_NOT_FOUND");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "ACCOUNT_NOT_FOUND") {
        throw error;
      }
      console.error("Error updating user password:", error);
      throw new Error("Error updating user password");
    }
  }
}
