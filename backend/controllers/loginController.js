import config from "../config/environmentVars.js";
import promisePool from "../db/database.js";
import { validationResult, matchedData } from "express-validator";
import { compare } from "../utils/handlePassword.js";
import { tokenSign } from "../utils/handleJwt.js";

const saveRefreshToken = async (userId, token, expiresAt) => {
  try {
    //delete any existing refresh token for this user
    const [existingToken] = await promisePool.query(
      "SELECT * FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    if (existingToken.length > 0) {
      await promisePool.query(
        "UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE user_id = ?",
        [token, expiresAt, userId]
      );
    } else {
      await promisePool.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt]
      );
    }
  } catch (error) {
    console.error("Error saving new refresh token to database:", error);
    throw new Error("Error saving new refresh token to database");
  }
};

const getUserByName = async (username) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM users WHERE namedb = ?",
      [username]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving user from database:", error);
    throw new Error("Error retrieving user from database");
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const { user, password } = data;

    //check if the user exists in users table
    const userResult = await getUserByName(user);

    if (userResult.length === 0) {
      console.error("Credentials don't exist for user:", user);
      return res.status(401).json({ message: "Credentials don't exist" });
    }

    const userRow = userResult[0];

    //compare password sent by the user with the password in the database
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

    const accessToken = await tokenSign(bodyWithRole, "access", "30s");
    const refreshToken = await tokenSign(bodyWithRole, "refresh", "1m");

    // Set expiration time for the refresh token
    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + 65); // 65 seconds for testing

    // Save the new refresh token, automatically deleting any existing one
    await saveRefreshToken(userRow.id, refreshToken, newExpiresAt);

    // Set refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 65 * 1000, // 65 seconds for testing
      sameSite: config.nodeEnv === "production" ? "None" : "Lax",
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