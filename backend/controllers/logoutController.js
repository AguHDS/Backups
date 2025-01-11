import promiseConnection from "../db/database.js";

const deleteRefreshFromDB = async (userId) => {
  try {
    const deletedRefresh = await promiseConnection.query(
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

const logout = async (req, res) => {
  try {
    const { id, hasRefreshCookie } = req.userData;

    if (hasRefreshCookie) res.clearCookie("refreshToken", { httpOnly: true });

    await deleteRefreshFromDB(id);
    console.log("logout successfull");
    return res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller:", error);

    return res.status(500).json({ msg: "Logout failed" });
  }
};

export default logout;
