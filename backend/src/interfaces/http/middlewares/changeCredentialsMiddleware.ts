// backend\src\interfaces\http\middlewares\changeCredentialsMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const changeCredentialsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    // Limpiar campos
    const cleanedData: any = {};
    const errors: { field: string; message: string }[] = [];

    // 1. Validar username (si se proporciona) - Solo validaciones básicas
    if (username !== undefined && username !== null && username !== "") {
      const trimmedUsername = username.trim();

      if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
        errors.push({
          field: "username",
          message: "Username must be between 3 and 30 characters",
        });
      } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        errors.push({
          field: "username",
          message: "Username can only contain letters, numbers and underscores",
        });
      } else {
        cleanedData.username = trimmedUsername;
      }
    }

    // 2. Validar formato de email (si se proporciona) - Solo formato básico
    if (email !== undefined && email !== null && email !== "") {
      const trimmedEmail = email.trim().toLowerCase();

      // Solo validación básica de formato - BetterAuth hará validaciones más completas
      if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
        errors.push({
          field: "email",
          message: "Invalid email format",
        });
      } else {
        cleanedData.email = trimmedEmail;
      }
    }

    // 3. Validar nueva contraseña (si se proporciona) - Solo longitud mínima
    if (
      newPassword !== undefined &&
      newPassword !== null &&
      newPassword !== ""
    ) {
      const trimmedNewPassword = newPassword.trim();

      // Solo validar longitud mínima - BetterAuth manejará la complejidad
      if (trimmedNewPassword.length < 6) {
        errors.push({
          field: "newPassword",
          message: "Password must be at least 6 characters",
        });
      } else {
        cleanedData.newPassword = trimmedNewPassword;
      }
    }

    // 4. Verificar que al menos un campo esté presente
    const hasValidField =
      cleanedData.username || cleanedData.email || cleanedData.newPassword;

    if (!hasValidField) {
      errors.push({
        field: "general",
        message:
          "At least one field (username, email, or newPassword) must be provided",
      });
    }

    // 5. SIEMPRE se requiere currentPassword cuando hay cambios
    if (hasValidField) {
      if (!currentPassword || currentPassword.trim() === "") {
        errors.push({
          field: "currentPassword",
          message: "Current password is required to confirm changes",
        });
      } else {
        const trimmedCurrentPassword = currentPassword.trim();
        cleanedData.currentPassword = trimmedCurrentPassword;

        // Validar que currentPassword tenga al menos 1 carácter
        if (cleanedData.currentPassword.length < 1) {
          errors.push({
            field: "currentPassword",
            message: "Please enter your current password",
          });
        }
      }
    }

    // Si hay errores de validación básica
    if (errors.length > 0) {
      const firstError = errors[0];
      res.status(400).json({
        success: false,
        error: firstError.message,
        field: firstError.field === "general" ? undefined : firstError.field,
      });
      return;
    }

    // Agregar los datos validados al request
    req.body = cleanedData;

    next();
  } catch (error) {
    console.error("❌ Validation middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during validation",
    });
    return;
  }
};
