import { SectionFilesPayload } from "../../../shared/dtos/SectionAndFiles.js";
import { DeleteFilesFromSectionsUseCase } from "../../../application/useCases/DeleteFilesFromSectionsUseCase.js";
import { MysqlFileRepository } from "../../../infraestructure/adapters/repositories/MysqlFileRepository.js";
import { CloudinaryRemover } from "../../../infraestructure/adapters/externalServices/CloudinaryRemover.js";

const useCase = new DeleteFilesFromSectionsUseCase(
  new MysqlFileRepository(),
  new CloudinaryRemover()
);

/**
 * Handle deletion of selected files from sections
 */
export const deleteFilesController = async (req, res) => {
  const payload: SectionFilesPayload[] = req.body;

  try {
    await useCase.execute(payload);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting files:", err);
    return res.status(500).json({ error: "Failed to delete files" });
  }
};
