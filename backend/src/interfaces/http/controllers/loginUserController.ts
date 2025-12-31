import { Request, Response } from "express";
import { LoginUserWithBetterAuthUseCase } from "@/application/useCases/LoginUserWithBetterAuthUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

// Dependency injection
const loginUserUseCase = new LoginUserWithBetterAuthUseCase(
  new MysqlUserRepository()
);

/** Login user with BetterAuth */
export const loginUserController = async (req: Request, res: Response) => {
  if (!req.userAndPassword) {
    res.status(400).json({ message: "User and password are required" });
    return;
  }

  const { user, password } = req.userAndPassword;

  try {
    const result = await loginUserUseCase.execute(user, password);

    res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "USER_NOT_FOUND":
          console.error("User not found");
          res.status(401).json({ message: "Credentials don't exist" });
          return;
        case "INVALID_CREDENTIALS":
          console.error("Invalid credentials");
          res.status(401).json({ message: "Invalid credentials" });
          return;
      }
    }

    console.error("Login failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
