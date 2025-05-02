import { User } from "../entities/User.js";

//checks if the user exists in the database
export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}
