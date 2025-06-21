import { Request, Response } from "express";
import { CloudinaryUploader } from "../../../infraestructure/adapters/externalServices/CloudinaryUploader.js";
import { UploadFilesUseCase } from "../../../application/useCases/UploadFilesUseCase.js";
import { MysqlFileRepository } from "../../../infraestructure/adapters/repositories/MysqlFileRepository.js";

/** Upload files to Cloudinary */
export const uploadFilesController = async (req: Request, res: Response) => {
  try {
    const { name, id } = req.baseUserData;
    const sectionId = req.query.sectionId as string;
    const sectionTitle = req.query.sectionTitle as string;

    const uploader = new CloudinaryUploader(name, id);
    const fileRepo = new MysqlFileRepository();
    const uploadUseCase = new UploadFilesUseCase(uploader, fileRepo);

    const files = req.files as Express.Multer.File[];
    const results = await uploadUseCase.execute(files, sectionId, sectionTitle);

    console.log("Files uploaded to Cloudinary successfully!");
    res.status(200).json({ files: results });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
