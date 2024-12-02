import promiseConnection from "../dbConnection/database.js";
import { validationResult, matchedData } from "express-validator";
import { compare } from "../utils/handlePassword.js";
import { tokenSign } from "../utils/handleJwt.js";

const saveRefreshToken = async (userId, token, expiresAt) => {
  try {
    await promiseConnection.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  } catch (error) {
    console.error("Error saving new refresh token to database:", error);
    throw new Error("Error saving new refresh token to database");
  }
};

const getUserByName = async (username) => {
  try {
    const [rows] = await promiseConnection.query(
      "SELECT * FROM users WHERE namedb = ?",
      [username]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw new Error("Error retrieving user from database");
  }
};

const checkExistingRefreshToken = async (userId) => {
  try {
    const [rows] = await promiseConnection.query(
      "SELECT * FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error checking refresh token in the database:", error);
    throw new Error("Error checking refresh token in the database");
  }
};

const deleteExistingRefreshToken = async (userId) => {
  try {
    await promiseConnection.query(
      "DELETE FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );
  } catch (error) {
    console.error("Error deleting expired refresh token:", error);
    throw new Error("Error deleting expired refresh token from the database");
  }
};

//localhost:3001/login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const { user, password } = data;

    //check if the user exists in the database
    const userResult = await getUserByName(user);

    if (userResult.length === 0) {
      console.error("Credentials don't exist for user:", user);
      return res.status(401).json({ message: "Credentials don't exist" });
    }

    const userRow = userResult[0];

    // compare password sent by the user with the password in the database
    const comparedPassword = await compare(password, userRow.passdb);

    if (!comparedPassword) {
      console.error("Invalid credentials for user:", user);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const bodyWithRole = {
      ...data,
      role: userRow.role,
      id: userRow.id,
    };

    const accessToken = await tokenSign(bodyWithRole, "access", "5m");
    const refreshToken = await tokenSign(bodyWithRole, "refresh", "6m");

    //check if the user already have a refresh token in the database

    const existingRefreshToken = await checkExistingRefreshToken(userRow.id);

    if (existingRefreshToken.length > 0) {
      const existingToken = existingRefreshToken[0];
      const expiresAt = new Date(existingToken.expires_at);
      const now = new Date();

      if (expiresAt < now) {
        console.log("Refresh token has expired, user must log in again");
        await deleteExistingRefreshToken(userRow.id);
        return res.status(401).json({
          message: "Token deleted, user must log in again",
        });
      } else {
        console.log(
          "User already has a non-expired refresh token in the database."
        );
        return res.status(400).json({
          message:
            "This user already has a non-expired refresh token in the database",
        });
      }
    }

    // If no token exists, set time, save in DB, and send cookie
    const newExpiresAt = new Date();
    newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 6); // 6 minutes for testing

    await saveRefreshToken(userRow.id, refreshToken, newExpiresAt);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 60 * 1000, // 6 minutes for testing
      sameSite: "Strict",
    });

    console.log(
      `Login successful for user: ${user}, role: ${userRow.role}, id: ${userRow.id}`
    );

    return res.status(200).json({
      accessToken,
      userData: {
        name: user,
        role: userRow.role,
        id: userRow.id,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Error trying to log in" });
  }
};

export default login;
