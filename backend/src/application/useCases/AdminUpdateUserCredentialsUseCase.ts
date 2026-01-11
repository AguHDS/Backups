import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { auth } from "@/lib/auth.js";
import promisePool from "@/db/database.js";

export interface UpdateCredentialsData {
  userId: string;
  username?: string;
  email?: string;
  password?: string;
  headers?: Headers | Record<string, string>;
}

/**
 * Updates user credentials (username, email, password)
 * Validates that new values are not already taken by other users
 */
export class AdminUpdateUserCredentialsUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: UpdateCredentialsData): Promise<void> {
    const { userId, username, email, password } = data;

    if (!userId) {
      throw new Error("MISSING_USER_ID");
    }

    if (!username && !email && !password) {
      throw new Error("NO_FIELDS_TO_UPDATE");
    }

    // Verify user exists
    const connection = await promisePool.getConnection();
    try {
      const user = await this.userRepo.findById(userId, connection);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      // Check if new username or email are already taken by OTHER users
      if (username || email) {
        const checkUsername = username || user.name;
        const checkEmail = email || user.email;

        const checkResult = await this.userRepo.isNameOrEmailTaken(
          checkUsername,
          checkEmail
        );

        if (checkResult.isTaken) {
          // Check if taken by current user (which is OK) or another user
          if (checkResult.userTaken && username && checkResult.userTaken !== user.name) {
            throw new Error("USERNAME_TAKEN");
          }
          if (checkResult.emailTaken && email && checkResult.emailTaken !== user.email) {
            throw new Error("EMAIL_TAKEN");
          }
        }
      }

      // Update username and/or email
      if (username || email) {
        await this.userRepo.updateUserCredentials(userId, username, email);
      }

      // Update password using BetterAuth API (handles hashing correctly)
      if (password) {
        if (!data.headers) {
          throw new Error("MISSING_HEADERS_FOR_AUTH");
        }
        
        await auth.api.setUserPassword({
          body: {
            userId: String(userId),
            newPassword: password,
          },
          headers: data.headers as Headers,
        });
      }
    } finally {
      connection.release();
    }
  }
}
