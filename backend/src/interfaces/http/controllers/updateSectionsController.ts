import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { UpdateSectionsUseCase } from "@/application/useCases/UpdateSectionsUseCase.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";

const updateSectionsUseCase = new UpdateSectionsUseCase(
  new MysqlProfileRepository()
);

interface SectionsDataToUpdate {
  sections: {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
  }[];
}

/** Updates sections for specific user */
export const updateSectionsController = async (
  req: Request,
  res: Response
) => {
  const cleanData: SectionsDataToUpdate = matchedData(req);
  if (!req.baseUserData) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id, role } = req.baseUserData;

  try {
    const { newlyCreatedSections } = await updateSectionsUseCase.execute(
      cleanData.sections,
      id,
      role
    );

    res.status(200).json({
      message: "Sections updated successfully!",
      newlyCreatedSections,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (errorMessage === "LIMIT_EXCEEDED_FOR_USER_ROLE") {
      console.error("Users with role 'user' only can have one section");
      res.status(400).json({ message: "User role only can have one section" });
      return;
    }

    if (errorMessage === "INVALID_SECTIONS") {
      console.error("Invalid sections provided");
      res.status(400).json({ message: "Invalid sections" });
      return;
    }

    console.error("Unexpected error updating sections:", error);
    res.status(500).json({ message: "Unexpected error updating sections" });
  }
};
