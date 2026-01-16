import express from "express";
import { deleteSectionsController } from "../controllers/deleteSectionsController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.delete("/:username", verifyUserOwnsProfile(true), updateUserActivity(), deleteSectionsController);

export default router;