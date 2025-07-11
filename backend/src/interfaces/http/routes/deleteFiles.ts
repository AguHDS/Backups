import express from "express";
import { deleteFilesController } from "../controllers/deleteFilesController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { deleteFilesMiddleware } from "../middlewares/deleteFilesMiddleware.js";

const router = express.Router();

router.delete("/:username", verifyUserOwnsProfile(true), deleteFilesMiddleware, deleteFilesController);

export default router;