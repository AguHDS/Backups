import { Request, Response } from "express";
import { GetUserSectionsUseCase } from "@/application/useCases/GetUserSectionsUseCase.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";

const getUserSectionsUseCase = new GetUserSectionsUseCase(
  new MysqlProfileRepository()
);

export const getUserSectionsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const sections = await getUserSectionsUseCase.execute(userId);

    res.status(200).json({
      success: true,
      sections: sections.map((section) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        isPublic: section.isPublic,
      })),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error getting user sections:", error);

    switch (errorMessage) {
      case "MISSING_USER_ID":
        res.status(400).json({ message: "User ID is required" });
        break;
      default:
        res.status(500).json({ message: "Failed to retrieve user sections" });
    }
  }
};
