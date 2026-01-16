import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { changeCredentialsController } from "../controllers/changeCredentialsController.js";
import { changeCredentialsMiddleware } from "../middlewares/changeCredentialsMiddleware.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.put(
  "/",
  requireAuth,
  updateUserActivity(),
  changeCredentialsMiddleware,
  changeCredentialsController
);
export default router;
