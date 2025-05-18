import express from "express";
import { uploadFilesMiddleware, uploadLimit } from "../middlewares/uploadFilesMiddleware.js";
import { uploadFilesController } from "../controllers/uploadFilesController.js";

const router = express.Router();

router.post("/", uploadLimit, uploadFilesMiddleware, uploadFilesController);

export default router;