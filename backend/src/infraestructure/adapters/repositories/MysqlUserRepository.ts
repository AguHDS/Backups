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
        "SELECT * FROM users WHERE namedb = ?",
        [username]
      );

      if (rows.length === 0) {
        console.error("Username not found in database");
        return null;
      }

      const row = rows[0];

      return new User(row.id, row.namedb, row.emaildb, row.passdb, row.role);
    } catch (error) {
      console.error("Error retrieving username from database:", error);
      throw new Error("Error retrieving username from database");
    }
  }
  async findById(id: number, connection: Connection): Promise<User | null> {
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];

      return new User(row.id, row.namedb, row.emaildb, row.passdb, row.role);
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
}
