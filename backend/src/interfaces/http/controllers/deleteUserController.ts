import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { DeleteUserUseCase } from "@/application/useCases/DeleteUserUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";

const deleteUserUseCase = new DeleteUserUseCase(
  new MysqlUserRepository(),
  new CloudinaryRemover()
);

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId } = req.body;

    await deleteUserUseCase.execute(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting user:", error);

    switch (errorMessage) {
      case "MISSING_USER_ID":
        res.status(400).json({ message: "User ID is required" });
        break;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
    }
  }
};
