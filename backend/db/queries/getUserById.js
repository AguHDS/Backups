import promiseConnection from "../database.js";

const getUserById = async (id) => {
  try {
    const [rows] = await promiseConnection.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

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
