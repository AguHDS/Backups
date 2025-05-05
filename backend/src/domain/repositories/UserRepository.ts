import { User } from "../entities/User.js";

export interface NameAndEmailCheckResult {
  isTaken: boolean;
  userTaken: string | null;
  emailTaken: string | null;
}

export interface UserRepository {
  //checks in the database if the user exists when logging in
  findByUsername(username: string): Promise<User | null>;
  //check in the database if username or email are already taken
  isNameOrEmailTaken(username: string, email: string): Promise<NameAndEmailCheckResult>
  //insert in the database a new user
  insertNewUser(name: string, email: string, pass: string, role: string): Promise<void>
}
