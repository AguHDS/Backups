import jwt from "jsonwebtoken";
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * @param {object} user - username and role
 * @param {string} type - type of token (access or refresh)
 * @param {Date} expiresIn - expiration time
 * @returns - jwt token
 */

export const tokenSign = async (user, type = "access", expiresIn = "5m") => {
  try {
    const secret = type === "access" ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;
    if(!secret) throw new Error("No secret");

    //TODO enviar tambien fecha de expiración para usarla en el front
    const sign = jwt.sign(
      {
        name: user.user,
        role: user.role,
        id: user.id,
      },
      secret,
      {
        expiresIn,
      }
    );

    return sign;
  } catch (error) {
    console.error(`Error signing ${type} token: `, error);
    return res.status(500).json({ msg: "Token generation failed" });
  }
};

/**
 * @param {string} token - token
 * @param {string} type - type of token (access or refresh)
 * @returns - decoded token
 */

export const verifyToken = (token, type = "access") => {
  try {
    const secret = type === "access" ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;
    if(!secret) throw new Error("No secret");

    //decode the token if is valid, comparing with the secret, returning the payload (name, role)
    return jwt.verify(token, secret);
    
  } catch (err) {
    console.error(`Token verification failed for ${type} token:`, err.message);
    return null;
  }
};