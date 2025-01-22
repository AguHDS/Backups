import express from "express";
import getProfileController from "../controllers/getProfileController";
import getProfileMiddleware from "../middlewares/getProfileMiddleware";

const router = express.Router();

router.get("/:username", getProfileMiddleware, getProfileController);

export default router;