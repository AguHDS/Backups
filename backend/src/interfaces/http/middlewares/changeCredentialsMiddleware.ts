import { Request, Response, NextFunction } from "express";
import promisePool from "@/db/database.js";

/**
 * Validates username, email and ensures current password for changes.
 */
export const changeCredentialsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const cleanedData: any = {};
    const errors: { field: string; message: string }[] = [];

    if (!userId) {
      errors.push({
        field: "general",
        message: "User not authenticated",
      });
    }

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

        if (userId) {
          try {
            const [rows] = await promisePool.execute(
              "SELECT last_username_change FROM users WHERE id = ?",
              [userId]
            );

            const userData = rows as any[];
            if (userData.length > 0 && userData[0].last_username_change) {
              const lastChange = new Date(userData[0].last_username_change);
              const now = new Date();
              const daysSinceLastChange = Math.floor(
                (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
              );

              if (daysSinceLastChange < 15) {
                const daysRemaining = 15 - daysSinceLastChange;
                errors.push({
                  field: "username",
                  message: `You can only change your username once every 15 days. Please wait ${daysRemaining} more day(s).`,
                });
              }
            }
          } catch (dbError) {
            console.error(
              "❌ Database error checking last username change:",
              dbError
            );
          }
        }
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
