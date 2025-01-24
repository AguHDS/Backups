import { Response, Request, NextFunction} from "express";
import promisePool from "../db/database";
import { RowDataPacket } from "mysql2/promise";

//check if the user has a refresh token in the database
const hasTokenInDB = async (userId: number): Promise<RowDataPacket | null> => {
  const [results] = await promisePool.execute<RowDataPacket[]>(
    "SELECT user_id FROM refresh_tokens WHERE (user_id = ?)",
    [userId]
  );

  return results.length === 0 ? null : results[0];
};

interface CustomRequest extends Request {
  userData?: {
    id: number;
    hasRefreshCookie: boolean;
  };
}

const hasSessionOpen = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let hasRefreshCookie;
    const { id } = req.body;
    if (!id) {
      console.log("No id in the logout request");
      res.status(401).json({ message: "No user id for logout request" });
      return;
    }

    const refreshDB = await hasTokenInDB(id);

    if (!refreshDB) {
      console.log("user has no refresh token in the db");
      res.status(401).json({ message: "User has no refresh token in the db" });
      return;
    }
    
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      console.log("No refresh token in cookies (logout middleware)");
      hasRefreshCookie = false;
      res.status(401).json({ message: "User has no refresh token in cookies" });
      return;
    } else {
      hasRefreshCookie = true;
    }
    
    req.userData = { id, hasRefreshCookie };
    next();
  } catch (error) {
    console.log("error in logout middleware ", error);
    res.status(500).json({ message: "Error trying to logout" });
    return;
  }
};

export default hasSessionOpen;
