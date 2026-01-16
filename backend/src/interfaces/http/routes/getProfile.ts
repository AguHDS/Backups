import express from "express";
import { getProfileController } from "../controllers/getProfileController.js";
import { getProfileMiddleware } from "../middlewares/getProfileMiddleware.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.get("/:username", updateUserActivity(), getProfileMiddleware, getProfileController);

export default router;