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
        expiresIn: "2h",
      }
    );

    return sign;
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET); //decode the token
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new Error("Invalid or expired token"); // Lanza un error específico
  }
};
