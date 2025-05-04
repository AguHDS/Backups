import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import promisePool from "../../db/database.js";
import { RowDataPacket } from "mysql2/promise";

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

      return new User(
        row.id, 
        row.namedb, 
        row.emaildb, 
        row.passdb, 
        row.role
      );
    } catch (error) {
      console.error("Error retrieving username from database:", error);
      throw new Error("Error retrieving username from database");
    }
  }
}
