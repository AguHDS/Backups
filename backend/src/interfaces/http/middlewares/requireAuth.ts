import { Request, Response, NextFunction } from "express";
import { auth } from "@/lib/auth.js";

/**
 * Verify the user is authenticated using BetterAuth
 * Adds the user data to req.user if authenticated
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert Express headers to Web API Headers format
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Add user to request object for downstream handlers
    req.user = {
      id: String(session.user.id),
      name: session.user.name,
      email: session.user.email,
      role: (session.user as { role?: "user" | "admin" }).role || "user",
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(401).json({ message: "Invalid or expired session" });
  }
};
