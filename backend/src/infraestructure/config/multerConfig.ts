import multer from "multer";

//define the file storage in RAM instead of disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // Max size per file
    files: 20, // Max files per request
  },
});