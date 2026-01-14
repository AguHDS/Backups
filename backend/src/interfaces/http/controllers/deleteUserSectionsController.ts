import { Request, Response } from "express";
import { AdminDeleteUserSectionsUseCase } from "@/application/useCases/AdminDeleteUserSectionsUseCase.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { MysqlFileRepository } from "@/infraestructure/adapters/repositories/MysqlFileRepository.js";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

const adminDeleteUserSectionsUseCase = new AdminDeleteUserSectionsUseCase(
  new MysqlProfileRepository(),
  new MysqlFileRepository(),
  new MysqlUserRepository(),
  new CloudinaryRemover(),
  new MysqlStorageUsageRepository()
);

export const deleteUserSectionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, sectionIds } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    if (
      !Array.isArray(sectionIds) ||
      sectionIds.length === 0 ||
      sectionIds.some((id) => typeof id !== "number" || id <= 0)
    ) {
      res.status(400).json({ message: "Invalid or empty sectionIds array" });
      return;
    }

    const deletedCount = await adminDeleteUserSectionsUseCase.execute(
      userId,
      sectionIds
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCount} section(s)`,
      deletedCount,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting user sections:", error);

    switch (errorMessage) {
      case "MISSING_USER_ID":
        res.status(400).json({ message: "User ID is required" });
        break;
      case "MISSING_SECTION_IDS":
        res.status(400).json({ message: "Section IDs are required" });
        break;
      case "USER_NOT_FOUND":
        res.status(404).json({ message: "User not found" });
        break;
      default:
        res.status(500).json({ message: "Failed to delete user sections" });
    }
  }
};
