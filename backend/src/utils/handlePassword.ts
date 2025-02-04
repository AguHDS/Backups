import bcryptjs from "bcrypt";

/**
 * Encripts and hashes a password
 * @param passwordPlain - password in plain text
 * @returns - hashed password
 */

export const encrypt = async (passwordPlain: string): Promise<string> => {
  const hash: string = await bcryptjs.hash(passwordPlain, 10);
  return hash;
};

/**
 * Compares a plain text password with the hashed password
 * @param passwordPlain - plain text password
 * @param hashPassword - hashed password to be compared with
 * @returns - true if the passwords match, false otherwise
 */
export const compare = async (passwordPlain: string, hashPassword: string): Promise<boolean> => {
  const comparer: boolean = await bcryptjs.compare(passwordPlain, hashPassword);
  return comparer;
};
