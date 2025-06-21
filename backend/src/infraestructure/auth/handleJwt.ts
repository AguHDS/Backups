import config from "../config/environmentVars.js";
import { JwtUserData } from "../../shared/dtos/jwtUserData.js";
import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT token using the given user data and token type
 *
 * @param user - User data to include in the token payload (name, role, id)
 * @param type - Type of token to generate: "access" or "refresh". Defaults to "access"
 * @param expiresIn - Expiration time of the token (e.g., "30s", "5m"). Defaults to "5m"
 * @returns A promise that resolves to the signed JWT token as a string
 */

export const tokenSign = async (
  user: JwtUserData,
  type: "access" | "refresh" = "access",
  expiresIn: jwt.SignOptions["expiresIn"] = "5m"
): Promise<string> => {
  try {
    const secret =
      type === "access" ? config.jwtSecret : config.jwtRefreshSecret;
    if (!secret) throw new Error("No secret");

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
 * Verifies a JWT token and returns the decoded payload if valid
 *
 * @param token - The JWT token to verify
 * @param type - The type of token: "access" or "refresh". Default is "access"
 * @returns The decoded JWT payload if the token is valid, or null if verification fails
 */

export const verifyToken = (token: string, type: "access" | "refresh" = "access"): string | jwt.JwtPayload | null => {
  try {
    const secret =
      type === "access" ? config.jwtSecret : config.jwtRefreshSecret;
    if (!secret) throw new Error("No secret");

    //decode the token if is valid, comparing with the secret, returning the payload (name, role)
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    const error = err as Error;
    console.error(
      `Token verification failed for ${type} token:`,
      error.message
    );
    return null;
  }
};
