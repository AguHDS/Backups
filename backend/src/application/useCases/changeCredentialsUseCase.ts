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
      const user = await this.userRepo.findById(userId, connection);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
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

          const loginResult = await auth.api.signInEmail({
            body: {
              email: user.email,
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

      if (username && username !== user.name) {
        await this.userRepo.updateUserCredentials(userId, username, undefined);
      }

      if (email && email !== user.email) {
        await this.userRepo.updateUserCredentials(userId, undefined, email);
      }

      if (newPassword && headers) {
        const betterAuthHeaders = new Headers();
        Object.entries(headers).forEach(([key, value]) => {
          if (value && typeof value === "string") {
            betterAuthHeaders.set(key, value);
          }
        });

        await auth.api.setUserPassword({
          body: {
            userId: userId,
            newPassword: newPassword,
          },
          headers: betterAuthHeaders,
        });
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
        ].includes(error.message)
      ) {
        throw error;
      }

      if (
        error &&
        typeof error === "object" &&
        "body" in error &&
        "statusCode" in error
      ) {
        const betterAuthError = error as { body: any; statusCode: number };

        if (
          betterAuthError.statusCode === 401 ||
          betterAuthError.statusCode === 403
        ) {
          throw new Error("INVALID_CURRENT_PASSWORD");
        }

        throw new Error("BETTERAUTH_ERROR");
      }

      throw error;
    } finally {
      connection.release();
    }
  }
}
