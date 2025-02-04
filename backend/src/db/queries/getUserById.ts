import { RowDataPacket, Connection } from "mysql2/promise";
import promisePool from "../database.js";

const getUserById = async (id: string, connection?: Connection): Promise<RowDataPacket | null> => {
  try {
    let rows: RowDataPacket[];

    if(!connection) {
      [rows] = await promisePool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
    }else {
      [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
    }

    if (rows.length === 0) {
      console.error("User by id not found in database");
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw new Error("Error retrieving user from database");
  }
};

export default getUserById;
