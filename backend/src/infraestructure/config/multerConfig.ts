import multer from "multer";

// Define the file storage in RAM instead of disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // Max size per file
    files: 100, // Max files per request
  },
});