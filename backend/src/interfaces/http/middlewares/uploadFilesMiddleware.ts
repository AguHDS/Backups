import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { upload } from "../../../infraestructure/config/multerConfig.js";

const MAX_TOTAL_SIZE_BYTES = 1024 * 1024 * 1024;

/** Limit the size of files per request */
export const uploadFilesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.array("files")(req, res, (err) => {
    if (err instanceof MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return res.status(400).json({ error: "A file exceeds the maximum allowed size of 1GB per file" });
        case "LIMIT_FILE_COUNT":
          return res.status(400).json({ error: "Too many files. Maximum allowed is 100" });
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

    // Total size of files can't exceed 3MB in a single request
    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
      return res.status(400).json({
        error: `Total file size is ${(totalSize / (1024 * 1024)).toFixed(2)}MB, which exceeds the 1GB limit`,
      });
    }

    next();
  });
};
