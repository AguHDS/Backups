import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const tokenSign = async (user) => {
  try {
    //TODO enviar tambien fecha de expiración para usarla en el front
    const sign = jwt.sign(
      {
        name: user.user,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    return sign;
  } catch (error) {
    console.log("error trying to sign token (tokenSIgn)", error);
  }
};

export const verifyToken = async (token) => {
  try {
    //decode the token, returning the payload (name, role)
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new Error("Invalid or expired token");
  }
};
