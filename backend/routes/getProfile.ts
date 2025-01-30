import express, { RequestHandler } from "express";
import getProfileController from "../controllers/getProfileController.ts";
import getProfileMiddleware from "../middlewares/getProfileMiddleware.ts";

const router = express.Router();

router.get("/:username", getProfileMiddleware as RequestHandler, getProfileController);

export default router;