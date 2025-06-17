import express from "express";
import { deleteSectionsController } from "../controllers/deleteSectionsController.js";
import { verifyUserOwnsProfile } from "../middlewares/verifyUserOwnsProfile.js";

const router = express.Router();

router.delete("/:username", verifyUserOwnsProfile(true), deleteSectionsController);

export default router;