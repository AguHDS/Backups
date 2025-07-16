import express from "express";
import { uploadFilesMiddleware } from "../middlewares/uploadFilesMiddleware.js";
import { uploadFilesController } from "../controllers/uploadFilesController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", verifyUserOwnsProfile(true), uploadFilesMiddleware, uploadFilesController);

export default router;