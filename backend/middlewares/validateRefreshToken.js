import { verifyToken } from "../utils/handleJwt.js";
import connection from "../dbConnection/database.js";

//verify existence and expiration time of this data in the database (user_id is a foreign key related to the real user id)
const isTokenValidInDB = (refreshToken, id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT token, user_id, expires_at FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()",
      [refreshToken, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        resolve(results[0]);
      }
    );
  });
};

const validateRefreshToken = async (req, res, next) => {
  try {
    //take refresh token from the cookies
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      console.error("No refresh found in the cookies");
      return res.status(401).json({ message: "Not refresh token in cookies" });
    }
    const refreshToken = cookies.refreshToken;

    //decode and validate the refresh token
    const decodedRefreshToken = verifyToken(refreshToken, "refresh");
    if (!decodedRefreshToken) {
      console.error("Error trying to verify the token");
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
 

    //data inside the refresh token, the user making the request should match this data too
    const { id, name, role } = decodedRefreshToken;

    //if the query result is not falsy, move to the controller
    const tokenData = await isTokenValidInDB(refreshToken, id);
    if (!tokenData) {
      console.error("Refresh token not found, don't match user or expired");
      return res.status(401).json({ message: "Refresh token not found, don't match user or expired" });
    }

    req.user = {
      id,
      name,
      role,
    };

    next();
  } catch (error) {
    console.error("Error during token validation:", error.message);
  }
};

export default validateRefreshToken;
