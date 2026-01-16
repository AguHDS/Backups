import { Request, Response, NextFunction } from "express";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { auth } from "@/lib/auth.js";

const userRepository = new MysqlUserRepository();

/** check if the username provided in the params of url exists in users table */
export const getProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    const user = await userRepository.findByUsername(username);
    if (!user) {
      res.status(404).json({ status: 404, message: `Profile data for ${username} not found` });
      return;
    }
    
    // Add profile owner's data to request
    req.baseUserData = {
      name: user.name,
      role: user.role,
      id: user.id,
      email: user.email
    };

    // Get requester's data if authenticated
    let requesterData: { id: string; role: string } | undefined = undefined;
    
    try {
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const session = await auth.api.getSession({ headers });
      if (session?.user) {
        requesterData = {
          id: String(session.user.id),
          role: session.user.role || 'user'
        };
      }
    } catch (err) {
      console.log("No session found for requester:", err);
      // Silent fail - user is not authenticated
    }

    // Add requester's data to request
    req.requesterData = requesterData;

    next();
  } catch (error) {
    console.error("Error in profileMiddleware:", error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};