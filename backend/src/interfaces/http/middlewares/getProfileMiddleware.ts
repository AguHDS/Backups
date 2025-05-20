import { Request, Response, NextFunction } from "express";
import { MysqlUserRepository } from "../../../infraestructure/adapters/repositories/MysqlUserRepository.js";

const userRepository = new MysqlUserRepository();

/** check if the username provided in the params of  url exists in users table */
export const getProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    const user = await userRepository.findByUsername(username);
    if (!user) {
      res.status(404).json({ status: 404, message: `Profile data for ${username} not found` });
      return;
    }
    
    req.baseUserData = {
      name: user.name,
      role: user.role,
      id: user.id
    };

    next();
  } catch (error) {
    console.error("Error in profileMiddleware:", error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};