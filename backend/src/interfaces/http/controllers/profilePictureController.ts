import { Request, Response } from "express";
import { CloudinaryUploader } from "@/infraestructure/adapters/externalServices/CloudinaryUploader.js";
import { UpdateProfilePictureUseCase } from "@/application/useCases/ProfilePictureUseCase.js";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { BaseUserData } from "@/shared/dtos/userDto.js";

export const profilePictureController = async (req: Request, res: Response) => {
  try {
    const baseUserData = req.baseUserData as BaseUserData | undefined;
    if (!baseUserData) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = baseUserData;
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "No image provided",
      });
      return;
    }

    const uploader = new CloudinaryUploader(id);
    const profileRepository = new MysqlProfileRepository();
    const storageUsageRepo = new MysqlStorageUsageRepository();

    const updateProfilePictureUseCase = new UpdateProfilePictureUseCase(
      uploader,
      profileRepository,
      storageUsageRepo
    );

    const result = await updateProfilePictureUseCase.execute(
      file,
      id
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);

    if (
      error instanceof Error &&
      (error as Error & { details?: { code: string } }).details?.code === "STORAGE_QUOTA_EXCEEDED"
    ) {
      const details = (error as Error & { details: { code: string; currentUsage: number; maxStorage: number; requested: number } }).details;

      res.status(409).json({
        success: false,
        code: "STORAGE_QUOTA_EXCEEDED",
        message: error.message,
        details: details,
      });
      return;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Invalid file type")) {
      res.status(400).json({
        success: false,
        message: errorMessage,
        code: "INVALID_FILE_TYPE",
      });
      return;
    }

    if (errorMessage.includes("No file provided")) {
      res.status(400).json({
        success: false,
        message: errorMessage,
        code: "NO_FILE_PROVIDED",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      code: "INTERNAL_SERVER_ERROR",
    });
    return;
  }
};
