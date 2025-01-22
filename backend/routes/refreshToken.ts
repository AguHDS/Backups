//this route will be consumed every time the access token is expired
import express from "express";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import sendNewAccessToken from "../controllers/refreshTokenController";

const router = express.Router();

router.post("/", validateRefreshToken, sendNewAccessToken);

export default router;
