import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { upload } from "@/infraestructure/config/multerConfig.js";

const MAX_TOTAL_SIZE_PER_REQUEST = 100 * 1024 * 1024; // 100MB

/** Limit size of upload files */
export const uploadFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.array("files")(req, res, (err) => {
    if (err instanceof MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return res.status(400).json({ error: "A file exceeds the maximum allowed size of 20MB per file" });
        case "LIMIT_FILE_COUNT":
          return res.status(400).json({ error: "Too many files. Maximum allowed is 50" });
        default:
          return res.status(500).json({ error: "File upload failed", message: err.message });
      }
    }

    if (err) {
      return res.status(500).json({
        error: "Unexpected error during upload",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }

    const files = req.files as Express.Multer.File[];

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    // Check total size limit per request
    if (totalSize > MAX_TOTAL_SIZE_PER_REQUEST) {
      return res.status(400).json({
        error: `Total file size is ${(totalSize / (1024 * 1024)).toFixed(2)}MB, which exceeds the limit allowed of ${(MAX_TOTAL_SIZE_PER_REQUEST / (1024 * 1024)).toFixed(2)}MB`,
      });
    }

    next();
  });
};
