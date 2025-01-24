import express, { RequestHandler } from "express";
import logoutMiddleware from "../middlewares/logoutMiddleware";
import logoutController from "../controllers/logoutController";

const router = express.Router();

router.post("/", logoutMiddleware as RequestHandler, logoutController as RequestHandler);

export default router;
