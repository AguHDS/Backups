import express, { RequestHandler } from "express";
import getProfileController from "../controllers/getProfileController";
import getProfileMiddleware from "../middlewares/getProfileMiddleware";

const router = express.Router();

router.get("/:username", getProfileMiddleware as RequestHandler, getProfileController);

export default router;