import { Request, Response, NextFunction } from "express";

/**
 * Validates username, email and ensures current password for changes.
 */
export const changeCredentialsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const cleanedData: any = {};
    const errors: { field: string; message: string }[] = [];

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

    if (email !== undefined && email !== null && email !== "") {
      const trimmedEmail = email.trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
        errors.push({
          field: "email",
          message: "Please enter a valid email address",
        });
      } else {
        cleanedData.email = trimmedEmail;
      }
    }

    if (
      newPassword !== undefined &&
      newPassword !== null &&
      newPassword !== ""
    ) {
      cleanedData.newPassword = newPassword.trim();
    }

    const hasValidField =
      cleanedData.username || cleanedData.email || cleanedData.newPassword;

    if (!hasValidField) {
      errors.push({
        field: "general",
        message:
          "At least one field (username, email, or newPassword) must be provided",
      });
    }

    if (hasValidField) {
      if (!currentPassword || currentPassword.trim() === "") {
        errors.push({
          field: "currentPassword",
          message: "Current password is required to confirm changes",
        });
      } else {
        cleanedData.currentPassword = currentPassword.trim();
      }
    }

    if (errors.length > 0) {
      const firstError = errors[0];
      res.status(400).json({
        success: false,
        error: firstError.message,
        field: firstError.field === "general" ? undefined : firstError.field,
      });
      return;
    }

    req.body = cleanedData;
    next();
  } catch (error) {
    console.error("❌ Validation middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during validation",
    });
  }
};
