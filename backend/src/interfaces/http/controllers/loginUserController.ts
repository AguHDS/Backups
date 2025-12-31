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
    // Convert Express headers to Web API Headers format
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const result = await loginUserUseCase.execute(user, password, headers);

    // Set cookies from BetterAuth response
    if (result.headers) {
      const setCookieHeaders = result.headers.getSetCookie();
      setCookieHeaders.forEach((cookie) => {
        res.append('Set-Cookie', cookie);
      });
    }

    res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    // Check if it's a BetterAuth API error with specific message
    if (error && typeof error === "object" && "body" in error) {
      const betterAuthError = error as { body?: { message?: string; code?: string }; statusCode?: number };
      
      if (betterAuthError.body?.message) {
        const statusCode = betterAuthError.statusCode || 401;
        console.error(`Login failed: ${betterAuthError.body.message}`);
        res.status(statusCode).json({ message: betterAuthError.body.message });
        return;
      }
    }

    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        console.error("User not found");
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
    }

    console.error("Login failed:", error);
    res.status(401).json({ message: "Invalid email or password" });
  }
};
