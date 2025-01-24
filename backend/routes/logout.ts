import express from "express";
import logoutMiddleware from "../middlewares/logoutMiddleware";
import logoutController from "../controllers/logoutController";

const router = express.Router();

router.post("/", logoutMiddleware, logoutController);

export default router;
