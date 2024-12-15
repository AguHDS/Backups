import promiseConnection from "../dbConnection/database.js";

//check if the user has a refresh token in the database
const hasTokenInDB = async (userId) => {
  const [results] = await promiseConnection.query(
    "SELECT user_id FROM refresh_tokens WHERE (user_id = ?)",
    [userId]
  );

  return results.length === 0 ? null : results[0];
};

const hasSessionOpen = async (req, res, next) => {
  try {
    let hasRefreshCookie;
    const { id } = req.body;
    console.log(req.body)
    if (!id) {
      console.log("No id in the logout request");
      return res.status(401).json({ message: "No user id for logout request" });
    }

    const refreshDB = await hasTokenInDB(id);

    if (!refreshDB) {
      console.log("user has no refresh token in the db");
      return res.status(401).json({ message: "User has no refresh token in the db" }); 
    }
    
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      console.log("No refresh token in cookies (logout middleware)");
      hasRefreshCookie = false;
      return res.status(401).json({ message: "User has no refresh token in cookies" })
    }

    req.userData = { id, hasRefreshCookie };

    next();
  } catch (error) {
    console.log("error in logout middleware ", error);
    return res.status(500).json({ message: "Error trying to logout" });
  }
};

export default hasSessionOpen;
