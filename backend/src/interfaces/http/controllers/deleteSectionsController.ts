import { DeleteSectionsUseCase } from "../../../application/useCases/DeleteSectionsUseCase.js";
import { MysqlProfileRepository } from "../../../infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { CloudinaryRemover } from "../../../infraestructure/adapters/externalServices/CloudinaryRemover.js";

const deleteSectionsUseCase = new DeleteSectionsUseCase(
  new MysqlProfileRepository(),
  new CloudinaryRemover()
);

export const deleteSectionsController = async (req, res) => {
  try {
    const { username } = req.params;
    const { sectionIds } = req.body;

    if (!Array.isArray(sectionIds) || sectionIds.some((id) => typeof id !== "number" || id <= 0)) {
      res.status(400).json({ message: "Invalid sectionIds array" });
      return;
    }

    //userId from refresh token
    const { id } = req.baseUserData;

    if (!id) {
      res.status(401).json({ message: "Unauthorized: missing user ID" });
      return;
    }

    await deleteSectionsUseCase.execute(sectionIds, id, username);

    res.status(200).json({ message: "Sections deleted successfully" });
  } catch (error) {
    if (error instanceof Error) console.error("Error deleting sections:", error);

    switch (error.message) {
      case "NO_SECTIONS_ID":
        res.status(400).json({ message: "Sections ID missing." });
        return;
    }

    res.status(500).json({ message: "Failed to delete sections" });
  }
};
