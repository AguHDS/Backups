import express from "express";
import { deleteFilesController } from "../controllers/deleteFilesController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { deleteFilesMiddleware } from "../middlewares/deleteFilesMiddleware.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.delete("/:username", verifyUserOwnsProfile(true), updateUserActivity(), deleteFilesMiddleware, deleteFilesController);

export default router;