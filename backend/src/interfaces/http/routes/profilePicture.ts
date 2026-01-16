import express from "express";
import { profilePictureMiddleware } from "../middlewares/profilePictureMiddleware.js";
import { profilePictureController } from "../controllers/profilePictureController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.post("/:username", verifyUserOwnsProfile(true), updateUserActivity(), profilePictureMiddleware, profilePictureController);

export default router;