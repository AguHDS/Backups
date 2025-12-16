import { Request, Response, NextFunction } from "express";
import { upload } from "../../../infraestructure/config/multerConfig.js";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const profilePictureMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const uploadSingle = upload.single("profilePicture");

  uploadSingle(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          message: "The image must not exceed 3MB",
          error: error.message,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "Error uploading the image",
        error: error.message,
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image was uploaded",
      });
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      res.status(400).json({
        success: false,
        message: "File type not allowed",
        error: `Only the following are allowed: ${ALLOWED_MIME_TYPES.join(
          ", "
        )}`,
      });
      return;
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      res.status(400).json({
        success: false,
        message: "File extension not allowed",
        error: `Only the following are allowed: ${allowedExtensions.join(
          ", "
        )}`,
      });
      return;
    }

    next();
  });
};
