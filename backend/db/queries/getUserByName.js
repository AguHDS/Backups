import promiseConnection from "../database.js";

const getUserByName = async (username) => {
  try {
    const [rows] = await promiseConnection.query(
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

export default getUserByName;
