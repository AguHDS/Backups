//verifica que el cliente sea un usuario autenticado en la web principal
import handleHttpError from "../utils/handleError.js";
import { verifyToken } from "../utils/handleJwt.js";

// this has to change
const authorizedUser = async (req, res, next) => { 
  try {
    const authToken = req.cookies["authToken"]; //this will change since the authToken will be stored in redux and the refresh token in the cookie
    if (!authToken) {
      return res.status(401).json({ message: "No auth token" });
    }

    const decodedToken = await verifyToken(authToken);
    req.user = decodedToken.name;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    console.error("Authorization error", error.message);
    return handleHttpError(res, 401, "Invalid or expired token.");
  }
};

export default authorizedUser;
