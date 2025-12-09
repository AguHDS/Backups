import { Request, Response } from "express";
import { DeleteSectionsUseCase } from "../../../application/useCases/DeleteSectionsUseCase.js";
import { MysqlProfileRepository } from "../../../infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { CloudinaryRemover } from "../../../infraestructure/adapters/externalServices/CloudinaryRemover.js";

const deleteSectionsUseCase = new DeleteSectionsUseCase(
  new MysqlProfileRepository(),
  new CloudinaryRemover()
);

export const deleteSectionsController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { sectionIds } = req.body;

    if (
      !Array.isArray(sectionIds) ||
      sectionIds.some((id) => typeof id !== "number" || id <= 0)
    ) {
      res.status(400).json({ message: "Invalid sectionIds array" });
      return;
    }

    if (!req.baseUserData) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // userId from refresh token
    const { id } = req.baseUserData;

    if (!id) {
      res.status(401).json({ message: "Unauthorized: missing user ID" });
      return;
    }

    await deleteSectionsUseCase.execute(sectionIds, id, username);

    res.status(200).json({ message: "Sections deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error deleting sections:", error);

    switch (errorMessage) {
      case "NO_SECTIONS_ID":
        res.status(400).json({ message: "Sections ID missing." });
        return;
      default:
        res.status(500).json({ message: "Failed to delete sections" });
        return;
    }
  }
};
