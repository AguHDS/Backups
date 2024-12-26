import promiseConnection from "../dbConnection/database.js";
import { verifyToken } from "../utils/handleJwt.js";

//verify existence and expiration time of this data in the database (user_id is a foreign key related to the real user id)
const findValidRefreshToken = async (refreshToken, id) => {
  try {
    const [results] = await promiseConnection.query(
      "SELECT token, user_id, expires_at FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()",
      [refreshToken, id]
    );

    if (results.length === 0) return null;

    return results[0];
  } catch (error) {
    console.error("Error in findValidRefreshToken:", error);
    throw error;
  }
};

const validateRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      console.error("No refresh found in the cookies");
      return res.status(401).json({ message: "No refresh token in cookies" });
    }
    const refreshToken = cookies.refreshToken;

    const decodedRefreshToken = verifyToken(refreshToken, "refresh");
    if (!decodedRefreshToken) {
      console.error("Invalid or expired refresh token detected.");
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { id } = decodedRefreshToken;

    const tokenData = await findValidRefreshToken(refreshToken, id);
    if (!tokenData) {
      console.error("Refresh token not found (db), doesn't match user or expired");
      return res.status(403).json({
        message: "Refresh token not found (db), doesn't match user or expired",
      });
    }

    req.user = {
      userId: id
    };

    next();
  } catch (error) {
    console.error("Error during token validation:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default validateRefreshToken;
