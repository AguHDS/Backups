import express from "express";
import { uploadLimit } from "../middlewares/uploadFilesMiddleware.js";
import { uploadFilesController } from "../controllers/uploadFilesController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", uploadLimit, verifyUserOwnsProfile(true), uploadFilesController);

export default router;