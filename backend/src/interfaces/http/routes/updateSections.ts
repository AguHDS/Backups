import express from "express";
import validatorUpdateSections from "../middlewares/express-validator/updateSectionsFields.js";
import { updateSectionsController } from "../controllers/updateSectionsController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.post("/:username", validatorUpdateSections, verifyUserOwnsProfile(true), updateUserActivity(), updateSectionsController);
export default router;
