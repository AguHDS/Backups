import { Response, Request } from "express";
import promisePool from "../db/database.ts";
import { ResultSetHeader } from "mysql2/promise";

const deleteRefreshFromDB = async (userId: number) => {
  try {
    const [deletedRefresh] = await promisePool.execute<ResultSetHeader>(
      "DELETE FROM refresh_tokens WHERE user_id = ?",
      [userId]
    );

    if (deletedRefresh.affectedRows === 0) {
      console.log(`No refresh token found for ${userId}`);
      return;
    }

    console.log("Refresh token successfully deleted from database");
  } catch (error) {
    console.error("Error deleting refresh token from db:", error);
    throw new Error("Error deleting refresh token from the database");
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const { id, hasRefreshCookie } = req.activeSessionData!;

    if (hasRefreshCookie) res.clearCookie("refreshToken", { httpOnly: true });

    await deleteRefreshFromDB(id);
    console.log("logout successfull");
    
    res.status(200).json({ message: "Logout successful" });
    return;
  } catch (error) {
    console.error("Error in logout controller:", error);

    res.status(500).json({ message: "Logout failed" });
    return;
  }
};

export default logout;
