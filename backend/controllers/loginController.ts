import { RequestHandler } from "express";
import config from "../config/environmentVars";
import promisePool from "../db/database";
import { getUserByName } from "../db/queries/index";
import { RowDataPacket } from "mysql2/promise";
import { validationResult, ValidationError, matchedData } from "express-validator";
import { compare } from "../utils/handlePassword";
import { tokenSign } from "../utils/handleJwt";
import { JwtUserData, ValidUserData } from "../types";

const saveRefreshToken = async (userId: number, token: string, expiresAt: Date): Promise<void> => {
  try {
    //delete any existing refresh token for this user
    const [existingToken] = await promisePool.execute<RowDataPacket[]>(
      "SELECT * FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    if (existingToken.length > 0) {
      await promisePool.execute(
        "UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE user_id = ?",
        [token, expiresAt, userId]
      );
    } else {
      await promisePool.execute(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt]
      );
    }
  } catch (error) {
    console.error("Error saving new refresh token to database:", error);
    throw new Error("Error saving new refresh token to database");
  }
};

interface UserData {
  user: string;
  password: string
}

const login: RequestHandler<{}, { message: string } | ValidUserData | { errors: ValidationError[] }, UserData, {}> = 
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: UserData = matchedData(req);
    const { user, password } = data;

    //check if the user exists in users table
    const userResult = await getUserByName(user);

    if(!userResult) {
      res.status(401).json({ message: "Credentials don't exist" });
      return;
    }

    if (userResult.length === 0) {
      console.error("Credentials don't exist for user:", user);
      res.status(401).json({ message: "Credentials don't exist" });
      return;
    }

    const userRow = userResult;

    //compare password sent by the user with the password in the database
    const comparedPassword = await compare(password, userRow.passdb);

    if (!comparedPassword) {
      console.error("Invalid credentials for user:", user);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const bodyWithRole: JwtUserData = {
      name: userRow.namedb,
      role: userRow.role,
      id: userRow.id,
    };

    const accessToken = await tokenSign(bodyWithRole, "access", "30s");
    const refreshToken = await tokenSign(bodyWithRole, "refresh", "1m");

    // Set expiration time for the refresh token
    const newExpiresAt: Date = new Date();
    newExpiresAt.setSeconds(newExpiresAt.getSeconds() + 65); // 65 seconds for testing

    // Save the new refresh token, automatically deleting any existing one
    await saveRefreshToken(userRow.id, refreshToken, newExpiresAt);

    // Set refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 65 * 1000, // 65 seconds for testing
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    });

    console.log(
      `Login successful for user: ${user}, role: ${userRow.role}, id: ${userRow.id}`
    );

     res.status(200).json({
      accessToken,
      userData: {
        name: userRow.namedb,
        role: userRow.role,
        id: userRow.id,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Error trying to log in" });
    return;
  }
};

export default login;