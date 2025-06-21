import { Request, Response, NextFunction } from "express";
import { decodeRefreshToken } from "../../../shared/utils/decodeRefreshToken.js";

/**
 * Check if the profile to edit belongs to the user making the request
 * @param attachUserDataToReq - if true, attaches username, role and id from the refresh token to request object
*/

export const verifyUserOwnsProfile = (attachUserDataToReq = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Verifying user owns profile... (verifyUserOwnsProfile middleware)");
      const decoded = decodeRefreshToken(req);
      const { name, role, id } = decoded;
      const { username } = req.params;

      //make params username optional
      if (username && name !== username) {
        res.status(403).json({ message: "You don't have permission for this profile" });
        return;
      }

      if (attachUserDataToReq) {
        req.baseUserData = { name, role, id };
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
