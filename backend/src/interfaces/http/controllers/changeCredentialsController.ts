import { Request, Response } from "express";
import { ChangeCredentialsUseCase } from "@/application/useCases/changeCredentialsUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const changeCredentialsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { username, email, currentPassword, newPassword } = req.body;

    // Preparar headers para BetterAuth
    const headers: Record<string, string> = {};

    // Solo tomar headers necesarios
    const importantHeaders = [
      "authorization",
      "cookie",
      "user-agent",
      "content-type",
    ];
    importantHeaders.forEach((key) => {
      const value = req.headers[key];
      if (value && typeof value === "string") {
        headers[key] = value;
      } else if (value && Array.isArray(value) && value.length > 0) {
        headers[key] = value[0];
      }
    });


    const userRepository = new MysqlUserRepository();
    const changeCredentialsUseCase = new ChangeCredentialsUseCase(
      userRepository
    );

    await changeCredentialsUseCase.execute({
      userId,
      username,
      email,
      currentPassword,
      newPassword,
      headers,
    });


    res.status(200).json({
      success: true,
      message: "Credentials updated successfully",
      updatedFields: {
        ...(username && { username }),
        ...(email && { email }),
        ...(newPassword && { password: true }),
      },
    });
  } catch (error) {
    // Mapeo de errores NUESTROS - ACTUALIZADO
    const ourErrorMap: Record<string, { status: number; message: string }> = {
      USER_NOT_FOUND: { status: 404, message: "User not found" },
      NO_FIELDS_TO_UPDATE: {
        status: 400,
        message: "No fields to update. Please change at least one field.",
      },
      INVALID_CURRENT_PASSWORD: {
        status: 401,
        message: "Current password is incorrect",
      },
      USERNAME_TAKEN: {
        status: 409,
        message: "Username is already taken",
      },
      EMAIL_TAKEN: {
        status: 409,
        message: "Email is already in use",
      },
      MISSING_CURRENT_PASSWORD: {
        status: 400,
        message: "Current password is required to confirm changes",
      },
      BETTERAUTH_ERROR: {
        status: 500,
        message: "Authentication service error",
      },
      INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "Internal server error",
      },
    };

    // 1. Si es error NUESTRO, usar nuestro mapeo
    if (error instanceof Error && error.message in ourErrorMap) {
      const { status, message } = ourErrorMap[error.message];

      res.status(status).json({
        success: false,
        error: message,
      });
      return;
    }

    // 2. Si es error de BetterAuth (con body y statusCode), propagarlo
    if (
      error &&
      typeof error === "object" &&
      "body" in error &&
      "statusCode" in error
    ) {
      const betterAuthError = error as {
        body: {
          message?: string;
          error?: string;
          code?: string;
        };
        statusCode: number;
      };


      // Extraer el mensaje de error de BetterAuth
      const betterAuthMessage =
        betterAuthError.body?.message ||
        betterAuthError.body?.error ||
        "Authentication service error";

      // Si es error de credenciales inválidas (contraseña incorrecta)
      if (
        betterAuthError.statusCode === 401 ||
        betterAuthError.body?.code === "INVALID_CREDENTIALS" ||
        betterAuthMessage.toLowerCase().includes("password") ||
        betterAuthMessage.toLowerCase().includes("credentials")
      ) {
        res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      } else {
        res.status(betterAuthError.statusCode).json({
          success: false,
          error: betterAuthMessage,
          ...(betterAuthError.body?.code && {
            code: betterAuthError.body.code,
          }),
        });
      }
      return;
    }

    // 3. Si es un error genérico
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
      return;
    }

    // 4. Cualquier otro error
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
