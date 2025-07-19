import { Request, Response, NextFunction } from "express";

/** Allow access by role */
export function requireRole(allowedRoles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.baseUserData?.role;
    
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
