import express, { RequestHandler } from "express";
import getProfileController from "../controllers/getProfileController.js";
import getProfileMiddleware from "../middlewares/getProfileMiddleware.js";

const router = express.Router();

router.get("/:username", getProfileMiddleware as RequestHandler, getProfileController);

export default router;