import express from "express";
import validatorUpdateSections from "../middlewares/express-validator/updateSectionsFields.js";
import { updateSectionsController } from "../controllers/updateSectionsController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.post("/:username", validatorUpdateSections, verifyUserOwnsProfile(true), updateSectionsController);

export default router;
