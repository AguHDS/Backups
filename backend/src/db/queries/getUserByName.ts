import promisePool from "../database.js";
import { RowDataPacket } from "mysql2/promise";

export const getUserByName = async (username: string): Promise<RowDataPacket | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE namedb = ?",
      [username]
    );

    if (rows.length === 0) {
      console.error("Username not found in database");
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error retrieving username from database:", error);
    throw new Error("Error retrieving username from database");
  }
};
