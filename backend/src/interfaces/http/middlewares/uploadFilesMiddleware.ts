import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { upload } from "../../../infraestructure/config/multerConfig.js";

/** Limit the size of files per request */
export const uploadLimit = async (req: Request, res: Response, next: NextFunction) => {
  upload.array("files", 5)(req, res, (err) => {
    if (err) {
      if (err instanceof MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
           /* TODO: obtain file size and limit number to use them in the error messages */
          console.error("Files limit exceeded per request");

          res.status(400).json({ error: "Too many files. Max allowed is 5 per request" });
          return;
        }

        if (err.code === "LIMIT_FILE_SIZE") {
          // TODO Check case where user uploads more than 1 file and 1 file size is bigger than allowed
          console.error("File size limit exceeded per request");

          res.status(400).json({ error: "Files size exceeds the limit. Max allowed is 5MB per request" });
          return;
        }

        res.status(500).json({ error: "Multer error during file upload", message: err.message });
        return;
      }

      res.status(500).json({ error: "Unexpected error occurred", message: err instanceof Error ? err.message : "Unknown error" });
      return;
    }

    next();
  });
};