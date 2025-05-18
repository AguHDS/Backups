import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";


export const updateProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors found", errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const decoded = decodeRefreshToken(req);

    const { name, id } = decoded;
    const { username } = req.params;

    if (!username) {
      res.status(400).json({ message: "Missing username in URL" });
      return;
    }

    //check if username in the url is the same than username from refresh token
    if (name !== username) {
      res.status(403).json({ message: "You don't have permission to edit this profile" });
      return;
    }

    req.refreshTokenId = { id };
    
    next();
  } catch (error) {
    if (error instanceof Error)
      console.error("Error in updateProfileMiddleware:", error);

    switch (error.message) {
      case "NO_REFRESH_TOKEN":
        res.status(401).json({ message: "No refresh token in cookies" });
        return;
      case "INVALID_REFRESH_TOKEN":
        res.status(403).json({ message: "Invalid or expired refresh token" });
        return;
      default:
        res.status(500).json({ message: "Internal server error" });
        return;
    }
  }
};
