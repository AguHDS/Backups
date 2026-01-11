import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { changeCredentialsController } from "../controllers/changeCredentialsController.js";
import { changeCredentialsMiddleware } from "../middlewares/changeCredentialsMiddleware.js";

const router = express.Router();

router.put(
  "/",
  requireAuth,
  changeCredentialsMiddleware,
  changeCredentialsController
);
export default router;
