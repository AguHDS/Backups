import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { auth } from "@/lib/auth.js";
import promisePool from "@/db/database.js";

export interface ChangeCredentialsRequest {
  userId: string;
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  headers?: Headers | Record<string, string>;
}

/**
 * Use case to update user credentials.
 * Coordinates current password verification and update in BetterAuth.
 */
export class ChangeCredentialsUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: ChangeCredentialsRequest): Promise<void> {
    const { userId, username, email, currentPassword, newPassword, headers } =
      data;

    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    if (!username && !email && !newPassword) {
      throw new Error("NO_FIELDS_TO_UPDATE");
    }

    if ((username || email || newPassword) && !currentPassword) {
      throw new Error("MISSING_CURRENT_PASSWORD");
    }

    const connection = await promisePool.getConnection();

    try {
      await connection.beginTransaction();

      const user = await this.userRepo.findById(userId, connection);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (username && username !== user.name) {
        const [rows] = await connection.execute(
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
            throw new Error("USERNAME_CHANGE_TOO_SOON");
          }
        }
      }

      if (username || email) {
        const checkUsername = username || user.name;
        const checkEmail = email || user.email;

        const checkResult = await this.userRepo.isNameOrEmailTaken(
          checkUsername,
          checkEmail
        );

        if (checkResult.isTaken) {
          if (
            checkResult.userTaken &&
            username &&
            checkResult.userTaken !== user.name
          ) {
            throw new Error("USERNAME_TAKEN");
          }
          if (
            checkResult.emailTaken &&
            email &&
            checkResult.emailTaken !== user.email
          ) {
            throw new Error("EMAIL_TAKEN");
          }
        }
      }

      if ((username || email || newPassword) && currentPassword && headers) {
        try {
          const betterAuthHeaders = new Headers();
          Object.entries(headers).forEach(([key, value]) => {
            if (value && typeof value === "string") {
              betterAuthHeaders.set(key, value);
            }
          });

          const emailToUse = user.email?.trim();

          if (!emailToUse) {
            throw new Error("INVALID_CURRENT_PASSWORD");
          }

          const loginResult = await auth.api.signInEmail({
            body: {
              email: emailToUse,
              password: currentPassword,
            },
            headers: betterAuthHeaders,
          });

          if (!loginResult || !loginResult.user) {
            throw new Error("INVALID_CURRENT_PASSWORD");
          }

          if (loginResult.user.id !== userId) {
            throw new Error("INVALID_CURRENT_PASSWORD");
          }
        } catch (error) {
          if (error && typeof error === "object" && "body" in error) {
            const errorBody = (error as any).body;

            if (
              errorBody?.code === "INVALID_CREDENTIALS" ||
              (errorBody?.message &&
                (errorBody.message.toLowerCase().includes("password") ||
                  errorBody.message.toLowerCase().includes("credentials") ||
                  errorBody.message.toLowerCase().includes("invalid")))
            ) {
              throw new Error("INVALID_CURRENT_PASSWORD");
            }
          }

          throw new Error("INVALID_CURRENT_PASSWORD");
        }
      }

      let usernameChanged = false;
      let emailChanged = false;
      let passwordChanged = false;
      let errorDuringBetterAuth = null;

      try {
        if (newPassword && headers) {
          const betterAuthHeaders = new Headers();
          Object.entries(headers).forEach(([key, value]) => {
            if (value && typeof value === "string") {
              betterAuthHeaders.set(key, value);
            }
          });

          await auth.api.changePassword({
            body: {
              currentPassword: currentPassword!,
              newPassword: newPassword,
            },
            headers: betterAuthHeaders,
          });
          passwordChanged = true;
        }

        if (username && username !== user.name) {
          await this.userRepo.updateUserCredentials(
            userId,
            username,
            undefined,
            connection
          );
          usernameChanged = true;
        }

        if (email && email !== user.email) {
          await this.userRepo.updateUserCredentials(
            userId,
            undefined,
            email,
            connection
          );
          emailChanged = true;
        }

        await connection.commit();
      } catch (error) {
        errorDuringBetterAuth = error;

        if (usernameChanged || emailChanged) {
          try {
            if (usernameChanged) {
              await this.userRepo.updateUserCredentials(
                userId,
                user.name,
                undefined,
                connection
              );
            }
            if (emailChanged) {
              await this.userRepo.updateUserCredentials(
                userId,
                undefined,
                user.email,
                connection
              );
            }
          } catch (rollbackError) {
            console.error("❌ Error during rollback:", rollbackError);
          }
        }

        await connection.rollback();

        throw error;
      }
    } catch (error) {
      if (
        error instanceof Error &&
        [
          "USER_NOT_FOUND",
          "NO_FIELDS_TO_UPDATE",
          "MISSING_CURRENT_PASSWORD",
          "INVALID_CURRENT_PASSWORD",
          "USERNAME_TAKEN",
          "EMAIL_TAKEN",
          "USERNAME_CHANGE_TOO_SOON",
        ].includes(error.message)
      ) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error(
            "❌ Error during rollback on validation error:",
            rollbackError
          );
        }
        throw error;
      }

      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "❌ Error during rollback on general error:",
          rollbackError
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  }
}