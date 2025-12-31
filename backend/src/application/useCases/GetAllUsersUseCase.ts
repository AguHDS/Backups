import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { User } from "@/domain/entities/User.js";

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    try {
      const users = await this.userRepository.getAllUsers();
      return users;
    } catch (error) {
      console.error("Error in GetAllUsersUseCase:", error);
      throw new Error("Failed to retrieve all users");
    }
  }
}
