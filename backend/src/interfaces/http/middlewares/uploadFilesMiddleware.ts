import { RequestHandler } from "express";
import { MulterError } from "multer";
import { upload } from "../infraestructure/config/multerConfig.js";
import { decodeRefreshToken } from "../utils/decodeRefreshToken.js";

interface ErrorResponse {
  error: string;
  message?: string;
}

//limit the size of files per request
export const uploadLimit: RequestHandler<{}, ErrorResponse> = (req, res, next) => {
  upload.array("file", 5)(req, res, (err) => {
    if (err) {
      if (err instanceof MulterError) {
        /* TODO: obtain file size and limit number to use them in the error messages */
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          console.error("Files limit exceeded per request");
          res.status(400).json({
            error: "Too many files. Max allowed is 5 per request"
          });
          return;
        }

        if (err.code === "LIMIT_FILE_SIZE") {
          /* TODO 
          Check case where user uploads more than 1 file and 1 file size is bigger than allowed */
          console.error("File size limit exceeded per request");
          res.status(400).json({
            error: "Files size exceeds the limit. Max allowed is 5MB per request"
          });
          return;
        }

        res.status(500).json({
          error: "Multer error during file upload",
          message: err.message
        });
        return;
      }

      res.status(500).json({
        error: "Unexpected error occurred",
        message: err instanceof Error ? err.message : "Unknown error"
      });
      return;
    }

    next();
  });
};

export const uploadFilesMiddleware: RequestHandler<{}, { message: string }> = (req, res, next) => {
  /* TODO
    . Manage the case of error where the file isn't a image, so show that error
    . Configure cloudinary to accept other type of files (txt, pdf, etc) */
  try {
    
    const decodedToken = decodeRefreshToken(req);
    console.log('test', decodedToken);
    if (!req.files || req.files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    req.body.refreshTokenId = decodedToken.id;

    next();
  } catch (error) {
    if (error instanceof Error) console.error("Error uploading files: ", error);
    res.status(500).json({ message: "Upload failed" });
    return;
  }
};
