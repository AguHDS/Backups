import express from "express";
import validatorUpdateProfile from "../middlewares/validators/updateProfileFields.js";
import { updateBioAndSectionsController } from "../controllers/updateBioAndSectionsController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", validatorUpdateProfile, verifyUserOwnsProfile(true), updateBioAndSectionsController);

export default router;