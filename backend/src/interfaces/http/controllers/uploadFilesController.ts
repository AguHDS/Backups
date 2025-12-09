import { Request, Response } from "express";
import { CloudinaryUploader } from "../../../infraestructure/adapters/externalServices/CloudinaryUploader.js";
import { UploadFilesUseCase } from "../../../application/useCases/UploadFilesUseCase.js";
import { MysqlFileRepository } from "../../../infraestructure/adapters/repositories/MysqlFileRepository.js";
import { MysqlStorageUsageRepository } from "../../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { BaseUserData } from "../../../shared/dtos/userDto.js";

/** Upload files to Cloudinary and database */
export const uploadFilesController = async (req: Request, res: Response) => {
  try {
    const baseUserData = req.baseUserData as BaseUserData | undefined;
    if (!baseUserData) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const { name, id } = baseUserData;
    const sectionId = req.query.sectionId as string;
    const sectionTitle = req.query.sectionTitle as string;
    const files = req.files as Express.Multer.File[];

    const uploader = new CloudinaryUploader(name, id);
    const fileRepo = new MysqlFileRepository();
    const storageUsageRepo = new MysqlStorageUsageRepository();

    const uploadUseCase = new UploadFilesUseCase(
      uploader,
      fileRepo,
      storageUsageRepo
    );

    const results = await uploadUseCase.execute(
      files,
      sectionId,
      sectionTitle,
      id
    );

    res.status(200).json({ files: results });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
