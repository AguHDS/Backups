//verifica que el cliente sea un usuario autenticado en la web principal
import { verifyToken } from "../utils/handleJwt.js";

const authorizedUser = async (req, res, next) => { 
  try {
    const authToken = req.cookies["authToken"];
    if (!authToken) {
      return res.status(401).json({ message: "No auth token" });
    }

    const decodedToken = await verifyToken(authToken);
    req.user = decodedToken.name;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    console.error("Authorization error", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authorizedUser;
