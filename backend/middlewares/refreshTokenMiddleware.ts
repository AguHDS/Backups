import { RequestHandler } from "express";
import promisePool from "../db/database";
import { RowDataPacket } from "mysql2/promise";
import { verifyToken } from "../utils/handleJwt";
import { JwtPayload } from "jsonwebtoken";

//verify existence and expiration time of this data in the database (user_id is a foreign key related to the real user id)
const findValidRefreshToken = async (refreshToken: string, id: string): Promise<RowDataPacket | null>  => {
  try {
    const [results] = await promisePool.execute<RowDataPacket[]>(
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

interface DecodedToken extends JwtPayload {
  id: string;
}

const refreshTokenMiddleware: RequestHandler<{}, { message: string }, { userTokenId: string }, {}> = 
async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      console.log("No refresh found in the cookies");
      res.status(401).json({ message: "No refresh token in cookies (refreshTokenMiddleware)" });
      return;
    }
    const refreshToken = cookies.refreshToken;

    const decodedRefreshToken = verifyToken(refreshToken, "refresh") as DecodedToken;
    if (!decodedRefreshToken) {
      console.error("Invalid or expired refresh token detected.");
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }

    const { id } = decodedRefreshToken;

    const tokenData = await findValidRefreshToken(refreshToken, id);
    if (!tokenData) {
      console.error("Refresh token not found (db), doesn't match user or expired");
      res.status(403).json({ message: "Refresh token not found (db), doesn't match user or expired" });
      return;
    }

    req.body.userTokenId = id;
    next();
  } catch (error) {
    if(error instanceof Error) {
      console.error("Error during token validation:", error.message);
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default refreshTokenMiddleware;
