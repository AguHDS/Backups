import express, { RequestHandler } from "express";
import { uploadFilesMiddleware, uploadLimit } from "../middlewares/uploadFilesMiddleware.js";
import uploadFilesController from "../controllers/uploadFilesController.js";

const router = express.Router();

router.post("/", uploadLimit, uploadFilesMiddleware as RequestHandler, uploadFilesController as RequestHandler);

export default router;