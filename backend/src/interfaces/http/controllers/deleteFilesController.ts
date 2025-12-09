import { Request, Response } from "express";
import { SectionFilesPayload } from "../../../shared/dtos/SectionAndFiles.js";
import { DeleteFilesFromSectionsUseCase } from "../../../application/useCases/DeleteFilesFromSectionsUseCase.js";
import { MysqlFileRepository, MysqlStorageUsageRepository } from "../../../infraestructure/adapters/repositories/index.js";
import { CloudinaryRemover } from "../../../infraestructure/adapters/externalServices/CloudinaryRemover.js";

const useCase = new DeleteFilesFromSectionsUseCase(
  new MysqlFileRepository(),
  new CloudinaryRemover(),
  new MysqlStorageUsageRepository()
);

/**
 * Handle deletion of selected files from sections
 */
export const deleteFilesController = async (req: Request, res: Response) => {
  const payload: SectionFilesPayload[] = req.body;
  if(!req.baseUserData) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { id } = req.baseUserData;

  try {
    await useCase.execute(id, payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting files:", err);
    res.status(500).json({ error: "Failed to delete files" });
  }
};
