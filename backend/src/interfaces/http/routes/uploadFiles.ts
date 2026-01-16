import express from "express";
import { uploadFilesMiddleware } from "../middlewares/uploadFilesMiddleware.js";
import { uploadFilesController } from "../controllers/uploadFilesController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.post("/:username", verifyUserOwnsProfile(true), updateUserActivity(), uploadFilesMiddleware, uploadFilesController);

export default router;