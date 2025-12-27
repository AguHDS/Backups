import { Request, Response } from "express";
import { RegisterUserUseCase } from "@/application/useCases/RegisterUserUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { encrypt } from "@/infraestructure/auth/handlePassword.js";

const registerUserUseCase = new RegisterUserUseCase(
  new MysqlUserRepository(),
  new MysqlStorageUsageRepository(),
  encrypt
);

/** Register new user */
export const registerController = async (req: Request, res: Response) => {
  if(!req.userSession) {
    res.status(400).json({ message: "Invalid request: missing user session data" });
    return;
  }
  const { user, email, password } = req.userSession;

  console.log(`Registering user: ${user} with email: ${email} and password: ${password}`);
  try {
    await registerUserUseCase.execute(user, email, password);
    console.log(`User: ${user} and email: ${email} saved successfully`);

    res.status(201).json({ message: "Registration completed" });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "USERNAME_TAKEN":
          console.error(`User ${user} already exists`);
          res.status(409).json({ message: "Username already taken" });
          return;
        case "EMAIL_TAKEN":
          console.error(`Email ${email} already exists`);
          res.status(409).json({ message: "Email already taken" });
          return;
        case "USERNAME_AND_EMAIL_TAKEN":
          console.error(`User ${user} and ${email} already exist`);
          res.status(409).json({ message: "Username and email are already taken" });
          return;
      }
    }
    console.error("Unexpected error", error);
    
    res.status(500).json({ message: "Error trying to sign up" });
  }
};