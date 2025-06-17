import { Request, Response, NextFunction } from "express";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";

/**
 * Check if the profile to edit belongs to the user making the request
 * @param attachIdToReq - if true, attaches the user ID from the refresh token to the request object
*/

export const verifyUserOwnsProfile = (attachIdToReq = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = decodeRefreshToken(req);
      const { name, id } = decoded;
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ message: "Missing username in URL" });
        return 
      }

      if (name !== username) {
        res.status(403).json({ message: "You don't have permission for this profile" });
        return 
      }

      if (attachIdToReq) {
        req.refreshTokenId = { id };
      }

      next();
    } catch (error) {
      if (error instanceof Error) console.error("Authorization error:", error);

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
};
