import express from "express";
import profileController from "../controllers/profileController.js";
import profileMiddleware from "../middlewares/profileMiddleware.js";

const router = express.Router();

router.get("/:username", profileMiddleware, profileController);

export default router;