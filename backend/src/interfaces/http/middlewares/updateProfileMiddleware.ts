import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";


export const updateProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const decoded = decodeRefreshToken(req);

    const { name, id } = decoded;
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Missing username in URL" });
    }

    //check if username in the url is the same than username from refresh token
    if (name !== username) {
      return res.status(403).json({ message: "You don't have permission to edit this profile" });
    }

    req.refreshTokenId = { id };
    next();
  } catch (error) {
    if (error instanceof Error)
      console.error("Error in updateProfileMiddleware:", error);

    switch (error.message) {
      case "NO_REFRESH_TOKEN":
        return res.status(401).json({ message: "No refresh token in cookies" });
      case "INVALID_REFRESH_TOKEN":
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      default:
        return res.status(500).json({ message: "Internal server error" });
    }
  }
};
