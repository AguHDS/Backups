import { Request, Response } from "express";
import { AdminUpdateUserCredentialsUseCase } from "@/application/useCases/AdminUpdateUserCredentialsUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

const adminUpdateUserCredentialsUseCase = new AdminUpdateUserCredentialsUseCase(
  new MysqlUserRepository()
);

export const updateUserCredentialsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, username, email, password } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Validate that at least one field is provided
    if (!username && !email && !password) {
      res.status(400).json({ 
        message: "At least one field (username, email, or password) must be provided" 
      });
      return;
    }

    await adminUpdateUserCredentialsUseCase.execute({
      userId,
      username,
      email,
      password,
      headers: req.headers as Record<string, string>,
    });

    res.status(200).json({
      success: true,
      message: "User credentials updated successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating user credentials:", error);

    switch (errorMessage) {
      case "MISSING_USER_ID":
        res.status(400).json({ message: "User ID is required" });
        break;
      case "NO_FIELDS_TO_UPDATE":
        res.status(400).json({ message: "No fields provided to update" });
        break;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not found" });
        break;
      case "USERNAME_TAKEN":
        res.status(409).json({ message: "Username is already taken" });
        break;
      case "EMAIL_TAKEN":
        res.status(409).json({ message: "Email is already taken" });
        break;
      case "ACCOUNT_NOT_FOUND":
        res.status(404).json({ 
          message: "User account not found. Cannot update password." 
        });
        break;
      default:
        res.status(500).json({ message: "Failed to update user credentials" });
    }
  }
};
