import config from "../config/environmentVars";
import jwt from "jsonwebtoken";
import { JwtUserData } from "../types";

/**
 * @param user - username and role
 * @param type - type of token (access or refresh)
 * @param expiresIn - expiration time
 * @returns - jwt token
 */

export const tokenSign = async (user: JwtUserData, type: "access" | "refresh" = "access", expiresIn: string = "5m"): Promise<string> => {
  try {
    const secret = type === "access" ? config.jwtSecret : config.jwtRefreshSecret;
    if(!secret) throw new Error("No secret");

    const sign = jwt.sign(
      {
        name: user.name,
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
    throw new Error("Token generation failed");
  }
};

/**
 * @param token - token
 * @param type - type of token (access or refresh)
 * @returns - decoded token
 */

export const verifyToken = (token: string, type: "access" | "refresh" = "access"): string | jwt.JwtPayload | null => {
  try {
    const secret = type === "access" ? config.jwtSecret : config.jwtRefreshSecret;
    if(!secret) throw new Error("No secret");

    //decode the token if is valid, comparing with the secret, returning the payload (name, role)
    const decoded = jwt.verify(token, secret);
    return decoded;
    
  } catch (err) {
    const error = err as Error;
    console.error(`Token verification failed for ${type} token:`, error.message);
    return null;
  }
};