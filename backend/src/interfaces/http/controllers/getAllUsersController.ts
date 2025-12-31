import { Request, Response } from "express";
import { GetAllUsersUseCase } from "@/application/useCases/GetAllUsersUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

const userRepository = new MysqlUserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersUseCase.execute();

    // Map users to safe response format (exclude passwords)
    const usersResponse = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    res.status(200).json({
      success: true,
      users: usersResponse,
    });
  } catch (error) {
    console.error("Error in getAllUsersController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};
