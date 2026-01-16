import { Request, Response, NextFunction } from "express";
import { auth } from "@/lib/auth.js";
import { UpdateUserActivityUseCase } from "@/application/useCases/UserActivityUseCase.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";

/**
 * Tracking for user activity (non-blocking)
 * Set online/offline for users who do not interact with our APIs in less than 3 minutes
 */
export const updateUserActivity = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const session = await auth.api.getSession({ headers });

      if (!session || !session.user) {
        next();
        return;
      }

      const { id } = session.user;
      const userId = String(id);

      if (!userId) {
        next();
        return;
      }

      const userRepo = new MysqlUserRepository();
      const updateActivityUseCase = new UpdateUserActivityUseCase(userRepo);

      updateActivityUseCase.execute(userId).catch((error) => {
        console.error("Background activity update failed:", error);
      });

      next();
    } catch (error) {
      console.error("Error in activity middleware:", error);
      next();
    }
  };
};
