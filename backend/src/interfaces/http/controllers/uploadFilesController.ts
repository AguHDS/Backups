import { Request, Response } from "express";
import { CloudinaryUploader } from "@/infraestructure/adapters/externalServices/CloudinaryUploader.js";
import { UploadFilesUseCase } from "@/application/useCases/UploadFilesUseCase.js";
import { MysqlFileRepository } from "@/infraestructure/adapters/repositories/MysqlFileRepository.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import { BaseUserData } from "@/shared/dtos/userDto.js";

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

    // Revalue file types (defense in depth)
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files provided or all files were invalid",
        code: "NO_VALID_FILES",
      });
      return;
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      "image/x-icon",
    ];

    const invalidFiles = files.filter(
      (file) => !allowedMimeTypes.includes(file.mimetype)
    );
    if (invalidFiles.length > 0) {
      res.status(400).json({
        success: false,
        message: "Invalid file type detected. Only image files are allowed",
        code: "INVALID_FILE_TYPE",
        details: {
          invalidFiles: invalidFiles.map((f) => ({
            name: f.originalname,
            type: f.mimetype,
          })),
        },
      });
      return;
    }

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

    res.status(200).json({
      success: true,
      message: `Uploaded ${results.length} files`,
      files: results.map((file) => ({
        publicId: file.publicId,
        sectionId: file.sectionId.toString(),
        sizeInBytes: file.sizeInBytes,
        userId: file.userId,
      })),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { details?: { code: string } }).details?.code ===
        "STORAGE_QUOTA_EXCEEDED"
    ) {
      const details = (
        error as Error & {
          details: {
            code: string;
            currentUsage: number;
            maxStorage: number;
            requested: number;
          };
        }
      ).details;

      res.status(409).json({
        success: false,
        code: "STORAGE_QUOTA_EXCEEDED",
        message: error.message,
        details: details,
      });
    } else if (
      error instanceof Error &&
      error.message.includes("Invalid file type")
    ) {
      res.status(400).json({
        success: false,
        message: "You only can upload image files",
        code: "INVALID_FILE_TYPE",
        details: {
          allowedFormats: [
            "JPEG",
            "PNG",
            "GIF",
            "WebP",
            "SVG",
            "BMP",
            "TIFF",
            "ICO",
          ],
        },
      });
    } else {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
};
