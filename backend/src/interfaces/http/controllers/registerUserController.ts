import { Request, Response } from "express";
import { RegisterUserWithBetterAuthUseCase } from "@/application/useCases/RegisterUserWithBetterAuthUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";

// Dependency injection
const registerUserUseCase = new RegisterUserWithBetterAuthUseCase(
  new MysqlUserRepository(),
  new MysqlStorageUsageRepository(),
  new MysqlProfileRepository()
);

/** Register new user with BetterAuth */
export const registerUserController = async (req: Request, res: Response) => {
  if (!req.userSession) {
    res.status(400).json({ message: "Invalid request: missing user session data" });
    return;
  }

  const { user, email, password } = req.userSession;

  console.log(`Registering user: ${user} with email: ${email}`);

  try {
    // Register user without auto-login (user must explicitly login after registration)
    const result = await registerUserUseCase.execute(user, email, password);

    console.log(`User: ${user} registered successfully`);

    res.status(201).json({
      message: "Registration completed",
      user: result.user,
    });
  } catch (error) {
    // Check if it's a BetterAuth API error with specific message
    if (error && typeof error === "object" && "body" in error) {
      const betterAuthError = error as { body?: { message?: string; code?: string }; statusCode?: number };
      
      if (betterAuthError.body?.message) {
        const statusCode = betterAuthError.statusCode || 400;
        console.error(`BetterAuth error: ${betterAuthError.body.message}`);
        res.status(statusCode).json({ message: betterAuthError.body.message });
        return;
      }
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "USERNAME_TAKEN":
          console.error(`Username ${user} already exists`);
          res.status(409).json({ message: "Username already taken" });
          return;
        case "EMAIL_TAKEN":
          console.error(`Email ${email} already exists`);
          res.status(409).json({ message: "Email already taken" });
          return;
        case "USERNAME_AND_EMAIL_TAKEN":
          console.error(`Username ${user} and email ${email} already exist`);
          res.status(409).json({ message: "Username and email are already taken" });
          return;
        case "REGISTRATION_FAILED":
          console.error("Failed to create user with BetterAuth");
          res.status(500).json({ message: "Failed to create user" });
          return;
      }
    }

    console.error("Unexpected error during registration:", error);
    res.status(500).json({ message: "Error trying to sign up" });
  }
};
