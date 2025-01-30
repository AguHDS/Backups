import express from "express";
import logoutMiddleware from "../middlewares/logoutMiddleware.ts";
import logoutController from "../controllers/logoutController.ts";

const router = express.Router();

router.post("/", logoutMiddleware, logoutController);

export default router;
