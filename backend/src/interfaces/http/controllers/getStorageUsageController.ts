import { Request, Response } from "express";
import { GetStorageUsageUseCase } from "../../../application/useCases/GetStorageUsageUseCase.js";
import { MysqlUserRepository } from "../../../infraestructure/adapters/repositories/MysqlUserRepository.js";
import { MysqlStorageUsageRepository } from "../../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

const getStorageByUsernameUseCase = new GetStorageUsageUseCase(
  new MysqlUserRepository(),
  new MysqlStorageUsageRepository()
);

/** Get all storage related stuff for user profiles */
export const getStorageUsageController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const result = await getStorageByUsernameUseCase.execute(username);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.error("Error getting storage by username:", err);
    res.status(500).json({ message: "Failed to get storage usage" });
  }
};
