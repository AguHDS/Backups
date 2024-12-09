import promiseConnection from "../dbConnection/database.js";
import { verifyToken } from "../utils/handleJwt.js";

const isTokenValidInDB = async (userId)=> {
  const [results] = await promiseConnection.query(
    "SELECT user_id FROM refresh_tokens WHERE (user_id = ?)", [userId]
  );

  return results.length === 0 ? null : results[0];
}

const hasSessionOpen = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    //check if refresh token in cookies is valid
    if(!refreshToken) {
      console.log("No refresh token in cookies (logout middleware)");
      return res.status(401).json({message: "No refresh token found in cookies"});
    }

    const decodedToken = verifyToken(refreshToken, "refresh");

    //check if token is valid in database
    const { id } = decodedToken;
    await isTokenValidInDB(id);
    
    if(!isTokenValidInDB) {
      console.log("Refresh token not found in database (logout middleware)");
      return res.status(401).json({message: "No refresh token found in database"});
    }

    return res.sendStatus(200);
    
  } catch (error) {
    console.log('error in logout middleware ', error);
    return res.status(500).json({ message: "Error trying to logout" });
  }
};

export default hasSessionOpen;