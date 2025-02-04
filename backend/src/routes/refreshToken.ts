//this route will be consumed every time the access token is expired
import express, { RequestHandler } from "express";
import refreshTokenMiddleware from "../middlewares/refreshTokenMiddleware.js";
import sendNewAccessToken from "../controllers/refreshTokenController.js";

const router = express.Router();

router.post("/", refreshTokenMiddleware as RequestHandler, sendNewAccessToken as RequestHandler);

export default router;
