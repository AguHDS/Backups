import handleHttpError from "../utils/handleError.js";

const hasSessionOpen = (req, res, next) => {
  try {
    const token = req.cookies["authToken"];
    if (!token) {
      console.error("No authToken found");
      return res.status(401).json({ message: "No session open at logoutMiddleware" });
    }

    next();
  } catch (error) {
    console.log(error);
    return handleHttpError(res, 401, "Invalid or expired token");
  }
};

export default hasSessionOpen;
