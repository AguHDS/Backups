import multer from "multer";

// Define the file storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Max size per individual file: 20MB
    files: 50, // Max files per request
  },
});