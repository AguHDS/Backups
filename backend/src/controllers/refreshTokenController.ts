import config from "../config/environmentVars.js";
import { RequestHandler } from "express";
import { tokenSign } from "../utils/handleJwt.js";
import { RowDataPacket, ResultSetHeader , Connection } from "mysql2/promise";
import promisePool from "../db/database.js";
import { getUserById } from "../db/queries/index.js";
import { JwtUserData, ValidUserData } from "../types/index.js";

//get expiration time of the first refresh token emited.
const getDateTime = async (userId: number, connection: Connection): Promise<string | null> => {
  try {
    const [results] = await connection.execute<RowDataPacket[]>(
      "SELECT expires_at FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    if (results.length === 0) return null;

    return results[0].expires_at;
  } catch (error) {
    console.error("Error in getDateTime:", error);
    throw error;
  }
};

const updateRefreshTokenFromDB = async (refreshToken: string, userId: number, connection: Connection): Promise<ResultSetHeader> => {
  try {
    const [results] = await connection.execute<ResultSetHeader>(
      "UPDATE refresh_tokens SET token = ? WHERE user_id = ?",
      [refreshToken, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error("Failed to update refresh token");
    }

    return results;
  } catch (error) {
    console.error("Error in updateRefreshTokenFromDB:", error);
    throw error;
  }
};

//send new access token if everything was validated
const sendNewAccessToken: RequestHandler<{}, { message: string } | ValidUserData, { userTokenId: string }, {}> = 
async (req, res) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    //use id from previous refreshToken to get user data from database
    const { userTokenId } = req.body;
    const userRow = await getUserById(userTokenId, connection);

    if (!userRow) {
      console.error(`User not found in db: ${userTokenId}`);
      res.status(404).json({ message: "User not found in db" });
      return;
    }

    const { namedb, role, id } = userRow;

    //rename namedb to match with the structure of tokenSign
    const userData: JwtUserData = { name: namedb, role: role, id: id };

    const accessToken = await tokenSign(userData, "access", "30s");

    const unmodifiedExpirationTime = await getDateTime(id, connection);
    if (!unmodifiedExpirationTime) {
      console.error(`No refresh token found for user in db: ${id}`);
      res.status(404).json({ message: "Refresh token not found for the user in db" });
      return;
    } 

    //converts the expiration time to seconds
    const expirationDate = new Date(unmodifiedExpirationTime);
    const timeRemaining = Math.floor((expirationDate.getTime() - Date.now()) / 1000);

    if (timeRemaining <= 0) {
      console.error(`Refresh token expired for user: ${id}`);
      res.status(403).json({ message: "Refresh token has expired" });
      return;
    }

    /* the expiration time of the refresh token is calculated to have same time than the first refresh token emited, so the expiration 
    time always counts down until it's zero, we're not using an absolute expiration time to make this process but maybe it will be 
    upgraded to that in the future if it was needed */
    const refreshToken = await tokenSign(userData, "refresh", `${timeRemaining}s`);
    await updateRefreshTokenFromDB(refreshToken, id, connection);
    await connection.commit();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: timeRemaining * 1000,
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    });

    console.log("sending new access token and updating refresh token... (refreshTokenController)");
    res.status(200).json({ accessToken, userData });
    return;
  } catch (error) {
    await connection.rollback();
    
    if(error instanceof Error) {
      console.error(`Error trying to update the token. ${error.message}`);
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  } finally {
    connection.release();
  }
};

export default sendNewAccessToken;