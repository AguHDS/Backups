import handleHttpError from "../utils/handleError.js";

const endSession = (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "Strict"
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Error in endSession controller:", error);

    return handleHttpError(res, "Error in endSession controller", 500);
  }
};

export default endSession;
