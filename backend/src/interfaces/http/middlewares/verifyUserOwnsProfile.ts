import { Request, Response, NextFunction } from "express";
import { auth } from "@/lib/auth.js";

/**
 * Check if the profile to edit belongs to the user making the request (requires /:username route param)
 * @param attachUserDataToReq - if true, attaches username, role and id from the session to request object
 */

export const verifyUserOwnsProfile = (attachUserDataToReq = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert Express headers to Web API Headers format
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      // Get session from BetterAuth
      const session = await auth.api.getSession({ headers });

      if (!session || !session.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const { name, id } = session.user;
      const role = (session.user as { role?: "user" | "admin" }).role || "user";
      const { username } = req.params;

      // Make params username optional - if provided, verify ownership
      if (username && name !== username) {
        res
          .status(403)
          .json({ message: "You don't have permission for this profile" });
        return;
      }

      if (attachUserDataToReq) {
        req.baseUserData = { name, role, id: String(id) };
        req.user = { name, role, id: String(id), email: session.user.email };
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
