import express from "express";
import validatorUpdateProfile from "../middlewares/validators/updateProfileFields.js";
import { updateProfileController } from "../controllers/updateProfileController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", validatorUpdateProfile, verifyUserOwnsProfile(true), updateProfileController);

export default router;