//this route will be consumed every time the access token is expired
import express from "express";
import validateRefreshToken from "../middlewares/validateRefreshToken.js";
import sendNewAccessToken from "../controllers/refreshTokenController.js";

const router = express.Router();

router.post("/", validateRefreshToken, sendNewAccessToken);

export default router;
