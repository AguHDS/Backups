import express from "express";
import { getDashboardController } from "../controllers/getDashboardController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { updateUserActivity } from "../middlewares/updateUserActivity.js";

const router = express.Router();

router.get("/", requireAuth, updateUserActivity(), getDashboardController);

export default router;