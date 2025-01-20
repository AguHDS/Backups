import { verifyToken } from "../utils/handleJwt.js";

const updateProfileMiddleware = (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      console.log("No refresh found in the cookies (updateProfileMiddleware)");
      return res.status(401).json({
        message: "No refresh token in cookies",
      });
    }
    const refreshToken = cookies.refreshToken;

    const decodedRefreshToken = verifyToken(refreshToken, "refresh");
    if (!decodedRefreshToken) {
      console.error("Invalid or expired refresh token detected.");
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { name, id } = decodedRefreshToken;

    const { username } = req.params;
    if (!username) {
      console.error("Username parameter is missing in the URL.");
      return res.status(400).json({ message: "Missing username in URL" });
    }

    //check if the user is trying to edit his own profile
    if (name !== username) {
      console.error("Token username does not match the username in the URL");
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this profile" });
    }

    req.body.userId = { id };

    next();
  } catch (error) {
    console.error("An error occurred in updateProfileMiddleware:", error);
    res.status(500).json({
      message: "Internal server error in updateProfileMiddleware",
    });
  }
};

export default updateProfileMiddleware;
