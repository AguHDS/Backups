import { getUserByName } from "../db/queries/index.js";

//check if the username provided in the params of the url exists in users table and extract: username, role, email and id
const getProfileMiddleware = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    //get userdata from users table
    const user = await getUserByName(username);
    if (!user) {
      return res.status(404).json({ 
        status: 404,
        message: `Profile data for ${username} not found` 
      });
    }
    
    req.userData = { username: user.namedb, role: user.role, id: user.id };

    next();
  } catch (error) {
    console.error("Error in profileMiddleware:", error);
    res.status(500).json({ 
      status: 500,
      message: 'Internal server error' 
    });
  }
};

export default getProfileMiddleware;
