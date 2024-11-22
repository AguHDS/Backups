import express from "express";
import validateRefreshToken from "../middlewares/validateRefreshToken.js";
import sendNewAccessToken from "../controllers/refreshTokenController.js";
//this route will be consumed every time we need new access token

const router = express.Router();

router.post("/", validateRefreshToken, sendNewAccessToken);

export default router;
