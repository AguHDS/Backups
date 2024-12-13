import config from "../config/environmentVars.js";
import promiseConnection from "../dbConnection/database.js";
import { tokenSign } from "../utils/handleJwt.js";

//get expiration time of the first refresh token emited.
const getDateTime = async (userId) => {
  try {
    const [results] = await promiseConnection.query(
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

const updateRefreshTokenFromDB = async (refreshToken, userId) => {
  try {
    const [results] = await promiseConnection.query(
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
const sendNewAccessToken = async (req, res) => {
  try {
    const { id, name, role } = req.user;

    const accessToken = await tokenSign({ id, name, role }, "access", "30s");

    const unmodifiedExpirationTime = await getDateTime(id);
    if (!unmodifiedExpirationTime) {
      console.error(`No refresh token found for user in db: ${id}`);
      return res.status(404).json({ message: "Refresh token not found for the user in db" });
    } 

    //converts the expiration time to seconds
    const timeRemaining = Math.floor((new Date(unmodifiedExpirationTime) - Date.now()) / 1000);
    if (timeRemaining <= 0) {
      console.error(`Refresh token expired for user: ${id}`);
      return res.status(401).json({ message: "Refresh token has expired" });
    }

    /* the expiration time of the refresh token is calculated to have same time than the first refresh token emited, so the expiration 
    time always counts down until it's zero, we're not using an absolute expiration time to make this process but maybe it will be 
    upgraded to that in the future if it was needed */
    const refreshToken = await tokenSign({ id, name, role }, "refresh", `${timeRemaining}s`);
    await updateRefreshTokenFromDB(refreshToken, id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: timeRemaining * 1000,
      sameSite: config.nodeEnv === "production" ? "None" : "Lax",
    });
    console.log("Enviando nuevo access token");

    return res.status(200).json({
      accessToken,
      userData: {
        name: name,
        role: role,
        id: id,
      },
    });
  } catch (error) {
    console.error(`Error trying to update the token. ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default sendNewAccessToken;