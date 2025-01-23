import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/handleJwt";

interface DecodedToken extends JwtPayload {
  name: string;
  id: string;
}

const updateProfileMiddleware: RequestHandler<{ username: string }, { message: string }, { userId: string }, {}> = 
(req, res, next): void => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      console.log("No refresh found in the cookies (updateProfileMiddleware)");
      res.status(401).json({ message: "No refresh token in cookies" });
      return;
    }

    const refreshToken = cookies.refreshToken;
    const decodedRefreshToken = verifyToken(refreshToken, "refresh") as DecodedToken;
    if (!decodedRefreshToken) {
      console.error("Invalid or expired refresh token detected.");
      res.status(403).json({ message: "Invalid or expired refresh token" });
      return;
    }
    const { name, id } = decodedRefreshToken;

    const { username } = req.params;
    if (!username) {
      console.error("Username parameter is missing in the url.");
      res.status(400).json({ message: "Missing username in url" });
      return;
    }

    //check if the user is trying to edit his own profile
    if (name !== username) {
      console.error("Token username does not match the username in the url");
      res.status(403).json({ message: "You don't have permission to edit this profile" });
      return;
    }

    req.body.userId = id;
    next();
  } catch (error) {
    console.error("An error occurred in updateProfileMiddleware:", error);
    res.status(500).json({ message: "Internal server error in updateProfileMiddleware" });
    return;
  }
};

export default updateProfileMiddleware;
