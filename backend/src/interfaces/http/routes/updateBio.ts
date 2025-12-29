import express from "express";
import validatorUpdateBio from "../middlewares/express-validator/updateBioFields.js";
import { updateBioController } from "../controllers/updateBioController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", validatorUpdateBio, verifyUserOwnsProfile(true), updateBioController);

export default router;
