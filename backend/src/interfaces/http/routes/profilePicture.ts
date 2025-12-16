import express from "express";
import { profilePictureMiddleware } from "../middlewares/profilePictureMiddleware.js";
import { profilePictureController } from "../controllers/profilePictureController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", verifyUserOwnsProfile(true), profilePictureMiddleware, profilePictureController);

export default router;