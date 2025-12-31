import { Request, Response, NextFunction } from "express";

/** Allow access by role - works with both BetterAuth (req.user) and legacy (req.baseUserData) */
export function requireRole(allowedRoles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check BetterAuth user first, then fall back to legacy baseUserData
    const role = req.user?.role || req.baseUserData?.role;
    
    if (!role || !allowedRoles.includes(role as "user" | "admin")) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
}
