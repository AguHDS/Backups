import handleHttpError from "../utils/handleError.js";

const validateUser = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
      role: req.role,
    });
  } catch (error) {
    console.error("Error in validateUser controller:", error);
    return handleHttpError(res, 500, "Error trying to validate the user data");
  }
};

export default validateUser;
