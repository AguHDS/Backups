//this route will be consumed every time the access token is expired
import express from "express";
import { refreshTokenMiddleware } from "../middlewares/refreshTokenMiddleware.js";
import { refreshTokenController } from "../controllers/refreshTokenController.js";

const router = express.Router();

router.post("/", refreshTokenMiddleware, refreshTokenController);

export default router;
