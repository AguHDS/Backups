import { Request, Response } from "express";
import { StorageManagerUseCase } from "../../../application/useCases/StorageManagerUseCase.js";
import { MysqlStorageUsageRepository } from "../../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

const getStorageUseCase = new StorageManagerUseCase(
  new MysqlStorageUsageRepository()
);

/** Handle amounth of storage for authenticated user */
export const storageManagerController = async (req: Request, res: Response) => {
  if (!req.refreshTokenId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { id } = req.refreshTokenId;
  try {
    const result = await getStorageUseCase.execute(id);
    res.json(result);
  } catch (err) {
    console.error("Error getting storage usage:", err);
    res.status(500).json({ error: "Failed to get storage usage" });
  }
};
