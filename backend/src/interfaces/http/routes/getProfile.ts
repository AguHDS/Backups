import express from "express";
import { getProfileController } from "../controllers/getProfileController.js";
import { getProfileMiddleware } from "../middlewares/getProfileMiddleware.js";

const router = express.Router();

router.get("/:username", getProfileMiddleware, getProfileController);

export default router;
