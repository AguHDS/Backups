import { User } from "../entities/User.js";

export interface UserRepository {
  //checks if the user exists in the database
  findByUsername(username: string): Promise<User | null>;
}
