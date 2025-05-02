import multer from "multer";

//define the file storage in RAM instead of disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //limit of files: 5mb
});
